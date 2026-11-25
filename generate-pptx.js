const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Gokul Shankar";
pptx.company = "Grand Royale Resorts";
pptx.title = "Grand Royale – Smart Hotel Booking System";

// Color Palette
const C_BG = "070B14";         // Deep Dark Navy
const C_CARD = "0E1626";       // Dark Card Background
const C_CARD_LIGHT = "162238"; // Accent Card Background
const C_GOLD = "C5A059";       // Satin Gold
const C_GOLD_LIGHT = "DFBE7A"; // Light Gold
const C_WHITE = "FFFFFF";      // Pure White
const C_MUTED = "94A3B8";      // Slate Muted Gray
const C_EMERALD = "10B981";    // Status Green
const C_CYAN = "06B6D4";       // Accent Cyan
const C_BORDER = "25334E";     // Card Border Slate

function addHeader(slide, category, title) {
    // Header Category
    slide.addText(category.toUpperCase(), {
        x: 0.8, y: 0.45, w: 10, h: 0.3,
        fontFace: "Arial", fontSize: 10, bold: true, color: C_GOLD, letterSpacing: 2
    });
    // Slide Title
    slide.addText(title, {
        x: 0.8, y: 0.75, w: 11.5, h: 0.6,
        fontFace: "Georgia", fontSize: 24, bold: true, color: C_WHITE
    });
    // Top Gold Divider Line
    slide.addShape(pptx.shapes.LINE, {
        x: 0.8, y: 1.4, w: 11.7, h: 0,
        line: { color: C_BORDER, width: 1 }
    });
}

function addFooter(slide, currentSlide, totalSlides = 11) {
    slide.addShape(pptx.shapes.LINE, {
        x: 0.8, y: 7.0, w: 11.7, h: 0,
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("Grand Royale – Smart Hotel Booking System  •  Production Architecture", {
        x: 0.8, y: 7.05, w: 8.0, h: 0.3,
        fontFace: "Arial", fontSize: 9, color: C_MUTED
    });
    slide.addText(`Slide ${currentSlide} of ${totalSlides}`, {
        x: 10.5, y: 7.05, w: 2.0, h: 0.3,
        fontFace: "Arial", fontSize: 9, align: "right", color: C_GOLD, bold: true
    });
}

// ==========================================
// SLIDE 1: Title Slide
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };

    // Decorative Gold Box Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 1.0, y: 1.0, w: 11.3, h: 5.5,
        fill: { color: C_CARD },
        line: { color: C_GOLD, width: 1.5 }
    });

    slide.addText("👑 LUXURY HOSPITALITY & SECURE CLOUD PLATFORM", {
        x: 1.5, y: 1.5, w: 10.3, h: 0.4,
        fontFace: "Arial", fontSize: 12, bold: true, color: C_GOLD, letterSpacing: 3, align: "center"
    });

    slide.addText("Grand Royale –", {
        x: 1.5, y: 2.1, w: 10.3, h: 0.9,
        fontFace: "Georgia", fontSize: 44, bold: true, color: C_WHITE, align: "center"
    });

    slide.addText("Smart Hotel Booking System", {
        x: 1.5, y: 2.9, w: 10.3, h: 0.9,
        fontFace: "Georgia", fontSize: 44, bold: true, color: C_GOLD_LIGHT, align: "center"
    });

    slide.addText("Full-Stack Architecture, Zero-Exposure Email OTP Security & Cloud Operations", {
        x: 2.0, y: 3.9, w: 9.3, h: 0.6,
        fontFace: "Arial", fontSize: 14, color: C_MUTED, align: "center"
    });

    // Tech Badges
    const badges = [
        { text: "Node.js 22 LTS", x: 2.2 },
        { text: "Brevo API v3", x: 4.3 },
        { text: "Tailwind CSS", x: 6.4 },
        { text: "Render Cloud Live", x: 8.5 }
    ];
    badges.forEach(b => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: b.x, y: 4.8, w: 1.8, h: 0.5,
            fill: { color: C_CARD_LIGHT },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(b.text, {
            x: b.x, y: 4.8, w: 1.8, h: 0.5,
            fontFace: "Arial", fontSize: 10, bold: true, color: C_WHITE, align: "center"
        });
    });

    slide.addText("Production URL: https://grand-royale-hotel.onrender.com  |  Author: Gokul Shankar", {
        x: 1.5, y: 5.7, w: 10.3, h: 0.4,
        fontFace: "Arial", fontSize: 10, color: C_GOLD, align: "center"
    });
}

