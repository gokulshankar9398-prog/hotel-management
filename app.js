// @ts-nocheck
/**
 * Grand Royale – Smart Hotel Booking System
 * Interactive Booking Engine & UI Logic
 */

// Room Catalog Data
const ROOMS_DATA = [
    // ---------------------------------------------------------
    // 1. BUDGET & ECONOMY ACCOMMODATIONS (Under ₹5,000 / night)
    // ---------------------------------------------------------
    {
        id: "room-eco-3",
        title: "Goa Bohemian Coastal Studio",
        category: "economy",
        budgetTier: "budget",
        location: "goa",
        tag: "Budget Special",
        priceUSD: 19, // ₹1,615 / night
        rating: 4.86,
        reviewsCount: 112,
        size: "380 sq ft",
        maxGuests: 2,
        bedType: "Queen Bed",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        description: "Sunlit studio with handcrafted cane furniture, private balcony overlooking coconut groves, rain shower, fast Wi-Fi, and 5-minute walk to Candolim beach.",
        amenities: ["Near Beach", "Fast Wi-Fi", "Private Balcony", "Air Conditioning", "Coffee Press"]
    },
    {
        id: "room-eco-1",
        title: "Grand Royale Heritage Classic Room",
        category: "economy",
        budgetTier: "budget",
        location: "goa",
        tag: "Budget Friendly",
        priceUSD: 24, // ₹2,040 / night
        rating: 4.88,
        reviewsCount: 142,
        size: "450 sq ft",
        maxGuests: 2,
        bedType: "Queen Bed",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
        description: "Comfortable, airy heritage retreat with traditional Goan wood accents, plush queen bedding, high-speed Wi-Fi, rain shower, and complimentary morning chai.",
        amenities: ["Complimentary Wi-Fi", "Rain Shower", "Work Desk", "Air Conditioning", "Morning Chai Station"]
    },
    {
        id: "room-eco-4",
        title: "Jaipur Heritage Jharokha Room",
        category: "economy",
        budgetTier: "budget",
        location: "jaipur",
        tag: "Royal Budget",
        priceUSD: 32, // ₹2,720 / night
        rating: 4.90,
        reviewsCount: 165,
        size: "480 sq ft",
        maxGuests: 2,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        description: "Traditional Rajasthani architecture with hand-carved stone jharokha window, marble flooring, brass lamps, and complimentary evening rooftop folk music.",
        amenities: ["Jharokha Window", "Traditional Decor", "Complimentary Breakfast", "Free Wi-Fi", "Daily Housekeeping"]
    },
    {
        id: "room-eco-2",
        title: "Deluxe Courtyard Garden Room",
        category: "economy",
        budgetTier: "budget",
        location: "goa",
        tag: "Great Value",
        priceUSD: 42, // ₹3,570 / night
        rating: 4.91,
        reviewsCount: 198,
        size: "550 sq ft",
        maxGuests: 2,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80",
        description: "Spacious deluxe room opening onto a landscaped tropical courtyard, featuring private sit-out patio, smart HDTV, mini-fridge, and daily buffet breakfast included.",
        amenities: ["Garden Sit-Out Patio", "Daily Breakfast Buffet", "Smart HDTV", "Mini Fridge", "En-suite Marble Bath"]
    },
    {
        id: "room-eco-5",
        title: "Santorini Sunlit Cycladic Studio",
        category: "economy",
        budgetTier: "budget",
        location: "santorini",
        tag: "Caldera Value",
        priceUSD: 52, // ₹4,420 / night
        rating: 4.87,
        reviewsCount: 134,
        size: "420 sq ft",
        maxGuests: 2,
        bedType: "Queen Bed",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
        description: "Charming white-washed cave room offering side caldera views, arched stone ceiling, artisanal olive oil toiletries, and Greek yogurt breakfast basket.",
        amenities: ["Caldera Side View", "Artisanal Toiletries", "Greek Breakfast Basket", "Mini Fridge", "Air Conditioning"]
    },

    // ---------------------------------------------------------
    // 2. EXECUTIVE & VALUE SUITES (₹5,000 – ₹15,000 / night)
    // ---------------------------------------------------------
    {
        id: "room-exec-3",
        title: "Goa Palm Serenity Pool Suite",
        category: "executive",
        budgetTier: "mid",
        location: "goa",
        tag: "Tropical Oasis",
        priceUSD: 78, // ₹6,630 / night
        rating: 4.93,
        reviewsCount: 184,
        size: "720 sq ft",
        maxGuests: 3,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        description: "Direct lagoon pool access from your private wooden deck, featuring outdoor rain shower, teak lounge loungers, and evening cocktail service.",
        amenities: ["Direct Pool Access", "Private Sun Deck", "Outdoor Rain Shower", "Welcome Drink", "Smart TV"]
    },
    {
        id: "room-exec-1",
        title: "Executive Business Club Suite",
        category: "executive",
        budgetTier: "mid",
        location: "monaco",
        tag: "Executive Choice",
        priceUSD: 95, // ₹8,075 / night
        rating: 4.93,
        reviewsCount: 215,
        size: "780 sq ft",
        maxGuests: 3,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
        description: "Designed for discerning professionals and travelers, featuring a separate living salon, ergonomic work desk, marble bathroom, and complimentary evening lounge access.",
        amenities: ["Club Lounge Access", "High-Speed Fiber Wi-Fi", "Separate Living Area", "Italian Marble Bath", "Nespresso Bar"]
    },
    {
        id: "room-exec-4",
        title: "Jaipur Royal Haveli Club Suite",
        category: "executive",
        budgetTier: "mid",
        location: "jaipur",
        tag: "Regal Heritage",
        priceUSD: 125, // ₹10,625 / night
        rating: 4.96,
        reviewsCount: 228,
        size: "880 sq ft",
        maxGuests: 3,
        bedType: "Four-Poster King Bed",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: "Grand four-poster teak bed, intricate Rajasthani frescoes, private courtyard sitting area, copper soaking bathtub, and royal high-tea service.",
        amenities: ["Four-Poster Bed", "Copper Soaking Tub", "Royal High Tea", "Butler Concierge", "Courtyard View"]
    },
    {
        id: "room-exec-2",
        title: "Azure Premium Ocean Horizon Suite",
        category: "executive",
        budgetTier: "mid",
        location: "maldives",
        tag: "Popular Choice",
        priceUSD: 165, // ₹14,025 / night
        rating: 4.95,
        reviewsCount: 310,
        size: "920 sq ft",
        maxGuests: 3,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        description: "Panoramic floor-to-ceiling sea views with private glass balcony, deep soaking oval bathtub, Bluetooth acoustics, and private sunset cocktail hour.",
        amenities: ["Ocean Horizon View", "Oval Soaking Tub", "Private Balcony", "Sunset Cocktail Hour", "24/7 Butler Service"]
    },

    // ---------------------------------------------------------
    // 3. LUXURY SIGNATURE SUITES (₹15,000 – ₹50,000 / night)
    // ---------------------------------------------------------
    {
        id: "room-suite-3",
        title: "Goa Portuguese Master Suite & Jacuzzi",
        category: "suite",
        budgetTier: "luxury",
        location: "goa",
        tag: "Private Jacuzzi",
        priceUSD: 220, // ₹18,700 / night
        rating: 4.96,
        reviewsCount: 247,
        size: "1,250 sq ft",
        maxGuests: 2,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        description: "Private open-air patio featuring a heated hydrotherapy jacuzzi enveloped by exotic palms, Portuguese azulejo tilework, and private candlelit dining.",
        amenities: ["Outdoor Heated Jacuzzi", "Private Dining Patio", "Complimentary Wine", "Luxury Bathrobes", "Sound System"]
    },
    {
        id: "room-suite-1",
        title: "Monaco Riviera Prestige Suite",
        category: "suite",
        budgetTier: "luxury",
        location: "monaco",
        tag: "Riviera Elegance",
        priceUSD: 340, // ₹28,900 / night
        rating: 4.94,
        reviewsCount: 218,
        size: "1,100 sq ft",
        maxGuests: 2,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "Overlooking the Mediterranean yacht harbor, featuring Carrara double vanity, private balcony, bespoke Italian furnishings, and acoustic soundproofing.",
        amenities: ["Harbor Sea View", "Carrara Marble Bath", "Bose Acoustics", "Pillow Menu", "Concierge Service"]
    },
    {
        id: "room-suite-4",
        title: "Maldives Coral Reef Sunset Suite",
        category: "suite",
        budgetTier: "luxury",
        location: "maldives",
        tag: "Sunset Panoramic",
        priceUSD: 440, // ₹37,400 / night
        rating: 4.97,
        reviewsCount: 286,
        size: "1,150 sq ft",
        maxGuests: 3,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
        description: "Suspended right over shallow coral lagoons, featuring a sunken outdoor living lounge, private glass bottom viewing deck, and complimentary snorkel safari.",
        amenities: ["Sunken Ocean Lounge", "Snorkel Gear Included", "Glass Floor Panel", "Mini Champagne Bar", "Direct Lagoon Access"]
    },
    {
        id: "room-suite-2",
        title: "Santorini Cliffside Deluxe Cave Suite",
        category: "suite",
        budgetTier: "luxury",
        location: "santorini",
        tag: "Caldera Sunset",
        priceUSD: 540, // ₹45,900 / night
        rating: 4.92,
        reviewsCount: 412,
        size: "820 sq ft",
        maxGuests: 2,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
        description: "Traditional Cycladic cave architecture blended with modern minimalist luxury. Features a heated outdoor cliff-edge jacuzzi looking into the Aegean caldera.",
        amenities: ["Caldera Jacuzzi", "Sunset Balcony", "Sommelier Wine Selection", "Complimentary Breakfast", "Luxury Linens"]
    },
    {
        id: "room-suite-fam",
        title: "Grand Family Garden Retreat",
        category: "suite",
        budgetTier: "ultra",
        location: "maldives",
        tag: "Family Haven",
        priceUSD: 780, // ₹66,300 / night
        rating: 4.89,
        reviewsCount: 175,
        size: "1,600 sq ft",
        maxGuests: 5,
        bedType: "2 King Beds",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        description: "Two interconnected master bedrooms with private landscaped garden, children's discovery corner, outdoor heated pool, and bespoke family experiences concierge.",
        amenities: ["Two En-suite Bedrooms", "Private Lawn & Pool", "Kids Amenities Kit", "Daily High Tea", "Game Lounge Access"]
    },

    // ---------------------------------------------------------
    // 4. WATER & BEACHFRONT VILLAS (₹50,000 – ₹1,00,000 / night)
    // ---------------------------------------------------------
    {
        id: "room-villa-1",
        title: "Goa Royal Heritage Beachfront Villa",
        category: "villa",
        budgetTier: "ultra",
        location: "goa",
        tag: "Indian Coast Special",
        priceUSD: 720, // ₹61,200 / night
        rating: 4.97,
        reviewsCount: 289,
        size: "2,100 sq ft",
        maxGuests: 4,
        bedType: "King Bed & Daybed",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        description: "Situated directly along the pristine coastline of South Goa, featuring private Portuguese-inspired open courtyard, private heated plunge pool, dedicated Ayurvedic spa pavilion, and sunset sea views.",
        amenities: ["Private Plunge Pool", "Ayurvedic Spa Deck", "Direct Beach Access", "Royal Butler Service", "Complimentary High Tea"]
    },
    {
        id: "room-villa-2",
        title: "Azure Overwater Lagoon Villa",
        category: "villa",
        budgetTier: "ultra",
        location: "maldives",
        tag: "Best Seller",
        priceUSD: 850, // ₹72,250 / night
        rating: 4.98,
        reviewsCount: 342,
        size: "1,450 sq ft",
        maxGuests: 3,
        bedType: "King Bed",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        description: "Perched atop crystal-clear turquoise waters with a private glass-bottom sun terrace, direct ocean staircase, private infinity plunge pool, and panoramic sunset views.",
        amenities: ["Private Plunge Pool", "Glass Floor Panel", "24/7 Butler", "Complimentary Breakfast", "Ocean Staircase"]
    },
    {
        id: "room-villa-3",
        title: "Sunset Beachfront Sanctuary Villa",
        category: "villa",
        budgetTier: "ultra",
        location: "maldives",
        tag: "Private Beach",
        priceUSD: 980, // ₹83,300 / night
        rating: 4.96,
        reviewsCount: 164,
        size: "1,800 sq ft",
        maxGuests: 4,
        bedType: "1 King & 2 Twins",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        description: "Nestled within tropical flora right onto powdered white sand, featuring an open-air rainwater courtyard shower, secluded garden hammock, and private beach cabana.",
        amenities: ["Direct Beach Access", "Private Cabana", "Outdoor Courtyard Bath", "In-villa Dining", "Snorkeling Gear"]
    },
    {
        id: "room-villa-4",
        title: "Monaco Maritime Cliffside Villa",
        category: "villa",
        budgetTier: "ultra",
        location: "monaco",
        tag: "Riviera Marvel",
        priceUSD: 1150, // ₹97,750 / night
        rating: 4.98,
        reviewsCount: 145,
        size: "2,400 sq ft",
        maxGuests: 4,
        bedType: "2 King Beds",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        description: "Dramatic architectural cliff villa overlooking private Mediterranean waters, private heated infinity pool, designer kitchen, and Ferrari town transfer.",
        amenities: ["Private Infinity Pool", "Panoramic Cliff Deck", "Ferrari Chauffeur", "Private Sommelier", "Helipad Access"]
    },

    // ---------------------------------------------------------
    // 5. ROYAL PENTHOUSES & PALACES (₹1,00,000+ / night)
    // ---------------------------------------------------------
    {
        id: "room-pent-2",
        title: "Jaipur Maharaja Grand Imperial Palace",
        category: "penthouse",
        budgetTier: "ultra",
        location: "jaipur",
        tag: "Palace Living",
        priceUSD: 1450, // ₹1,23,250 / night
        rating: 5.0,
        reviewsCount: 64,
        size: "3,800 sq ft",
        maxGuests: 6,
        bedType: "3 Royal King Suites",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        description: "An authentic historic royal wing reserved for dignitaries, with pure gold leaf ceiling detailing, private marble courtyard, dedicated royal butler, and vintage car transfer.",
        amenities: ["Private Palace Wing", "Gold Leaf Ceilings", "Vintage Rolls-Royce Transfer", "24/7 Royal Butler", "Private Banquet Hall"]
    },
    {
        id: "room-pent-1",
        title: "The Royal Imperial Penthouse",
        category: "penthouse",
        budgetTier: "ultra",
        location: "monaco",
        tag: "Ultimate Luxury",
        priceUSD: 1950, // ₹1,65,750 / night
        rating: 5.0,
        reviewsCount: 89,
        size: "3,200 sq ft",
        maxGuests: 6,
        bedType: "2 King & 1 Queen",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        description: "The pinnacle of opulence featuring 360-degree rooftop views, private heated infinity pool, dedicated executive chef, Steinway baby grand piano, and private elevator entrance.",
        amenities: ["Private Rooftop Pool", "Personal Chef", "Private Elevator", "Free Rolls-Royce Chauffeur", "Rare Wine Cellar"]
    }
];

