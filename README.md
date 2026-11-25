# 🏰 Grand Royale – Smart Hotel Booking System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-00c7b7?style=for-the-badge&logo=render&logoColor=white)](https://grand-royale-hotel.onrender.com)
[![Admin Portal](https://img.shields.io/badge/Admin%20Portal-Live-C5A059?style=for-the-badge&logo=shield&logoColor=white)](https://grand-royale-hotel.onrender.com/admin)

> 🌐 **Live Web Application:** [https://grand-royale-hotel.onrender.com](https://grand-royale-hotel.onrender.com)  
> 👑 **Executive Admin Command Center:** [https://grand-royale-hotel.onrender.com/admin](https://grand-royale-hotel.onrender.com/admin)

A modern, responsive, 5-star hotel & resort booking web application designed with high aesthetic standards, interactive room catalogs, dynamic pricing, live checkout calculation, and reservation management.

---

## ✨ Features Included

1. **Luxury Visual Design & Branding**:
   - Palette: Deep Royal Navy (`#0B1325`), Satin Gold (`#C5A059`), Warm Ivory (`#FAF9F6`).
   - Editorial Typography: Google Fonts *Playfair Display* (luxury serif) + *Plus Jakarta Sans* (clean geometric sans).
   - Fully responsive on mobile, tablet, and ultra-wide screens.

2. **Smart Interactive Booking Bar**:
   - Destination Selector (Maldives, Monaco, Santorini).
   - Dynamic Check-in & Check-out date pickers with automatic minimum date synchronization and nights counter.
   - Interactive Guests & Rooms dropdown with adult, children, and room increment/decrement controls.

3. **Room, Suite & Villa Showcase**:
   - Filter pills by category: *All Accommodations*, *Luxury Suites*, *Water & Beach Villas*, *Royal Penthouse*.
   - Sorting options: *Featured Collection*, *Price: Low to High*, *Price: High to Low*, *Highest Rated*.
   - Interactive Wishlist heart toggle saved locally (`localStorage`).
   - Live night recalculation showing per-night and total stay prices.

4. **Interactive Reservation & Checkout Flow**:
   - Room preview modal with details, amenities, max capacity, and bed configuration.
   - Optional stay upgrades with real-time price updates:
     - 🥂 Champagne Gourmet Breakfast (+$45/night)
     - 🚗 Airport VIP Limousine Pickup (+$95 one-time)
     - 💆 Couple's 60-min Aromatherapy Spa (+$180)
   - Real-time tax (12%) and grand total breakdown.
   - Instant booking confirmation modal with generated reference code (e.g. `GR-784920`).
   - Printable reservation voucher trigger.

5. **"My Trips" Saved Reservations Management**:
   - Live badge on the navbar showing the number of confirmed bookings.
   - Saved trips viewer modal displaying reservation IDs, dates, room types, and price breakdown.
   - Option to cancel reservations with instant status feedback.

6. **Currency Converter**:
   - Instant conversion between **USD ($)**, **EUR (€)**, and **GBP (£)** across all listings and checkout modals.

7. **Guest Reviews, Amenities, FAQ Accordion, & Newsletter**:
   - Verified 4.97-star guest testimonials.
   - Interactive collapsible FAQ section.
   - Newsletter subscription form with feedback toast.

8. **🔐 Secure Passwordless Login System with Real Mobile / Email OTP**:
   - **Zero Code Disclosure**: The OTP passcode is **never revealed on the web page**, toasts, or client-side UI.
   - **Flexible Identity Choice**: Log in using either **Email Address** or **Mobile Phone Number** with international country codes (`+1`, `+44`, `+91`, `+33`, `+971`, etc.).
   - **Carrier SMS Dispatch (Real Phones)**: Ready-to-use SMS integration via Twilio or Fast2SMS in `server.js` and `config.json`.
   - **Interactive 6-Digit Digit Boxes**: Auto-advancing boxes, backspace deletion, and clipboard paste support.
   - **Security Timeout**: 30-second cooldown timer before requesting another code.
   - **Member Profile & Header Sync**: Once verified, the navbar displays the user's avatar, initials, first name, and a member dropdown with "My Reservations" and "Sign Out".
   - **Auto Pre-Fill at Checkout**: Logged-in member details (Name, Email/Phone) automatically populate the reservation checkout form with active VIP member perks!

---

## 🚀 How to Run with Real SMS Support

### Method 1: Run with the SMS Server (Recommended)
1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd "C:\Users\Shankar Reddy\.gemini\antigravity\scratch\hotel-booking"
   ```
2. Start the native Node server:
   ```powershell
   node server.js
   ```
3. Open `http://localhost:3000` in your browser.
4. **To receive real SMS on your phone**:
   Open `config.json` and insert your free **Twilio** or **Fast2SMS** API credentials:
   ```json
   {
     "twilio": {
       "accountSid": "YOUR_TWILIO_SID",
       "authToken": "YOUR_TWILIO_AUTH_TOKEN",
       "fromPhone": "+1234567890"
     },
     "fast2sms": {
       "apiKey": "YOUR_FAST2SMS_KEY"
     }
   }
   ```
   *Note: If no API key is entered yet, the server securely logs the passcode directly to the **terminal/server console** (never on the webpage!) so you can test entering it.*

### Method 2: Static Browser View
Simply double-click `index.html` to open it directly in Chrome, Edge, or Firefox.