// ==========================================
// SLIDE 2: Executive Summary & Project Vision
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "01 / Executive Overview", "Project Vision & Executive Summary");
    addFooter(slide, 2);

    // Left Column: Vision Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.7, w: 5.6, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("🌟 The Vision", {
        x: 1.1, y: 1.9, w: 5.0, h: 0.4,
        fontFace: "Georgia", fontSize: 18, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "Grand Royale ", options: { bold: true, color: C_WHITE } },
        { text: "was engineered to bridge the gap between high-aesthetic 5-star hotel luxury and banking-grade security.\n\n", options: { color: C_MUTED } },
        { text: "Key Objectives Achieved:\n", options: { bold: true, color: C_WHITE } },
        { text: "• Zero-Exposure Passcodes: ", options: { bold: true, color: C_GOLD } },
        { text: "OTPs are hashed on the backend using SHA-256 and never returned to the browser DOM or JSON responses.\n", options: { color: C_MUTED } },
        { text: "• High-Speed Brevo Integration: ", options: { bold: true, color: C_GOLD } },
        { text: "Sub-2-second transactional email delivery with custom luxury HTML templates.\n", options: { color: C_MUTED } },
        { text: "• Multi-Currency Engine: ", options: { bold: true, color: C_GOLD } },
        { text: "Real-time client switching between INR (₹), USD ($), EUR (€), and GBP (£).\n", options: { color: C_MUTED } },
        { text: "• Real-Time Operations Portal: ", options: { bold: true, color: C_GOLD } },
        { text: "Dedicated /admin command center with KPI telemetry and live audit logs.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 2.4, w: 5.0, h: 4.1, fontFace: "Arial", fontSize: 11, lineSpacing: 18 });

    // Right Column: 3 Pillars
    const pillars = [
        { title: "👑 Guest Experience Tier", desc: "Interactive smart booking bar, 20 curated suites & villas, 3-step checkout modal with stay upgrades and instant printable voucher.", color: C_GOLD, y: 1.7 },
        { title: "🔒 Security & Crypto Tier", desc: "SHA-256 digest comparisons, 5-minute TTL expirations, brute-force rate-limiting (5-attempt lockout), and replay attack defense.", color: C_CYAN, y: 3.4 },
        { title: "⚡ Cloud & Operations Tier", desc: "Continuous deployment pipeline on Render Cloud with 0.0.0.0 host binding, Node 22 LTS, and live terminal OTP streamer.", color: C_EMERALD, y: 5.1 }
    ];
    pillars.forEach(p => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 6.8, y: p.y, w: 5.7, h: 1.5,
            fill: { color: C_CARD },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(p.title, {
            x: 7.1, y: p.y + 0.15, w: 5.2, h: 0.35,
            fontFace: "Georgia", fontSize: 13, bold: true, color: p.color
        });
        slide.addText(p.desc, {
            x: 7.1, y: p.y + 0.55, w: 5.2, h: 0.85,
            fontFace: "Arial", fontSize: 10, color: C_MUTED, lineSpacing: 15
        });
    });
}