// Currency Rates & Symbols (Default: Indian Rupee with standard Indian Numbering System)
const CURRENCIES = {
    INR: { symbol: "₹", name: "Indian Rupee (INR)", rate: 85.0, locale: "en-IN" },
    USD: { symbol: "$", name: "US Dollar (USD)", rate: 1.0, locale: "en-US" },
    EUR: { symbol: "€", name: "Euro (EUR)", rate: 0.92, locale: "de-DE" },
    GBP: { symbol: "£", name: "British Pound (GBP)", rate: 0.79, locale: "en-GB" }
};

// Application State (Configured with budget filtering & Low-to-High sort by default)
const state = {
    currency: "INR",
    selectedCategory: "all",
    selectedLocation: "all",
    selectedBudgetTier: "all", // "all" | "budget" | "mid" | "luxury" | "ultra"
    maxBudgetINR: 170000,
    sortBy: "price-asc",       // Default to Low to High so user sees budget options right away!
    checkIn: null,
    checkOut: null,
    nights: 3,
    guests: {
        adults: 2,
        children: 0,
        rooms: 1
    },
    activeRoomForBooking: null,
    user: JSON.parse(localStorage.getItem("aurelia_user") || "null"),
    wishlist: JSON.parse(localStorage.getItem("aurelia_wishlist") || "[]"),
    bookings: JSON.parse(localStorage.getItem("aurelia_bookings") || "[]"),
    pendingBooking: null,
    bookingOtpIdentifier: null,
    bookingOtpTimerInterval: null,
    selectedPaymentMethod: "card"
};

// Auth State
const authState = {
    method: "email", // "email" | "phone"
    generatedOtp: null,
    pendingUser: null,
    resendInterval: null,
    resendSeconds: 30
};

// Backend API Base URL (Works seamlessly from both http://localhost:3000 and file:/// URLs)
const API_BASE = (typeof window !== "undefined" && (window.location.protocol === "file:" || window.location.port !== "3000")) ? "http://localhost:3000" : "";

// Safe DOM Helper Utilities
const getEl = (id) => document.getElementById(id);
const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = String(text);
};
const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = String(html);
};
const getValue = (id, defaultVal = "") => {
    const el = document.getElementById(id);
    return el && "value" in el ? el.value : defaultVal;
};
const setValue = (id, val) => {
    const el = document.getElementById(id);
    if (el && "value" in el) el.value = val;
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    initLucide();
    initDates();
    updateAddonPriceTags();
    renderRooms();
    setupEventListeners();
    initAuth();
    updateBookingsBadge();
});

// Reinitialize Lucide Icons
function initLucide() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Setup Dates: Default to Tomorrow and +3 Days
function initDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkOutDate = new Date(tomorrow);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    const checkInInput = document.getElementById("checkInDate");
    const checkOutInput = document.getElementById("checkOutDate");

    const formatISODate = (d) => d.toISOString().split("T")[0];

    if (checkInInput && "min" in checkInInput) {
        checkInInput.min = formatISODate(tomorrow);
        checkInInput.value = formatISODate(tomorrow);
    }

    if (checkOutInput && "min" in checkOutInput) {
        checkOutInput.min = formatISODate(tomorrow);
        checkOutInput.value = formatISODate(checkOutDate);
    }

    state.checkIn = formatISODate(tomorrow);
    state.checkOut = formatISODate(checkOutDate);
    recalcNights();
}

// Calculate night count from inputs
function recalcNights() {
    const cin = new Date(state.checkIn);
    const cout = new Date(state.checkOut);
    const diffTime = cout - cin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    state.nights = diffDays > 0 ? diffDays : 1;
    
    const nightNotice = document.getElementById("activeBookingNightsText");
    if (nightNotice) {
        nightNotice.innerHTML = `Pricing calculated for <strong>${state.nights} night${state.nights > 1 ? 's' : ''}</strong> (${state.checkIn} to ${state.checkOut})`;
    }
}

// Format Currency using Indian Numbering System (Lakhs & Crores) or selected locale
function formatPrice(amountInUSD) {
    const curr = CURRENCIES[state.currency] || CURRENCIES.INR;
    const converted = Math.round(amountInUSD * curr.rate);
    const localeStr = curr.locale || "en-IN";
    return `${curr.symbol}${converted.toLocaleString(localeStr)}`;
}

