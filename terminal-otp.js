/**
 * Grand Royale – Live Terminal OTP Streamer
 * 
 * Runs in your PowerShell / Command Prompt.
 * Automatically polls for live OTP requests from Render (and localhost)
 * and prints any new 6-digit passcode directly to your terminal!
 */

const https = require("https");
const http = require("http");

const RENDER_URL = "https://grand-royale-hotel.onrender.com/api/admin/otp-logs";
const LOCAL_URL = "http://localhost:3000/api/admin/otp-logs";

console.clear();
console.log(`\x1b[33m
===============================================================
👑 GRAND ROYALE – LIVE TERMINAL OTP STREAMER
===============================================================
\x1b[0m\x1b[36m
📡 Listening for live OTP requests from your phone & web...
🌐 Connected to: https://grand-royale-hotel.onrender.com
💡 Whenever anyone requests an OTP, it will pop up right here!
\x1b[0m
===============================================================
`);

const seenLogIds = new Set();
let isFirstCheck = true;

function fetchJson(url) {
    return new Promise((resolve) => {
        const client = url.startsWith("https") ? https : http;
        const req = client.get(url, { timeout: 4000 }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on("error", () => resolve(null));
        req.on("timeout", () => { req.destroy(); resolve(null); });
    });
}

async function checkLogs() {
    // Check Render first, fallback to localhost
    let data = await fetchJson(RENDER_URL);
    if (!data || !data.success) {
        data = await fetchJson(LOCAL_URL);
    }

    if (data && data.success && Array.isArray(data.logs)) {
        // Render newest logs first
        const newLogs = [];
        for (const log of data.logs) {
            if (!seenLogIds.has(log.id)) {
                seenLogIds.add(log.id);
                newLogs.push(log);
            }
        }

        if (isFirstCheck) {
            isFirstCheck = false;
            if (data.logs.length > 0) {
                const latest = data.logs[0];
                console.log(`\x1b[32m✔ Connected! Most recent passcode on record:\x1b[0m`);
                printOtpCard(latest);
            } else {
                console.log(`\x1b[32m✔ Connected! Ready and waiting for your first OTP request...\x1b[0m\n`);
            }
            return;
        }

        // Print new incoming OTPs in chronological order
        for (let i = newLogs.length - 1; i >= 0; i--) {
            const log = newLogs[i];
            process.stdout.write("\x07"); // System Bell beep
            printOtpCard(log);
        }
    }
}

function printOtpCard(log) {
    const code = log.otp || "VERIFIED";
    console.log(`
\x1b[33m╔═══════════════════════════════════════════════════════════════╗
║  👑 LIVE PASSCODE DETECTED IN YOUR TERMINAL!                  ║
╚═══════════════════════════════════════════════════════════════╝\x1b[0m
\x1b[36m👤 Recipient:\x1b[0m   \x1b[1m${log.target}\x1b[0m
\x1b[33m🔑 PASSCODE:\x1b[0m    \x1b[1;43;30m [ ${code.split("").join(" ")} ] \x1b[0m  \x1b[32m(Valid for 5 min)\x1b[0m
\x1b[36m📡 Channel:\x1b[0m     ${log.method.toUpperCase()} (${log.provider})
\x1b[36m⏰ Time:\x1b[0m        ${log.timestamp} - ${log.date}
\x1b[32m👉 Enter [ ${code} ] on your phone or web browser to sign in!\x1b[0m
───────────────────────────────────────────────────────────────
`);
}

// Poll every 1.5 seconds
checkLogs();
setInterval(checkLogs, 1500);