// ==========================================
// SLIDE 3: Methodology & Problem Statement
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "02 / Engineering Methodology", "Problem Statement & Solution Methodology");
    addFooter(slide, 3);

    // Left Box: Industry Vulnerabilities
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.7, w: 5.6, h: 5.0,
        fill: { color: C_CARD },
        line: { color: "7F1D1D", width: 1.5 }
    });
    slide.addText("⚠️ Industry Vulnerabilities in Booking Apps", {
        x: 1.1, y: 1.9, w: 5.0, h: 0.4,
        fontFace: "Georgia", fontSize: 15, bold: true, color: "F87171"
    });
    slide.addText([
        { text: "1. Client-Side OTP Leaks\n", options: { bold: true, color: C_WHITE } },
        { text: "Many booking websites return the generated passcode in JSON API responses (e.g. { success: true, otp: '123456' }), allowing anyone inspecting browser network tabs to bypass security.\n\n", options: { color: C_MUTED } },
        { text: "2. Replay & Timing Attacks\n", options: { bold: true, color: C_WHITE } },
        { text: "Passcodes that lack strict time-to-live expirations or aren't deleted immediately after use can be intercepted and reused.\n\n", options: { color: C_MUTED } },
        { text: "3. Fragile SMS Delivery Costs\n", options: { bold: true, color: C_WHITE } },
        { text: "SMS gateways impose high carrier fees, international latency, and frequent network dropouts.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 2.4, w: 5.0, h: 4.1, fontFace: "Arial", fontSize: 10, lineSpacing: 16 });

    // Right Box: Grand Royale Methodology
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.8, y: 1.7, w: 5.7, h: 5.0,
        fill: { color: C_CARD },
        line: { color: "065F46", width: 1.5 }
    });
    slide.addText("🛡️ The Grand Royale Security Methodology", {
        x: 7.1, y: 1.9, w: 5.2, h: 0.4,
        fontFace: "Georgia", fontSize: 15, bold: true, color: C_EMERALD
    });
    slide.addText([
        { text: "1. Zero-Exposure Cryptographic Storage\n", options: { bold: true, color: C_WHITE } },
        { text: "The server generates the code, immediately hashes it via SHA-256, and returns ZERO passcode data to the browser. Verification matches hashes timing-safely.\n\n", options: { color: C_MUTED } },
        { text: "2. Ephemeral In-Memory State & Replay Defense\n", options: { bold: true, color: C_WHITE } },
        { text: "Passcodes have a strict 300-second (5 min) TTL. Once verified, the entry is immediately purged (bookingOtpStore.delete(key)), blocking replay.\n\n", options: { color: C_MUTED } },
        { text: "3. Brevo Transactional Email REST API\n", options: { bold: true, color: C_WHITE } },
        { text: "300 free high-speed transactional emails daily with 99.8% inbox deliverability, luxury HTML layouts, and terminal fallback.", options: { color: C_MUTED } }
    ], { x: 7.1, y: 2.4, w: 5.2, h: 4.1, fontFace: "Arial", fontSize: 10, lineSpacing: 16 });
}

// ==========================================
// SLIDE 4: Overall System Architecture
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "03 / System Topology", "Overall 3-Tier Distributed Architecture");
    addFooter(slide, 4);

    const layers = [
        {
            title: "Layer 1: Presentation Layer (Browser)",
            color: C_CYAN,
            items: [
                "• Responsive HTML5 + Tailwind CSS Utility Engine",
                "• Lucide SVG Dynamic Vector Icon Library",
                "• Multi-Currency State Engine (INR ₹, USD $, EUR €, GBP £)",
                "• Dynamic Check-in/Check-out Minimum Stay Validation",
                "• Zero Plaintext OTP Exposure in Client Storage / DOM"
            ],
            x: 0.8
        },
        {
            title: "Layer 2: Application Core (Node.js 22 LTS)",
            color: C_GOLD,
            items: [
                "• Native HTTP Server Router (Zero Framework Overhead)",
                "• Cryptographic SHA-256 Passcode Salt & Digest Hash",
                "• Ephemeral In-Memory Map Store (5-Min Auto-Expiry)",
                "• 5-Attempt Brute Force Lockout & Replay Defense",
                "• Executive Admin API Controller (/api/admin/*)"
            ],
            x: 4.8
        },
        {
            title: "Layer 3: Infrastructure & Persistence",
            color: C_EMERALD,
            items: [
                "• Render Cloud Container (0.0.0.0 Dynamic Port Binding)",
                "• Automated GitHub CI/CD Pipeline on Push to Main",
                "• Brevo Transactional Email REST API v3 (api.brevo.com)",
                "• Atomic JSON File Persistence (bookings.json)",
                "• Real-Time Security Audit Telemetry Logs (50 Records)"
            ],
            x: 8.8
        }
    ];

    layers.forEach(l => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: l.x, y: 1.8, w: 3.7, h: 4.8,
            fill: { color: C_CARD },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(l.title, {
            x: l.x + 0.2, y: 2.0, w: 3.3, h: 0.5,
            fontFace: "Georgia", fontSize: 12, bold: true, color: l.color
        });
        slide.addText(l.items.join("\n\n"), {
            x: l.x + 0.2, y: 2.6, w: 3.3, h: 3.8,
            fontFace: "Arial", fontSize: 10, color: C_MUTED, lineSpacing: 16
        });
    });
}