// Update add-on pricing tags in the booking modal to match current currency
function updateAddonPriceTags() {
    setText("addonBreakfastPrice", `+${formatPrice(45)}/night`);
    setText("addonTransferPrice", `+${formatPrice(95)} one-time`);
    setText("addonSpaPrice", `+${formatPrice(180)}`);
}

// Render Room Cards
function renderRooms() {
    const container = document.getElementById("roomsGrid");
    const noRoomsNotice = document.getElementById("noRoomsMatch");
    if (!container) return;

    // Filter
    let filtered = ROOMS_DATA.filter(room => {
        const matchesCategory = state.selectedCategory === "all" || room.category === state.selectedCategory;
        const matchesLocation = state.selectedLocation === "all" || room.location === state.selectedLocation;
        
        // Price in INR for standardized budget filtering
        const priceInINR = Math.round(room.priceUSD * 85.0);

        // Budget Tier match
        let matchesBudgetTier = true;
        if (state.selectedBudgetTier === "budget") {
            matchesBudgetTier = priceInINR <= 5000;
        } else if (state.selectedBudgetTier === "mid") {
            matchesBudgetTier = priceInINR > 5000 && priceInINR <= 15000;
        } else if (state.selectedBudgetTier === "luxury") {
            matchesBudgetTier = priceInINR > 15000 && priceInINR <= 50000;
        } else if (state.selectedBudgetTier === "ultra") {
            matchesBudgetTier = priceInINR > 50000;
        }

        // Slider Max Budget match
        let matchesSlider = true;
        if (state.maxBudgetINR && state.maxBudgetINR < 170000) {
            matchesSlider = priceInINR <= state.maxBudgetINR;
        }

        return matchesCategory && matchesLocation && matchesBudgetTier && matchesSlider;
    });

    // Sort: Default is Low to High
    if (state.sortBy === "price-asc") {
        filtered.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (state.sortBy === "price-desc") {
        filtered.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (state.sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    // Update Counter in UI
    const countEl = document.getElementById("budgetMatchingCount");
    if (countEl) {
        countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${ROOMS_DATA.length}</strong> stays matching your budget`;
    }

    if (filtered.length === 0) {
        container.innerHTML = "";
        noRoomsNotice.classList.remove("hidden");
        return;
    } else {
        noRoomsNotice.classList.add("hidden");
    }

    container.innerHTML = filtered.map(room => {
        const isWishlisted = state.wishlist.includes(room.id);
        const totalPrice = room.priceUSD * state.nights;

        // Visual budget badge styling
        let tierBadge = "";
        const priceInINR = Math.round(room.priceUSD * 85.0);
        if (priceInINR <= 5000) {
            tierBadge = `<span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">🟢 Budget Pick</span>`;
        } else if (priceInINR <= 15000) {
            tierBadge = `<span class="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">🔵 Executive</span>`;
        } else if (priceInINR <= 50000) {
            tierBadge = `<span class="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">🟣 Luxury Suite</span>`;
        } else {
            tierBadge = `<span class="bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">👑 Royal Luxury</span>`;
        }

        return `
        <article class="room-card bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all duration-300">
            <!-- Room Image Container -->
            <div class="relative h-64 overflow-hidden">
                <img src="${room.image}" alt="${room.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy">
                
                <!-- Tag Badge -->
                <span class="absolute top-4 left-4 bg-navy-900/85 backdrop-blur-md text-gold-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold-400/30">
                    ${room.tag}
                </span>

                <!-- Wishlist Toggle -->
                <button class="wishlist-btn absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center transition shadow-md ${isWishlisted ? 'active' : ''}" 
                        onclick="toggleWishlist('${room.id}', event)" 
                        title="${isWishlisted ? 'Remove from saved' : 'Save to favorites'}">
                    <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}"></i>
                </button>

                <!-- Rating Overlay -->
                <div class="absolute bottom-3 right-3 bg-navy-900/85 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold border border-white/10">
                    <i data-lucide="star" class="w-3.5 h-3.5 text-gold-400 fill-current"></i>
                    <span>${room.rating.toFixed(2)}</span>
                    <span class="text-gray-400 text-[10px]">(${room.reviewsCount})</span>
                </div>
            </div>

            <!-- Room Content -->
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <!-- Meta Specs & Budget Tier Badge -->
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                        <div class="flex items-center gap-2">
                            <span class="flex items-center gap-1"><i data-lucide="maximize" class="w-3.5 h-3.5 text-gold-600"></i> ${room.size}</span>
                            <span>•</span>
                            <span class="flex items-center gap-1"><i data-lucide="users" class="w-3.5 h-3.5 text-gold-600"></i> Up to ${room.maxGuests}</span>
                        </div>
                        ${tierBadge}
                    </div>

                    <h3 class="font-serif text-xl font-bold text-navy-900 group-hover:text-gold-600 transition mb-2">
                        ${room.title}
                    </h3>
                    
                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        ${room.description}
                    </p>

                    <!-- Feature Tags -->
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        ${room.amenities.slice(0, 3).map(a => `
                            <span class="text-[10px] font-medium bg-gold-50 text-gold-800 border border-gold-200 px-2 py-0.5 rounded-md">
                                ${a}
                            </span>
                        `).join("")}
                    </div>
                </div>

                <!-- Price and CTA -->
                <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <div class="flex items-baseline gap-1">
                            <span class="font-serif text-2xl font-bold text-navy-900">${formatPrice(room.priceUSD)}</span>
                            <span class="text-xs text-gray-400">/ night</span>
                        </div>
                        <span class="text-[11px] text-gold-700 block">${formatPrice(totalPrice)} total for ${state.nights} night${state.nights > 1 ? 's' : ''}</span>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button onclick="openBookingModal('${room.id}')" class="bg-navy-900 hover:bg-gold-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition duration-300 flex items-center gap-1.5">
                            <span>Book Room</span>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
        `;
    }).join("");

    initLucide();
}

// Toggle Wishlist Function
function toggleWishlist(roomId, event) {
    if (event) event.stopPropagation();

    const index = state.wishlist.indexOf(roomId);
    if (index > -1) {
        state.wishlist.splice(index, 1);
        showToast("Removed from your saved list", "info");
    } else {
        state.wishlist.push(roomId);
        showToast("Suite added to your favorites ❤️", "success");
    }

    localStorage.setItem("aurelia_wishlist", JSON.stringify(state.wishlist));
    renderRooms();
}
window.toggleWishlist = toggleWishlist;

// Reset Filters Function
function resetFilters() {
    state.selectedCategory = "all";
    state.selectedLocation = "all";
    state.selectedBudgetTier = "all";
    state.maxBudgetINR = 170000;
    state.sortBy = "price-asc";

    setValue("searchLocation", "all");
    setValue("roomSortSelect", "price-asc");

    const slider = document.getElementById("priceBudgetSlider");
    if (slider) slider.value = "170000";
    setText("maxBudgetDisplay", "Any Budget (Up to ₹1,70,000+)");

    // Reset Category Pills
    document.querySelectorAll(".room-filter-pill").forEach(p => {
        p.classList.remove("bg-navy-900", "text-white");
        p.classList.add("bg-white", "text-gray-600");
        if (p.getAttribute("data-category") === "all") {
            p.classList.add("bg-navy-900", "text-white");
            p.classList.remove("bg-white", "text-gray-600");
        }
    });

    // Reset Budget Tier Pills
    document.querySelectorAll(".budget-tier-pill").forEach(p => {
        p.classList.remove("bg-gold-600", "text-white", "border-gold-600", "shadow-sm");
        p.classList.add("bg-white", "text-gray-700", "border-gray-200");
        if (p.getAttribute("data-budget-tier") === "all") {
            p.classList.add("bg-gold-600", "text-white", "border-gold-600", "shadow-sm");
            p.classList.remove("bg-white", "text-gray-700", "border-gray-200");
        }
    });

    renderRooms();
    showToast("Filters reset to all budgets and categories", "info");
}
window.resetFilters = resetFilters;

// Open Booking Modal
function openBookingModal(roomId) {
    const room = ROOMS_DATA.find(r => r.id === roomId);
    if (!room) return;

    state.activeRoomForBooking = room;

    setText("modalRoomTitle", `Reserve ${room.title}`);
    const modalImg = /** @type {HTMLImageElement|null} */ (getEl("modalRoomImage"));
    if (modalImg) modalImg.src = room.image;
    setText("modalRoomTag", room.tag);
    setText("modalRoomSize", room.size);
    setText("modalRoomGuests", `Max ${room.maxGuests} Guests`);
    setText("modalRoomBed", room.bedType);
    setText("modalRoomDesc", room.description);

    setText("modalCheckInSummary", state.checkIn || "");
    setText("modalCheckOutSummary", `${state.checkOut} (${state.nights} nights)`);

    // Reset addon checkboxes
    document.querySelectorAll(".addon-checkbox").forEach(cb => {
        if ("checked" in cb) cb.checked = false;
    });

    // Pre-fill user data if signed in
    const memberNotice = getEl("bookingMemberNotice");
    if (state.user && state.user.isLoggedIn) {
        if (state.user.name) setValue("guestName", state.user.name);
        if (state.user.method === "email") {
            setValue("guestEmail", state.user.identifier);
        } else if (state.user.method === "phone") {
            setValue("guestPhone", state.user.identifier);
        }
        if (memberNotice) memberNotice.classList.remove("hidden");
    } else {
        if (memberNotice) memberNotice.classList.add("hidden");
    }

    updateAddonPriceTags();
    calculateModalPricing();

    const bookingModalEl = getEl("bookingModal");
    if (bookingModalEl) bookingModalEl.classList.remove("hidden");
    initLucide();
}
window.openBookingModal = openBookingModal;

// Close Booking Modal
function closeBookingModal() {
    const bookingModalEl = getEl("bookingModal");
    if (bookingModalEl) bookingModalEl.classList.add("hidden");
    state.activeRoomForBooking = null;
}

// Calculate Modal Pricing Breakdown
function calculateModalPricing() {
    if (!state.activeRoomForBooking) return;

    const baseNightly = state.activeRoomForBooking.priceUSD;
    const baseTotal = baseNightly * state.nights;

    let addonsTotal = 0;
    const hasBreakfast = document.getElementById("addonBreakfast")?.checked;
    const hasTransfer = document.getElementById("addonTransfer")?.checked;
    const hasSpa = document.getElementById("addonSpa")?.checked;

    if (hasBreakfast) addonsTotal += 45 * state.nights;
    if (hasTransfer) addonsTotal += 95;
    if (hasSpa) addonsTotal += 180;

    const subtotal = baseTotal + addonsTotal;
    const taxes = Math.round(subtotal * 0.12);
    const grandTotal = subtotal + taxes;

    setText("calcNightCount", state.nights);
    setText("calcBaseTotal", formatPrice(baseTotal));
    setText("calcAddonsTotal", formatPrice(addonsTotal));
    setText("calcTaxesTotal", formatPrice(taxes));
    setText("calcGrandTotal", formatPrice(grandTotal));

    return { baseTotal, addonsTotal, taxes, grandTotal };
}

// Setup Event Listeners
function setupEventListeners() {
    // Currency Selector
    const currSelect = document.getElementById("currencySelector");
    if (currSelect) {
        currSelect.value = state.currency;
        currSelect.addEventListener("change", (e) => {
            state.currency = e.target.value;
            renderRooms();
            updateAddonPriceTags();
            if (state.activeRoomForBooking) calculateModalPricing();
            const curr = CURRENCIES[state.currency] || CURRENCIES.INR;
            showToast(`Currency updated to ${state.currency} (${curr.symbol})`, "info");
        });
    }

    // Category Filter Pills
    document.querySelectorAll(".room-filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".room-filter-pill").forEach(p => {
                p.classList.remove("bg-navy-900", "text-white");
                p.classList.add("bg-white", "text-gray-600");
            });
            pill.classList.remove("bg-white", "text-gray-600");
            pill.classList.add("bg-navy-900", "text-white");

            state.selectedCategory = pill.getAttribute("data-category");
            renderRooms();
        });
    });

    // Room Sort Select
    const sortSelect = document.getElementById("roomSortSelect");
    if (sortSelect) {
        sortSelect.value = state.sortBy;
        sortSelect.addEventListener("change", (e) => {
            state.sortBy = e.target.value;
            renderRooms();
        });
    }

    // Budget Tier Filter Pills
    document.querySelectorAll(".budget-tier-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".budget-tier-pill").forEach(p => {
                p.classList.remove("bg-gold-600", "text-white", "border-gold-600", "shadow-sm");
                p.classList.add("bg-white", "text-gray-700", "border-gray-200");
            });
            pill.classList.remove("bg-white", "text-gray-700", "border-gray-200");
            pill.classList.add("bg-gold-600", "text-white", "border-gold-600", "shadow-sm");

            state.selectedBudgetTier = pill.getAttribute("data-budget-tier");
            renderRooms();
        });
    });

    // Price Budget Slider
    const budgetSlider = document.getElementById("priceBudgetSlider");
    if (budgetSlider) {
        budgetSlider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value, 10);
            state.maxBudgetINR = val;
            if (val >= 170000) {
                setText("maxBudgetDisplay", "Any Budget (Up to ₹1,70,000+)");
            } else {
                const formatted = val.toLocaleString("en-IN");
                setText("maxBudgetDisplay", `Up to ₹${formatted} / night`);
            }
            renderRooms();
        });
    }

    // Hero Search Form
    const searchForm = getEl("heroBookingForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            state.selectedLocation = getValue("searchLocation", "all");
            state.checkIn = getValue("checkInDate");
            state.checkOut = getValue("checkOutDate");
            
            recalcNights();
            renderRooms();

            // Smooth scroll to rooms catalog
            const roomsSection = getEl("rooms");
            if (roomsSection) {
                roomsSection.scrollIntoView({ behavior: "smooth" });
            }
            showToast(`Searching available suites for ${state.nights} nights...`, "success");
        });
    }

    // Check-in and Check-out Date Change sync
    const cinInput = getEl("checkInDate");
    const coutInput = getEl("checkOutDate");

    if (cinInput && coutInput) {
        cinInput.addEventListener("change", (e) => {
            const target = e.target;
            if (target && "value" in target) {
                state.checkIn = target.value;
            }
            if ("min" in coutInput && state.checkIn) {
                coutInput.min = state.checkIn;
            }
            if ("value" in coutInput && state.checkIn && new Date(coutInput.value) <= new Date(state.checkIn)) {
                const nextDay = new Date(state.checkIn);
                nextDay.setDate(nextDay.getDate() + 1);
                coutInput.value = nextDay.toISOString().split("T")[0];
                state.checkOut = coutInput.value;
            }
            recalcNights();
            renderRooms();
        });

        coutInput.addEventListener("change", (e) => {
            const target = e.target;
            if (target && "value" in target) {
                state.checkOut = target.value;
            }
            recalcNights();
            renderRooms();
        });
    }

    // Guest Dropdown Toggle
    const guestTrigger = getEl("guestDropdownTrigger");
    const guestMenu = getEl("guestDropdownMenu");
    const closeGuestDropdown = getEl("closeGuestDropdown");

    if (guestTrigger && guestMenu) {
        guestTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            guestMenu.classList.toggle("hidden");
        });

        if (closeGuestDropdown) {
            closeGuestDropdown.addEventListener("click", () => {
                guestMenu.classList.add("hidden");
            });
        }

        document.addEventListener("click", (e) => {
            const target = e?.target;
            if (target && !guestMenu.contains(target) && !guestTrigger.contains(target)) {
                guestMenu.classList.add("hidden");
            }
        });
    }

    // Guest Counter Buttons (+ / -)
    document.querySelectorAll(".counter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const type = btn.getAttribute("data-type");
            const delta = parseInt(btn.getAttribute("data-delta") || "0", 10);

            if (type === "adults") {
                state.guests.adults = Math.max(1, Math.min(10, state.guests.adults + delta));
                setText("adultCount", state.guests.adults);
            } else if (type === "children") {
                state.guests.children = Math.max(0, Math.min(6, state.guests.children + delta));
                setText("childrenCount", state.guests.children);
            } else if (type === "rooms") {
                state.guests.rooms = Math.max(1, Math.min(5, state.guests.rooms + delta));
                setText("roomCount", state.guests.rooms);
            }

            const guestSummary = `${state.guests.adults} Adult${state.guests.adults > 1 ? 's' : ''}${state.guests.children > 0 ? `, ${state.guests.children} Child` : ''} · ${state.guests.rooms} Room${state.guests.rooms > 1 ? 's' : ''}`;
            setText("guestSummaryText", guestSummary);
        });
    });

    // Add-on checkboxes in booking modal
    document.querySelectorAll(".addon-checkbox").forEach(cb => {
        cb.addEventListener("change", calculateModalPricing);
    });

    // Close Modal Button
    const closeBtn = document.getElementById("closeBookingModal");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeBookingModal);
    }

    // Close on backdrop click
    const modalEl = document.getElementById("bookingModal");
    if (modalEl) {
        modalEl.addEventListener("click", (e) => {
            if (e?.target === modalEl) closeBookingModal();
        });
    }

    // Reservation Form Submission -> Email OTP Verification before Payment Checkout
    const reservationForm = document.getElementById("reservationForm");
    if (reservationForm) {
        reservationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const pricing = calculateModalPricing();
            const grandTotal = pricing ? pricing.grandTotal : (state.activeRoomForBooking ? state.activeRoomForBooking.priceUSD * state.nights : 0);
            const refCode = "GR-" + Math.floor(100000 + Math.random() * 900000);
            const guestName = getValue("guestName", "Valued Guest").trim() || "Valued Guest";
            const guestEmail = getValue("guestEmail").trim();
            const guestPhone = getValue("guestPhone").trim();
            const specialRequests = getValue("guestSpecialRequests");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!guestEmail || !emailRegex.test(guestEmail)) {
                showToast("Please enter a valid email address to receive your verification code", "info");
                const emailInput = document.getElementById("guestEmail");
                if (emailInput) emailInput.focus();
                return;
            }

            state.pendingBooking = {
                id: refCode,
                roomId: state.activeRoomForBooking ? state.activeRoomForBooking.id : "",
                roomTitle: state.activeRoomForBooking ? state.activeRoomForBooking.title : "Luxury Suite",
                roomImage: state.activeRoomForBooking ? state.activeRoomForBooking.image : "",
                guestName,
                guestEmail,
                guestPhone,
                specialRequests,
                checkIn: state.checkIn,
                checkOut: state.checkOut,
                nights: state.nights,
                guests: `${state.guests.adults} Adults, ${state.guests.children} Children`,
                grandTotalUSD: grandTotal,
                grandTotalFormatted: formatPrice(grandTotal),
                bookedAt: new Date().toLocaleDateString()
            };

            // Set loading state on submit button
            const submitBtn = reservationForm.querySelector("button[type='submit']");
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Sending Verification Code...</span>`;
                initLucide();
            }

            let serverResult = null;
            try {
                const resp = await fetch(`${API_BASE}/api/booking/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: guestName,
                        email: guestEmail,
                        phone: guestPhone,
                        roomTitle: state.pendingBooking.roomTitle,
                        grandTotal: state.pendingBooking.grandTotalFormatted,
                        checkIn: state.checkIn,
                        checkOut: state.checkOut,
                        nights: state.nights
                    })
                });
                serverResult = await resp.json().catch(() => ({}));
            } catch (err) {
                console.warn("Failed to reach booking OTP endpoint:", err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    initLucide();
                }
            }

            // Close room modal and open booking OTP verification modal
            closeBookingModal();
            openBookingOtpModal(guestEmail, serverResult);
        });
    }

    // Initialize Booking OTP & Payment Listeners
    setupBookingOtpListeners();
    setupPaymentListeners();

    // Success Modal Close
    const closeSuccessBtn = document.getElementById("closeSuccessModal");
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            document.getElementById("successModal").classList.add("hidden");
        });
    }

    // Print Confirmation Button
    const printBtn = document.getElementById("printConfirmationBtn");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // My Bookings Drawer/Modal
    const viewMyBookingsBtn = document.getElementById("viewMyBookingsBtn");
    const mobileMyBookingsBtn = document.getElementById("mobileMyBookingsBtn");
    const myBookingsModal = document.getElementById("myBookingsModal");
    const closeMyBookingsModal = document.getElementById("closeMyBookingsModal");

    const openMyBookings = () => {
        if (typeof renderMyBookings === "function") renderMyBookings();
        if (myBookingsModal) myBookingsModal.classList.remove("hidden");
        if (typeof initLucide === "function") initLucide();
    };

    if (viewMyBookingsBtn) viewMyBookingsBtn.addEventListener("click", openMyBookings);
    if (mobileMyBookingsBtn) mobileMyBookingsBtn.addEventListener("click", openMyBookings);

    if (closeMyBookingsModal && myBookingsModal) {
        closeMyBookingsModal.addEventListener("click", () => {
            myBookingsModal.classList.add("hidden");
        });
    }

    if (myBookingsModal) {
        myBookingsModal.addEventListener("click", (e) => {
            if (e?.target === myBookingsModal) myBookingsModal.classList.add("hidden");
        });
    }

    // FAQ Accordion
    document.querySelectorAll(".faq-question").forEach(q => {
        q.addEventListener("click", () => {
            const answer = q.nextElementSibling;
            if (!answer) return;

            const isHidden = answer.classList.contains("hidden");

            // Close all open answers first
            document.querySelectorAll(".faq-answer").forEach(a => a.classList.add("hidden"));
            document.querySelectorAll(".faq-question").forEach(btn => btn.classList.remove("active"));

            if (isHidden) {
                answer.classList.remove("hidden");
                q.classList.add("active");
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Newsletter Form
    const newsletterForm = getEl("newsletterForm");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = getValue("newsletterEmail");
            if (email) {
                showToast("Welcome to The Grand Royale Society. Check your inbox for your 10% welcome voucher.", "success");
                setValue("newsletterEmail", "");
            }
        });
    }
}

// Update Bookings Badge Count
function updateBookingsBadge() {
    const badge = getEl("bookingCountBadge");
    if (!badge) return;

    if (state.bookings.length > 0) {
        badge.innerText = String(state.bookings.length);
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

// Render "My Bookings" in modal
function renderMyBookings() {
    const list = document.getElementById("savedBookingsList");
    const emptyNotice = document.getElementById("noSavedBookings");
    if (!list) return;

    if (state.bookings.length === 0) {
        list.innerHTML = "";
        emptyNotice.classList.remove("hidden");
        return;
    } else {
        emptyNotice.classList.add("hidden");
    }

    list.innerHTML = state.bookings.map(booking => `
        <div class="border border-gray-200 rounded-2xl p-4 bg-[#FAF9F6] relative group">
            <div class="flex gap-4">
                <img src="${booking.roomImage}" alt="${booking.roomTitle}" class="w-20 h-20 rounded-xl object-cover">
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-mono text-gold-600 bg-gold-50 px-2 py-0.5 rounded font-bold">${booking.id}</span>
                        <span class="text-xs font-bold text-navy-900">${booking.totalPaidFormatted}</span>
                    </div>
                    <h4 class="font-serif font-bold text-sm text-navy-900 mt-1">${booking.roomTitle}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">${booking.checkIn} — ${booking.checkOut} (${booking.nights} nights)</p>
                    <p class="text-[11px] text-gray-400 mt-1">Guest: ${booking.guestName}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                <span class="text-emerald-600 font-semibold flex items-center gap-1">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Confirmed & Guaranteed
                </span>
                <button onclick="cancelReservation('${booking.id}')" class="text-red-500 hover:text-red-700 font-medium transition text-[11px]">
                    Cancel Reservation
                </button>
            </div>
        </div>
    `).join("");

    initLucide();
}

// Cancel Reservation
function cancelReservation(refCode) {
    if (confirm("Are you sure you wish to cancel this luxury suite reservation? Free cancellation applies.")) {
        state.bookings = state.bookings.filter(b => b.id !== refCode);
        localStorage.setItem("aurelia_bookings", JSON.stringify(state.bookings));
        updateBookingsBadge();
        renderMyBookings();
        showToast("Reservation successfully cancelled", "info");
    }
}
window.cancelReservation = cancelReservation;

// Toast Notification Manager
function showToast(message, type = "info", duration = 4000) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold max-w-sm border ${
        type === "success" 
            ? "bg-navy-900 text-white border-gold-400/50 shadow-gold-500/10" 
            : "bg-white text-navy-900 border-gray-200"
    }`;

    const icon = type === "success" ? "sparkles" : "info";
    const iconColor = type === "success" ? "text-gold-400" : "text-navy-900";

    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-4 h-4 ${iconColor} shrink-0"></i>
        <span class="flex-1 leading-snug">${message}</span>
        <button class="text-gray-400 hover:text-gray-200 focus:outline-none shrink-0" onclick="this.parentElement.remove()">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
    `;

    container.appendChild(toast);
    initLucide();

    // Fade in
    setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    // Auto dismiss after duration
    setTimeout(() => {
        toast.classList.add("translate-y-2", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========================================================
// ROOM BOOKING OTP VERIFICATION FLOW
// ========================================================

function openBookingOtpModal(email, serverResult) {
    const modal = getEl("bookingOtpModal");
    if (!modal) return;

    state.bookingOtpIdentifier = email;
    setText("bookingOtpEmailDisplay", email);

    // Dynamic carrier / email notice based on real server dispatch (Zero OTP codes displayed on web page)
    if (serverResult && serverResult.dispatched) {
        setText("bookingOtpNoticeTitle", `Delivered via ${serverResult.provider}`);
        setText("bookingOtpNoticeSubtitle", `Verification email sent to ${email}. Valid for 5 minutes.`);
        showToast(`📧 Verification code sent to ${email}! Please check your inbox.`, "success");
    } else if (serverResult && serverResult.error) {
        setText("bookingOtpNoticeTitle", "Email Delivery Issue");
        setText("bookingOtpNoticeSubtitle", serverResult.error);
        showToast(`❌ Email Delivery Error: ${serverResult.error}`, "info", 12000);
    } else {
        setText("bookingOtpNoticeTitle", "Email Verification Sent");
        setText("bookingOtpNoticeSubtitle", "Verification passcode dispatched to your email (and logged in the admin terminal).");
        showToast("ℹ️ Verification code dispatched. Please check your inbox.", "info");
    }

    // Reset OTP input boxes
    const inputs = document.querySelectorAll(".booking-otp-input");
    inputs.forEach(input => {
        if ("value" in input) input.value = "";
        input.classList.remove("filled", "border-red-400");
    });

    modal.classList.remove("hidden");
    if (inputs[0] && "focus" in inputs[0]) inputs[0].focus();

    // Start 30s resend timer
    startBookingResendTimer();
    initLucide();
}

function closeBookingOtpModal() {
    const modal = getEl("bookingOtpModal");
    if (modal) modal.classList.add("hidden");
    clearInterval(state.bookingOtpTimerInterval);
}

function startBookingResendTimer() {
    clearInterval(state.bookingOtpTimerInterval);
    let seconds = 30;

    const resendBtn = /** @type {HTMLButtonElement|null} */ (getEl("resendBookingOtpBtn"));
    if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerHTML = `Resend (<span id="bookingResendTimerSpan">${seconds}</span>s)`;
    }

    state.bookingOtpTimerInterval = setInterval(() => {
        seconds--;
        const span = getEl("bookingResendTimerSpan");
        if (span) {
            span.innerText = String(seconds);
        } else if (resendBtn) {
            resendBtn.innerText = `Resend (${seconds}s)`;
        }

        if (seconds <= 0) {
            clearInterval(state.bookingOtpTimerInterval);
            if (resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerText = "Resend Code";
            }
        }
    }, 1000);
}

async function handleVerifyBookingOtp(e) {
    if (e) e.preventDefault();
    const inputs = document.querySelectorAll(".booking-otp-input");
    let enteredCode = "";
    inputs.forEach(i => enteredCode += i.value.trim());

    if (enteredCode.length < 6) {
        showToast("Please enter all 6 digits of your verification code", "info");
        return;
    }

    const verifyBtn = /** @type {HTMLButtonElement|null} */ (getEl("verifyBookingOtpSubmitBtn"));
    const origBtnHtml = verifyBtn ? verifyBtn.innerHTML : "";
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Verifying...</span>`;
        initLucide();
    }

    let verified = false;
    let serverErrorMsg = "";

    try {
        const resp = await fetch(`${API_BASE}/api/booking/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identifier: state.bookingOtpIdentifier || state.pendingBooking?.guestEmail,
                email: state.bookingOtpIdentifier || state.pendingBooking?.guestEmail,
                otp: enteredCode
            })
        });
        const result = await resp.json().catch(() => ({}));
        if (resp.ok && result.success) {
            verified = true;
        } else if (result.error) {
            serverErrorMsg = result.error;
        }
    } catch (err) {
        console.warn("Server verification error:", err);
    } finally {
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = origBtnHtml;
            initLucide();
        }
    }

    if (verified) {
        closeBookingOtpModal();
        openPaymentModal();
        showToast("✅ Email verified! Proceeding to Payment Checkout.", "success");
    } else {
        showToast(serverErrorMsg || "❌ Incorrect code. Please check your email and try again.", "info");
        inputs.forEach(i => {
            i.classList.add("border-red-400");
            setTimeout(() => i.classList.remove("border-red-400"), 1800);
        });
    }
}

