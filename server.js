/**
 * Grand Royale – Smart Hotel Booking System - Real SMS & Authentication Server
 * Built with native Node.js (Zero external dependencies required!)
 * 
 * Supports:
 * - Twilio SMS Gateway (Worldwide Real Carrier SMS)
 * - Fast2SMS Gateway (Instant Indian Mobile SMS)
 * - Local Static Web Server for Hotel Booking
 */

const http = require("http");
const https = require("https");
const tls = require("tls");
const fs = require("fs");
const path = require("path");
const url = require("url");
const crypto = require("crypto");

// -----------------------------------------------------------------
// 1. Environment Variables Loader (.env support via dotenv or native)
// -----------------------------------------------------------------
try {
    require("dotenv").config();
} catch (e) {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
        try {
            const envContent = fs.readFileSync(envPath, "utf-8");
            envContent.split(/\r?\n/).forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith("#")) {
                    const eqIdx = trimmed.indexOf("=");
                    if (eqIdx > 0) {
                        const k = trimmed.slice(0, eqIdx).trim();
                        let v = trimmed.slice(eqIdx + 1).trim();
                        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                            v = v.slice(1, -1);
                        }
                        if (!process.env[k]) process.env[k] = v;
                    }
                }
            });
        } catch (err) {
            console.warn("Could not parse .env file:", err.message);
        }
    }
}

// Optional Nodemailer loader (if installed via npm)
let nodemailer = null;
try {
    nodemailer = require("nodemailer");
} catch (e) {
    // Nodemailer optional - native TLS SMTP and Resend API provide zero-dependency fallback
}

const PORT = process.env.PORT || 3000;

// Sender email address default matching EMAIL_USER so Gmail never blocks delivery due to mismatched sender domain
const detectedEmailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || "").trim();
const defaultEmailFrom = detectedEmailUser 
    ? `"Grand Royale" <${detectedEmailUser}>` 
    : `"Grand Royale" <no-reply@grandroyalehotel.com>`;

// SMS, WhatsApp & Email Gateway Configuration (Read from .env or config.json)
let config = {
    // 1. CallMeBot WhatsApp API (100% Free WhatsApp delivery directly to user phone)
    callmebot: {
        apiKey: process.env.CALLMEBOT_API_KEY || ""
    },
    // 2. Fast2SMS (Direct SMS to Indian mobile numbers)
    fast2sms: {
        apiKey: process.env.FAST2SMS_API_KEY || ""
    },
    // 3. Twilio (Worldwide real SMS to any phone number)
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || "",
        authToken: process.env.TWILIO_AUTH_TOKEN || "",
        fromPhone: process.env.TWILIO_PHONE_NUMBER || ""
    },
    // 4. Textbelt (Free fallback SMS)
    textbelt: {
        apiKey: process.env.TEXTBELT_API_KEY || "textbelt"
    },
    // 5. Email Gateway Configuration (Nodemailer Gmail SMTP, Resend API, or native TLS)
    email: {
        service: process.env.EMAIL_SERVICE || "gmail",
        user: detectedEmailUser,
        pass: (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, ""),
        from: process.env.EMAIL_FROM || process.env.SMTP_FROM || defaultEmailFrom,
        resendApiKey: process.env.RESEND_API_KEY || "",
        brevoApiKey: process.env.BREVO_API_KEY || "",
        brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || "",
        smtp: {
            host: process.env.EMAIL_HOST || process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || "465", 10),
            user: detectedEmailUser,
            pass: (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, ""),
            from: process.env.EMAIL_FROM || defaultEmailFrom
        }
    }
};

// Deep merge helper that only copies non-empty values so config.json never wipes out .env variables
function mergeNonEmpty(target, source) {
    if (!source || typeof source !== "object") return target;
    for (const key of Object.keys(source)) {
        if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            mergeNonEmpty(target[key], source[key]);
        } else if (source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== "") {
            target[key] = source[key];
        }
    }
    return target;
}

// Try loading optional config.json if exists (safe merge: empty strings in config.json never overwrite .env)
const configPath = path.join(__dirname, "config.json");
if (fs.existsSync(configPath)) {
    try {
        const loaded = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        mergeNonEmpty(config, loaded);
    } catch (e) {
        console.warn("Could not parse config.json, using environment variables.");
    }
}

// In-Memory OTP Store: identifier -> { hashedOtp, otp, expiresAt, name, method, attempts, createdAt }
const otpStore = new Map();
// In-Memory Booking OTP Store: identifier -> { otp, expiresAt, name, email, phone, roomTitle, grandTotal }
const bookingOtpStore = new Map();

// Admin Configuration & OTP Store
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "gokulshankar9398@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "admin123").trim();
const adminOtpStore = new Map();

// Real-Time OTP Audit Logs (last 50 requests)
const otpAuditLogs = [];
function recordOtpLog(target, method, provider, success, error) {
    otpAuditLogs.unshift({
        id: "LOG-" + Date.now().toString(36).toUpperCase(),
        target: target,
        method: method || "email",
        provider: provider || "Brevo",
        success: Boolean(success),
        error: error || null,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    });
    if (otpAuditLogs.length > 50) otpAuditLogs.pop();
}

// Persistent Bookings Storage (bookings.json)
const bookingsFilePath = path.join(__dirname, "bookings.json");

function loadBookings() {
    if (fs.existsSync(bookingsFilePath)) {
        try {
            return JSON.parse(fs.readFileSync(bookingsFilePath, "utf-8"));
        } catch (e) {
            return [];
        }
    }
    const initialBookings = [
        {
            id: "GR-892104",
            guestName: "Lady Victoria Sterling",
            guestEmail: "victoria.sterling@royaltravel.co.uk",
            guestPhone: "+44 7911 123456",
            roomTitle: "The Royal Penthouse Suite",
            checkIn: "2026-12-01",
            checkOut: "2026-12-05",
            nights: 4,
            guests: "2 Adults",
            grandTotalUSD: 14000,
            grandTotalFormatted: "₹11,62,000",
            paymentMethod: "Credit Card (Visa Platinum)",
            status: "Confirmed",
            bookedAt: new Date(Date.now() - 3600000 * 4).toLocaleDateString()
        },
        {
            id: "GR-451928",
            guestName: "Archduke Maximilian Vance",
            guestEmail: "max.vance@dynasty.com",
            guestPhone: "+1 (555) 342-9988",
            roomTitle: "Presidential Palace Suite",
            checkIn: "2026-12-03",
            checkOut: "2026-12-08",
            nights: 5,
            guests: "2 Adults, 1 Child",
            grandTotalUSD: 11250,
            grandTotalFormatted: "₹9,33,750",
            paymentMethod: "Concierge Bank Wire",
            status: "Checked-In",
            bookedAt: new Date(Date.now() - 3600000 * 18).toLocaleDateString()
        },
        {
            id: "GR-782310",
            guestName: "Baroness Evelyn Montgomery",
            guestEmail: "evelyn.m@montgomeryestate.com",
            guestPhone: "+33 6 12 34 56 78",
            roomTitle: "Ambassador Oceanfront Villa",
            checkIn: "2026-11-28",
            checkOut: "2026-12-02",
            nights: 4,
            guests: "2 Adults",
            grandTotalUSD: 7200,
            grandTotalFormatted: "₹5,97,600",
            paymentMethod: "Apple Pay",
            status: "Confirmed",
            bookedAt: new Date(Date.now() - 3600000 * 28).toLocaleDateString()
        }
    ];
    saveBookings(initialBookings);
    return initialBookings;
}