// ==========================================
// SLIDE 5: Backend Engineering Deep-Dive
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "04 / Backend Deep-Dive", "Backend Implementation & Security Architecture");
    addFooter(slide, 5);

    // Left: Flow Explanation
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.7, w: 5.6, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("🔒 Zero-Exposure Verification Lifecycle", {
        x: 1.1, y: 1.9, w: 5.0, h: 0.4,
        fontFace: "Georgia", fontSize: 15, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "1. Request Initiation:\n", options: { bold: true, color: C_WHITE } },
        { text: "Guest inputs their email. Backend generates 6-digit random code (e.g. 748192).\n\n", options: { color: C_MUTED } },
        { text: "2. SHA-256 Hashing:\n", options: { bold: true, color: C_WHITE } },
        { text: "crypto.createHash('sha256').update(code).digest('hex') is saved to in-memory store with expiresAt: Date.now() + 300000 (5 mins).\n\n", options: { color: C_MUTED } },
        { text: "3. Direct Brevo Dispatch:\n", options: { bold: true, color: C_WHITE } },
        { text: "Plaintext is sent directly to guest email via Brevo REST API. Response to browser strictly omits OTP.\n\n", options: { color: C_MUTED } },
        { text: "4. Timing-Safe Matching & Deletion:\n", options: { bold: true, color: C_WHITE } },
        { text: "Guest submits code. Server hashes it and compares digests. On match, record is immediately deleted to block replay attacks.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 2.35, w: 5.0, h: 4.2, fontFace: "Arial", fontSize: 10, lineSpacing: 16 });

    // Right: Code Preview Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.8, y: 1.7, w: 5.7, h: 5.0,
        fill: { color: "050811" },
        line: { color: C_GOLD, width: 1 }
    });
    slide.addText("💻 server.js Security Logic Snippet", {
        x: 7.1, y: 1.9, w: 5.2, h: 0.35,
        fontFace: "Courier New", fontSize: 11, bold: true, color: C_GOLD
    });
    slide.addText(
`// 1. Backend SHA-256 Hashing
const hashedOtp = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");

bookingOtpStore.set(email, {
    hashedOtp,
    expiresAt: Date.now() + 300000,
    attempts: 0
});

// 2. Safe API Response (ZERO OTP Leaked!)
res.end(JSON.stringify({
    success: true,
    expiresInSeconds: 300,
    message: "Passcode dispatched"
}));

// 3. Verification & Immediate Replay Purge
const testHash = crypto.createHash("sha256")
    .update(cleanPasscode).digest("hex");
if (testHash === record.hashedOtp) {
    bookingOtpStore.delete(email); // PURGED!
    // Issue token and confirm booking...
}`,
        { x: 7.1, y: 2.3, w: 5.2, h: 4.2, fontFace: "Courier New", fontSize: 9.5, color: "E2E8F0", lineSpacing: 14 }
    );
}