async function handleResendBookingOtp() {
    const resendBtn = /** @type {HTMLButtonElement|null} */ (getEl("resendBookingOtpBtn"));
    if (resendBtn && resendBtn.disabled) return;

    if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerText = "Sending...";
    }

    const email = state.bookingOtpIdentifier || state.pendingBooking?.guestEmail;
    if (!email) return;

    try {
        const resp = await fetch(`${API_BASE}/api/booking/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: state.pendingBooking?.guestName || "Valued Guest",
                email: email,
                phone: state.pendingBooking?.guestPhone || "",
                roomTitle: state.pendingBooking?.roomTitle || "Luxury Suite",
                grandTotal: state.pendingBooking?.grandTotalFormatted || "₹0",
                checkIn: state.pendingBooking?.checkIn || "",
                checkOut: state.pendingBooking?.checkOut || "",
                nights: state.pendingBooking?.nights || 1
            })
        });
        const serverResult = await resp.json().catch(() => ({}));

        if (serverResult && serverResult.dispatched) {
            setText("bookingOtpNoticeTitle", `Delivered via ${serverResult.provider}`);
            setText("bookingOtpNoticeSubtitle", `New verification code sent to ${email}. Valid for 5 minutes.`);
            showToast(`📧 New verification code emailed to ${email}!`, "success");
        } else if (serverResult && serverResult.error) {
            setText("bookingOtpNoticeTitle", "Email Delivery Issue");
            setText("bookingOtpNoticeSubtitle", serverResult.error);
            showToast(`❌ Email Error: ${serverResult.error}`, "info", 12000);
        } else {
            setText("bookingOtpNoticeTitle", "Email Verification Sent");
            setText("bookingOtpNoticeSubtitle", "New passcode dispatched to your email (and logged in the admin terminal).");
            showToast("ℹ️ New verification code dispatched. Please check your inbox.", "info");
        }
    } catch (err) {
        showToast("Network error resending code. Please try again.", "info");
    }

    startBookingResendTimer();
}

function setupBookingOtpListeners() {
    const closeBtn = document.getElementById("closeBookingOtpModal");
    const backBtn = document.getElementById("backToReservationBtn");
    const resendBtn = document.getElementById("resendBookingOtpBtn");
    const form = document.getElementById("verifyBookingOtpForm");

    if (closeBtn) closeBtn.addEventListener("click", closeBookingOtpModal);

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            closeBookingOtpModal();
            if (state.activeRoomForBooking) {
                openBookingModal(state.activeRoomForBooking);
            }
        });
    }

    if (resendBtn) resendBtn.addEventListener("click", handleResendBookingOtp);
    if (form) form.addEventListener("submit", handleVerifyBookingOtp);

    // Auto-advance & paste for .booking-otp-input
    const inputs = document.querySelectorAll(".booking-otp-input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const val = input.value.replace(/[^0-9]/g, "");
            input.value = val ? val[val.length - 1] : "";
            if (input.value) {
                input.classList.add("filled");
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else {
                input.classList.remove("filled");
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData("text").trim().replace(/[^0-9]/g, "");
            if (pasteData) {
                const chars = pasteData.slice(0, 6).split("");
                chars.forEach((char, i) => {
                    if (inputs[i]) {
                        inputs[i].value = char;
                        inputs[i].classList.add("filled");
                    }
                });
                const nextIndex = Math.min(chars.length, inputs.length - 1);
                if (inputs[nextIndex]) inputs[nextIndex].focus();
            }
        });
    });
}

// ========================================================
// PAYMENT CHECKOUT FLOW (AFTER OTP VERIFICATION)
// ========================================================

function openPaymentModal() {
    const modal = getEl("paymentModal");
    if (!modal || !state.pendingBooking) return;

    const booking = state.pendingBooking;

    // Populate details in payment modal
    const imgEl = getEl("paymentSuiteImage");
    if (imgEl) imgEl.src = booking.roomImage || "";
    setText("paymentSuiteTitle", booking.roomTitle);
    setText("paymentStayDates", `${booking.checkIn} to ${booking.checkOut} (${booking.nights} night${booking.nights > 1 ? 's' : ''}) • ${booking.guests}`);
    setText("paymentGuestName", booking.guestName);
    setText("paymentGrandTotalDisplay", booking.grandTotalFormatted);
    setText("payButtonAmountDisplay", booking.grandTotalFormatted);

    // Default cardholder name
    setValue("payCardName", booking.guestName);

    // Reset to card method
    switchPaymentMethod("card");

    modal.classList.remove("hidden");
    initLucide();
}

function closePaymentModal() {
    const modal = getEl("paymentModal");
    if (modal) modal.classList.add("hidden");
}

function switchPaymentMethod(method) {
    state.selectedPaymentMethod = method;

    // Toggle active tabs
    document.querySelectorAll(".payment-tab-btn").forEach(btn => {
        const isCurrent = btn.dataset.method === method;
        if (isCurrent) {
            btn.classList.add("active", "border-gold-500", "bg-gold-50/50", "text-navy-900", "font-bold");
            btn.classList.remove("border-gray-200", "bg-white", "text-gray-600");
        } else {
            btn.classList.remove("active", "border-gold-500", "bg-gold-50/50", "text-navy-900", "font-bold");
            btn.classList.add("border-gray-200", "bg-white", "text-gray-600");
        }
    });

    // Toggle field visibility
    const cardFields = getEl("methodCardFields");
    const upiFields = getEl("methodUpiFields");
    const netbankFields = getEl("methodNetbankingFields");
    const hotelFields = getEl("methodHotelFields");

    if (cardFields) cardFields.classList.toggle("hidden", method !== "card");
    if (upiFields) upiFields.classList.toggle("hidden", method !== "upi");
    if (netbankFields) netbankFields.classList.toggle("hidden", method !== "netbanking");
    if (hotelFields) hotelFields.classList.toggle("hidden", method !== "hotel");

    // Update button text
    const payBtn = getEl("submitPaymentBtn");
    if (payBtn) {
        if (method === "hotel") {
            payBtn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-gold-300"></i><span>Confirm Reservation (Pay at Reception)</span>`;
        } else {
            payBtn.innerHTML = `<i data-lucide="lock" class="w-4 h-4 text-gold-300"></i><span>Confirm &amp; Pay <span id="payButtonAmountDisplay">${state.pendingBooking ? state.pendingBooking.grandTotalFormatted : ''}</span></span>`;
        }
        initLucide();
    }
}