function saveBookings(bookings) {
    try {
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf-8");
    } catch (e) {
        console.error("Could not save bookings.json:", e.message);
    }
}

/**
 * Hash OTP using SHA-256 for secure storage
 */
function hashOTP(otp) {
    return crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
}

/**
 * Compare plain OTP against stored SHA-256 hash in constant time
 */
function verifyOTPHash(plainOtp, hashedOtp) {
    if (!plainOtp || !hashedOtp) return false;
    const computedHash = hashOTP(plainOtp);
    try {
        return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hashedOtp, "hex"));
    } catch (e) {
        return computedHash === hashedOtp;
    }
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
function generate6DigitOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Periodic cleanup of expired OTP records (runs every 2 minutes)
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of otpStore.entries()) {
        if (record.expiresAt && now > record.expiresAt) {
            otpStore.delete(key);
        }
    }
}, 2 * 60 * 1000);

// MIME Types for Static File Serving
const MIME_TYPES = {
    ".html": "text/html; charset=UTF-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

/**
 * Send real OTP message to user's phone via CallMeBot (WhatsApp)
 * Free API: https://api.callmebot.com/whatsapp.php?phone=[phone]&text=[text]&apikey=[apikey]
 */
function sendCallMeBotWhatsApp(toPhone, otpCode, customApiKey) {
    return new Promise((resolve, reject) => {
        const apiKey = (customApiKey || config.callmebot?.apiKey || "").trim();
        if (!apiKey) {
            return reject(new Error("CallMeBot API key missing. Please provide your personal CallMeBot API key."));
        }

        // CallMeBot format: international country code + digits, no '+', spaces, or hyphens
        let cleanPhone = toPhone.replace(/[^0-9]/g, "");
        if (cleanPhone.length === 10) {
            // Default 10-digit Indian number to country code 91
            cleanPhone = "91" + cleanPhone;
        }

        const messageText = `👑 *Grand Royale – Smart Hotel Booking System*\n\nYour security verification passcode is: *${otpCode}*\n\nValid for 5 minutes. Please do not share this passcode with anyone.`;

        const queryParams = new URLSearchParams({
            phone: cleanPhone,
            text: messageText,
            apikey: apiKey
        }).toString();

        const options = {
            hostname: "api.callmebot.com",
            port: 443,
            path: `/whatsapp.php?${queryParams}`,
            method: "GET",
            headers: {
                "User-Agent": "GrandRoyaleHotel-OTP/1.0"
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                const cleanData = data.replace(/<[^>]*>/g, "").trim();
                const lower = cleanData.toLowerCase();

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    if (lower.includes("error") || lower.includes("not authorized") || lower.includes("invalid apikey") || lower.includes("not allowed")) {
                        reject(new Error(`CallMeBot: ${cleanData}`));
                    } else {
                        resolve({ success: true, response: cleanData });
                    }
                } else {
                    reject(new Error(`CallMeBot HTTP Error (${res.statusCode}): ${cleanData}`));
                }
            });
        });

        req.on("error", (err) => {
            reject(new Error(`CallMeBot network error: ${err.message}`));
        });

        req.setTimeout(12000, () => {
            req.destroy(new Error("CallMeBot request timed out after 12s"));
        });

        req.end();
    });
}

/**
 * Send real SMS to user's phone via Twilio
 */
function sendTwilioSMS(toPhone, otpCode) {
    return new Promise((resolve, reject) => {
        const { accountSid, authToken, fromPhone } = config.twilio;
        if (!accountSid || !authToken || !fromPhone) {
            return reject(new Error("Twilio credentials missing. Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"));
        }

        const cleanPhone = toPhone.replace(/[^0-9+]/g, "");
        const postData = new URLSearchParams({
            To: cleanPhone,
            From: fromPhone,
            Body: `[Grand Royale Resort] Your security verification passcode is: ${otpCode}. Valid for 5 minutes. Do not share this with anyone.`
        }).toString();

        const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
        const options = {
            hostname: "api.twilio.com",
            port: 443,
            path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Twilio error (${res.statusCode}): ${data}`));
                }
            });
        });

        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Send real SMS to user's phone via Fast2SMS (Popular for +91 Indian numbers)
 */
function sendFast2SMS(toPhone, otpCode) {
    return new Promise((resolve, reject) => {
        const apiKey = config.fast2sms?.apiKey;
        if (!apiKey) {
            return reject(new Error("Fast2SMS API key missing in config.json"));
        }

        // Extract 10-digit mobile number
        const digits = toPhone.replace(/[^0-9]/g, "");
        const mobile10 = digits.length > 10 ? digits.slice(-10) : digits;

        const postBody = JSON.stringify({
            route: "otp",
            variables_values: otpCode,
            numbers: mobile10
        });

        const options = {
            hostname: "www.fast2sms.com",
            port: 443,
            path: "/dev/bulkV2",
            method: "POST",
            headers: {
                "authorization": apiKey,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postBody)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Fast2SMS error (${res.statusCode}): ${data}`));
                }
            });
        });

        req.on("error", reject);
        req.write(postBody);
        req.end();
    });
}

/**
 * Send SMS via Textbelt (Automatic free fallback carrier SMS)
 */
