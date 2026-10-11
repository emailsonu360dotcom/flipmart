# Flipkart College Project — Phase 26

A front-end e-commerce website demonstration built with HTML, CSS, and JavaScript for an academic project.

## Run locally
1. Keep `index.html`, `style.css`, `script.js`, `flipkart-logo.png`, and `travel-logo.png` in the same folder.
2. Open this folder in VS Code.
3. Use the Live Server extension to open `index.html`.

## Phase 26 header update
- Two-row white header based on the supplied 1440 × 124 screenshot.
- Flipkart and Travel logo images at top-left.
- Location pin and “Location not set / Select delivery location” at top-right.
- Wide blue-outlined search bar on the second row.
- Outlined profile icon with Login, More dropdown, and cart icon with Cart label.
- Existing product-demo features and JavaScript IDs retained.

This is an independent academic front-end demonstration. It is not affiliated with or endorsed by Flipkart. Account, cart, and checkout features are demonstrations only.


## Phase 27 — Category navigation
Updated the category strip to include For You, Fashion, Mobile, Electronics, Beauty, Home, Appliances, Toys & Baby Products, Food & Health Supplements, Auto Accessories, Sports & Fitness, Furnitures, Books, and 2 Wheelers. The category strip is horizontally scrollable on smaller screens. Existing product filters remain connected for categories with matching demo products.


## Phase 32 — Dynamic hero banners
- Replaced the static hero banner with a four-slide rotating banner carousel for general deals, tech, fashion, and home products.
- Banners rotate automatically every five seconds and include previous/next controls and direct slide dots.
- Rotation pauses while hovered/focused and when the browser tab is hidden; mobile styling and reduced-motion preferences are supported.


### Static banner
A single static promotional banner appears directly below the moving banner strip. Replace `banners/static-banner.jpg` with your own image (recommended 1570 × 349 pixels). Keep the filename unchanged.


## Phase 35 — Payment page & coupons
- Checkout is now two steps: delivery details, then a full-screen "Complete Payment" page.
- Payment options: UPI, Credit / Debit / ATM Card, EMI, Cash on Delivery (₹29 fee), Net Banking, Have a Flipkart Gift Card?
- Coupons: UPI50, CARD60, NETBANK70 (valid only on their payment method), SAVE30 and FLAT25 (any method).
- Demo only — no card, UPI or bank details are stored or sent anywhere.

## Phase 36 — Login with Phone / Email + OTP
- Login dialog redesigned as a split blue/white panel. "Phone Number" (+91, 10 digits) is the default; "Use Email-ID" switches to email and "Use Phone Number" switches back.
- Step 2 is a 6-box OTP screen with a 30-second timer, Edit and Resend OTP. Paste and backspace are supported.
- Demo only: no SMS or email is sent; the generated OTP is shown on the screen.

## Phase 37 — UPI QR code and UPI app redirection
- Desktop / laptop: choosing UPI shows a "Scan QR and Pay" card with a scannable UPI QR (amount included), a 5-minute validity timer and a "Generate new QR" button when it expires. The QR updates automatically if a coupon changes the total.
- Mobile / tablet: choosing UPI shows Google Pay, PhonePe, Paytm, BHIM and Other UPI apps buttons that open the installed app with the payee, amount and order reference pre-filled (Android intents / iOS app links).
- "Pay using UPI ID" remains available as a fallback.
- Set the receiving UPI ID and display name in `upi-config.js`. The QR library is bundled offline in `qrcode.js` (MIT, Kazuhiko Arase).
- There is no payment gateway, so payment is not verified automatically; the customer taps "I've completed the payment" (demo).

## Phase 39 — Dynamic UPI QR + real app icons
- Receiving UPI ID is set in `upi-config.js` (currently `sonu.409@superyes`).
- The QR refreshes itself every 60 seconds. The payee UPI ID, name, amount and note never change; only a fresh transaction reference (`tr`) is embedded each time, so the QR pattern changes while the UPI ID stays the same.
- App icons live in `upi-logos/` (Google Pay, PhonePe, BHIM, Super.money, Paytm), resized to 128×128.

*Update:* the customer only sees the 5-minute payment countdown. The QR still refreshes silently every 60 seconds in the background (same UPI ID, new reference). After 5 minutes the QR expires and "Generate new QR" starts a fresh session.