function setupPaymentListeners() {
    // Payment Tab buttons
    document.querySelectorAll(".payment-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            switchPaymentMethod(btn.dataset.method);
        });
    });

    // Close Payment Modal Button
    const closePaymentModalBtn = getEl("closePaymentModal");
    if (closePaymentModalBtn) {
        closePaymentModalBtn.addEventListener("click", closePaymentModal);
    }

    // Back to Room Details Button
    const backToBookingFromPaymentBtn = getEl("backToBookingFromPaymentBtn");
    if (backToBookingFromPaymentBtn) {
        backToBookingFromPaymentBtn.addEventListener("click", () => {
            closePaymentModal();
            const bookingModal = getEl("bookingModal");
            if (bookingModal) bookingModal.classList.remove("hidden");
        });
    }

    const checkoutPaymentForm = getEl("checkoutPaymentForm");
    if (checkoutPaymentForm) {
        checkoutPaymentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!state.pendingBooking) {
                showToast("No reservation in progress.", "info");
                return;
            }

            const submitBtn = getEl("submitPaymentBtn");
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-gold-300"></i><span>Processing Payment &amp; Finalizing...</span>`;
                initLucide();
            }

            setTimeout(() => {
                // Finalize reservation
                const finalBooking = {
                    ...state.pendingBooking,
                    paymentMethod: state.selectedPaymentMethod,
                    paymentStatus: state.selectedPaymentMethod === "hotel" ? "Pay on Arrival" : "Paid & Guaranteed",
                    totalPaidFormatted: state.pendingBooking.grandTotalFormatted
                };

                // Store in bookings
                state.bookings.unshift(finalBooking);
                localStorage.setItem("aurelia_bookings", JSON.stringify(state.bookings));
                updateBookingsBadge();

                // Synchronize reservation to backend persistent storage for live Admin Portal visibility
                fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalBooking)
                }).catch(err => console.log("Admin sync notice:", err.message));

                // Populate confirmation receipt modal
                setText("confirmRefCode", finalBooking.id);
                setText("confirmGuestName", finalBooking.guestName);
                setText("confirmRoomName", finalBooking.roomTitle);
                setText("confirmStayDates", `${finalBooking.checkIn} — ${finalBooking.checkOut} (${finalBooking.nights} nights)`);
                setText("confirmTotalPaid", finalBooking.grandTotalFormatted);

                // Close payment modal, show success receipt modal
                closePaymentModal();
                state.pendingBooking = null;

                const successModalEl = getEl("successModal");
                if (successModalEl) successModalEl.classList.remove("hidden");
                initLucide();

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                }

                showToast("🎉 Payment confirmed! Your luxury reservation is secured.", "success", 8000);
            }, 800);
        });
    }
}

