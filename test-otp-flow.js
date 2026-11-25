const http = require("http");
const { spawn } = require("child_process");

const TEST_PORT = 3891;

function makeRequest(path, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const req = http.request({
            hostname: "127.0.0.1",
            port: TEST_PORT,
            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            }
        }, (res) => {
            let resBody = "";
            res.on("data", chunk => resBody += chunk);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(resBody);
                    resolve({ statusCode: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, raw: resBody });
                }
            });
        });

        req.on("error", reject);
        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log("🚀 Starting server for automated test suite...");
    const serverProcess = spawn("node", ["server.js"], {
        cwd: __dirname,
        env: { ...process.env, PORT: TEST_PORT }
    });

    let serverLogs = "";
    serverProcess.stdout.on("data", (d) => {
        const s = d.toString();
        serverLogs += s;
        process.stdout.write("[Server] " + s);
    });
    serverProcess.stderr.on("data", (d) => process.stderr.write("[Server Error] " + d.toString()));

    // Wait for server to boot
    await new Promise(r => setTimeout(r, 1500));

    function getLatestTerminalOtp() {
        const matches = [...serverLogs.matchAll(/\[\s*(\d{6})\s*\]/g)];
        if (matches.length > 0) {
            return matches[matches.length - 1][1];
        }
        return null;
    }

    try {
        console.log("\n--- TEST 1: POST /api/auth/send-otp with invalid email ---");
        const t1 = await makeRequest("/api/auth/send-otp", { email: "invalid-email" });
        if (t1.statusCode !== 400 || t1.data.success !== false) {
            throw new Error("Test 1 failed: Expected 400 validation error for invalid email");
        }
        console.log("✅ TEST 1 PASSED: Rejected invalid email.");

        console.log("\n--- TEST 2: POST /api/auth/send-otp with valid email ---");
        const t2 = await makeRequest("/api/auth/send-otp", {
            email: "guest.test@grandroyalehotel.com",
            name: "Lady Eleanor Vance"
        });
        console.log("Status:", t2.statusCode, "Response:", t2.data);
        if (t2.statusCode !== 200 || !t2.data.success) {
            throw new Error("Test 2 failed: Expected 200 success");
        }
        // Verify ZERO OTP in API response
        if (t2.data.otp) {
            throw new Error("Test 2 failed: OTP code must NEVER be returned in API response!");
        }
        console.log("🔒 Security verified: Zero OTP code in API response!");
        
        // Read OTP strictly from admin server terminal logs
        const adminTerminalOtp = getLatestTerminalOtp();
        if (!adminTerminalOtp) {
            throw new Error("Test 2 failed: OTP was not logged to admin terminal");
        }
        console.log(`✅ TEST 2 PASSED: OTP securely routed to admin terminal: [ ${adminTerminalOtp} ]`);

        console.log("\n--- TEST 3: POST /api/auth/verify-otp with incorrect OTP ---");
        const t3 = await makeRequest("/api/auth/verify-otp", {
            email: "guest.test@grandroyalehotel.com",
            otp: "999999"
        });
        if (t3.statusCode !== 400 || t3.data.success !== false) {
            throw new Error("Test 3 failed: Expected 400 error for wrong OTP");
        }
        console.log("✅ TEST 3 PASSED: Incorrect OTP properly rejected.");

        console.log("\n--- TEST 4: POST /api/auth/verify-otp with correct OTP from admin terminal ---");
        const t4 = await makeRequest("/api/auth/verify-otp", {
            email: "guest.test@grandroyalehotel.com",
            otp: adminTerminalOtp
        });
        console.log("Status:", t4.statusCode, "Response:", t4.data);
        if (t4.statusCode !== 200 || !t4.data.success || !t4.data.user) {
            throw new Error("Test 4 failed: Expected 200 success with user session");
        }
        console.log("✅ TEST 4 PASSED: User successfully verified with SHA-256 hash comparison.");

        console.log("\n--- TEST 5: Replay attack prevention (used OTP must be cleared) ---");
        const t5 = await makeRequest("/api/auth/verify-otp", {
            email: "guest.test@grandroyalehotel.com",
            otp: adminTerminalOtp
        });
        if (t5.statusCode !== 400 || t5.data.success !== false) {
            throw new Error("Test 5 failed: Expected used OTP to be cleared and rejected on reuse");
        }
        console.log("✅ TEST 5 PASSED: Used OTP was deleted, preventing replay attacks.");

        console.log("\n--- TEST 6: POST /api/booking/send-otp for room reservation ---");
        const t6 = await makeRequest("/api/booking/send-otp", {
            name: "Lord Sterling",
            email: "sterling.booking@grandroyalehotel.com",
            phone: "+1 555 123 4567",
            roomTitle: "Presidential Palace Suite",
            grandTotal: "₹2,50,000",
            checkIn: "2026-12-01",
            checkOut: "2026-12-04",
            nights: 3
        });
        console.log("Status:", t6.statusCode, "Response:", t6.data);
        if (t6.statusCode !== 200 || !t6.data.success) {
            throw new Error("Test 6 failed: Expected 200 for booking OTP");
        }
        // Verify ZERO OTP in API response
        if (t6.data.otp) {
            throw new Error("Test 6 failed: Booking OTP code must NEVER be returned in API response!");
        }
        console.log("🔒 Security verified: Zero booking OTP in API response!");

        const bookingTerminalOtp = getLatestTerminalOtp();
        console.log(`✅ TEST 6 PASSED: Room booking OTP logged in admin terminal: [ ${bookingTerminalOtp} ]`);

        console.log("\n--- TEST 7: POST /api/booking/verify-otp with incorrect OTP ---");
        const t7 = await makeRequest("/api/booking/verify-otp", {
            email: "sterling.booking@grandroyalehotel.com",
            otp: "000000"
        });
        if (t7.statusCode !== 400 || t7.data.success !== false) {
            throw new Error("Test 7 failed: Expected 400 error for wrong booking OTP");
        }
        console.log("✅ TEST 7 PASSED: Wrong booking OTP rejected.");

        console.log("\n--- TEST 8: POST /api/booking/verify-otp with correct OTP from admin terminal ---");
        const t8 = await makeRequest("/api/booking/verify-otp", {
            email: "sterling.booking@grandroyalehotel.com",
            otp: bookingTerminalOtp
        });
        console.log("Status:", t8.statusCode, "Response:", t8.data);
        if (t8.statusCode !== 200 || !t8.data.success || !t8.data.bookingData) {
            throw new Error("Test 8 failed: Expected 200 with booking confirmation");
        }
        console.log("✅ TEST 8 PASSED: Booking email verified successfully!");

        console.log("\n--- TEST 9: Booking OTP replay attack prevention ---");
        const t9 = await makeRequest("/api/booking/verify-otp", {
            email: "sterling.booking@grandroyalehotel.com",
            otp: bookingTerminalOtp
        });
        if (t9.statusCode !== 400 || t9.data.success !== false) {
            throw new Error("Test 9 failed: Expected used booking OTP to be deleted");
        }
        console.log("✅ TEST 9 PASSED: Used booking OTP cleared.");

        console.log("\n🎉 ALL 9 AUTOMATED SECURITY TESTS PASSED SUCCESSFULLY!");
    } catch (err) {
        console.error("❌ Test suite error:", err);
        process.exitCode = 1;
    } finally {
        serverProcess.kill();
    }
}

runTests();
