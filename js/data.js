// Initial Anchor & Roots Data store
const DEFAULT_SITE_DATA = {
  settings: {
    brandName: "Anchor & Roots",
    tagline: "Rooted in trust. Anchored in care.",
    subheading: "Dedicated elder care, property stewardship & on-ground concierge in Hyderabad for NRI families worldwide.",
    phone: "+91 91000 84729",
    whatsapp: "+919100084729",
    email: "hello@anchorroots.co.in",
    address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
    adminPin: "anchor2026",
    pinProtected: true,
    announcement: {
      enabled: true,
      text: "🌱 Welcoming new NRI families in Hyderabad — Schedule a Complimentary In-Person Care & Property Audit for Q1 2026."
    },
    currencyRates: {
      INR: { symbol: "₹", rate: 1, name: "INR (₹)" },
      USD: { symbol: "$", rate: 0.012, name: "USD ($)" },
      GBP: { symbol: "£", rate: 0.0095, name: "GBP (£)" },
      EUR: { symbol: "€", rate: 0.011, name: "EUR (€)" },
      AED: { symbol: "AED ", rate: 0.044, name: "AED (د.إ)" },
      CAD: { symbol: "CA$", rate: 0.016, name: "CAD ($)" },
      AUD: { symbol: "A$", rate: 0.018, name: "AUD ($)" }
    }
  },
  services: [
    {
      id: "elder-care",
      title: "Elder Care & Companionship",
      badge: "Core Specialty",
      category: "elder-care",
      priceINR: 4999,
      priceNote: "per month (from)",
      shortDesc: "Regular wellness visits, doctor visit escorts, medication management, and compassionate companionship for aging parents in Hyderabad.",
      image: "assets/images/elder-care.jpg",
      features: [
        "Bi-weekly or weekly scheduled home visits by background-verified caregivers",
        "Vitals recording: Blood Pressure, Sugar, Pulse & O2 level logged",
        "Escorted doctor appointments at Apollo, Yashoda, AIG, KIMS & CARE",
        "Doorstep prescription refill and grocery restocking",
        "24/7 Emergency response liaison and hospital admission coordination",
        "Post-visit time-stamped photo and caregiver voice note via WhatsApp"
      ],
      sampleUpdate: {
        title: "Visit Report: Mrs. & Mr. Rao (Banjara Hills)",
        vitals: "BP: 122/82 mmHg | Sugar: 114 mg/dL | Pulse: 72 bpm",
        tasks: "Escorted to Dr. Reddy at Apollo (cardiology follow-up). 30-day BP prescriptions delivered from Apollo Pharmacy. Pantry restocked with fresh fruits.",
        note: "Auntie was in great spirits today! We reviewed her evening walk routine."
      }
    },
    {
      id: "property-watch",
      title: "Property & Land Watch",
      badge: "High Demand",
      category: "property",
      priceINR: 15000,
      priceNote: "per year (from)",
      shortDesc: "Physical, geo-tagged audits of vacant plots, villas, and apartments across Hyderabad to prevent encroachments and verify upkeep.",
      image: "assets/images/property-watch.jpg",
      features: [
        "Monthly scheduled physical inspection by certified field supervisors",
        "GPS geo-tagged high-res photos and 360° video walkthrough",
        "Boundary wall, fencing, and anti-encroachment status check",
        "GHMC property tax, water bill, and electricity meter verification",
        "Post-monsoon dampness, roof leakage, and pest infestation inspection",
        "Secure key holding and authorized contractor supervision"
      ],
      sampleUpdate: {
        title: "Quarterly Audit: Plot #42, Tellapur",
        coordinates: "17.4839° N, 78.2912° E (Geo-Confirmed)",
        tasks: "Boundary wall inspection completed. Notice board intact. Cleared minor weed growth along western perimeter. Zero encroachment detected.",
        note: "4K video walkthrough uploaded to family portal drive."
      }
    },
    {
      id: "shipping-errands",
      title: "Shipping, Legal & Local Errands",
      badge: "On Demand",
      category: "errands",
      priceINR: 1499,
      priceNote: "per errand / milestone",
      shortDesc: "Handling official paperwork, bank submissions, Sub-Registrar coordination, shopping, and international courier needs.",
      image: "assets/images/shipping-errands.jpg",
      features: [
        "Sub-Registrar office coordination and Dharani/revenue record follow-ups",
        "Bank document submissions, pension verification & notarization assistance",
        "Procurement of authentic local sweets, textiles & festive hampers",
        "Doorstep pickup and international express courier (DHL/FedEx) to USA/UK/UAE",
        "Transparent itemized billing with original GST receipts attached"
      ],
      sampleUpdate: {
        title: "Errand: Encumbrance Certificate & Gifting",
        tasks: "Collected EC from Gandipet Sub-Registrar. Picked up Diwali sweets from G. Pulla Reddy. Dispatched via DHL Express (Tracking #HYD-9942).",
        note: "Original receipt and sealed certificate handed over."
      }
    },
    {
      id: "medical-coordination",
      title: "Medical Coordination & Escort",
      badge: "Dedicated Escort",
      category: "elder-care",
      priceINR: 2499,
      priceNote: "per hospital visit",
      shortDesc: "A reliable healthcare advocate by your parents' side for complex consultations, routine check-ups, and diagnostic tests.",
      image: "assets/images/medical-coordination.jpg",
      features: [
        "Pre-booking appointments with top super-specialists across Hyderabad",
        "Door-to-door escort in sanitized vehicle with wheelchair assistance",
        "Clear notes taken during doctor consultation and shared with family abroad",
        "Medical records, lab reports, and imaging digitized onto cloud storage",
        "Second opinion facilitation with reputed medical boards"
      ],
      sampleUpdate: {
        title: "Medical Escort: AIG Hospitals Gachibowli",
        tasks: "Escorted uncle for routine echocardiogram. Dr. Kumar confirmed normal recovery. Digitized lab results to Google Drive folder.",
        note: "Next follow-up scheduled in 6 months."
      }
    },
    {
      id: "personalized-travel",
      title: "Personalized Travel & Home Readiness",
      badge: "NRI Travel Concierge",
      category: "concierge",
      priceINR: 3999,
      priceNote: "per trip arrangement",
      shortDesc: "Step into a spotlessly clean, fully stocked, air-conditioned home upon landing in Hyderabad, with private airport transit.",
      image: "assets/images/personalized-travel.jpg",
      features: [
        "Deep home sanitization, dusting, and AC servicing before your arrival",
        "Refrigerator stocked with fresh dairy, drinking water, and your requested favorites",
        "Chauffeured airport pickup and drop-off at Rajiv Gandhi International Airport (RGIA)",
        "Local SIM card, Wi-Fi router check, and vehicle rental assistance",
        "Custom family itinerary planning across Hyderabad, Tirupati, and Vijayawada"
      ],
      sampleUpdate: {
        title: "Arrival Prep: Jubilee Hills Apartment",
        tasks: "Deep cleaning completed. AC units serviced. RO water filter verified. Pantry stocked with Heritage milk, fruits, and snacks. Driver assigned for 2:15 AM RGIA arrival.",
        note: "Keys deposited in secure smart lock box."
      }
    },
    {
      id: "home-events",
      title: "Renovations, Repairs & Family Events",
      badge: "Milestone Escrow",
      category: "property",
      priceINR: 4999,
      priceNote: "milestone supervision",
      shortDesc: "Professional supervision for home repairs, painting, plumbing, and family celebrations with zero vendor exploitation.",
      image: "assets/images/home-events.jpg",
      features: [
        "Vetted carpenters, electricians, plumbers, and painting contractors",
        "Milestone-based sign-offs: You review video proof before contractor gets paid",
        "Home renovation, modular kitchen, and interior upkeep monitoring",
        "Organization of anniversary, 60th/70th birthday, and puja ceremonies",
        "Photography, catering, and flower decoration oversight"
      ],
      sampleUpdate: {
        title: "Renovation Stage 2: Painting & Waterproofing",
        tasks: "Terrace waterproofing primer applied. Living room Asian Paints Royale coat 1 finished. Photo proof verified with customer sign-off.",
        note: "Payment released for Milestone 2 only after your approval."
      }
    }
  ],
  plans: [
    {
      id: "care-basic",
      name: "Care Basic",
      badge: "Essential Peace of Mind",
      priceINRMonthly: 4999,
      priceINRAnnual: 49990,
      description: "Ideal for active, independent parents who benefit from regular check-ins, medicine management, and an emergency liaison in Hyderabad.",
      popular: false,
      features: [
        "2 Comprehensive in-person wellness visits per month",
        "Weekly reassuring check-in phone calls",
        "Vital signs tracking: Blood Pressure, Sugar, Pulse",
        "Prescription medicines refilled and delivered to doorstep",
        "24/7 Emergency response & hospital admission escort",
        "Time-stamped photo updates after each visit",
        "Dedicated Family WhatsApp group"
      ]
    },
    {
      id: "care-plus",
      name: "Care Plus",
      badge: "MOST CHOSEN BY NRIs",
      priceINRMonthly: 9999,
      priceINRAnnual: 99990,
      description: "Our premier care package for aging parents requiring frequent companionship, doctor visit escorts, and complete errand relief.",
      popular: true,
      features: [
        "Weekly dedicated home wellness visits (4 visits/month)",
        "Escorted doctor visits & specialist appointments",
        "Doorstep grocery & essentials restocking",
        "Complete vitals logging & medication schedule compliance",
        "Dedicated Relationship Manager assigned to your family",
        "Priority emergency response & ambulance liaison",
        "Time-stamped photo & video reports after every visit",
        "Monthly family health digest sent to your email"
      ]
    },
    {
      id: "property-watch",
      name: "Property & Land Watch",
      badge: "ASSET PROTECTION",
      priceINRMonthly: 2499,
      priceINRAnnual: 24990,
      description: "Designed for NRI homeowners with vacant apartments, gated community villas, or open residential/commercial plots in Hyderabad.",
      popular: false,
      features: [
        "Monthly physical on-site inspection by field team",
        "High-definition geo-tagged photos and 4K video walkthrough",
        "Perimeter, boundary wall & anti-encroachment verification",
        "GHMC property tax, electricity & water bill payment tracking",
        "Monsoon leak, dampness & structural inspection",
        "Authorized key holding & emergency maintenance liaison",
        "Instant WhatsApp alert if any boundary issue detected"
      ]
    },
    {
      id: "family-shield",
      name: "Estate & Family Shield",
      badge: "ALL-IN-ONE ELITE",
      priceINRMonthly: 14999,
      priceINRAnnual: 149990,
      description: "The ultimate comprehensive package combining full weekly Elder Care, monthly Property Watch, and priority errand concierge.",
      popular: false,
      features: [
        "Everything in Care Plus (4 Elder wellness visits + doctor escorts)",
        "Everything in Property Watch (Monthly inspection + geo-tagged proof)",
        "Priority concierge for banking, legal & government paperwork",
        "Complimentary Home Deep Cleaning prior to your India trip",
        "1-on-1 Monthly Video Review with Relationship Director",
        "Dedicated on-ground emergency response team"
      ]
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Srinivas & Rekha V.",
      location: "San Jose, California (Bay Area)",
      service: "Elder Care & Medical Escort",
      rating: 5,
      quote: "Living 9,000 miles away in Silicon Valley, our biggest anxiety was my 78-year-old mother living alone in Banjara Hills. Anchor & Roots is the greatest blessing. Their coordinator escorting her to Apollo and sending us photos and doctor notes within an hour gave us incredible peace of mind.",
      date: "October 2026"
    },
    {
      id: "t2",
      name: "Aditya Rao",
      location: "London, United Kingdom",
      service: "Property Watch & Plot Protection",
      rating: 5,
      quote: "I have two residential plots in Tellapur and Mokila. Hearing horror stories of encroachments kept me on edge. Anchor & Roots sends geo-tagged, timestamped 4K video surveys every month. Transparent, accountable, and thoroughly professional.",
      date: "September 2026"
    },
    {
      id: "t3",
      name: "Dr. Prerna & Karthik M.",
      location: "Dubai, UAE",
      service: "Care Plus & Home Readiness",
      rating: 5,
      quote: "When we flew into Hyderabad for our annual Diwali visit, our house in Jubilee Hills was impeccably clean, ACs humming, and fridge stocked with all our favorites. Even better: my in-laws feel so genuinely loved and respected by their caregiver. Truly rooted in trust.",
      date: "November 2026"
    }
  ],
  faqs: [
    {
      category: "Elder Care",
      question: "How are your caregivers and relationship managers vetted?",
      answer: "Every team member undergoes strict background screening including government ID verification, criminal record checks, reference validation from previous employers, and hands-on geriatric sensitivity and emergency training. We never send unverified personnel to your family's home."
    },
    {
      category: "Property Watch",
      question: "What is 'Geo-Tagged Proof' and how does it prevent property disputes?",
      answer: "Our field inspectors use calibrated GPS cameras that embed unalterable cryptographic time stamps, exact latitude/longitude coordinates, and elevation into each photo and video. This proves beyond doubt that our team physically inspected your boundary on that exact day and hour."
    },
    {
      category: "Billing & Trust",
      question: "How do milestone payments and invoicing work?",
      answer: "For ongoing care plans, we bill monthly or annually in advance via secure international payment methods (Credit Card, Wire, UPI, Stripe). For custom projects (repairs, events, legal errands), money is kept in milestone escrow: contractors are only paid after you view and sign off on photographic proof."
    },
    {
      category: "Coverage",
      question: "Which areas of Hyderabad and Secunderabad do you cover?",
      answer: "We currently serve Jubilee Hills, Banjara Hills, Gachibowli, Hitec City, Madhapur, Kondapur, Manikonda, Kokapet, Tellapur, Nallagandla, Financial District, Begumpet, Somajiguda, Secunderabad, Sainikpuri, Kukatpally, and Miyapur. If your family is located in another area of Telangana, let us know and we will verify coverage."
    },
    {
      category: "Getting Started",
      question: "How soon can services begin after we contact you?",
      answer: "Within 24 hours of receiving your request, our Relationship Director conducts a video consultation with you. We then arrange a complimentary in-person home audit in Hyderabad. Once you approve the care plan, services can commence immediately or within 48 hours."
    }
  ],
  localities: [
    { name: "Banjara Hills", status: "Full Coverage", sla: "< 1 Hour", highlight: "Dedicated Hub" },
    { name: "Jubilee Hills", status: "Full Coverage", sla: "< 1 Hour", highlight: "Dedicated Hub" },
    { name: "Gachibowli", status: "Full Coverage", sla: "< 1.5 Hours", highlight: "High Priority" },
    { name: "Hitec City / Madhapur", status: "Full Coverage", sla: "< 1.5 Hours", highlight: "High Priority" },
    { name: "Kondapur & Nallagandla", status: "Full Coverage", sla: "< 2 Hours", highlight: "Full Coverage" },
    { name: "Tellapur & Kokapet", status: "Full Coverage", sla: "< 2 Hours", highlight: "Plot & Villa Watch" },
    { name: "Manikonda & Puppalguda", status: "Full Coverage", sla: "< 2 Hours", highlight: "Full Coverage" },
    { name: "Financial District", status: "Full Coverage", sla: "< 2 Hours", highlight: "Full Coverage" },
    { name: "Begumpet & Somajiguda", status: "Full Coverage", sla: "< 2 Hours", highlight: "Full Coverage" },
    { name: "Secunderabad & Sainikpuri", status: "Full Coverage", sla: "< 2.5 Hours", highlight: "Full Coverage" },
    { name: "Kukatpally & Miyapur", status: "Full Coverage", sla: "< 2.5 Hours", highlight: "Full Coverage" }
  ],
  leads: []
};

// Store helper to manage localStorage & fallback
class SiteStore {
  constructor() {
    this.STORAGE_KEY = 'anchor_roots_data_v1';
    this.data = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure defaults if any new keys are missing
        return Object.assign({}, DEFAULT_SITE_DATA, parsed);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using default", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    // Also try posting to local python server if running
    this.syncToServer();
    // Dispatch event so all components re-render immediately
    window.dispatchEvent(new CustomEvent('siteDataChanged', { detail: this.data }));
  }

  async syncToServer() {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      });
    } catch (e) {
      // Server may not be running (e.g. running statically), which is totally fine
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    this.save();
  }

  addLead(lead) {
    if (!this.data.leads) this.data.leads = [];
    lead.id = 'lead_' + Date.now();
    lead.timestamp = new Date().toISOString();
    lead.status = 'New';
    this.data.leads.unshift(lead);
    this.save();
    return lead;
  }
}

window.siteStore = new SiteStore();