// ========================================================
// AUTHENTICATION & OTP SYSTEM (EMAIL OR PHONE)
// ========================================================

function initAuth() {
    updateAuthUI();
    setupAuthListeners();
}

function updateAuthUI() {
    const openBtn = document.getElementById("openAuthModalBtn");
    const userContainer = document.getElementById("userProfileContainer");
    const userAvatar = document.getElementById("userAvatar");
    const userDisplayName = document.getElementById("userDisplayName");
    const userDropdownIdentifier = document.getElementById("userDropdownIdentifier");
    const mobileAuthLabel = document.getElementById("mobileAuthLabel");

    if (state.user && state.user.isLoggedIn) {
        if (openBtn) openBtn.classList.add("hidden");
        if (userContainer) userContainer.classList.remove("hidden");

        const firstChar = state.user.name ? state.user.name.trim().charAt(0).toUpperCase() : "G";
        const firstName = state.user.name ? state.user.name.trim().split(" ")[0] : "Member";

        if (userAvatar) userAvatar.innerText = firstChar;
        if (userDisplayName) userDisplayName.innerText = firstName;
        if (userDropdownIdentifier) userDropdownIdentifier.innerText = state.user.identifier;
        if (mobileAuthLabel) mobileAuthLabel.innerText = `${firstName} (Sign Out)`;
    } else {
        if (openBtn) openBtn.classList.remove("hidden");
        if (userContainer) userContainer.classList.add("hidden");
        if (mobileAuthLabel) mobileAuthLabel.innerText = "Sign In with OTP";
    }
}