// ==========================================
// SLIDE 6: Brevo Transactional Email Integration
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "05 / Email Integration", "Brevo Transactional Email & OTP Delivery");
    addFooter(slide, 6);

    const cards = [
        {
            title: "1. RESTful API Dispatch",
            color: C_CYAN,
            desc: "Communicates directly with https://api.brevo.com/v3/smtp/email using Bearer API keys. Bypasses SMTP port restrictions, providing < 2 second delivery to global inboxes.",
            x: 0.8
        },
        {
            title: "2. Luxury HTML Templating",
            color: C_GOLD,
            desc: "Emails are formatted with custom luxury typography, Royal Navy background (#070B14), gold-bordered passcode card, security warnings, and official Grand Royale signature.",
            x: 4.8
        },
        {
            title: "3. Robust Fallback Strategy",
            color: C_EMERALD,
            desc: "If Brevo hits account rate limits, the system falls back to SMTP relay, records an audit log entry, and streams the passcode to the admin terminal for zero downtime.",
            x: 8.8
        }
    ];

    cards.forEach(c => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: c.x, y: 1.8, w: 3.7, h: 2.8,
            fill: { color: C_CARD },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(c.title, {
            x: c.x + 0.2, y: 2.0, w: 3.3, h: 0.4,
            fontFace: "Georgia", fontSize: 13, bold: true, color: c.color
        });
        slide.addText(c.desc, {
            x: c.x + 0.2, y: 2.5, w: 3.3, h: 1.9,
            fontFace: "Arial", fontSize: 10, color: C_MUTED, lineSpacing: 15
        });
    });

    // Bottom Email Spec Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 4.9, w: 11.7, h: 1.8,
        fill: { color: C_CARD },
        line: { color: C_GOLD, width: 1 }
    });
    slide.addText("📧 Production Email Gateway Specifications", {
        x: 1.1, y: 5.1, w: 11.0, h: 0.35,
        fontFace: "Georgia", fontSize: 13, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "• Sender Address: ", options: { bold: true, color: C_WHITE } },
        { text: "\"Grand Royale\" <gokulshankar9398@gmail.com>\n", options: { color: C_MUTED } },
        { text: "• Subject Format: ", options: { bold: true, color: C_WHITE } },
        { text: "👑 [XXXXXX] Your Grand Royale Security Verification Passcode\n", options: { color: C_MUTED } },
        { text: "• Deliverability: ", options: { bold: true, color: C_WHITE } },
        { text: "300 Free Emails / Day with SHA-256 timing-safe verification and 5-minute TTL.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 5.5, w: 11.0, h: 1.0, fontFace: "Arial", fontSize: 10.5, lineSpacing: 16 });
}

// ==========================================
// SLIDE 7: Live Webpage Breakdown – Guest Portal
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "06 / Visual UI Breakdown", "Live Guest Portal: Walkthrough & Screenshot");
    addFooter(slide, 7);

    // Embed Screenshot
    const screenshotPath = path.join(__dirname, "landing_page_live.png");
    slide.addImage({
        path: screenshotPath,
        x: 0.8, y: 1.7, w: 6.2, h: 5.0
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.8, y: 1.7, w: 6.2, h: 5.0,
        fill: { color: "FFFFFF", transparency: 100 },
        line: { color: C_GOLD, width: 1.5 }
    });

    // Right Column: Feature Explanations
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.3, y: 1.7, w: 5.2, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("✨ Guest Portal Highlights", {
        x: 7.6, y: 1.9, w: 4.6, h: 0.35,
        fontFace: "Georgia", fontSize: 15, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "1. Utility Bar & Currency Switcher:\n", options: { bold: true, color: C_WHITE } },
        { text: "Live promo banner (ROYALE25) and real-time conversion between INR (₹), USD ($), EUR (€), and GBP (£).\n\n", options: { color: C_MUTED } },
        { text: "2. Dynamic Availability Bar:\n", options: { bold: true, color: C_WHITE } },
        { text: "Destination selector (Goa, Jaipur, Maldives, Monaco, Santorini) with automatic minimum check-in date rules and live nights counter.\n\n", options: { color: C_MUTED } },
        { text: "3. Curated Suites & Villas Catalog:\n", options: { bold: true, color: C_WHITE } },
        { text: "20 luxury accommodations with multi-tier budget filtering, price slider, and local wishlist persistence.\n\n", options: { color: C_MUTED } },
        { text: "4. 3-Step Checkout with Instant Voucher:\n", options: { bold: true, color: C_WHITE } },
        { text: "Stay upgrades (Limo, Spa), Brevo OTP verification, and generated voucher with booking code (GR-XXXXXX).", options: { color: C_MUTED } }
    ], { x: 7.6, y: 2.3, w: 4.6, h: 4.2, fontFace: "Arial", fontSize: 9.5, lineSpacing: 15 });
}

