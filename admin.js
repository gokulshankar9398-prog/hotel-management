/**
 * Grand Royale – Smart Hotel Booking System — Executive Admin Portal Application
 * Operations, Reservations Management, Dual-Factor Authentication & Live Auditing
 */

(function () {
    "use strict";

    // Application State
    const state = {
        token: localStorage.getItem("grandroyale_admin_token") || localStorage.getItem("aurelia_admin_token") || null,
        admin: null,
        bookings: [],
        stats: null,
        otpLogs: [],
        activeView: "reservations", // 'reservations' | 'otpLogs' | 'gateway'
        authMethod: "password", // 'password' | 'otp'
        searchQuery: "",
        statusFilter: "ALL",
        otpCountdown: 0,
        otpTimerInterval: null
    };

    // DOM Elements Cache
    const el = {
        // Sections
        authGate: document.getElementById("authGateSection"),
        dashboard: document.getElementById("dashboardSection"),
        adminUserSection: document.getElementById("adminUserSection"),
        topAdminEmail: document.getElementById("topAdminEmail"),
        adminLogoutBtn: document.getElementById("adminLogoutBtn"),

        // Auth Tabs & Forms
        tabPasswordBtn: document.getElementById("tabPasswordBtn"),
        tabOtpBtn: document.getElementById("tabOtpBtn"),
        passwordLoginForm: document.getElementById("passwordLoginForm"),
        otpLoginForm: document.getElementById("otpLoginForm"),
        loginAdminEmail: document.getElementById("loginAdminEmail"),
        loginAdminPassword: document.getElementById("loginAdminPassword"),
        submitPasswordLoginBtn: document.getElementById("submitPasswordLoginBtn"),
        loginOtpEmail: document.getElementById("loginOtpEmail"),
        otpSendBox: document.getElementById("otpSendBox"),
        otpVerifyBox: document.getElementById("otpVerifyBox"),
        sendAdminOtpBtn: document.getElementById("sendAdminOtpBtn"),
        adminOtpInput: document.getElementById("adminOtpInput"),
        adminOtpTimer: document.getElementById("adminOtpTimer"),
        resendAdminOtpBtn: document.getElementById("resendAdminOtpBtn"),
        verifyAdminOtpBtn: document.getElementById("verifyAdminOtpBtn"),

        // Dashboard Navigation
        tabReservationsViewBtn: document.getElementById("tabReservationsViewBtn"),
        tabOtpLogsViewBtn: document.getElementById("tabOtpLogsViewBtn"),
        tabGatewayViewBtn: document.getElementById("tabGatewayViewBtn"),
        tableControls: document.getElementById("tableControls"),
        reservationsView: document.getElementById("reservationsView"),
        otpLogsView: document.getElementById("otpLogsView"),
        gatewayView: document.getElementById("gatewayView"),

        // KPI Metric Cards
        kpiRevenue: document.getElementById("kpiRevenue"),
        kpiRevenueUSD: document.getElementById("kpiRevenueUSD"),
        kpiBookings: document.getElementById("kpiBookings"),
        kpiConfirmedCount: document.getElementById("kpiConfirmedCount"),
        kpiCancelledCount: document.getElementById("kpiCancelledCount"),
        kpiActiveGuests: document.getElementById("kpiActiveGuests"),
        kpiCheckedInCount: document.getElementById("kpiCheckedInCount"),
        kpiOccupancy: document.getElementById("kpiOccupancy"),
        occupancyProgressBar: document.getElementById("occupancyProgressBar"),

        // Tables & Badges
        bookingsTableBody: document.getElementById("bookingsTableBody"),
        noBookingsState: document.getElementById("noBookingsState"),
        bookingSearchInput: document.getElementById("bookingSearchInput"),
        statusFilterSelect: document.getElementById("statusFilterSelect"),
        otpLogsTableBody: document.getElementById("otpLogsTableBody"),
        noOtpLogsState: document.getElementById("noOtpLogsState"),
        otpLogCountBadge: document.getElementById("otpLogCountBadge"),

        // Gateway Elements
        serverUptimeLabel: document.getElementById("serverUptimeLabel"),
        gatewaySenderEmail: document.getElementById("gatewaySenderEmail"),
        serverAdminEmail: document.getElementById("serverAdminEmail"),
        cardTestEmailBtn: document.getElementById("cardTestEmailBtn"),
        testBrevoBtn: document.getElementById("testBrevoBtn"),
        refreshDashboardBtn: document.getElementById("refreshDashboardBtn"),

        // VIP Modal
        newBookingModal: document.getElementById("newBookingModal"),
        openNewBookingModalBtn: document.getElementById("openNewBookingModalBtn"),
        closeNewBookingModalBtn: document.getElementById("closeNewBookingModalBtn"),
        cancelNewBookingBtn: document.getElementById("cancelNewBookingBtn"),
        newBookingForm: document.getElementById("newBookingForm"),
        nbGuestName: document.getElementById("nbGuestName"),
        nbGuestEmail: document.getElementById("nbGuestEmail"),
        nbGuestPhone: document.getElementById("nbGuestPhone"),
        nbRoomTitle: document.getElementById("nbRoomTitle"),
        nbCheckIn: document.getElementById("nbCheckIn"),
        nbCheckOut: document.getElementById("nbCheckOut"),
        nbGuests: document.getElementById("nbGuests"),
        nbGrandTotal: document.getElementById("nbGrandTotal"),
        nbPaymentMethod: document.getElementById("nbPaymentMethod"),

        // Toasts
        toastContainer: document.getElementById("adminToastContainer")
    };

    /**
     * Re-initializes Lucide SVG icons safely
     */
    function initLucide() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    /**
     * Luxury Toast Notifications
     */
    function showToast(message, type = "info", duration = 4000) {
        if (!el.toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-xs shadow-xl transition-all duration-300 transform translate-y-2 opacity-0";

        let borderClasses = "bg-navy-900/95 border-gold-500/40 text-slate-200";
        let iconName = "info";
        let iconColor = "text-gold-400";

        if (type === "success") {
            borderClasses = "bg-navy-900/95 border-emerald-500/50 text-emerald-100";
            iconName = "check-circle";
            iconColor = "text-emerald-400";
        } else if (type === "error") {
            borderClasses = "bg-navy-900/95 border-rose-500/50 text-rose-100";
            iconName = "alert-circle";
            iconColor = "text-rose-400";
        } else if (type === "warning") {
            borderClasses = "bg-navy-900/95 border-amber-500/50 text-amber-100";
            iconName = "alert-triangle";
            iconColor = "text-amber-400";
        }

        toast.className += " " + borderClasses;
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-4 h-4 ${iconColor} shrink-0"></i>
            <span class="font-medium">${message}</span>
        `;

        el.toastContainer.appendChild(toast);
        initLucide();

        requestAnimationFrame(() => {
            toast.classList.remove("translate-y-2", "opacity-0");
        });

        setTimeout(() => {
            toast.classList.add("translate-y-2", "opacity-0");
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Switch Authentication Gate Tabs (Password vs Brevo OTP)
     */
    function setAuthTab(mode) {
        state.authMethod = mode;
        if (mode === "password") {
            el.tabPasswordBtn.className = "flex-1 pb-3 text-gold-400 border-b-2 border-gold-500 transition flex items-center justify-center gap-1.5 font-semibold";
            el.tabOtpBtn.className = "flex-1 pb-3 text-slate-400 hover:text-slate-200 border-b-2 border-transparent transition flex items-center justify-center gap-1.5 font-semibold";
            el.passwordLoginForm.classList.remove("hidden");
            el.otpLoginForm.classList.add("hidden");
        } else {
            el.tabOtpBtn.className = "flex-1 pb-3 text-gold-400 border-b-2 border-gold-500 transition flex items-center justify-center gap-1.5 font-semibold";
            el.tabPasswordBtn.className = "flex-1 pb-3 text-slate-400 hover:text-slate-200 border-b-2 border-transparent transition flex items-center justify-center gap-1.5 font-semibold";
            el.otpLoginForm.classList.remove("hidden");
            el.passwordLoginForm.classList.add("hidden");
        }
        initLucide();
    }

    /**
     * Start 5-Minute OTP Expiry Countdown
     */
    function startOtpTimer(durationSeconds = 300) {
        state.otpCountdown = durationSeconds;
        if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);

        function updateDisplay() {
            const mins = Math.floor(state.otpCountdown / 60);
            const secs = state.otpCountdown % 60;
            if (el.adminOtpTimer) {
                el.adminOtpTimer.textContent = `Valid for ${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }
            if (state.otpCountdown <= 0) {
                clearInterval(state.otpTimerInterval);
                if (el.adminOtpTimer) el.adminOtpTimer.textContent = "Passcode expired. Please resend.";
            }
            state.otpCountdown--;
        }

        updateDisplay();
        state.otpTimerInterval = setInterval(updateDisplay, 1000);
    }

    /**
     * Switch Active Dashboard View Tab
     */
    function setActiveView(view) {
        state.activeView = view;
        const tabs = [
            { id: "tabReservationsViewBtn", view: "reservations", panel: el.reservationsView },
            { id: "tabOtpLogsViewBtn", view: "otpLogs", panel: el.otpLogsView },
            { id: "tabGatewayViewBtn", view: "gateway", panel: el.gatewayView }
        ];

        tabs.forEach(t => {
            const btn = document.getElementById(t.id);
            if (t.view === view) {
                btn.className = "pb-3 text-gold-400 border-b-2 border-gold-500 transition flex items-center gap-2 font-semibold";
                t.panel.classList.remove("hidden");
            } else {
                btn.className = "pb-3 text-slate-400 hover:text-slate-200 border-b-2 border-transparent transition flex items-center gap-2 font-semibold";
                t.panel.classList.add("hidden");
            }
        });

        // Hide search/filter controls when not in reservations table
        if (el.tableControls) {
            if (view === "reservations") {
                el.tableControls.classList.remove("hidden");
            } else {
                el.tableControls.classList.add("hidden");
            }
        }

        initLucide();
    }

    /**
     * Render KPI Metric Cards
     */
    function renderStats(stats) {
        if (!stats) return;
        state.stats = stats;

        if (el.kpiRevenue) el.kpiRevenue.textContent = stats.totalRevenue || "₹0";
        if (el.kpiRevenueUSD) el.kpiRevenueUSD.textContent = (stats.totalRevenueUSD || "$0") + " USD";
        if (el.kpiBookings) el.kpiBookings.textContent = stats.totalBookings || 0;
        if (el.kpiConfirmedCount) el.kpiConfirmedCount.textContent = (stats.confirmedBookings || 0) + " Confirmed";
        if (el.kpiCancelledCount) el.kpiCancelledCount.textContent = (stats.cancelledBookings || 0) + " Cancelled";
        if (el.kpiActiveGuests) el.kpiActiveGuests.textContent = stats.activeGuests || 0;
        if (el.kpiCheckedInCount) el.kpiCheckedInCount.textContent = (stats.checkedInGuests || 0) + " In-House Checked-In";
        if (el.kpiOccupancy) el.kpiOccupancy.textContent = stats.occupancyRate || "0%";
        if (el.occupancyProgressBar) el.occupancyProgressBar.style.width = (stats.occupancyPercentNum || 0) + "%";

        if (el.serverUptimeLabel) el.serverUptimeLabel.textContent = stats.serverUptime || "Live";
        if (el.gatewaySenderEmail && stats.senderEmail) el.gatewaySenderEmail.textContent = stats.senderEmail;
        if (el.serverAdminEmail && stats.adminEmail) el.serverAdminEmail.textContent = stats.adminEmail;
    }

    /**
     * Helper to get status badge styling
     */
    function getStatusBadge(status) {
        switch (status) {
            case "Confirmed":
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Confirmed
                </span>`;
            case "Checked-In":
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold-500/15 text-gold-400 border border-gold-500/40">
                    <span class="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span> Checked-In
                </span>`;
            case "Completed":
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/30 text-slate-400 border border-slate-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Completed
                </span>`;
            case "Cancelled":
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Cancelled
                </span>`;
            default:
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-800 text-slate-300 border border-navy-700">${status}</span>`;
        }
    }

    /**
     * Render Reservations Table Rows
     */
    function renderBookingsTable() {
        if (!el.bookingsTableBody) return;

        let filtered = state.bookings.filter(b => {
            // Filter by status
            if (state.statusFilter !== "ALL" && b.status !== state.statusFilter) return false;

            // Search query
            if (state.searchQuery) {
                const q = state.searchQuery.toLowerCase();
                const matchId = (b.id || "").toLowerCase().includes(q);
                const matchName = (b.guestName || "").toLowerCase().includes(q);
                const matchEmail = (b.guestEmail || "").toLowerCase().includes(q);
                const matchSuite = (b.roomTitle || "").toLowerCase().includes(q);
                if (!matchId && !matchName && !matchEmail && !matchSuite) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            el.bookingsTableBody.innerHTML = "";
            el.noBookingsState.classList.remove("hidden");
            return;
        }

        el.noBookingsState.classList.add("hidden");

        const rows = filtered.map(b => {
            const initials = (b.guestName || "Guest").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

            return `
                <tr class="hover:bg-navy-900/50 transition duration-150">
                    <!-- Booking Ref & Date -->
                    <td class="py-4 px-4 whitespace-nowrap">
                        <span class="font-mono font-bold text-gold-400 text-xs">${b.id || "GR-000000"}</span>
                        <div class="text-[10px] text-slate-500 mt-0.5">${b.bookedAt || "Recent"}</div>
                    </td>

                    <!-- Guest Details -->
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 text-navy-950 flex items-center justify-center font-bold text-xs shrink-0">
                                ${initials}
                            </div>
                            <div class="min-w-0">
                                <p class="font-semibold text-white truncate max-w-[150px] sm:max-w-[180px]">${b.guestName || "Valued Guest"}</p>
                                <p class="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-[180px]">${b.guestEmail || "No Email"}</p>
                                ${b.guestPhone ? `<p class="text-[10px] text-slate-500 truncate">${b.guestPhone}</p>` : ""}
                            </div>
                        </div>
                    </td>

                    <!-- Suite & Guests -->
                    <td class="py-4 px-4">
                        <p class="font-medium text-slate-200">${b.roomTitle || "Luxury Suite"}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">${b.guests || "2 Guests"}</p>
                    </td>

                    <!-- Stay Dates -->
                    <td class="py-4 px-4 whitespace-nowrap">
                        <div class="text-slate-200 font-medium">${b.checkIn || "N/A"} <span class="text-gold-500">→</span> ${b.checkOut || "N/A"}</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">${b.nights || 1} Night(s)</div>
                    </td>

                    <!-- Total & Payment Method -->
                    <td class="py-4 px-4 whitespace-nowrap">
                        <div class="font-serif font-bold text-gold-400 text-sm">${b.grandTotalFormatted || "₹0"}</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">${b.paymentMethod || "Credit Card"}</div>
                    </td>

                    <!-- Status Badge -->
                    <td class="py-4 px-4 whitespace-nowrap">
                        ${getStatusBadge(b.status || "Confirmed")}
                    </td>

                    <!-- Action Controls -->
                    <td class="py-4 px-4 text-right whitespace-nowrap">
                        <div class="inline-flex items-center gap-1.5">
                            ${b.status !== "Checked-In" && b.status !== "Completed" && b.status !== "Cancelled" ? `
                                <button type="button" data-action="status" data-id="${b.id}" data-status="Checked-In" class="px-2.5 py-1 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[11px] font-semibold transition" title="Check-In Guest">
                                    Check-In
                                </button>
                            ` : ""}

                            ${b.status === "Checked-In" ? `
                                <button type="button" data-action="status" data-id="${b.id}" data-status="Completed" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition" title="Complete Stay">
                                    Check-Out
                                </button>
                            ` : ""}

                            ${b.status !== "Cancelled" && b.status !== "Completed" ? `
                                <button type="button" data-action="status" data-id="${b.id}" data-status="Cancelled" class="px-2 py-1 rounded-lg hover:bg-rose-500/10 text-rose-400/80 hover:text-rose-400 border border-transparent hover:border-rose-500/30 text-[11px] transition" title="Cancel Reservation">
                                    Cancel
                                </button>
                            ` : ""}

                            ${b.status === "Cancelled" ? `
                                <button type="button" data-action="status" data-id="${b.id}" data-status="Confirmed" class="px-2 py-1 rounded-lg hover:bg-emerald-500/10 text-emerald-400/80 hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 text-[11px] transition" title="Re-confirm">
                                    Reactivate
                                </button>
                            ` : ""}

                            <button type="button" data-action="delete" data-id="${b.id}" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition" title="Delete record permanently">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        el.bookingsTableBody.innerHTML = rows;
        initLucide();
    }

    /**
     * Render OTP & Security Audit Logs Table
     */
    function renderOtpLogsTable() {
        if (!el.otpLogsTableBody) return;

        if (el.otpLogCountBadge) {
            el.otpLogCountBadge.textContent = state.otpLogs.length;
        }

        if (state.otpLogs.length === 0) {
            el.otpLogsTableBody.innerHTML = "";
            el.noOtpLogsState.classList.remove("hidden");
            return;
        }

        el.noOtpLogsState.classList.add("hidden");

        const rows = state.otpLogs.map(log => {
            const isSuccess = log.success;
            const statusBadge = isSuccess
                ? `<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400"><i data-lucide="check-circle" class="w-3 h-3"></i> Delivered</span>`
                : `<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400"><i data-lucide="x-circle" class="w-3 h-3"></i> Failed</span>`;

            return `
                <tr class="hover:bg-navy-900/50 transition">
                    <td class="py-3 px-4 font-mono text-slate-400">${log.id}</td>
                    <td class="py-3 px-4 font-medium text-white">${log.target}</td>
                    <td class="py-3 px-4 capitalize text-slate-300">${log.method}</td>
                    <td class="py-3 px-4 text-gold-400 font-semibold">${log.provider}</td>
                    <td class="py-3 px-4">${statusBadge}</td>
                    <td class="py-3 px-4 text-right text-slate-400 whitespace-nowrap">${log.timestamp} <span class="text-[10px] text-slate-500">(${log.date || ''})</span></td>
                </tr>
            `;
        }).join("");

        el.otpLogsTableBody.innerHTML = rows;
        initLucide();
    }

    /**
     * Fetch Live Dashboard Data (Stats, Bookings, Logs)
     */
    async function fetchDashboardData() {
        try {
            const [statsRes, bookingsRes, logsRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/bookings"),
                fetch("/api/admin/otp-logs")
            ]);

            if (statsRes.ok) {
                const sData = await statsRes.json();
                if (sData.success) renderStats(sData.stats);
            }

            if (bookingsRes.ok) {
                const bData = await bookingsRes.json();
                if (bData.success) {
                    state.bookings = bData.bookings || [];
                    renderBookingsTable();
                }
            }

            if (logsRes.ok) {
                const lData = await logsRes.json();
                if (lData.success) {
                    state.otpLogs = lData.logs || [];
                    renderOtpLogsTable();
                }
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        }
    }

    /**
     * Update Booking Status
     */
    async function updateBookingStatus(id, newStatus) {
        try {
            const res = await fetch("/api/admin/bookings/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Reservation ${id} updated to "${newStatus}"`, "success");
                // Update local list
                const idx = state.bookings.findIndex(b => b.id === id);
                if (idx !== -1) {
                    state.bookings[idx].status = newStatus;
                    renderBookingsTable();
                }
                // Refresh KPI stats
                const statsRes = await fetch("/api/admin/stats");
                if (statsRes.ok) {
                    const s = await statsRes.json();
                    if (s.success) renderStats(s.stats);
                }
            } else {
                showToast(data.error || "Failed to update reservation status", "error");
            }
        } catch (err) {
            showToast("Server communication error: " + err.message, "error");
        }
    }

    /**
     * Delete Booking Record
     */
    async function deleteBooking(id) {
        if (!confirm(`Are you sure you want to permanently delete reservation ${id}? This cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Reservation ${id} deleted successfully`, "success");
                state.bookings = state.bookings.filter(b => b.id !== id);
                renderBookingsTable();
                // Refresh KPI stats
                const statsRes = await fetch("/api/admin/stats");
                if (statsRes.ok) {
                    const s = await statsRes.json();
                    if (s.success) renderStats(s.stats);
                }
            } else {
                showToast(data.error || "Could not delete reservation", "error");
            }
        } catch (err) {
            showToast("Server error: " + err.message, "error");
        }
    }

    /**
     * Unlock Dashboard
     */
    function enterDashboard(admin) {
        state.admin = admin;
        el.authGate.classList.add("hidden");
        el.dashboard.classList.remove("hidden");
        el.adminUserSection.classList.remove("hidden");
        if (el.topAdminEmail && admin?.email) {
            el.topAdminEmail.textContent = admin.email;
        }
        fetchDashboardData();
        initLucide();
    }

    /**
     * Setup Event Listeners
     */
    function setupEventListeners() {
        // Auth Tab Switching
        el.tabPasswordBtn?.addEventListener("click", () => setAuthTab("password"));
        el.tabOtpBtn?.addEventListener("click", () => setAuthTab("otp"));

        // Password Login Form
        el.passwordLoginForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = el.loginAdminEmail?.value.trim();
            const password = el.loginAdminPassword?.value.trim();

            if (!password) {
                showToast("Please enter the master admin password", "error");
                return;
            }

            el.submitPasswordLoginBtn.disabled = true;
            el.submitPasswordLoginBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Verifying credentials...`;

            try {
                const res = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem("grandroyale_admin_token", data.token);
                    state.token = data.token;
                    showToast("Access Granted. Welcome, Executive General Manager.", "success");
                    enterDashboard(data.admin);
                } else {
                    showToast(data.error || "Invalid administrator credentials", "error");
                }
            } catch (err) {
                showToast("Connection failed: " + err.message, "error");
            } finally {
                el.submitPasswordLoginBtn.disabled = false;
                el.submitPasswordLoginBtn.innerHTML = `<i data-lucide="lock" class="w-4 h-4"></i><span>Sign In to Executive Portal</span>`;
                initLucide();
            }
        });

        // Send Brevo OTP to Admin
        el.sendAdminOtpBtn?.addEventListener("click", async () => {
            const email = el.loginOtpEmail?.value.trim() || "gokulshankar9398@gmail.com";
            el.sendAdminOtpBtn.disabled = true;
            el.sendAdminOtpBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Dispatching via Brevo API...`;

            try {
                const res = await fetch("/api/admin/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message || `Passcode emailed to ${email}`, "success");
                    el.otpSendBox.classList.add("hidden");
                    el.otpVerifyBox.classList.remove("hidden");
                    startOtpTimer(300);
                    if (el.adminOtpInput) el.adminOtpInput.focus();
                } else {
                    showToast(data.error || "Failed to dispatch passcode", "error");
                }
            } catch (err) {
                showToast("Dispatch error: " + err.message, "error");
            } finally {
                el.sendAdminOtpBtn.disabled = false;
                el.sendAdminOtpBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i><span>Send 6-Digit Passcode to My Email</span>`;
                initLucide();
            }
        });

        // Resend Admin OTP
        el.resendAdminOtpBtn?.addEventListener("click", () => {
            el.sendAdminOtpBtn?.click();
        });

        // Verify Brevo OTP
        el.verifyAdminOtpBtn?.addEventListener("click", async () => {
            const email = el.loginOtpEmail?.value.trim() || "gokulshankar9398@gmail.com";
            const otp = el.adminOtpInput?.value.trim();

            if (!otp || !/^\d{6}$/.test(otp)) {
                showToast("Please enter exactly 6 numeric digits", "error");
                return;
            }

            el.verifyAdminOtpBtn.disabled = true;
            el.verifyAdminOtpBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Validating passcode...`;

            try {
                const res = await fetch("/api/admin/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp })
                });
                const data = await res.json();
                if (data.success) {
                    if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
                    localStorage.setItem("grandroyale_admin_token", data.token);
                    state.token = data.token;
                    showToast("2FA Verified. Welcome, Executive General Manager.", "success");
                    enterDashboard(data.admin);
                } else {
                    showToast(data.error || "Invalid verification code", "error");
                }
            } catch (err) {
                showToast("Verification error: " + err.message, "error");
            } finally {
                el.verifyAdminOtpBtn.disabled = false;
                el.verifyAdminOtpBtn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i><span>Verify Code & Sign In</span>`;
                initLucide();
            }
        });

        // Logout
        el.adminLogoutBtn?.addEventListener("click", () => {
            if (confirm("Sign out of Grand Royale Executive Portal?")) {
                localStorage.removeItem("grandroyale_admin_token");
                localStorage.removeItem("aurelia_admin_token");
                state.token = null;
                state.admin = null;
                el.dashboard.classList.add("hidden");
                el.adminUserSection.classList.add("hidden");
                el.authGate.classList.remove("hidden");
                setAuthTab("password");
                showToast("Signed out successfully.", "info");
            }
        });

        // Dashboard Tabs
        el.tabReservationsViewBtn?.addEventListener("click", () => setActiveView("reservations"));
        el.tabOtpLogsViewBtn?.addEventListener("click", () => setActiveView("otpLogs"));
        el.tabGatewayViewBtn?.addEventListener("click", () => setActiveView("gateway"));

        // Search and Filter
        el.bookingSearchInput?.addEventListener("input", (e) => {
            state.searchQuery = e.target.value.trim();
            renderBookingsTable();
        });

        el.statusFilterSelect?.addEventListener("change", (e) => {
            state.statusFilter = e.target.value;
            renderBookingsTable();
        });

        // Delegated table actions (status change & delete)
        el.bookingsTableBody?.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;
            const action = btn.getAttribute("data-action");
            const id = btn.getAttribute("data-id");

            if (action === "status") {
                const status = btn.getAttribute("data-status");
                if (id && status) updateBookingStatus(id, status);
            } else if (action === "delete") {
                if (id) deleteBooking(id);
            }
        });

        // Manual VIP Booking Modal Controls
        el.openNewBookingModalBtn?.addEventListener("click", () => {
            // Set default dates
            const today = new Date();
            const tomorrow = new Date(Date.now() + 86400000 * 3);
            if (el.nbCheckIn) el.nbCheckIn.value = today.toISOString().split("T")[0];
            if (el.nbCheckOut) el.nbCheckOut.value = tomorrow.toISOString().split("T")[0];
            el.newBookingModal?.classList.remove("hidden");
            initLucide();
        });

        function closeNewBookingModal() {
            el.newBookingModal?.classList.add("hidden");
            el.newBookingForm?.reset();
        }

        el.closeNewBookingModalBtn?.addEventListener("click", closeNewBookingModal);
        el.cancelNewBookingBtn?.addEventListener("click", closeNewBookingModal);

        // Save New VIP Booking Form
        el.newBookingForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const guestName = el.nbGuestName?.value.trim();
            const guestEmail = el.nbGuestEmail?.value.trim();
            const guestPhone = el.nbGuestPhone?.value.trim();
            const roomTitle = el.nbRoomTitle?.value;
            const checkIn = el.nbCheckIn?.value;
            const checkOut = el.nbCheckOut?.value;
            const guests = el.nbGuests?.value;
            const grandTotalFormatted = el.nbGrandTotal?.value.trim();
            const paymentMethod = el.nbPaymentMethod?.value;

            // Calculate nights
            let nights = 1;
            if (checkIn && checkOut) {
                const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
                if (diff > 0) nights = Math.round(diff);
            }

            const payload = {
                guestName,
                guestEmail,
                guestPhone,
                roomTitle,
                checkIn,
                checkOut,
                nights,
                guests,
                grandTotalFormatted,
                paymentMethod,
                status: "Confirmed"
            };

            try {
                const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    showToast(`VIP Reservation ${data.booking?.id || ''} confirmed & saved!`, "success");
                    closeNewBookingModal();
                    fetchDashboardData();
                } else {
                    showToast(data.error || "Failed to save booking", "error");
                }
            } catch (err) {
                showToast("Error saving reservation: " + err.message, "error");
            }
        });

        // Test Brevo API Dispatch
        async function runBrevoTest() {
            showToast("Dispatching Brevo test verification email...", "info");
            try {
                const res = await fetch("/api/admin/test-email", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                    showToast("🎉 Brevo Test Succeeded! Message ID: " + (data.result?.messageId || "Sent"), "success", 6000);
                    fetchDashboardData();
                } else {
                    showToast("Brevo test failed: " + (data.error || "Unknown error"), "error", 6000);
                }
            } catch (err) {
                showToast("Request failed: " + err.message, "error");
            }
        }

        el.testBrevoBtn?.addEventListener("click", runBrevoTest);
        el.cardTestEmailBtn?.addEventListener("click", runBrevoTest);

        // Refresh Data Button
        el.refreshDashboardBtn?.addEventListener("click", () => {
            fetchDashboardData();
            showToast("Dashboard refreshed with latest data.", "info", 2000);
        });

        // Keyboard navigation (Escape closes modal)
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !el.newBookingModal?.classList.contains("hidden")) {
                closeNewBookingModal();
            }
        });
    }

    /**
     * Application Initialization
     */
    async function init() {
        initLucide();
        setupEventListeners();

        // Check if existing admin token is present
        if (state.token) {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    enterDashboard({ email: "gokulshankar9398@gmail.com", role: "Super Admin" });
                } else {
                    localStorage.removeItem("grandroyale_admin_token");
                localStorage.removeItem("aurelia_admin_token");
                    state.token = null;
                }
            } catch (e) {
                // Keep login gate
            }
        }

        // Live sync: auto-poll every 30 seconds if authenticated
        setInterval(() => {
            if (!el.dashboard.classList.contains("hidden")) {
                fetchDashboardData();
            }
        }, 30000);
    }

    // Run on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