function setupAuthListeners() {
    // Open Auth Modal
    const openBtn = document.getElementById("openAuthModalBtn");
    const mobileAuthBtn = document.getElementById("mobileAuthBtn");
    const closeBtn = document.getElementById("closeAuthModal");
    const authModal = document.getElementById("authModal");

    if (openBtn) openBtn.addEventListener("click", openAuthModal);

    if (mobileAuthBtn) {
        mobileAuthBtn.addEventListener("click", () => {
            if (state.user && state.user.isLoggedIn) {
                logoutUser();
            } else {
                openAuthModal();
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeAuthModal);

    if (authModal) {
        authModal.addEventListener("click", (e) => {
            if (e?.target === authModal) closeAuthModal();
        });
    }

    // User Profile Dropdown Toggle
    const userProfileBtn = document.getElementById("userProfileBtn");
    const userProfileDropdown = document.getElementById("userProfileDropdown");
    if (userProfileBtn && userProfileDropdown) {
        userProfileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userProfileDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            const target = e?.target;
            if (target && !userProfileDropdown.contains(target) && !userProfileBtn.contains(target)) {
                userProfileDropdown.classList.add("hidden");
            }
        });
    }

    // Profile menu action: My Trips
    const profileMyTripsBtn = document.getElementById("profileMyTripsBtn");
    if (profileMyTripsBtn) {
        profileMyTripsBtn.addEventListener("click", () => {
            if (userProfileDropdown) userProfileDropdown.classList.add("hidden");
            const myBookingsModal = document.getElementById("myBookingsModal");
            if (myBookingsModal) {
                if (typeof renderMyBookings === "function") renderMyBookings();
                myBookingsModal.classList.remove("hidden");
                if (typeof initLucide === "function") initLucide();
            }
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

    // Tab Switching: Email vs Phone
    const tabEmail = document.getElementById("authTabEmail");
    const tabPhone = document.getElementById("authTabPhone");
    const emailContainer = document.getElementById("authEmailContainer");
    const phoneContainer = document.getElementById("authPhoneContainer");
    const emailInput = document.getElementById("authEmailInput");
    const phoneInput = document.getElementById("authPhoneInput");

    if (tabEmail && tabPhone) {
        tabEmail.addEventListener("click", () => {
            authState.method = "email";
            tabEmail.classList.add("bg-white", "text-navy-900", "shadow-sm");
            tabEmail.classList.remove("text-gray-600");
            tabPhone.classList.remove("bg-white", "text-navy-900", "shadow-sm");
            tabPhone.classList.add("text-gray-600");

            emailContainer.classList.remove("hidden");
            phoneContainer.classList.add("hidden");
            if (emailInput) emailInput.focus();
        });

        tabPhone.addEventListener("click", () => {
            authState.method = "phone";
            tabPhone.classList.add("bg-white", "text-navy-900", "shadow-sm");
            tabPhone.classList.remove("text-gray-600");
            tabEmail.classList.remove("bg-white", "text-navy-900", "shadow-sm");
            tabEmail.classList.add("text-gray-600");

            phoneContainer.classList.remove("hidden");
            emailContainer.classList.add("hidden");
            if (phoneInput) phoneInput.focus();
        });
    }

    // CallMeBot API Key Storage Listener
    const callmebotInput = document.getElementById("callmebotApiKeyInput");
    if (callmebotInput) {
        const savedKey = localStorage.getItem("aurelia_callmebot_key");
        if (savedKey && "value" in callmebotInput) {
            callmebotInput.value = savedKey;
        }
        callmebotInput.addEventListener("input", (e) => {
            const key = (e.target?.value || "").trim();
            localStorage.setItem("aurelia_callmebot_key", key);
        });
    }

    // Resend API Key Storage Listener
    const resendInput = document.getElementById("resendApiKeyInput");
    if (resendInput) {
        const savedKey = localStorage.getItem("aurelia_resend_key");
        if (savedKey && "value" in resendInput) {
            resendInput.value = savedKey;
        }
        resendInput.addEventListener("input", (e) => {
            const key = (e.target?.value || "").trim();
            localStorage.setItem("aurelia_resend_key", key);
        });
    }

    // Step 1: Send OTP Form
    const identifierForm = document.getElementById("authIdentifierForm");
    if (identifierForm) {
        identifierForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleSendOtp();
        });
    }

    // Step 2: OTP Input Boxes Navigation
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input, idx) => {
        // Input event (moving forward)
        input.addEventListener("input", (e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            e.target.value = val;

            if (val) {
                input.classList.add("filled");
                if (idx < otpInputs.length - 1) {
                    otpInputs[idx + 1].focus();
                }
            } else {
                input.classList.remove("filled");
            }
        });

        // Keydown event (backspace backwards)
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && idx > 0) {
                otpInputs[idx - 1].focus();
                otpInputs[idx - 1].value = "";
                otpInputs[idx - 1].classList.remove("filled");
            }
        });

        // Paste event
        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData("text").trim();
            const digits = pasteData.replace(/[^0-9]/g, "").slice(0, 6);
            if (digits) {
                fillOtpInputs(digits);
            }
        });
    });

    // Step 2: Verify OTP Form
    const verifyForm = document.getElementById("verifyOtpForm");
    if (verifyForm) {
        verifyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleVerifyOtp();
        });
    }

    // Step 2: Back to Step 1
    const backBtn = document.getElementById("backToIdentifierBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            clearInterval(authState.resendInterval);
            document.getElementById("authStepOtp").classList.add("hidden");
            document.getElementById("authStepInput").classList.remove("hidden");
        });
    }

    // Step 2: Resend OTP Button
    const resendBtn = document.getElementById("resendOtpBtn");
    if (resendBtn) {
        resendBtn.addEventListener("click", () => {
            if (!resendBtn.disabled) {
                handleSendOtp(true);
            }
        });
    }
}

// Open Auth Modal
function openAuthModal() {
    const authModal = getEl("authModal");
    if (!authModal) return;

    // Reset view to Step 1
    const step1 = getEl("authStepInput");
    const step2 = getEl("authStepOtp");
    if (step1) step1.classList.remove("hidden");
    if (step2) step2.classList.add("hidden");

    // Pre-fill CallMeBot & Resend keys from local storage if available
    const callmebotInput = /** @type {HTMLInputElement|null} */ (getEl("callmebotApiKeyInput"));
    if (callmebotInput) {
        const savedKey = localStorage.getItem("aurelia_callmebot_key") || "";
        if (savedKey) callmebotInput.value = savedKey;
    }
    const resendInput = /** @type {HTMLInputElement|null} */ (getEl("resendApiKeyInput"));
    if (resendInput) {
        const savedKey = localStorage.getItem("aurelia_resend_key") || "";
        if (savedKey) resendInput.value = savedKey;
    }

    // Reset fields if needed (clean empty input for user's own email address)
    if (!state.user) {
        setValue("authEmailInput", "");
        if (!getValue("authGuestName")) setValue("authGuestName", "");
        if (!getValue("authPhoneInput")) setValue("authPhoneInput", "");
        const cc = /** @type {HTMLSelectElement|null} */ (getEl("authCountryCode"));
        if (cc && !cc.value) cc.value = "+91";
    }

    authModal.classList.remove("hidden");
    initLucide();
}
window.openAuthModal = openAuthModal;

// Close Auth Modal
function closeAuthModal() {
    const authModal = getEl("authModal");
    if (authModal) authModal.classList.add("hidden");
    clearInterval(authState.resendInterval);
}