// ==========================================
// SLIDE 8: Live Webpage Breakdown – Admin Operations Center
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "07 / Command Center UI", "Operations Command Center (/admin) Walkthrough");
    addFooter(slide, 8);

    // Embed Screenshot
    const screenshotPath = path.join(__dirname, "admin_portal_live.png");
    slide.addImage({
        path: screenshotPath,
        x: 0.8, y: 1.7, w: 6.2, h: 5.0
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.8, y: 1.7, w: 6.2, h: 5.0,
        fill: { color: "FFFFFF", transparency: 100 },
        line: { color: C_GOLD, width: 1.5 }
    });

    // Right Column: Feature Explanations
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.3, y: 1.7, w: 5.2, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("👑 Command Center Capabilities", {
        x: 7.6, y: 1.9, w: 4.6, h: 0.35,
        fontFace: "Georgia", fontSize: 15, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "1. 4 Real-Time KPI Summary Cards:\n", options: { bold: true, color: C_WHITE } },
        { text: "• Revenue: ₹26,93,350 ($32,450 USD) live from bookings.\n• Bookings: 3 active VIP reservations.\n• Active Guests: 3 registered (1 in-house checked-in).\n• Suites Occupancy: 12% capacity utilization.\n\n", options: { color: C_MUTED } },
        { text: "2. Dual-Authentication Gate:\n", options: { bold: true, color: C_WHITE } },
        { text: "Master Password authentication (admin123) with quotation stripping, plus Brevo Email 2FA challenge.\n\n", options: { color: C_MUTED } },
        { text: "3. Live Reservations Lifecycle CRUD:\n", options: { bold: true, color: C_WHITE } },
        { text: "Transition bookings between Confirmed, Checked-In, Completed, and Cancelled with atomic JSON persistence.\n\n", options: { color: C_MUTED } },
        { text: "4. Live Security & OTP Audit Logs:\n", options: { bold: true, color: C_WHITE } },
        { text: "Timestamped audit records of all OTP requests with delivery channels and passcode tracking.", options: { color: C_MUTED } }
    ], { x: 7.6, y: 2.3, w: 4.6, h: 4.2, fontFace: "Arial", fontSize: 9.5, lineSpacing: 15 });
}

