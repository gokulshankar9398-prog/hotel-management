/**
 * Automated Verification Script for Grand Royale Admin Portal & APIs
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const TEST_PORT = 3985;
process.env.PORT = String(TEST_PORT);
process.env.ADMIN_EMAIL = "gokulshankar9398@gmail.com";
process.env.ADMIN_PASSWORD = "admin123";

// Require the server (it will listen on TEST_PORT)
require("./server.js");

function request(options, body) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                let json = null;
                try {
                    json = JSON.parse(data);
                } catch (e) {}
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    raw: data,
                    json: json
                });
            });
        });
        req.on("error", reject);
        if (body) {
            req.write(typeof body === "string" ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("===============================================================");
    console.log("🧪 TESTING GRAND ROYALE ADMIN PORTAL ENDPOINTS");
    console.log("===============================================================\n");

    let passed = 0;
    let failed = 0;

    function assert(name, condition, details = "") {
        if (condition) {
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${name} - ${details}`);
            failed++;
        }
    }

    try {
        // Wait 1 second for server to bind
        await new Promise(r => setTimeout(r, 1000));

        // Test 1: Static routing for /admin
        console.log("--- 1. Testing /admin Static Route ---");
        const adminPage = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/admin",
            method: "GET"
        });
        assert("GET /admin serves 200 OK", adminPage.statusCode === 200);
        assert("GET /admin contains Executive Admin Access", adminPage.raw.includes("Executive Admin Access"));

        // Test 2: Admin Password Login - Unauthorized
        console.log("\n--- 2. Testing Admin Password Authentication ---");
        const badLogin = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/login",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, { email: "gokulshankar9398@gmail.com", password: "wrong_password" });
        assert("Invalid password returns 401", badLogin.statusCode === 401 && badLogin.json.success === false);

        // Test 3: Admin Password Login - Valid
        const goodLogin = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/login",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, { email: "gokulshankar9398@gmail.com", password: "admin123" });
        assert("Valid password returns 200", goodLogin.statusCode === 200 && goodLogin.json.success === true);
        assert("Token returned in login response", typeof goodLogin.json.token === "string");
        assert("Admin profile returned", goodLogin.json.admin && goodLogin.json.admin.email === "gokulshankar9398@gmail.com");

        // Test 4: KPI Analytics Stats
        console.log("\n--- 3. Testing Admin KPI Stats ---");
        const statsRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/stats",
            method: "GET"
        });
        assert("GET /api/admin/stats returns 200", statsRes.statusCode === 200 && statsRes.json.success === true);
        assert("Stats includes totalRevenue", typeof statsRes.json.stats.totalRevenue === "string");
        assert("Stats includes totalBookings", statsRes.json.stats.totalBookings >= 3);
        assert("Stats includes occupancyRate", typeof statsRes.json.stats.occupancyRate === "string");
        assert("Brevo status reported", statsRes.json.stats.brevoStatus.includes("Connected"));

        // Test 5: Reservations Manager (GET & POST)
        console.log("\n--- 4. Testing Reservations CRUD & Sync ---");
        const bookingsRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/bookings",
            method: "GET"
        });
        assert("GET /api/admin/bookings returns 200", bookingsRes.statusCode === 200 && Array.isArray(bookingsRes.json.bookings));

        // Create new guest test booking via POST /api/bookings
        const testBookingId = "GR-TEST-" + Date.now();
        const createRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/bookings",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, {
            id: testBookingId,
            guestName: "Lord Arthur Pendelton",
            guestEmail: "arthur.pendelton@testluxury.com",
            guestPhone: "+91 93986 48195",
            roomTitle: "Grand Imperial Signature Suite",
            checkIn: "2026-12-10",
            checkOut: "2026-12-14",
            nights: 4,
            guests: "2 Guests",
            grandTotalFormatted: "₹5,00,000",
            paymentMethod: "Credit Card (Guaranteed)",
            status: "Confirmed"
        });
        assert("POST /api/bookings creates reservation (201)", createRes.statusCode === 201 && createRes.json.success === true);

        // Update status of the test booking to Checked-In
        const statusRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/bookings/status",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, { id: testBookingId, status: "Checked-In" });
        assert("POST /api/admin/bookings/status updates status", statusRes.statusCode === 200 && statusRes.json.booking.status === "Checked-In");

        // Delete the test booking
        const deleteRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: `/api/admin/bookings?id=${testBookingId}`,
            method: "DELETE"
        });
        assert("DELETE /api/admin/bookings removes reservation", deleteRes.statusCode === 200 && deleteRes.json.success === true);

        // Test 6: Security & Zero OTP Exposure
        console.log("\n--- 5. Testing Security & 2FA Passcode Protection ---");
        const unauthOtp = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/send-otp",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, { email: "unauthorized.attacker@domain.com" });
        assert("Unauthorized admin email 2FA blocked with 403", unauthOtp.statusCode === 403);

        const adminOtpRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/send-otp",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }, { email: "gokulshankar9398@gmail.com" });
        assert("Admin 2FA OTP request accepted (200)", adminOtpRes.statusCode === 200 && adminOtpRes.json.success === true);
        assert("Zero OTP code exposed in response", adminOtpRes.json.otp === undefined && adminOtpRes.json.passcode === undefined);

        // Test 7: OTP Audit Logs
        console.log("\n--- 6. Testing OTP Audit Logs ---");
        const logsRes = await request({
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/admin/otp-logs",
            method: "GET"
        });
        assert("GET /api/admin/otp-logs returns 200", logsRes.statusCode === 200 && Array.isArray(logsRes.json.logs));
        assert("Audit log recorded admin 2FA event", logsRes.json.logs.some(l => l.target === "gokulshankar9398@gmail.com"));

        console.log("\n===============================================================");
        console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
        console.log("===============================================================");

        process.exit(failed > 0 ? 1 : 0);
    } catch (err) {
        console.error("Test execution fatal error:", err);
        process.exit(1);
    }
}

runTests();
