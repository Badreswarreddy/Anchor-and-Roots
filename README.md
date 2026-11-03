# Anchor & Roots — Elite NRI Care & Property Stewardship Platform
> *"Rooted in trust. Anchored in care."*

A modern, high-trust, interactive web platform redesigned for **Anchor & Roots** (Hyderabad, India). Built to cater to Non-Resident Indian (NRI) families living in the USA, UK, UAE, Canada, and Australia who need reliable elder care, property watch, and concierge support back home.

---

## 🌟 Key Improvements Over the Original Website

### 1. Visual & Aesthetic Overhaul ("Make it look better")
- **High-Trust Luxury Identity**: Palette of deep heritage emerald (`#071F1A`, `#0D2C25`), warm champagne gold (`#D4A359`), and crisp sand/cream (`#FBF9F5`) tailored to affluent NRI families.
- **Typography**: Editorial serif typography (`Playfair Display` & `Cinzel`) combined with high-legibility geometric sans-serif (`Plus Jakarta Sans`).
- **Authentic Brand Media**: Integrated high-resolution brand photography and video protocol preview directly from the official Anchor & Roots assets.
- **Live Trust Indicators**: 100% Geo-tagged proof badges, background-verified caregivers, milestone escrow protection, and live Hyderabad desk status.

### 2. Rich Interactivity ("Make it interactable")
- 💱 **Live Multi-Currency Switcher**: NRIs can instantly view all service rates and care plans in **INR (₹), USD ($), GBP (£), EUR (€), AED, CAD (CA$), or AUD (A$)**.
- 🎛️ **Interactive Care Plan Cost Calculator**:
  - Sliders for elder wellness visits (2, 4, or 8 visits/month)
  - Selectors for property/plot physical inspections
  - Local errand & paperwork add-ons
  - Medical/hospital escort options
  - Instant dynamic calculation of monthly and annual costs with a 1-click **"Schedule Free Audit for this Plan"** button.
- 📱 **Simulated WhatsApp Proof of Work Phone Viewer**:
  - Interactive smartphone mockup showcasing real-world updates:
    - *Scenario 1: Elder Care Visit & Vitals Log (BP, Sugar, Pulse)*
    - *Scenario 2: Tellapur Plot & Boundary Inspection (GPS Coordinates & Walkthrough)*
    - *Scenario 3: Sub-Registrar Encumbrance Certificate & Festive Gifting*
  - Includes audio voice briefing simulation, certified GPS coordinate tags, and caregiver notes.
- 📍 **Interactive Hyderabad Locality & SLA Checker**:
  - Searchable neighborhood coverage: *Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Tellapur, Kokapet, Kondapur, Begumpet, Secunderabad, etc.*
  - Real-time verification of response times and specialized hubs.
- 🔍 **Interactive Services Explorer & Modals**:
  - Category filters: *All, Elder Care, Property & Land, Errands & Legal, NRI Travel*.
  - Full-scope modal detailing tasks, deliverables, and sample field reports.
- ❓ **Searchable FAQ Accordion**:
  - Real-time search filter for quick answers on caregiver vetting, GPS proof, escrow, and pricing.
- 🗓️ **Free Home & Care Audit Booking Modal**:
  - Step-by-step booking form connected to the leads inbox and WhatsApp concierge.

---

## 🛠️ How to Add & Edit Information ("So I can add information")

You can add, edit, or delete any content on the website through the **Anchor & Roots Admin Studio**:

### Accessing the Admin Panel
1. Click the **"CMS & Admin Studio"** button in the website footer (under *Owner Portal*).
2. Or use the keyboard shortcut: **`Ctrl + Shift + A`** (or **`Cmd + Shift + A`** on Mac).
3. Or navigate to `index.html#admin` in your browser.
4. **Default PIN / Passcode**: Enter **`anchor2026`** to unlock the Admin Studio (you can easily change the PIN or toggle passcode protection on/off under the *Notice & Settings* tab).

### What You Can Manage in the Admin Studio:
- 📝 **Services Manager**: Add new services, edit service titles, badges, descriptions, starting prices, and feature bullet points.
- 💳 **Care Plans Manager**: Update subscription plans, monthly/annual fees, highlight badges (e.g. *MOST CHOSEN*), and what's included.
- 📢 **Notice Banner & Settings**: Enable/disable the top announcement bar, edit phone numbers, WhatsApp link, support email, and Hyderabad office address.
- 💬 **Testimonials**: Add new reviews from NRI families with location, rating, and quote.
- ❓ **FAQs**: Add new questions and answers as prospective clients ask them.
- 📥 **Leads & Free Audit Requests Inbox**:
  - View all client requests submitted through the site forms with date, phone, email, locality, requested service, and message.
  - Track lead status (*New*, *Contacted*, *Audited*, *Converted*).
  - One-click **"Export Leads to CSV"** to download all leads into Excel or Google Sheets.
  - One-click WhatsApp link to immediately chat with the client.
- 💾 **Backup & Restore**:
  - **Export Backup (JSON)**: Download your entire website data as a JSON file.
  - **Restore Backup (JSON)**: Restore or migrate your data across computers anytime.
  - **Reset to Factory Data**: Revert back to defaults if needed.

---

## 🚀 How to Run the Website Locally

### Option A: Zero Install (Direct in Browser)
Simply double-click `index.html` in Finder/File Explorer to open it in Chrome, Safari, Edge, or Firefox. 
*(All edits made in the Admin Studio will be saved directly in your browser's `localStorage`)*.

### Option B: Local Python Server (With Disk Persistence)
To run a local server that automatically writes changes directly to `data.json` on disk:
```bash
python3 server.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 📂 Project Structure
```
├── index.html            # Main website (Hero, Services, Calculator, Simulator, FAQ, Modals)
├── css/
│   └── styles.css        # Luxury color tokens, typography, glassmorphism, animations
├── js/
│   ├── data.js           # Reactive data store with localStorage & server synchronization
│   ├── app.js            # Core interactivity (currency converter, calculator, simulator)
│   └── admin.js          # Built-in CMS studio for adding and editing all information
├── assets/
│   └── images/           # Authentic brand assets & images
│       ├── logo.jpeg
│       ├── elder-care.jpg
│       ├── property-watch.jpg
│       ├── shipping-errands.jpg
│       ├── medical-coordination.jpg
│       ├── personalized-travel.jpg
│       ├── home-events.jpg
│       └── hero-team.jpg
├── data.json             # Persistent content database
├── server.py             # Optional Python server for static serving & /api/data persistence
└── README.md             # Documentation
```

---

## 🌐 Deploying to Production (e.g. `anchorroots.co.in`)
The website is 100% static-ready and can be hosted immediately on:
- **GitHub Pages**: Free, push to a repository and enable Pages.
- **Vercel / Netlify**: Drag-and-drop the project folder to deploy in 10 seconds.
- **Wix / Custom Domain**: Point your custom domain `www.anchorroots.co.in` directly to Netlify/Vercel or embed the modern site.