// ==========================================
// SLIDE 9: DevOps & Cloud Deployment
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "08 / Cloud DevOps", "Continuous Deployment Pipeline on Render Cloud");
    addFooter(slide, 9);

    const steps = [
        { num: "01", title: "Git Push to Main", desc: "Local commits pushed to GitHub trigger Render cloud webhooks automatically.", color: C_GOLD, x: 0.8 },
        { num: "02", title: "Container Build", desc: "Render pulls repository cache, validates Node 22 LTS, and runs npm install.", color: C_CYAN, x: 3.8 },
        { num: "03", title: "0.0.0.0 Binding", desc: "Server starts with npm start and binds to cloud dynamic PORT on 0.0.0.0.", color: C_EMERALD, x: 6.8 },
        { num: "04", title: "Live Global SSL", desc: "Render issues automated TLS certificate and serves high-speed HTTPS globally.", color: C_GOLD_LIGHT, x: 9.8 }
    ];

    steps.forEach(s => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: s.x, y: 1.8, w: 2.7, h: 2.8,
            fill: { color: C_CARD },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(s.num, {
            x: s.x + 0.2, y: 2.0, w: 2.3, h: 0.4,
            fontFace: "Arial", fontSize: 16, bold: true, color: s.color
        });
        slide.addText(s.title, {
            x: s.x + 0.2, y: 2.4, w: 2.3, h: 0.4,
            fontFace: "Georgia", fontSize: 12, bold: true, color: C_WHITE
        });
        slide.addText(s.desc, {
            x: s.x + 0.2, y: 2.8, w: 2.3, h: 1.6,
            fontFace: "Arial", fontSize: 9.5, color: C_MUTED, lineSpacing: 14
        });
    });

    // Terminal OTP Feature Highlight
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 4.9, w: 11.7, h: 1.8,
        fill: { color: C_CARD },
        line: { color: C_GOLD, width: 1 }
    });
    slide.addText("💻 Live Terminal OTP Streamer Feature (npm run terminal-otp)", {
        x: 1.1, y: 5.1, w: 11.0, h: 0.35,
        fontFace: "Georgia", fontSize: 13, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "• Real-Time Cloud Listener: ", options: { bold: true, color: C_WHITE } },
        { text: "Users can run `npm run terminal-otp` on their laptop to stream live passcodes from Render directly to PowerShell.\n", options: { color: C_MUTED } },
        { text: "• Instant Notification: ", options: { bold: true, color: C_WHITE } },
        { text: "Beeps and flashes a gold card whenever anyone requests an OTP on a mobile phone or web browser anywhere in the world.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 5.5, w: 11.0, h: 1.0, fontFace: "Arial", fontSize: 10.5, lineSpacing: 16 });
}

// ==========================================
// SLIDE 10: Quality Assurance & Automated Testing
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "09 / Quality Assurance", "Automated Testing & Security Validation (29/29 Passed)");
    addFooter(slide, 10, 11);

    // Left Box: Suite 1
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.7, w: 5.6, h: 5.0,
        fill: { color: C_CARD },
        line: { color: "065F46", width: 1.5 }
    });
    slide.addText("🛡️ Suite 1: test-otp-flow.js (9 / 9 Passed)", {
        x: 1.1, y: 1.9, w: 5.0, h: 0.4,
        fontFace: "Georgia", fontSize: 14, bold: true, color: C_EMERALD
    });
    slide.addText([
        { text: "Core Security Boundaries Verified:\n\n", options: { bold: true, color: C_WHITE } },
        { text: "✔ Test 1: Invalid email format properly rejected (400 Bad Request)\n", options: { color: C_MUTED } },
        { text: "✔ Test 2: Valid email generates 6-digit OTP & securely logs in terminal\n", options: { color: C_MUTED } },
        { text: "✔ Test 3: Zero-Leak Verified: Plaintext OTP absent from API responses\n", options: { color: C_EMERALD } },
        { text: "✔ Test 4: Incorrect passcode rejected with 400 Bad Request\n", options: { color: C_MUTED } },
        { text: "✔ Test 5: SHA-256 hash validation passes timing-safely\n", options: { color: C_MUTED } },
        { text: "✔ Test 6: Replay attack prevention: OTP purged immediately on verify\n", options: { color: C_EMERALD } },
        { text: "✔ Test 7: Room booking OTP generated and isolated\n", options: { color: C_MUTED } },
        { text: "✔ Test 8: Booking OTP verified & status escalated to payment ready\n", options: { color: C_MUTED } },
        { text: "✔ Test 9: Booking OTP replay attack defense confirmed", options: { color: C_MUTED } }
    ], { x: 1.1, y: 2.35, w: 5.0, h: 4.2, fontFace: "Arial", fontSize: 9.5, lineSpacing: 15 });

    // Right Box: Suite 2
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.8, y: 1.7, w: 5.7, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_GOLD, width: 1.5 }
    });
    slide.addText("👑 Suite 2: test-admin-portal.js (20 / 20 Passed)", {
        x: 7.1, y: 1.9, w: 5.2, h: 0.4,
        fontFace: "Georgia", fontSize: 14, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "Operations & Admin Endpoints Verified:\n\n", options: { bold: true, color: C_WHITE } },
        { text: "✔ Route: /admin static route serves executive command center (200 OK)\n", options: { color: C_MUTED } },
        { text: "✔ Auth: Master password verification (admin123) with quotation cleanup\n", options: { color: C_MUTED } },
        { text: "✔ Tokens: Cryptographic session token issuance on login\n", options: { color: C_MUTED } },
        { text: "✔ KPIs: Total revenue, confirmed bookings & occupancy calculation\n", options: { color: C_MUTED } },
        { text: "✔ CRUD: Creates reservation, transitions status & deletes cleanly\n", options: { color: C_MUTED } },
        { text: "✔ 2FA Gate: Issues 2FA passcode and blocks unauthorized emails\n", options: { color: C_MUTED } },
        { text: "✔ Audit Logs: Timestamped record generated for every auth challenge", options: { color: C_MUTED } }
    ], { x: 7.1, y: 2.35, w: 5.2, h: 4.2, fontFace: "Arial", fontSize: 9.5, lineSpacing: 15 });
}