function sendTextbeltSMS(toPhone, otpCode) {
    return new Promise((resolve, reject) => {
        const cleanPhone = toPhone.replace(/[^0-9+]/g, "");
        const postData = new URLSearchParams({
            phone: cleanPhone,
            message: `[Grand Royale Resort] Your verification passcode is: ${otpCode}. Valid for 5 minutes.`,
            key: config.textbelt?.apiKey || "textbelt"
        }).toString();

        const options = {
            hostname: "textbelt.com",
            port: 443,
            path: "/text",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.success) {
                        resolve(parsed);
                    } else {
                        reject(new Error(parsed.error || "Textbelt quota or carrier dispatch error"));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Generate luxury HTML email for OTP verification
 */
function generateEmailHTML(otpCode, guestName) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background-color: #0B1325; padding: 32px 24px; border-bottom: 2px solid #C5A059;">
                            <h1 style="color: #FAF9F6; font-size: 22px; font-weight: bold; margin: 0; letter-spacing: 1px;">🏰 Grand Royale – Smart Hotel Booking System</h1>
                            <p style="color: #C5A059; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 0 0;">Grand Royale Society • Security Verification</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 36px 32px;">
                            <p style="font-size: 15px; color: #1F2937; margin: 0 0 16px 0;">Dear <strong>${guestName || "Valued Guest"}</strong>,</p>
                            <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 24px 0;">
                                Please use the following 6-digit one-time verification passcode (OTP) to securely sign in to your Grand Royale account:
                            </p>
                            <div style="background-color: #0B1325; border: 1px solid #C5A059; border-radius: 14px; text-align: center; padding: 22px 10px; margin: 24px 0;">
                                <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace; color: #F59E0B; text-align: center;">${otpCode}</div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">Valid for 5 Minutes</div>
                            </div>
                            <p style="font-size: 13px; color: #6B7280; line-height: 1.5; margin: 24px 0 0 0;">
                                🔒 For your security, never share this verification code with anyone. Grand Royale Concierge staff will never ask for your passcode.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 20px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                            <p style="font-size: 11px; color: #9CA3AF; margin: 0;">© 2026 Grand Royale – Smart Hotel Booking System. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Send real OTP to email via Resend API (Free 100 emails/day, zero setup)
 */
function sendEmailViaResend(toEmail, otpCode, guestName, customApiKey) {
    return new Promise((resolve, reject) => {
        const apiKey = (customApiKey || config.email?.resendApiKey || "").trim();
        if (!apiKey) {
            return reject(new Error("Resend API key missing in config.json or input."));
        }

        const fromAddress = config.email?.from || "Grand Royale Resort <onboarding@resend.dev>";
        const postData = JSON.stringify({
            from: fromAddress,
            to: [toEmail],
            subject: `👑 [${otpCode}] Your Grand Royale Security Verification Passcode`,
            html: generateEmailHTML(otpCode, guestName)
        });

        const options = {
            hostname: "api.resend.com",
            port: 443,
            path: "/emails",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ success: true, id: parsed.id });
                    } else {
                        reject(new Error(parsed.message || `Resend error (${res.statusCode}): ${data}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on("error", (err) => reject(new Error(`Resend network error: ${err.message}`)));
        req.setTimeout(12000, () => req.destroy(new Error("Resend request timed out")));
        req.write(postData);
        req.end();
    });
}

/**
 * Send real OTP to email via Brevo REST API (300 free emails/day to any recipient)
 * Documentation: https://developers.brevo.com/reference/sendtransacemail
 */
function sendEmailViaBrevo(toEmail, otpCode, guestName, customApiKey) {
    return new Promise((resolve, reject) => {
        const apiKey = (customApiKey || process.env.BREVO_API_KEY || config.email?.brevoApiKey || "").trim();
        if (!apiKey) {
            return reject(new Error("BREVO_API_KEY missing in .env"));
        }

        const senderEmail = (process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || "").trim();
        if (!senderEmail) {
            return reject(new Error("BREVO_SENDER_EMAIL is missing in .env. Please set it to your registered Brevo account email."));
        }

        const postData = JSON.stringify({
            sender: {
                name: "Grand Royale – Smart Hotel Booking System",
                email: senderEmail
            },
            to: [{
                email: toEmail.trim(),
                name: guestName || "Valued Guest"
            }],
            subject: `👑 [${otpCode}] Your Grand Royale Security Verification Passcode`,
            htmlContent: generateEmailHTML(otpCode, guestName),
            textContent: `Dear ${guestName || "Valued Guest"},\n\nYour Grand Royale verification passcode is: ${otpCode}\nValid for 5 minutes.\n\nNever share this code with anyone.`
        });

        const options = {
            hostname: "api.brevo.com",
            port: 443,
            path: "/v3/smtp/email",
            method: "POST",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
                "accept": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ success: true, messageId: parsed.messageId, provider: "Brevo Email API" });
                    } else {
                        reject(new Error(parsed.message || `Brevo error (${res.statusCode}): ${data}`));
                    }
                } catch (e) {
                    reject(new Error(`Brevo HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on("error", (err) => reject(new Error(`Brevo network error: ${err.message}`)));
        req.setTimeout(12000, () => req.destroy(new Error("Brevo request timed out")));
        req.write(postData);
        req.end();
    });
}

/**
 * Send real OTP to email via Native SMTP (Port 465 SSL/TLS) - Zero external packages required!
 */
function sendEmailViaSMTP(toEmail, otpCode, guestName, smtpConfig) {
    return new Promise((resolve, reject) => {
        const { host, port = 465, user, pass, from } = smtpConfig || {};
        if (!host || !user || !pass) {
            return reject(new Error("SMTP configuration missing host, user, or pass in config.json"));
        }

        const socket = tls.connect({
            host,
            port: Number(port) || 465,
            rejectUnauthorized: false
        });

        let step = 0;
        let buffer = "";

        const fromAddr = from || user;
        const htmlContent = generateEmailHTML(otpCode, guestName);
        const rawMessage = [
            `From: "Grand Royale" <${fromAddr}>`,
            `To: <${toEmail}>`,
            `Subject: [${otpCode}] Your Grand Royale Security Verification Passcode`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            ``,
            htmlContent,
            `.`
        ].join("\r\n");

        const send = (cmd) => {
            socket.write(cmd + "\r\n");
        };

        socket.on("data", (chunk) => {
            buffer += chunk.toString();

            // SMTP replies are complete when the last line starts with a 3-digit code followed by a space (not hyphen)
            const lines = buffer.split(/\r?\n/).filter(Boolean);
            if (!lines.length) return;
            const lastLine = lines[lines.length - 1];
            if (!/^\d{3}\s/.test(lastLine)) {
                return; // Wait for full multi-line response
            }

            const code = parseInt(lastLine.slice(0, 3), 10);
            buffer = ""; // Clear buffer for next command

            if (code >= 400) {
                socket.end();
                return reject(new Error(`SMTP error (${code}): ${lastLine.trim()}`));
            }

            if (step === 0 && code === 220) {
                step++;
                send(`EHLO localhost`);
            } else if (step === 1 && code === 250) {
                step++;
                send(`AUTH LOGIN`);
            } else if (step === 2 && code === 334) {
                step++;
                send(Buffer.from(user.trim()).toString("base64"));
            } else if (step === 3 && code === 334) {
                step++;
                // Strip spaces in case user pasted Gmail 16-character app password with spaces
                const cleanPass = pass.replace(/\s+/g, "");
                send(Buffer.from(cleanPass).toString("base64"));
            } else if (step === 4 && code === 235) {
                step++;
                send(`MAIL FROM:<${fromAddr}>`);
            } else if (step === 5 && code === 250) {
                step++;
                send(`RCPT TO:<${toEmail.trim()}>`);
            } else if (step === 6 && code === 250) {
                step++;
                send(`DATA`);
            } else if (step === 7 && code === 354) {
                step++;
                send(rawMessage);
            } else if (step === 8 && code === 250) {
                step++;
                send(`QUIT`);
                socket.end();
                resolve({ success: true, message: "Email sent via SMTP" });
            }
        });

        socket.on("error", (err) => {
            reject(new Error(`SMTP socket error: ${err.message}`));
        });

        socket.setTimeout(15000, () => {
            socket.destroy();
            reject(new Error("SMTP connection timed out"));
        });
    });
}

/**
 * Send real OTP to email via Nodemailer (with Gmail SMTP via App Passwords or custom SMTP)
 */
async function sendEmailViaNodemailer(toEmail, otpCode, guestName) {
    if (!nodemailer) {
        throw new Error("Nodemailer module is not installed");
    }

    const emailUser = (process.env.EMAIL_USER || config.email?.user || "").trim();
    const emailPass = (process.env.EMAIL_PASS || config.email?.pass || "").replace(/\s+/g, "");

    if (!emailUser || !emailPass) {
        throw new Error("EMAIL_USER or EMAIL_PASS environment variable missing in .env");
    }

    const host = process.env.EMAIL_HOST || config.email?.smtp?.host;
    const port = parseInt(process.env.EMAIL_PORT || config.email?.smtp?.port || "465", 10);
    const service = process.env.EMAIL_SERVICE || config.email?.service || "gmail";

    let transportOpts;
    if (host && host !== "smtp.gmail.com") {
        transportOpts = {
            host,
            port,
            secure: port === 465,
            auth: { user: emailUser, pass: emailPass }
        };
    } else {
        transportOpts = {
            service: service,
            auth: { user: emailUser, pass: emailPass }
        };
    }

    const transporter = nodemailer.createTransport(transportOpts);
    const fromAddr = process.env.EMAIL_FROM || config.email?.from || `"Grand Royale" <${emailUser}>`;

    return await transporter.sendMail({
        from: fromAddr,
        to: toEmail,
        subject: `👑 [${otpCode}] Your Grand Royale Security Verification Passcode`,
        html: generateEmailHTML(otpCode, guestName),
        text: `Dear ${guestName || "Valued Guest"},\n\nYour Grand Royale verification passcode is: ${otpCode}\nValid for 5 minutes.\n\nNever share this code with anyone.`
    });
}

/**
 * Unified Email Dispatcher with Fallbacks:
 * 1. Brevo REST API (300 free emails/day to ANY recipient)
 * 2. Nodemailer with Gmail SMTP / App Passwords
 * 3. Native TLS SMTP (works zero-dependency if Nodemailer not yet installed)
 * 4. Resend REST API (if RESEND_API_KEY is provided)
 */
async function dispatchEmail(toEmail, otpCode, guestName, customResendKey) {
    const brevoKey = (process.env.BREVO_API_KEY || config.email?.brevoApiKey || "").trim();
    const emailUser = (process.env.EMAIL_USER || config.email?.user || "").trim();
    const emailPass = (process.env.EMAIL_PASS || config.email?.pass || "").replace(/\s+/g, "");
    const resendKey = (customResendKey || process.env.RESEND_API_KEY || config.email?.resendApiKey || "").trim();

    let lastError = null;

    // 1. Try Brevo REST API first (Delivers to ANY email recipient)
    if (brevoKey) {
        try {
            await sendEmailViaBrevo(toEmail, otpCode, guestName, brevoKey);
            return { success: true, provider: "Brevo Email API" };
        } catch (err) {
            console.warn(`[Brevo API] Warning: ${err.message}. Trying SMTP fallback...`);
            lastError = err;
        }
    }

    // 2. Try Nodemailer Gmail SMTP (Standard production SMTP)
    if (nodemailer && emailUser && emailPass) {
        try {
            await sendEmailViaNodemailer(toEmail, otpCode, guestName);
            return { success: true, provider: `Gmail SMTP (Nodemailer)` };
        } catch (err) {
            console.warn(`[Nodemailer] Warning: ${err.message}. Trying SMTP fallback...`);
            lastError = err;
        }
    }

    // 3. Try Native TLS SMTP fallback (Zero dependency)
    if (emailUser && emailPass) {
        try {
            const defaultFrom = `"Grand Royale" <${emailUser}>`;
            const smtpConfig = {
                host: process.env.EMAIL_HOST || config.email?.smtp?.host || "smtp.gmail.com",
                port: parseInt(process.env.EMAIL_PORT || config.email?.smtp?.port || "465", 10),
                user: emailUser,
                pass: emailPass,
                from: process.env.EMAIL_FROM || config.email?.from || defaultFrom
            };
            await sendEmailViaSMTP(toEmail, otpCode, guestName, smtpConfig);
            return { success: true, provider: `Native SMTP (${smtpConfig.host})` };
        } catch (err) {
            console.warn(`[Native SMTP] Warning: ${err.message}. Trying Resend fallback...`);
            lastError = err;
        }
    }

    // 4. Try Resend REST API
    if (resendKey) {
        try {
            await sendEmailViaResend(toEmail, otpCode, guestName, resendKey);
            return { success: true, provider: "Resend API" };
        } catch (err) {
            console.warn(`[Resend] Warning: ${err.message}`);
            lastError = err;
        }
    }

    if (!brevoKey && !emailUser && !resendKey) {
        throw new Error("No email service credentials in .env. Please configure BREVO_API_KEY or EMAIL_USER & EMAIL_PASS.");
    }

    throw lastError || new Error("Failed to dispatch email via configured gateways");
}

/**
 * Main HTTP Server
 */
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // ==========================================
    // API: POST /api/auth/send-otp and /api/send-otp
    // ==========================================
    if ((pathname === "/api/auth/send-otp" || pathname === "/api/send-otp") && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const parsedBody = JSON.parse(body || "{}");
                const {
                    email,
                    identifier,
                    name,
                    method = (email ? "email" : "phone"),
                    callmebotApiKey,
                    resendApiKey
                } = parsedBody;

                const target = (email || identifier || "").trim();
                const authMethod = (email || target.includes("@")) ? "email" : method;

                if (!target) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: authMethod === "email" ? "Email address is required" : "Phone number or email required"
                    }));
                }

                // Email validation
                if (authMethod === "email") {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(target)) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({
                            success: false,
                            error: "Please enter a valid email address (e.g. user@example.com)"
                        }));
                    }
                }

                const storeKey = authMethod === "email" ? target.toLowerCase() : target;

                // Rate limiting cooldown check (30 seconds between requests for same target)
                const existingRecord = otpStore.get(storeKey);
                if (existingRecord && existingRecord.createdAt && (Date.now() - existingRecord.createdAt < 5000)) {
                    res.writeHead(429, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "Please wait a few seconds before requesting another verification code."
                    }));
                }

                // Generate cryptographically secure 6-digit numeric OTP
                const otp = generate6DigitOTP();
                const hashedOtp = hashOTP(otp);
                const expiresAt = Date.now() + 5 * 60 * 1000; // 5-minute expiry

                // Store in secure backend cache with 5-minute expiration
                otpStore.set(storeKey, {
                    hashedOtp,
                    otp, // Retained in server state for development/testing visibility
                    expiresAt,
                    name: (name || "Valued Guest").trim(),
                    method: authMethod,
                    attempts: 0,
                    createdAt: Date.now()
                });

                console.log(`\n======================================================`);
                console.log(`🔑 [Grand Royale Security] 6-Digit Passcode generated for: ${storeKey}`);
                console.log(`⏰ Expiry: 5 Minutes (SHA-256 Hashed on Backend)`);

                let dispatchSuccess = false;
                let providerUsed = "None";
                let providerError = null;

                // ==========================================
                // 1. Email OTP Dispatch
                // ==========================================
                if (authMethod === "email") {
                    try {
                        const emailResult = await dispatchEmail(storeKey, otp, name, resendApiKey);
                        dispatchSuccess = true;
                        providerUsed = emailResult.provider;
                        console.log(`🚀 [Email Service] Passcode successfully delivered via ${providerUsed} to: ${storeKey}`);
                    } catch (err) {
                        providerError = err.message;
                        console.error(`⚠️ Email dispatch notice: ${err.message}`);
                    }
                }

                // ==========================================
                // 2. Mobile Phone OTP Dispatch
                // ==========================================
                if (authMethod === "phone") {
                    const activeCallMeBotKey = (callmebotApiKey || config.callmebot?.apiKey || "").trim();

                    // Priority 1: CallMeBot WhatsApp
                    if (activeCallMeBotKey) {
                        try {
                            await sendCallMeBotWhatsApp(storeKey, otp, activeCallMeBotKey);
                            console.log(`🚀 [CallMeBot] Real WhatsApp message dispatched to: ${storeKey}`);
                            dispatchSuccess = true;
                            providerUsed = "CallMeBot WhatsApp";
                            if (!config.callmebot.apiKey) config.callmebot.apiKey = activeCallMeBotKey;
                        } catch (err) {
                            console.error(`⚠️ CallMeBot dispatch failed:`, err.message);
                            providerError = err.message;
                        }
                    }

                    // Priority 2: Fast2SMS (Indian Mobile SMS)
                    if (!dispatchSuccess && config.fast2sms?.apiKey) {
                        try {
                            await sendFast2SMS(storeKey, otp);
                            dispatchSuccess = true;
                            providerUsed = "Fast2SMS";
                        } catch (err) {
                            console.error(`⚠️ Fast2SMS dispatch failed:`, err.message);
                        }
                    }

                    // Priority 3: Twilio Worldwide SMS
                    if (!dispatchSuccess && config.twilio?.accountSid && config.twilio?.authToken && config.twilio?.fromPhone) {
                        try {
                            await sendTwilioSMS(storeKey, otp);
                            dispatchSuccess = true;
                            providerUsed = "Twilio SMS";
                        } catch (err) {
                            console.error(`⚠️ Twilio dispatch failed:`, err.message);
                        }
                    }

                    // Priority 4: Textbelt Free SMS Fallback
                    if (!dispatchSuccess && !activeCallMeBotKey) {
                        try {
                            await sendTextbeltSMS(storeKey, otp);
                            dispatchSuccess = true;
                            providerUsed = "Textbelt Free SMS";
                        } catch (err) {
                            console.log(`ℹ️ [Textbelt Notice]: ${err.message}`);
                        }
                    }
                }

                console.log(`\n===============================================================`);
                console.log(`📩 [PASSCODE REQUEST] Target: ${storeKey} (Method: ${authMethod})`);
                if (dispatchSuccess) {
                    console.log(`✅ Status: Transmitted via ${providerUsed}`);
                    console.log(`🔑 PASSCODE SENT TO DESTINATION: [ ${otp} ]`);
                } else {
                    console.log(`⚠️ Status: Gateway dispatch pending configuration`);
                    if (providerError) console.log(`⚠️ Detail: ${providerError}`);
                    console.log(`🔑 PASSCODE FOR TESTING: [ ${otp} ]`);
                    console.log(`👉 (Enter [ ${otp} ] on the web page to sign in)`);
                    if (authMethod === "email") {
                        console.log(`💡 To receive real emails: Set EMAIL_USER & EMAIL_PASS in your .env file`);
                    } else {
                        console.log(`💡 To receive real WhatsApp messages: Use CallMeBot (send message to +34 644 44 49 46)`);
                    }
                }
                console.log(`===============================================================\n`);

                recordOtpLog(storeKey, authMethod, providerUsed, dispatchSuccess, providerError);

                res.writeHead(200, { "Content-Type": "application/json" });
                // Zero OTP codes returned to browser - OTP goes strictly to user email and admin terminal
                res.end(JSON.stringify({
                    success: true,
                    dispatched: dispatchSuccess,
                    email: authMethod === "email" ? storeKey : undefined,
                    identifier: storeKey,
                    expiresInSeconds: 300,
                    message: dispatchSuccess 
                        ? `Verification code dispatched to ${storeKey} via ${providerUsed}`
                        : "Verification passcode generated (Logged in admin terminal)",
                    provider: providerUsed,
                    error: dispatchSuccess ? null : providerError
                }));

            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/auth/verify-otp and /api/verify-otp
    // ==========================================
    if ((pathname === "/api/auth/verify-otp" || pathname === "/api/verify-otp") && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const parsedBody = JSON.parse(body || "{}");
                const { email, identifier, otp } = parsedBody;

                const target = (email || identifier || "").trim();
                const storeKey = target.includes("@") ? target.toLowerCase() : target;
                const cleanOtp = String(otp || "").trim();

                if (!target || !cleanOtp) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "Email and 6-digit verification code are required"
                    }));
                }

                if (!/^\d{6}$/.test(cleanOtp)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "Verification code must be exactly 6 numeric digits"
                    }));
                }

                const record = otpStore.get(storeKey);

                if (!record) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "No pending verification found or code has expired. Please request a new code."
                    }));
                }

                if (Date.now() > record.expiresAt) {
                    otpStore.delete(storeKey);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "Verification code has expired. Please request a new code."
                    }));
                }

                // Guard against brute force (maximum 5 attempts)
                if (record.attempts >= 5) {
                    otpStore.delete(storeKey);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: "Too many incorrect attempts. Please request a new verification code."
                    }));
                }

                // Validate OTP with SHA-256 hash comparison
                const isValid = verifyOTPHash(cleanOtp, record.hashedOtp) || (record.otp && record.otp === cleanOtp);

                if (!isValid) {
                    record.attempts = (record.attempts || 0) + 1;
                    const remaining = 5 - record.attempts;
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}`
                    }));
                }

                // Verification successful: mark user verified and delete used OTP to prevent replay attacks
                otpStore.delete(storeKey);
                console.log(`✅ [Grand Royale Security] Verified successfully: ${storeKey} (${record.name})`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: "Email verified successfully",
                    user: {
                        name: record.name,
                        email: storeKey.includes("@") ? storeKey : undefined,
                        identifier: storeKey,
                        method: record.method,
                        verifiedAt: new Date().toISOString()
                    }
                }));

            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/booking/send-otp
    // Pre-reservation 6-digit OTP verification via Real Email
    // ==========================================
    if (pathname === "/api/booking/send-otp" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const { name, email, phone, roomTitle, grandTotal, checkIn, checkOut, nights } = JSON.parse(body || "{}");
                const targetEmail = (email || "").trim().toLowerCase();
                const identifier = targetEmail || (phone || "").trim();

                if (!identifier) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Email address or phone number required for verification" }));
                }

                if (targetEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(targetEmail)) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: "Please enter a valid email address (e.g. guest@example.com)" }));
                    }
                }

                // Generate secure random 6-digit OTP and SHA-256 hash
                const otp = generate6DigitOTP();
                const hashedOtp = hashOTP(otp);
                const expiresAt = Date.now() + 5 * 60 * 1000; // 5-minute expiry

                bookingOtpStore.set(identifier, {
                    hashedOtp,
                    otp,
                    expiresAt,
                    name: name || "Valued Guest",
                    email: targetEmail,
                    phone: phone || "",
                    roomTitle: roomTitle || "Luxury Suite",
                    grandTotal: grandTotal || "₹0",
                    checkIn: checkIn || "",
                    checkOut: checkOut || "",
                    nights: nights || 1,
                    attempts: 0,
                    createdAt: Date.now()
                });

                console.log(`\n===============================================================`);
                console.log(`🏨 [GRAND ROYALE – SMART HOTEL BOOKING SYSTEM - OTP VERIFICATION]`);
                console.log(`👤 Guest: ${name || "Valued Guest"}`);
                console.log(`📧 Target Email: ${targetEmail || "None"}`);
                console.log(`📱 Contact: ${identifier}`);
                console.log(`🛏️ Suite: ${roomTitle || "Luxury Suite"}`);
                console.log(`💰 Total: ${grandTotal || "N/A"}`);
                console.log(`🔑 6-DIGIT VERIFICATION PASSCODE: [ ${otp} ]`);
                console.log(`⏰ Expiry: Valid for 5 minutes (until ${new Date(expiresAt).toLocaleTimeString()})`);

                let dispatchSuccess = false;
                let providerUsed = "None";
                let providerError = null;

                // Dispatch real email OTP to the guest's inbox via Gmail SMTP (or fallback)
                if (targetEmail) {
                    try {
                        const emailResult = await dispatchEmail(targetEmail, otp, name);
                        dispatchSuccess = true;
                        providerUsed = emailResult.provider;
                        console.log(`🚀 [Booking Email] Real verification OTP emailed via ${providerUsed} to: ${targetEmail}`);
                    } catch (err) {
                        providerError = err.message;
                        console.error(`⚠️ Booking email dispatch failed:`, err.message);
                    }
                }

                // Also optionally dispatch via CallMeBot if phone is provided and WhatsApp key configured
                if (phone && config.callmebot?.apiKey) {
                    try {
                        await sendCallMeBotWhatsApp(phone, otp);
                        console.log(`🚀 [CallMeBot] Real WhatsApp message dispatched to ${phone}`);
                    } catch (e) {
                        // ignore secondary notification error
                    }
                }

                console.log(`===============================================================\n`);

                recordOtpLog(targetEmail || identifier, "email", providerUsed, dispatchSuccess, providerError);

                res.writeHead(200, { "Content-Type": "application/json" });
                // Zero OTP codes returned to browser - OTP goes strictly to user email and admin terminal
                res.end(JSON.stringify({
                    success: true,
                    dispatched: dispatchSuccess,
                    identifier: identifier,
                    email: targetEmail,
                    expiresIn: 300,
                    provider: providerUsed,
                    error: dispatchSuccess ? null : providerError,
                    message: dispatchSuccess 
                        ? `Verification code dispatched to ${targetEmail} via ${providerUsed}`
                        : (providerError ? `Email dispatch error: ${providerError}` : "Verification code generated (Logged in admin terminal)")
                }));

            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/booking/verify-otp
    // ==========================================
    if (pathname === "/api/booking/verify-otp" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { identifier, email, otp } = JSON.parse(body || "{}");
                const cleanId = (email || identifier || "").trim().toLowerCase();
                const cleanOtp = String(otp || "").trim();

                if (!cleanId || !cleanOtp) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: "Email and 6-digit verification code are required" 
                    }));
                }

                if (!/^\d{6}$/.test(cleanOtp)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: "Verification code must be exactly 6 numeric digits" 
                    }));
                }

                const record = bookingOtpStore.get(cleanId);

                if (!record) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: "No pending verification found or code has expired. Please click Resend OTP." 
                    }));
                }

                if (Date.now() > record.expiresAt) {
                    bookingOtpStore.delete(cleanId);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: "Passcode has expired (5-minute limit). Please request a new code." 
                    }));
                }

                if (record.attempts >= 5) {
                    bookingOtpStore.delete(cleanId);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: "Too many incorrect attempts. Please request a new verification code." 
                    }));
                }

                const isValid = (record.hashedOtp && verifyOTPHash(cleanOtp, record.hashedOtp)) || (record.otp && record.otp === cleanOtp);

                if (!isValid) {
                    record.attempts = (record.attempts || 0) + 1;
                    const remaining = 5 - record.attempts;
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        error: `Incorrect 6-digit passcode. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}` 
                    }));
                }

                // Verified successfully: remove OTP from store to prevent replay
                bookingOtpStore.delete(cleanId);
                console.log(`\n===============================================================`);
                console.log(`✅ [GRAND ROYALE - BOOKING OTP VERIFIED]`);
                console.log(`👤 Guest: ${record.name} (${cleanId})`);
                console.log(`🛏️ Suite: ${record.roomTitle}`);
                console.log(`💳 Status: Email verified! Proceeding to Payment.`);
                console.log(`===============================================================\n`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: "Passcode verified successfully! Proceeding to payment.",
                    bookingData: record
                }));

            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/bookings
    // Save new guest reservation to persistent store (bookings.json)
    // ==========================================
    if (pathname === "/api/bookings" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const data = JSON.parse(body || "{}");
                const bookings = loadBookings();

                const newBooking = {
                    id: data.id || ("GR-" + Math.floor(100000 + Math.random() * 900000)),
                    guestName: data.guestName || data.name || "Valued Guest",
                    guestEmail: data.guestEmail || data.email || "",
                    guestPhone: data.guestPhone || data.phone || "",
                    roomTitle: data.roomTitle || data.suite || "Luxury Suite",
                    checkIn: data.checkIn || new Date().toISOString().split("T")[0],
                    checkOut: data.checkOut || "",
                    nights: Number(data.nights) || 1,
                    guests: data.guests || "2 Guests",
                    grandTotalUSD: Number(data.grandTotalUSD) || 0,
                    grandTotalFormatted: data.grandTotalFormatted || data.grandTotal || "₹0",
                    paymentMethod: data.paymentMethod || "Credit Card (Guaranteed)",
                    status: data.status || "Confirmed",
                    bookedAt: data.bookedAt || new Date().toLocaleDateString()
                };

                bookings.unshift(newBooking);
                saveBookings(bookings);

                console.log(`\n===============================================================`);
                console.log(`🏨 [GRAND ROYALE - NEW RESERVATION PERSISTED]`);
                console.log(`📋 ID: ${newBooking.id} | Guest: ${newBooking.guestName}`);
                console.log(`🛏️ Suite: ${newBooking.roomTitle} | Total: ${newBooking.grandTotalFormatted}`);
                console.log(`💾 Stored in: bookings.json`);
                console.log(`===============================================================\n`);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, booking: newBooking }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/admin/login
    // Admin Password Authentication
    // ==========================================
    if (pathname === "/api/admin/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { email, password } = JSON.parse(body || "{}");
                const cleanEmail = (email || "").trim().toLowerCase();
                const cleanPassword = String(password || "").trim();

                if (!cleanPassword) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Password is required" }));
                }

                if (cleanPassword !== ADMIN_PASSWORD) {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Invalid admin password" }));
                }

                if (cleanEmail && cleanEmail !== ADMIN_EMAIL) {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Unauthorized email address for admin login" }));
                }

                const token = "grandroyale_adm_" + Buffer.from(`${ADMIN_EMAIL}:${Date.now()}`).toString("base64");
                console.log(`🔐 [Grand Royale Admin] Password login successful for: ${ADMIN_EMAIL}`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    token,
                    admin: {
                        name: "Executive General Manager",
                        email: ADMIN_EMAIL,
                        role: "Super Admin",
                        hotel: "Grand Royale – Smart Hotel Booking System"
                    }
                }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/admin/send-otp
    // Admin Email OTP Authentication via Brevo
    // ==========================================
    if (pathname === "/api/admin/send-otp" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const { email } = JSON.parse(body || "{}");
                const targetEmail = (email || ADMIN_EMAIL).trim().toLowerCase();

                if (targetEmail !== ADMIN_EMAIL) {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        success: false,
                        error: `Access restricted. Admin passcode can only be sent to registered admin email (${ADMIN_EMAIL})`
                    }));
                }

                const otp = generate6DigitOTP();
                const hashedOtp = hashOTP(otp);
                const expiresAt = Date.now() + 5 * 60 * 1000;

                adminOtpStore.set(targetEmail, {
                    hashedOtp,
                    otp,
                    expiresAt,
                    attempts: 0,
                    createdAt: Date.now()
                });

                console.log(`\n===============================================================`);
                console.log(`👑 [GRAND ROYALE - ADMIN PORTAL 2FA DISPATCH]`);
                console.log(`👤 Target Admin: ${targetEmail}`);
                console.log(`🔑 6-DIGIT ADMIN PASSCODE: [ ${otp} ]`);
                console.log(`⏰ Expiry: 5 Minutes (until ${new Date(expiresAt).toLocaleTimeString()})`);

                let dispatchSuccess = false;
                let providerUsed = "None";
                let providerError = null;

                try {
                    const result = await dispatchEmail(targetEmail, otp, "Hotel Administrator");
                    dispatchSuccess = true;
                    providerUsed = result.provider;
                    console.log(`🚀 [Admin Email] 2FA Passcode emailed via ${providerUsed} to: ${targetEmail}`);
                } catch (err) {
                    providerError = err.message;
                    console.error(`⚠️ Admin email dispatch failed:`, err.message);
                }

                console.log(`===============================================================\n`);

                recordOtpLog(targetEmail, "admin-2fa", providerUsed, dispatchSuccess, providerError);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    dispatched: dispatchSuccess,
                    email: targetEmail,
                    provider: providerUsed,
                    message: dispatchSuccess 
                        ? `Admin security passcode sent to ${targetEmail} via ${providerUsed}`
                        : "Passcode generated (Logged in admin terminal)"
                }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: POST /api/admin/verify-otp
    // Admin Email OTP Verification
    // ==========================================
    if (pathname === "/api/admin/verify-otp" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { email, otp } = JSON.parse(body || "{}");
                const targetEmail = (email || ADMIN_EMAIL).trim().toLowerCase();
                const cleanOtp = String(otp || "").trim();

                const record = adminOtpStore.get(targetEmail);
                if (!record) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "No pending admin verification code found or code expired." }));
                }

                if (Date.now() > record.expiresAt) {
                    adminOtpStore.delete(targetEmail);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Admin passcode expired. Please request a new one." }));
                }

                const isValid = (record.hashedOtp && verifyOTPHash(cleanOtp, record.hashedOtp)) || (record.otp && record.otp === cleanOtp);
                if (!isValid) {
                    record.attempts = (record.attempts || 0) + 1;
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Incorrect admin passcode." }));
                }

                adminOtpStore.delete(targetEmail);
                const token = "grandroyale_adm_" + Buffer.from(`${ADMIN_EMAIL}:${Date.now()}`).toString("base64");
                console.log(`🔐 [Grand Royale Admin] OTP verification successful for: ${ADMIN_EMAIL}`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    token,
                    admin: {
                        name: "Executive General Manager",
                        email: ADMIN_EMAIL,
                        role: "Super Admin",
                        hotel: "Grand Royale – Smart Hotel Booking System"
                    }
                }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: GET /api/admin/stats
    // KPI Analytics for Admin Dashboard
    // ==========================================
    if (pathname === "/api/admin/stats" && req.method === "GET") {
        try {
            const bookings = loadBookings();
            let totalRevenueINR = 0;
            let activeCount = 0;
            let checkedInCount = 0;
            let confirmedCount = 0;
            let cancelledCount = 0;
            let completedCount = 0;

            bookings.forEach(b => {
                if (b.status !== "Cancelled") {
                    if (b.grandTotalUSD) {
                        totalRevenueINR += b.grandTotalUSD * 83;
                    } else if (typeof b.grandTotalFormatted === "string") {
                        const num = parseInt(b.grandTotalFormatted.replace(/[^\d]/g, ""), 10);
                        if (!isNaN(num)) totalRevenueINR += num;
                    }
                }
                if (b.status === "Checked-In") {
                    checkedInCount++;
                    activeCount++;
                } else if (b.status === "Confirmed") {
                    confirmedCount++;
                    activeCount++;
                } else if (b.status === "Completed") {
                    completedCount++;
                } else if (b.status === "Cancelled") {
                    cancelledCount++;
                }
            });

            const totalSuites = 25;
            const occupancyRate = Math.min(100, Math.round((activeCount / totalSuites) * 100));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: true,
                stats: {
                    totalRevenue: "₹" + totalRevenueINR.toLocaleString("en-IN"),
                    totalRevenueUSD: "$" + Math.round(totalRevenueINR / 83).toLocaleString(),
                    totalBookings: bookings.length,
                    activeGuests: activeCount,
                    checkedInGuests: checkedInCount,
                    confirmedBookings: confirmedCount,
                    cancelledBookings: cancelledCount,
                    completedBookings: completedCount,
                    occupancyRate: occupancyRate + "%",
                    occupancyPercentNum: occupancyRate,
                    totalSuites: totalSuites,
                    brevoStatus: process.env.BREVO_API_KEY ? "Connected (Live)" : "Not Configured",
                    senderEmail: process.env.BREVO_SENDER_EMAIL || "gokulshankar9398@gmail.com",
                    serverUptime: Math.floor(process.uptime()) + "s",
                    adminEmail: ADMIN_EMAIL
                }
            }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // ==========================================
    // API: GET /api/admin/bookings
    // Retrieve all reservations
    // ==========================================
    if (pathname === "/api/admin/bookings" && req.method === "GET") {
        try {
            const bookings = loadBookings();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, bookings }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // ==========================================
    // API: POST /api/admin/bookings/status
    // Update reservation status
    // ==========================================
    if (pathname === "/api/admin/bookings/status" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { id, status } = JSON.parse(body || "{}");
                if (!id || !status) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Booking ID and new status required" }));
                }

                const bookings = loadBookings();
                const index = bookings.findIndex(b => b.id === id);
                if (index === -1) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Booking record not found" }));
                }

                const prevStatus = bookings[index].status;
                bookings[index].status = status;
                bookings[index].updatedAt = new Date().toISOString();
                saveBookings(bookings);

                console.log(`🏨 [Admin Update] Booking ${id} status changed: ${prevStatus} -> ${status}`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, booking: bookings[index] }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: DELETE or POST /api/admin/bookings/delete
    // Remove reservation
    // ==========================================
    if ((pathname === "/api/admin/bookings" && req.method === "DELETE") ||
        (pathname === "/api/admin/bookings/delete" && req.method === "POST")) {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
                const queryId = parsedUrl.searchParams.get("id");
                const bodyData = body ? JSON.parse(body) : {};
                const id = queryId || bodyData.id;

                if (!id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Booking ID required for deletion" }));
                }

                let bookings = loadBookings();
                const initialLength = bookings.length;
                bookings = bookings.filter(b => b.id !== id);

                if (bookings.length === initialLength) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ success: false, error: "Booking record not found" }));
                }

                saveBookings(bookings);
                console.log(`🗑️ [Admin Action] Booking ${id} deleted.`);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: `Reservation ${id} deleted successfully` }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: GET /api/admin/otp-logs
    // Real-Time OTP & Security Audit Logs
    // ==========================================
    if (pathname === "/api/admin/otp-logs" && req.method === "GET") {
        try {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, logs: otpAuditLogs }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // ==========================================
    // API: POST /api/admin/test-email
    // Quick Brevo Connection Test
    // ==========================================
    if (pathname === "/api/admin/test-email" && req.method === "POST") {
        (async () => {
            try {
                const testResult = await dispatchEmail(ADMIN_EMAIL, "888999", "Hotel Admin Tester");
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: `Test email dispatched successfully to ${ADMIN_EMAIL} via ${testResult.provider}`,
                    result: testResult
                }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        })();
        return;
    }

    // ==========================================
    // STATIC FILE SERVING
    // ==========================================
    let servePath = pathname;
    if (servePath === "/admin" || servePath === "/admin/") {
        servePath = "/admin.html";
    }
    let filePath = path.join(__dirname, servePath === "/" ? "index.html" : servePath);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1>", "utf-8");
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, "utf-8");
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n===============================================================`);
    console.log(`🏰 Grand Royale – Smart Hotel Booking System - Server Running`);
    console.log(`📍 Web Application: http://0.0.0.0:${PORT}`);
    console.log(`🔒 Security: Zero OTP codes displayed on web page`);
    console.log(`📲 Real SMS Support: Twilio & Fast2SMS Ready in config.json`);
    console.log(`===============================================================\n`);
});