// Send OTP
async function handleSendOtp(isResend = false) {
    const name = getValue("authGuestName", "Valued Member").trim() || "Valued Member";
    let identifier = "";

    if (authState.method === "email") {
        const email = getValue("authEmailInput").trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showToast("Please enter a valid email address (e.g. guest@example.com)", "info");
            return;
        }
        identifier = email;
    } else {
        const code = getValue("authCountryCode", "+91");
        const phone = getValue("authPhoneInput").trim().replace(/\s+/g, "");
        if (!phone || phone.length < 6) {
            showToast("Please enter a valid phone number", "info");
            return;
        }
        identifier = `${code} ${phone}`;
    }

    authState.pendingUser = {
        name,
        identifier,
        method: authState.method
    };

    // Retrieve CallMeBot & Resend keys if present
    const callmebotApiKey = (getValue("callmebotApiKeyInput") || localStorage.getItem("aurelia_callmebot_key") || "").trim();
    const resendApiKey = (getValue("resendApiKeyInput") || localStorage.getItem("aurelia_resend_key") || "").trim();
    if (callmebotApiKey) localStorage.setItem("aurelia_callmebot_key", callmebotApiKey);
    if (resendApiKey) localStorage.setItem("aurelia_resend_key", resendApiKey);

    // Set UI Loading State on Send Button
    const sendOtpBtn = /** @type {HTMLButtonElement|null} */ (getEl("sendOtpBtn"));
    const originalBtnHtml = sendOtpBtn ? sendOtpBtn.innerHTML : "";
    if (sendOtpBtn && !isResend) {
        sendOtpBtn.disabled = true;
        sendOtpBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Sending Code...</span>`;
        initLucide();
    }

    const resendBtn = /** @type {HTMLButtonElement|null} */ (getEl("resendOtpBtn"));
    if (isResend && resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerText = "Sending...";
    }

    // Attempt to dispatch real OTP to email or phone via backend
    let sentViaServer = false;
    let serverResult = null;
    let endpointUrl = authState.method === "email" ? `${API_BASE}/api/auth/send-otp` : `${API_BASE}/api/send-otp`;

    try {
        const payload = authState.method === "email" ? {
            email: identifier,
            name: name,
            resendApiKey: resendApiKey
        } : {
            method: "phone",
            identifier: identifier,
            name: name,
            callmebotApiKey: callmebotApiKey
        };

        const resp = await fetch(endpointUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        serverResult = await resp.json().catch(() => ({}));

        if (resp.ok && serverResult.success) {
            sentViaServer = true;
        } else if (serverResult && serverResult.error) {
            showToast(serverResult.error, "info");
            if (sendOtpBtn && !isResend) {
                sendOtpBtn.disabled = false;
                sendOtpBtn.innerHTML = originalBtnHtml;
                initLucide();
            }
            if (isResend && resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerText = "Resend Code";
            }
            return;
        }
    } catch (err) {
        // Network or offline fallback
        console.warn("Backend unavailable, using local session:", err);
    } finally {
        if (sendOtpBtn && !isResend) {
            sendOtpBtn.disabled = false;
            sendOtpBtn.innerHTML = originalBtnHtml;
            initLucide();
        }
    }

    // Update Step 2 UI
    setText("authOtpTargetDisplay", identifier);

    // Dynamic carrier / email notice based on real server dispatch (Zero OTP codes displayed on webpage)
    if (authState.method === "email") {
        if (serverResult && serverResult.dispatched) {
            setText("authDispatchTitle", `Delivered via ${serverResult.provider}`);
            setText("authDispatchSubtitle", `Verification email sent to ${identifier}. Please check your inbox and spam folder.`);
            showToast(`📧 Verification code emailed to ${identifier}! Please check your inbox.`, "success");
        } else if (serverResult && serverResult.error) {
            // Display exact SMTP / configuration error in toast and subtitle
            setText("authDispatchTitle", "Email Delivery Issue");
            setText("authDispatchSubtitle", serverResult.error);
            showToast(`❌ Email Delivery Error: ${serverResult.error}`, "info", 12000);
        } else {
            setText("authDispatchTitle", "Email Verification Sent");
            setText("authDispatchSubtitle", "Passcode dispatched to your email (and logged in the admin terminal).");
            showToast("ℹ️ Security code dispatched. Please check your inbox.", "info");
        }
    } else {
        // Phone method
        if (serverResult && serverResult.provider === "CallMeBot WhatsApp") {
            setText("authDispatchTitle", "Delivered via CallMeBot WhatsApp");
            setText("authDispatchSubtitle", `Verification passcode sent directly to your WhatsApp on ${identifier}.`);
            showToast("📲 Real OTP dispatched to your WhatsApp via CallMeBot!", "success");
        } else if (serverResult && serverResult.dispatched) {
            setText("authDispatchTitle", `Dispatched via ${serverResult.provider}`);
            setText("authDispatchSubtitle", `Please check your messages on ${identifier}.`);
            showToast(`📱 Real OTP sent via ${serverResult.provider}!`, "success");
        } else {
            setText("authDispatchTitle", "Security Passcode Dispatched");
            setText("authDispatchSubtitle", "Passcode dispatched to your phone (and logged in the admin terminal).");
            showToast("ℹ️ Security code dispatched. Please check your messages.", "info");
        }
    }

    // Reset OTP input boxes
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach(input => {
        if ("value" in input) input.value = "";
        input.classList.remove("filled");
        input.classList.remove("border-red-400");
    });

    // Switch to Step 2
    const step1El = getEl("authStepInput");
    const step2El = getEl("authStepOtp");
    if (step1El) step1El.classList.add("hidden");
    if (step2El) step2El.classList.remove("hidden");

    if (otpInputs[0] && "focus" in otpInputs[0]) otpInputs[0].focus();

    // Setup WhatsApp Option if phone
    const waContainer = getEl("whatsappDeliveryContainer");
    const waLink = getEl("whatsappOtpLink");
    if (authState.method === "phone") {
        const rawDigits = identifier.replace(/[^0-9]/g, "");
        if (waContainer && waLink && "href" in waLink) {
            waContainer.classList.remove("hidden");
            const msg = `[Grand Royale Resort] Your verification passcode is: ${authState.generatedOtp || '123456'}`;
            waLink.href = `https://wa.me/${rawDigits}?text=${encodeURIComponent(msg)}`;
            setText("whatsappDeliveryText", `Open WhatsApp for ${identifier}`);
        }
    } else {
        if (waContainer) waContainer.classList.add("hidden");
    }

    // Start Resend Timer (30s)
    startResendTimer();

    initLucide();
}

// Start Countdown Timer (30s cooldown)
function startResendTimer() {
    clearInterval(authState.resendInterval);
    authState.resendSeconds = 30;

    const resendBtn = /** @type {HTMLButtonElement|null} */ (getEl("resendOtpBtn"));
    if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerHTML = `Resend (<span id="resendTimerSpan">${authState.resendSeconds}</span>s)`;
    }

    authState.resendInterval = setInterval(() => {
        authState.resendSeconds--;
        const span = getEl("resendTimerSpan");
        if (span) {
            span.innerText = String(authState.resendSeconds);
        } else if (resendBtn) {
            resendBtn.innerText = `Resend (${authState.resendSeconds}s)`;
        }

        if (authState.resendSeconds <= 0) {
            clearInterval(authState.resendInterval);
            if (resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerText = "Resend Code";
            }
        }
    }, 1000);
}

// Fill OTP boxes programmatically
function fillOtpInputs(codeStr) {
    const inputs = document.querySelectorAll(".otp-input");
    const chars = codeStr.split("");
    inputs.forEach((input, i) => {
        if (chars[i]) {
            input.value = chars[i];
            input.classList.add("filled");
        }
    });
    if (inputs[inputs.length - 1]) inputs[inputs.length - 1].focus();
}

// Verify OTP
async function handleVerifyOtp() {
    const inputs = document.querySelectorAll(".otp-input");
    let enteredCode = "";
    inputs.forEach(i => enteredCode += i.value.trim());

    if (enteredCode.length < 6) {
        showToast("Please enter all 6 digits of your verification code", "info");
        return;
    }

    const verifyBtn = /** @type {HTMLButtonElement|null} */ (getEl("verifyOtpSubmitBtn"));
    const origVerifyHtml = verifyBtn ? verifyBtn.innerHTML : "";
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Verifying...</span>`;
        initLucide();
    }

    let verified = false;
    let serverErrorMsg = "";
    let verifiedUser = null;

    // 1. Try server verification if backend is active
    try {
        const isEmail = authState.pendingUser?.method === "email";
        const endpointUrl = isEmail ? `${API_BASE}/api/auth/verify-otp` : `${API_BASE}/api/verify-otp`;
        const payload = isEmail ? {
            email: authState.pendingUser.identifier,
            otp: enteredCode
        } : {
            identifier: authState.pendingUser.identifier,
            otp: enteredCode
        };

        const resp = await fetch(endpointUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await resp.json().catch(() => ({}));
        if (resp.ok && result.success) {
            verified = true;
            verifiedUser = result.user;
        } else if (result.error) {
            serverErrorMsg = result.error;
        }
    } catch (e) {
        serverErrorMsg = "Unable to connect to verification server.";
    }

    if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = origVerifyHtml;
        initLucide();
    }

    if (verified) {
        // Success!
        state.user = {
            isLoggedIn: true,
            name: verifiedUser?.name || authState.pendingUser.name,
            email: verifiedUser?.email || (authState.pendingUser.method === "email" ? authState.pendingUser.identifier : ""),
            identifier: authState.pendingUser.identifier,
            method: authState.pendingUser.method,
            signedInAt: new Date().toLocaleDateString()
        };

        localStorage.setItem("aurelia_user", JSON.stringify(state.user));
        updateAuthUI();
        closeAuthModal();

        showToast(`🎉 Welcome to The Grand Royale Society, ${state.user.name}!`, "success");
    } else {
        showToast(serverErrorMsg || "❌ Incorrect code. Please check the passcode and try again.", "info");
        inputs.forEach(i => {
            i.classList.add("border-red-400");
            setTimeout(() => i.classList.remove("border-red-400"), 1800);
        });
    }
}

// Logout User
function logoutUser() {
    state.user = null;
    localStorage.removeItem("aurelia_user");

    const userProfileDropdown = document.getElementById("userProfileDropdown");
    if (userProfileDropdown) userProfileDropdown.classList.add("hidden");

    updateAuthUI();
    showToast("You have been signed out safely. Come back soon!", "info");
}