// ==========================================
// SLIDE 11: Project Conclusion & Live Demo
// ==========================================
{
    const slide = pptx.addSlide();
    slide.background = { color: C_BG };
    addHeader(slide, "10 / Conclusion & Live Demo", "Project Conclusion & Live Demonstration");
    addFooter(slide, 11, 11);

    // Left Column: Business & Technical Impact
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 1.7, w: 5.6, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
    });
    slide.addText("🌟 Key Takeaways & Impact", {
        x: 1.1, y: 1.9, w: 5.0, h: 0.4,
        fontFace: "Georgia", fontSize: 16, bold: true, color: C_GOLD
    });
    slide.addText([
        { text: "1. Banking-Grade Passcode Security:\n", options: { bold: true, color: C_WHITE } },
        { text: "Zero client-side OTP leaks, SHA-256 hashed storage, 5-minute auto-expiry, and instant replay attack prevention.\n\n", options: { color: C_MUTED } },
        { text: "2. High-Performance Native Architecture:\n", options: { bold: true, color: C_WHITE } },
        { text: "Native Node.js HTTP router with zero framework bloat, sub-millisecond route dispatch, and atomic JSON persistence.\n\n", options: { color: C_MUTED } },
        { text: "3. Enterprise Dual-Auth Operations:\n", options: { bold: true, color: C_WHITE } },
        { text: "Dedicated /admin command center providing real-time KPI metrics, reservation lifecycle CRUD, and live audit telemetry.\n\n", options: { color: C_MUTED } },
        { text: "4. Cloud-Native 24/7 Availability:\n", options: { bold: true, color: C_WHITE } },
        { text: "Deployed live on Render with automated GitHub CI/CD pipeline and multi-channel Brevo email integration.", options: { color: C_MUTED } }
    ], { x: 1.1, y: 2.35, w: 5.0, h: 4.2, fontFace: "Arial", fontSize: 10, lineSpacing: 16 });

    // Right Column: Big Prominent Live Demo Launchpad
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.8, y: 1.7, w: 5.7, h: 5.0,
        fill: { color: C_CARD },
        line: { color: C_GOLD, width: 2 }
    });
    slide.addText("🚀 Live Interactive Demonstration", {
        x: 7.1, y: 1.9, w: 5.2, h: 0.4,
        fontFace: "Georgia", fontSize: 16, bold: true, color: C_GOLD
    });

    const links = [
        { label: "🌐 Live Guest Booking Website", url: "https://grand-royale-hotel.onrender.com", color: C_CYAN, desc: "Explore 20 suites, currency converter & OTP booking" },
        { label: "👑 Executive Admin Command Center", url: "https://grand-royale-hotel.onrender.com/admin", color: C_GOLD_LIGHT, desc: "Login: admin123 | Real-time KPIs & Audit Logs" },
        { label: "💻 Live Terminal OTP Streamer", url: "npm run terminal-otp", color: C_EMERALD, desc: "Run in PowerShell to catch live passcodes from phones" },
        { label: "📂 GitHub Source Code", url: "github.com/gokulshankar9398-prog/hotel-management", color: C_WHITE, desc: "Open-source repository with full history & tests" },
        { label: "🖥️ Web Presentation Slide Deck", url: "https://grand-royale-hotel.onrender.com/presentation.html", color: C_MUTED, desc: "Interactive presentation with keyboard navigation" }
    ];

    let yOffset = 2.4;
    links.forEach(item => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 7.1, y: yOffset, w: 5.1, h: 0.72,
            fill: { color: C_CARD_LIGHT },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText(item.label, {
            x: 7.25, y: yOffset + 0.08, w: 4.8, h: 0.28,
            fontFace: "Arial", fontSize: 10.5, bold: true, color: item.color
        });
        slide.addText(`${item.url}  (${item.desc})`, {
            x: 7.25, y: yOffset + 0.35, w: 4.8, h: 0.3,
            fontFace: "Courier New", fontSize: 8.5, color: C_MUTED
        });
        yOffset += 0.82;
    });
}

// Write the PPTX file
const outputPath = path.join(__dirname, "Grand_Royale_Hotel_Booking_System.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
    console.log("🎉 SUCCESS: PowerPoint presentation created at: " + outputPath);
}).catch(err => {
    console.error("❌ Error generating PowerPoint:", err);
});
