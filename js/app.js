/**
 * Anchor & Roots - Main Application Interactivity
 * High-Trust Luxury Experience for NRI Families
 */

class AnchorRootsApp {
  constructor() {
    this.currentCurrency = 'INR';
    this.billingCycle = 'monthly'; // 'monthly' | 'annual'
    this.activeServiceCategory = 'all';
    this.isAudioPlaying = false;
    this.audioElapsed = 0;
    this.audioInterval = null;
    this.audioLengthStr = '0:34';
    this.audioTotalSeconds = 34;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderAll();
    
    // Listen for data changes from admin CMS
    window.addEventListener('siteDataChanged', () => {
      this.renderAll();
    });
  }

  setupEventListeners() {
    // Currency Switcher
    document.querySelectorAll('.currency-selector').forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.currentCurrency = e.target.value;
        this.renderPricing();
        this.renderServices();
        this.updateCalculator();
      });
    });

    // Billing Cycle Toggle (Monthly vs Annual)
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
      billingToggle.addEventListener('change', (e) => {
        this.billingCycle = e.target.checked ? 'annual' : 'monthly';
        this.renderPricing();
      });
    }

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('hidden');
      });
      if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
      }
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
      });
    }

    // Global Modal Backdrop click-to-close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('app-modal-backdrop')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    // Calculator inputs
    const calcInputs = ['calc-elder', 'calc-property', 'calc-errands', 'calc-medical'];
    calcInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateCalculator());
      }
    });

    // Neighborhood search
    const locSearch = document.getElementById('locality-search');
    if (locSearch) {
      locSearch.addEventListener('input', (e) => this.filterLocalities(e.target.value));
    }

    // FAQ search
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', (e) => this.filterFaqs(e.target.value));
    }

    // Contact & Audit Form Submission
    const auditForm = document.getElementById('audit-booking-form');
    if (auditForm) {
      auditForm.addEventListener('submit', (e) => this.handleAuditSubmit(e));
    }

    const contactForm = document.getElementById('quick-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }
  }

  renderAll() {
    this.renderHeaderAndAnnouncement();
    this.renderServices();
    this.renderPricing();
    this.renderLocalities();
    this.renderTestimonials();
    this.renderFaqs();
    this.updateCalculator();
    this.setupReportSimulator();
    if (window.lucide) window.lucide.createIcons();
  }

  // Currency Converter helper
  formatMoney(inrAmount) {
    const rateInfo = window.siteStore.data.settings.currencyRates[this.currentCurrency] || { symbol: '₹', rate: 1 };
    const converted = Math.round(inrAmount * rateInfo.rate);
    return `${rateInfo.symbol}${converted.toLocaleString()}`;
  }

  // --- HEADER & ANNOUNCEMENT ---
  renderHeaderAndAnnouncement() {
    const s = window.siteStore.data.settings;
    const annBar = document.getElementById('announcement-bar');
    const annText = document.getElementById('announcement-text');
    if (annBar && annText) {
      if (s.announcement && s.announcement.enabled && s.announcement.text) {
        annBar.classList.remove('hidden');
        annText.textContent = s.announcement.text;
      } else {
        annBar.classList.add('hidden');
      }
    }

    // Update phone & whatsapp links
    document.querySelectorAll('.app-phone-text').forEach(el => el.textContent = s.phone || '+91 91000 84729');
    document.querySelectorAll('.app-phone-link').forEach(el => el.href = `tel:${(s.phone || '').replace(/\s+/g, '')}`);
    document.querySelectorAll('.app-wa-link').forEach(el => el.href = `https://wa.me/${(s.whatsapp || '919100084729').replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Anchor & Roots, I am an NRI inquiring about care support for my family in Hyderabad.")}`);
    document.querySelectorAll('.app-email-link').forEach(el => {
      el.textContent = s.email || 'hello@anchorroots.co.in';
      el.href = `mailto:${s.email || 'hello@anchorroots.co.in'}`;
    });
    document.querySelectorAll('.app-address-text').forEach(el => el.textContent = s.address || 'Jubilee Hills, Hyderabad, India');
  }

  // --- SERVICES SECTION ---
  renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    let services = window.siteStore.data.services || [];
    if (this.activeServiceCategory !== 'all') {
      services = services.filter(s => s.category === this.activeServiceCategory);
    }

    container.innerHTML = services.map(s => `
      <div class="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs pillar-card flex flex-col justify-between h-full group">
        <div>
          <!-- Service Card Image with Badge & Price Tag -->
          <div class="relative h-48 sm:h-56 lg:h-60 w-full overflow-hidden bg-stone-100">
            <img src="${s.image}" alt="${s.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onerror="this.src='assets/images/hero-team.jpg'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div class="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
              <span class="px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full bg-white/95 text-emerald-900 shadow-xs border border-emerald-100">
                ${s.badge || 'NRI Support'}
              </span>
            </div>
            <div class="absolute bottom-3 left-3.5 right-3.5 sm:left-4 sm:right-4 flex items-end justify-between text-white">
              <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300">Starting from</span>
              <span class="font-serif text-base sm:text-lg font-bold text-white">${this.formatMoney(s.priceINR)} <span class="text-xs font-sans font-normal opacity-90">${s.priceNote || ''}</span></span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col">
            <h3 class="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-950 transition-colors leading-snug mb-2 min-h-[32px]">${s.title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed min-h-[44px] sm:min-h-[48px] mb-4 line-clamp-3">${s.shortDesc}</p>

            <!-- Highlights with Strict Icon Alignment -->
            <ul class="space-y-2 sm:space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700 mb-5 sm:mb-6 flex-1">
              ${(s.features || []).slice(0, 4).map(f => `
                <li class="flex items-start gap-2.5 leading-snug">
                  <svg class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Footer Actions Pinned to Bottom -->
        <div class="mt-auto p-5 sm:p-6 lg:p-7 pt-4 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50/40">
          <button onclick="window.app.openServiceModal('${s.id}')" class="text-xs font-bold text-emerald-900 hover:text-amber-700 flex items-center gap-1.5 transition">
            <span>View Full Scope</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <button onclick="window.app.openAuditModal('${s.title}')" class="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-emerald-950 text-amber-200 hover:bg-emerald-900 transition shadow-xs">
            Book Audit
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  filterServices(category) {
    this.activeServiceCategory = category;
    document.querySelectorAll('.service-filter-btn').forEach(btn => {
      const isMatch = btn.dataset.category === category;
      if (isMatch) {
        btn.classList.add('active', 'bg-emerald-950', 'text-amber-300', 'border-amber-500/50');
        btn.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');
      } else {
        btn.classList.remove('active', 'bg-emerald-950', 'text-amber-300', 'border-amber-500/50');
        btn.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
      }
    });

    const container = document.getElementById('services-grid');
    if (!container) return;

    let services = window.siteStore.data.services || [];
    if (category !== 'all') {
      const catLower = category.toLowerCase();
      services = services.filter(s => {
        const sCat = (s.category || '').toLowerCase();
        if (catLower.includes('elder')) return sCat.includes('elder') || s.id.includes('elder') || s.id.includes('medical');
        if (catLower.includes('property')) return sCat.includes('property') || s.id.includes('property') || s.id.includes('renov');
        if (catLower.includes('shipping') || catLower.includes('legal') || catLower.includes('errand')) return sCat.includes('errand') || s.id.includes('shipping') || s.id.includes('travel');
        return sCat === catLower;
      });
    }

    container.innerHTML = services.map(s => `
      <div class="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs pillar-card flex flex-col justify-between h-full group">
        <div>
          <!-- Service Card Image with Badge & Price Tag -->
          <div class="relative h-48 sm:h-56 lg:h-60 w-full overflow-hidden bg-stone-100">
            <img src="${s.image}" alt="${s.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onerror="this.src='assets/images/hero-team.jpg'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div class="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
              <span class="px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full bg-white/95 text-emerald-900 shadow-xs border border-emerald-100">
                ${s.badge || 'NRI Support'}
              </span>
            </div>
            <div class="absolute bottom-3 left-3.5 right-3.5 sm:left-4 sm:right-4 flex items-end justify-between text-white">
              <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300">Starting from</span>
              <span class="font-serif text-base sm:text-lg font-bold text-white">${this.formatMoney(s.priceINR)} <span class="text-xs font-sans font-normal opacity-90">${s.priceNote || ''}</span></span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col">
            <h3 class="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-950 transition-colors leading-snug mb-2 min-h-[32px]">${s.title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed min-h-[44px] sm:min-h-[48px] mb-4 line-clamp-3">${s.shortDesc}</p>

            <!-- Highlights with Strict Icon Alignment -->
            <ul class="space-y-2 sm:space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700 mb-5 sm:mb-6 flex-1">
              ${(s.features || []).slice(0, 4).map(f => `
                <li class="flex items-start gap-2.5 leading-snug">
                  <svg class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Footer Actions Pinned to Bottom -->
        <div class="mt-auto p-5 sm:p-6 lg:p-7 pt-4 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50/40">
          <button onclick="window.app.openServiceModal('${s.id}')" class="text-xs font-bold text-emerald-900 hover:text-amber-700 flex items-center gap-1.5 transition">
            <span>View Full Scope</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <button onclick="window.app.openAuditModal('${s.title}')" class="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-emerald-950 text-amber-200 hover:bg-emerald-900 transition shadow-xs">
            Book Audit
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  openServiceModal(id) {
    const s = window.siteStore.data.services.find(x => x.id === id);
    if (!s) return;

    const modal = document.getElementById('service-detail-modal');
    if (!modal) return;

    document.getElementById('modal-svc-image').src = s.image;
    document.getElementById('modal-svc-badge').textContent = s.badge || 'NRI Support';
    document.getElementById('modal-svc-title').textContent = s.title;
    document.getElementById('modal-svc-price').textContent = `${this.formatMoney(s.priceINR)} ${s.priceNote || ''}`;
    document.getElementById('modal-svc-desc').textContent = s.shortDesc;

    const featContainer = document.getElementById('modal-svc-features');
    featContainer.innerHTML = (s.features || []).map(f => `
      <li class="flex items-start text-xs sm:text-sm text-stone-700">
        <svg class="w-4 h-4 text-emerald-700 shrink-0 mr-2.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <span>${f}</span>
      </li>
    `).join('');

    // Sample Update box
    const sampleBox = document.getElementById('modal-svc-sample');
    if (s.sampleUpdate) {
      sampleBox.classList.remove('hidden');
      document.getElementById('sample-title').textContent = s.sampleUpdate.title || 'Sample Field Update';
      document.getElementById('sample-tasks').textContent = s.sampleUpdate.tasks || '';
      document.getElementById('sample-note').textContent = s.sampleUpdate.note || '';
    } else {
      sampleBox.classList.add('hidden');
    }

    // Set action button
    document.getElementById('modal-svc-cta').onclick = () => {
      modal.classList.add('hidden');
      this.openAuditModal(s.title);
    };

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // --- CARE PLANS & PRICING ---
  renderPricing() {
    const container = document.getElementById('plans-grid');
    if (!container) return;

    const plans = window.siteStore.data.plans || [];
    const isAnnual = this.billingCycle === 'annual';

    container.innerHTML = plans.map(p => {
      const priceINR = isAnnual ? p.priceINRAnnual : p.priceINRMonthly;
      const formatted = this.formatMoney(priceINR);
      const cycleLabel = isAnnual ? '/ year' : '/ month';

      return `
        <div class="relative bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border ${p.popular ? 'border-amber-500 shadow-xl ring-2 ring-amber-400/30' : 'border-stone-200 shadow-xs'} flex flex-col justify-between h-full hover-lift transition">
          ${p.popular ? `
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider px-3.5 sm:px-4 py-1 rounded-full shadow-md whitespace-nowrap">
              ★ Most Chosen by NRI Families ★
            </div>
          ` : ''}

          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">${p.badge || 'Care Plan'}</span>
              ${isAnnual ? '<span class="text-[11px] font-semibold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">Save 17%</span>' : ''}
            </div>

            <h3 class="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2 min-h-[32px]">${p.name}</h3>
            <p class="text-xs text-stone-600 mb-5 sm:mb-6 min-h-[44px] sm:min-h-[48px] leading-relaxed">${p.description}</p>

            <!-- Price Display with Strict Baseline Alignment -->
            <div class="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <div class="flex items-baseline gap-1.5">
                <span class="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">${formatted}</span>
                <span class="text-xs font-semibold text-stone-500">${cycleLabel}</span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-stone-400 mt-1">Confirmed after complimentary on-site audit</p>
            </div>

            <!-- Features with Strict Icon Alignment -->
            <div class="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
              <p class="text-xs font-bold uppercase tracking-wider text-stone-400">What's Included:</p>
              <ul class="space-y-2 sm:space-y-2.5">
                ${(p.features || []).map(f => `
                  <li class="flex items-start gap-2 text-xs sm:text-sm text-stone-700 leading-snug">
                    <svg class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Bottom CTA Button Locked to Bottom -->
          <button onclick="window.app.openAuditModal('${p.name} (${isAnnual ? 'Annual' : 'Monthly'})')" class="mt-auto w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-2 ${p.popular ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950' : 'bg-emerald-950 hover:bg-emerald-900 text-amber-200'}">
            <span>Schedule Free Audit</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // --- INTERACTIVE COST & PLAN CALCULATOR ---
  setCalculatorPreset(type) {
    const elderInput = document.getElementById('calc-elder');
    const propInput = document.getElementById('calc-property');
    const errandInput = document.getElementById('calc-errands');
    const medInput = document.getElementById('calc-medical');

    if (type === 'elder') {
      if (elderInput) elderInput.value = '4';
      if (propInput) propInput.value = 'none';
      if (errandInput) errandInput.value = '1';
      if (medInput) medInput.value = '1';
    } else if (type === 'property') {
      if (elderInput) elderInput.value = '0';
      if (propInput) propInput.value = 'monthly';
      if (errandInput) errandInput.value = '0';
      if (medInput) medInput.value = '0';
    } else if (type === 'combo') {
      if (elderInput) elderInput.value = '4';
      if (propInput) propInput.value = 'monthly';
      if (errandInput) errandInput.value = '2';
      if (medInput) medInput.value = '1';
    }

    // Highlight active preset button
    document.querySelectorAll('.calc-preset-btn').forEach(btn => {
      if (btn.dataset.preset === type) {
        btn.classList.add('bg-emerald-950', 'text-amber-300', 'border-amber-500', 'shadow-md', 'font-bold');
        btn.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');
      } else {
        btn.classList.remove('bg-emerald-950', 'text-amber-300', 'border-amber-500', 'shadow-md', 'font-bold');
        btn.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
      }
    });

    this.updateCalculator();
  }

  updateCalculator() {
    const elderFreq = parseInt(document.getElementById('calc-elder')?.value || '2', 10);
    const propertyType = document.getElementById('calc-property')?.value || 'monthly';
    const errands = parseInt(document.getElementById('calc-errands')?.value || '1', 10);
    const medical = parseInt(document.getElementById('calc-medical')?.value || '0', 10);

    // Rate calculations in INR
    let elderCost = 0;
    if (elderFreq === 2) elderCost = 4999;
    else if (elderFreq === 4) elderCost = 8999;
    else if (elderFreq === 8) elderCost = 15999;

    let propertyCost = 0;
    if (propertyType === 'biweekly') propertyCost = 3499;
    else if (propertyType === 'monthly') propertyCost = 1999;
    else if (propertyType === 'none') propertyCost = 0;

    let errandCost = errands * 1200;
    let medicalCost = medical * 2499;

    const totalINR = elderCost + propertyCost + errandCost + medicalCost;
    const totalAnnualINR = Math.round(totalINR * 12 * 0.83); // 17% discount for annual

    // Update UI elements
    const monthlyEl = document.getElementById('calc-total-monthly');
    const annualEl = document.getElementById('calc-total-annual');
    const elderValEl = document.getElementById('calc-elder-val');
    const errandsValEl = document.getElementById('calc-errands-val');
    const medicalValEl = document.getElementById('calc-medical-val');

    if (elderValEl) {
      elderValEl.textContent = elderFreq === 0 ? 'No regular visits' : `${elderFreq} visits / month`;
    }
    if (errandsValEl) errandsValEl.textContent = `${errands} errand(s) / mo`;
    if (medicalValEl) medicalValEl.textContent = medical === 0 ? 'As needed' : `${medical} escorted visit(s) / mo`;

    if (monthlyEl) monthlyEl.textContent = this.formatMoney(totalINR);
    if (annualEl) annualEl.textContent = `${this.formatMoney(totalAnnualINR)} / yr`;

    const lockBtn = document.getElementById('calc-lock-in-btn');
    if (lockBtn) {
      lockBtn.onclick = () => {
        const summary = `Custom Plan: ${elderFreq} elder visits/mo, ${propertyType} property inspection, ${errands} errands, ${medical} medical escorts (~${this.formatMoney(totalINR)}/mo)`;
        this.openAuditModal(summary);
      };
    }
  }

  // --- REAL-TIME WHATSAPP / INSPECTION SIMULATOR ---
  setupReportSimulator() {
    const tabs = document.querySelectorAll('.simulator-tab');
    if (!tabs.length) return;

    const scenarios = {
      elder: {
        time: 'Today 11:42 AM',
        title: 'Elder Care & Vitals Check-in',
        location: 'Road 12, Banjara Hills, Hyderabad',
        vitals: { bp: '124 / 82 mmHg', sugar: '112 mg/dL', pulse: '74 bpm', spo2: '98%' },
        photo: 'assets/images/elder-care.jpg',
        photoCaption: 'Auntie enjoying morning tea after vitals check and BP medicine replenishment.',
        message: 'Namaste Srinivas garu, we completed our wellness visit. Auntie took her 10 AM medicines. Apollo pharmacy delivered her 30-day supply. Dr. Reddy cardio review is confirmed for next Tuesday.',
        audioLength: '0:34'
      },
      property: {
        time: 'Yesterday 3:15 PM',
        title: 'Plot & Boundary Encroachment Audit',
        location: 'Sector 4, Tellapur (17.4839° N, 78.2912° E)',
        vitals: { perimeter: '100% Secure', encroachment: 'Zero / Clear', noticeBoard: 'Intact', weeds: 'Cleared' },
        photo: 'assets/images/property-watch.jpg',
        photoCaption: 'Verified boundary wall & geo-tag coordinates. North-facing gate secured with master padlock.',
        message: 'Hello Aditya, physical inspection for Plot #42 completed. GPS timestamp logged. GHMC property tax receipt collected from municipal office. 4K walkthrough video uploaded to your drive.',
        audioLength: '0:48'
      },
      errand: {
        time: 'Monday 2:30 PM',
        title: 'Encumbrance Certificate & Festive Gifting',
        location: 'Gandipet Sub-Registrar & Jubilee Hills',
        vitals: { status: 'EC Collected', period: '30 Years Clean', dispatch: 'DHL Express', courierNo: 'HYD-9942-US' },
        photo: 'assets/images/shipping-errands.jpg',
        photoCaption: 'Sealed 30-year Encumbrance Certificate collected from Sub-Registrar with verified stamp.',
        message: 'Hi Karthik, certified copy of your title deed search is stamped and ready. Hand-delivered Diwali sweets from G. Pulla Reddy to your parents in Somajiguda.',
        audioLength: '0:22'
      }
    };

    const updateSimulator = (key) => {
      const data = scenarios[key];
      if (!data) return;

      const timeEl = document.getElementById('sim-time');
      if (timeEl) timeEl.textContent = data.time;
      const titleEl = document.getElementById('sim-title');
      if (titleEl) titleEl.textContent = data.title;
      const locEl = document.getElementById('sim-location');
      if (locEl) locEl.textContent = data.location;
      const photoEl = document.getElementById('sim-photo');
      if (photoEl) photoEl.src = data.photo;
      const captionEl = document.getElementById('sim-photo-caption');
      if (captionEl) captionEl.textContent = data.photoCaption;
      const msgEl = document.getElementById('sim-message');
      if (msgEl) msgEl.textContent = data.message;
      const audioLenEl = document.getElementById('sim-audio-len');
      if (audioLenEl) audioLenEl.textContent = data.audioLength;

      this.resetAudioBriefing(data.audioLength);

      const vitalsContainer = document.getElementById('sim-vitals-grid');
      if (vitalsContainer) {
        vitalsContainer.innerHTML = Object.entries(data.vitals).map(([k, v]) => `
          <div class="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-2 text-center">
            <div class="text-[10px] uppercase font-bold text-emerald-400/80">${k}</div>
            <div class="text-xs font-bold text-white">${v}</div>
          </div>
        `).join('');
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-emerald-950', 'text-amber-300', 'border-amber-500/50');
          t.classList.add('bg-stone-800', 'text-stone-300', 'border-transparent');
        });
        tab.classList.add('bg-emerald-950', 'text-amber-300', 'border-amber-500/50');
        tab.classList.remove('bg-stone-800', 'text-stone-300', 'border-transparent');
        updateSimulator(tab.dataset.scenario);
      });
    });

    // Initial load
    updateSimulator('elder');
  }

  // --- PLAYABLE AUDIO BRIEFING SIMULATION ---
  resetAudioBriefing(lengthStr = '0:34') {
    if (this.audioInterval) {
      clearInterval(this.audioInterval);
      this.audioInterval = null;
    }
    this.isAudioPlaying = false;
    this.audioElapsed = 0;
    this.audioLengthStr = lengthStr;
    const parts = lengthStr.split(':');
    this.audioTotalSeconds = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 34);

    const timer = document.getElementById('sim-audio-timer');
    if (timer) timer.textContent = `0:00 / ${this.audioLengthStr}`;

    const bar = document.getElementById('sim-audio-bar');
    if (bar) bar.style.width = '0%';

    const playBtn = document.getElementById('sim-audio-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i>';
    }

    const waves = document.getElementById('sim-audio-waves');
    if (waves) waves.classList.remove('audio-wave-playing');

    if (window.lucide) window.lucide.createIcons();
  }

  toggleAudioBriefing() {
    if (!this.audioTotalSeconds) {
      this.resetAudioBriefing(this.audioLengthStr || '0:34');
    }

    const timer = document.getElementById('sim-audio-timer');
    const bar = document.getElementById('sim-audio-bar');
    const playBtn = document.getElementById('sim-audio-play-btn');
    const waves = document.getElementById('sim-audio-waves');

    if (this.isAudioPlaying) {
      clearInterval(this.audioInterval);
      this.audioInterval = null;
      this.isAudioPlaying = false;
      if (waves) waves.classList.remove('audio-wave-playing');
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i>';
      }
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.isAudioPlaying = true;
      if (waves) waves.classList.add('audio-wave-playing');
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i>';
      }
      if (window.lucide) window.lucide.createIcons();

      this.audioInterval = setInterval(() => {
        this.audioElapsed = (this.audioElapsed || 0) + 0.5;
        if (this.audioElapsed >= this.audioTotalSeconds) {
          this.resetAudioBriefing(this.audioLengthStr);
          this.showToast('Voice memo playback completed.');
          return;
        }

        const pct = Math.min(100, (this.audioElapsed / this.audioTotalSeconds) * 100);
        if (bar) bar.style.width = `${pct}%`;

        const curM = Math.floor(this.audioElapsed / 60);
        const curS = Math.floor(this.audioElapsed % 60).toString().padStart(2, '0');
        if (timer) timer.textContent = `${curM}:${curS} / ${this.audioLengthStr}`;
      }, 500);
    }
  }

  // --- PLAN COMPARISON MATRIX MODAL ---
  openPlanComparisonModal() {
    const modal = document.getElementById('plan-comparison-modal');
    const container = document.getElementById('plan-comparison-table-container');
    if (!modal || !container) return;

    const plans = window.siteStore.data.plans || [];
    const isAnnual = this.billingCycle === 'annual';

    const matrixFeatures = [
      {
        title: "Dedicated Relationship Manager",
        tooltip: "Personal single point of contact on Hyderabad ground",
        getVal: (p) => p.id === 'care-basic' ? 'Standard Support' : '✓ Dedicated RM'
      },
      {
        title: "Physical Home Wellness Visits",
        tooltip: "In-person visit with vitals & safety check",
        getVal: (p) => {
          if (p.id === 'care-basic') return '2 Visits / month';
          if (p.id === 'care-plus') return '4 Visits / mo (Weekly)';
          if (p.id === 'property-watch') return '— (Property Only)';
          if (p.id === 'family-shield') return '4 Visits / mo (Weekly)';
          return '2 Visits / month';
        }
      },
      {
        title: "Doctor & Hospital Visit Escorts",
        tooltip: "Coordinator accompanies parent to appointment",
        getVal: (p) => {
          if (p.id === 'care-basic') return 'Optional Add-on';
          if (p.id === 'care-plus') return '✓ Included (Unlimited)';
          if (p.id === 'property-watch') return '—';
          if (p.id === 'family-shield') return '✓ Priority Included';
          return '—';
        }
      },
      {
        title: "Prescription Medicine Compliance",
        tooltip: "Apollo pharmacy restock delivered to home doorstep",
        getVal: (p) => (p.id === 'property-watch' ? '—' : '✓ Apollo Doorstep')
      },
      {
        title: "Property & Plot Geo-Tagged Watch",
        tooltip: "High-definition photos, 4K walkthrough, boundary check",
        getVal: (p) => {
          if (p.id === 'property-watch') return '✓ Monthly 4K Geo-Tag';
          if (p.id === 'family-shield') return '✓ Monthly 4K Geo-Tag';
          return 'Add-on ₹2,499/mo';
        }
      },
      {
        title: "Government, Tax & Legal Paperwork",
        tooltip: "GHMC, Sub-registrar, EC, Bank KYC",
        getVal: (p) => {
          if (p.id === 'family-shield') return '✓ Priority Concierge';
          if (p.id === 'property-watch') return '✓ Tax & Bill Liaison';
          return 'On Request';
        }
      },
      {
        title: "24/7 Emergency Dispatch SLA",
        tooltip: "Ambulance coordination and hospital admission escort",
        getVal: (p) => {
          if (p.id === 'family-shield' || p.id === 'care-plus') return '✓ Priority (< 30 min)';
          if (p.id === 'property-watch') return '✓ Security Emergency';
          return '✓ Standard (< 60 min)';
        }
      },
      {
        title: "WhatsApp Video & Photo Logs",
        tooltip: "Time-stamped proof sent directly to NRI family group",
        getVal: () => '✓ Time-Stamped Proof'
      },
      {
        title: "Pre-India Trip Home Deep Cleaning",
        tooltip: "Spotless sanitization before you land in Hyderabad",
        getVal: (p) => (p.id === 'family-shield' ? '✓ Complimentary' : 'Optional Add-on')
      }
    ];

    container.innerHTML = `
      <table class="w-full text-left border-collapse min-w-[680px]">
        <thead>
          <tr class="border-b border-stone-200">
            <th class="p-3 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-50/70 w-1/4">Feature / SLA</th>
            ${plans.map(p => `
              <th class="p-3 text-center ${p.popular ? 'bg-amber-50/60 border-x-2 border-amber-400/40' : 'bg-stone-50/70'} w-[18%]">
                <span class="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${p.popular ? 'bg-amber-500 text-stone-950 font-black' : 'bg-emerald-100 text-emerald-900'} mb-1">
                  ${p.badge || 'Plan'}
                </span>
                <div class="font-serif font-bold text-sm text-stone-900">${p.name}</div>
                <div class="mt-1">
                  <span class="font-serif text-base font-black text-emerald-950">
                    ${this.formatMoney(isAnnual ? p.priceINRAnnual : p.priceINRMonthly)}
                  </span>
                  <span class="text-[10px] text-stone-500 font-normal">${isAnnual ? '/ yr' : '/ mo'}</span>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          ${matrixFeatures.map(feat => `
            <tr class="hover:bg-stone-50/50 transition">
              <td class="p-3 font-semibold text-stone-800 text-xs">
                ${feat.title}
                <div class="text-[10px] text-stone-400 font-normal">${feat.tooltip}</div>
              </td>
              ${plans.map(p => {
                const val = feat.getVal(p);
                const isCheck = val.includes('✓');
                const isDash = val === '—';
                return `
                  <td class="p-3 text-center text-xs ${p.popular ? 'bg-amber-50/30 border-x-2 border-amber-400/30' : ''}">
                    <span class="${isCheck ? 'font-bold text-emerald-800' : isDash ? 'text-stone-300' : 'text-stone-600 font-medium'}">
                      ${val}
                    </span>
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
          <tr class="border-t-2 border-stone-200 bg-stone-50/50">
            <td class="p-3 font-bold text-stone-700 text-xs">Recommended Action</td>
            ${plans.map(p => `
              <td class="p-3 text-center ${p.popular ? 'bg-amber-50/50 border-x-2 border-amber-400/40' : ''}">
                <button onclick="window.app.closePlanComparisonModal(); window.app.openAuditModal('${p.name}')" class="w-full py-2 px-2.5 rounded-lg text-xs font-bold transition shadow-2xs ${p.popular ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 hover:brightness-105' : 'bg-emerald-950 text-amber-200 hover:bg-emerald-900'}">
                  Select Plan
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  closePlanComparisonModal() {
    const modal = document.getElementById('plan-comparison-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // --- 1-TAP COPY HELPER ---
  copyText(text, label = 'Information') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`✓ ${label} copied to clipboard!`);
      }).catch(() => {
        this.fallbackCopy(text, label);
      });
    } else {
      this.fallbackCopy(text, label);
    }
  }

  fallbackCopy(text, label) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      this.showToast(`✓ ${label} copied to clipboard!`);
    } catch (err) {
      this.showToast(`Copied: ${text}`);
    }
    document.body.removeChild(el);
  }

  // --- LOCALITY COVERAGE CHECKER ---
  renderLocalities() {
    const list = window.siteStore.data.localities || [];
    const container = document.getElementById('localities-container');
    if (!container) return;

    container.innerHTML = list.map(loc => `
      <div class="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between shadow-sm hover:border-emerald-700/50 transition">
        <div>
          <div class="font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>${loc.name}</span>
          </div>
          <div class="text-[11px] text-stone-500 mt-0.5">${loc.highlight}</div>
        </div>
        <div class="text-right shrink-0 pl-2">
          <span class="inline-block px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-md border border-emerald-100">${loc.status}</span>
          <div class="text-[10px] text-stone-400 mt-0.5">SLA: ${loc.sla}</div>
        </div>
      </div>
    `).join('');
  }

  filterLocalities(query) {
    const term = query.toLowerCase().trim();
    const list = window.siteStore.data.localities || [];
    const filtered = list.filter(l => l.name.toLowerCase().includes(term) || l.highlight.toLowerCase().includes(term));
    const container = document.getElementById('localities-container');

    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900">
            <strong>"${query}" not found in primary list?</strong> We often extend to neighboring areas of Hyderabad & Rangareddy. 
            <button onclick="window.app.openAuditModal('Coverage request for: ' + '${query}')" class="underline font-bold ml-1">Request audit for ${query} →</button>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(loc => `
          <div class="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <div class="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>${loc.name}</span>
              </div>
              <div class="text-[11px] text-stone-500 mt-0.5">${loc.highlight}</div>
            </div>
            <div class="text-right shrink-0 pl-2">
              <span class="inline-block px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-md">${loc.status}</span>
              <div class="text-[10px] text-stone-400 mt-0.5">SLA: ${loc.sla}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --- TESTIMONIALS ---
  renderTestimonials() {
    const list = window.siteStore.data.testimonials || [];
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = list.map(t => `
      <div class="bg-stone-900 border border-stone-800 rounded-3xl p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition h-full">
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex text-amber-400 text-sm tracking-widest">★★★★★</div>
            <span class="text-xs text-stone-500 font-mono">${t.date || ''}</span>
          </div>
          <p class="text-sm text-stone-300 leading-relaxed italic mb-6 min-h-[72px]">"${t.quote}"</p>
        </div>

        <div class="pt-4 border-t border-stone-800/80 flex items-center gap-3 mt-auto">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold font-serif text-sm shrink-0">
            ${t.name ? t.name[0] : 'N'}
          </div>
          <div>
            <div class="font-bold text-white text-sm">${t.name}</div>
            <div class="text-xs text-amber-300/80">${t.location} · <span class="text-stone-400">${t.service}</span></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- FAQS ---
  renderFaqs() {
    const faqs = window.siteStore.data.faqs || [];
    const container = document.getElementById('faqs-container');
    if (!container) return;

    container.innerHTML = faqs.map((f, i) => `
      <details class="group bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-200">
        <summary class="p-5 font-serif font-bold text-base sm:text-lg text-stone-900 cursor-pointer flex items-center justify-between select-none">
          <span class="flex items-center gap-3">
            <span class="text-xs font-sans font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${f.category || 'FAQ'}</span>
            <span>${f.question}</span>
          </span>
          <svg class="accordion-icon w-5 h-5 text-stone-400 group-hover:text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
          ${f.answer}
        </div>
      </details>
    `).join('');
  }

  filterFaqs(term) {
    const q = term.toLowerCase().trim();
    const faqs = window.siteStore.data.faqs || [];
    const container = document.getElementById('faqs-container');
    if (!container) return;

    const filtered = faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q)));
    
    if (filtered.length === 0) {
      container.innerHTML = `<div class="p-6 text-center text-sm text-stone-500 bg-white rounded-2xl border">No answers found matching "${term}". Please contact our care coordinator directly.</div>`;
    } else {
      container.innerHTML = filtered.map(f => `
        <details open class="group bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <summary class="p-5 font-serif font-bold text-base text-stone-900 cursor-pointer flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="text-xs font-sans font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${f.category || 'FAQ'}</span>
              <span>${f.question}</span>
            </span>
            <svg class="accordion-icon w-5 h-5 text-stone-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </summary>
          <div class="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">${f.answer}</div>
        </details>
      `).join('');
    }
  }

  // --- FREE AUDIT & BOOKING MODAL ---
  openAuditModal(presetService = '') {
    const modal = document.getElementById('audit-modal');
    if (!modal) return;

    const svcSelect = document.getElementById('audit-service-select');
    if (svcSelect && presetService) {
      // If matches option or set custom
      let matched = false;
      for (let opt of svcSelect.options) {
        if (opt.value.toLowerCase().includes(presetService.toLowerCase()) || presetService.toLowerCase().includes(opt.value.toLowerCase())) {
          opt.selected = true;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const customOpt = document.createElement('option');
        customOpt.value = presetService;
        customOpt.textContent = presetService;
        customOpt.selected = true;
        svcSelect.appendChild(customOpt);
      }
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeAuditModal() {
    const modal = document.getElementById('audit-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  handleAuditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const locality = form.querySelector('[name="locality"]')?.value || '';
    const service = form.querySelector('[name="service"]')?.value || 'Free Home Audit';
    const message = form.querySelector('[name="message"]')?.value || '';

    // Save lead in site store
    const newLead = window.siteStore.addLead({
      name,
      phone,
      email,
      locality,
      service,
      message
    });

    // Update leads badge in admin panel if open
    const badge = document.getElementById('leads-count-badge');
    if (badge) badge.textContent = window.siteStore.data.leads.length;

    // Show celebration state in modal
    const modalBody = document.getElementById('audit-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="text-center py-8 px-4 space-y-4">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
          <h3 class="font-serif text-2xl font-bold text-stone-900">Audit Request Received!</h3>
          <p class="text-sm text-stone-600 max-w-md mx-auto">
            Thank you, <strong>${name}</strong>. Our Hyderabad Relationship Manager will contact you via WhatsApp / Phone at <strong>${phone}</strong> within 12 hours.
          </p>

          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-sm mx-auto text-xs text-stone-700">
            <strong>Need immediate assistance?</strong> Connect with our senior coordinator directly on WhatsApp right now.
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href="https://wa.me/919100084729?text=${encodeURIComponent(`Hi Anchor & Roots, I submitted an audit request for ${name} (${service}) in ${locality}.`)}" target="_blank" class="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              <span>Continue on WhatsApp</span>
            </a>
            <button onclick="window.app.closeAuditModal()" class="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition">
              Close
            </button>
          </div>
        </div>
      `;
    }

    this.showToast('Audit request submitted successfully!');
  }

  handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    window.siteStore.addLead({
      name,
      phone,
      email,
      locality: 'Direct Inquiry',
      service: 'General Inquiry',
      message
    });

    form.reset();
    this.showToast('Thank you! Your message has been sent to our care desk.');
  }

  toggleHeroVideo() {
    const video = document.getElementById('hero-video-player');
    const img = document.getElementById('hero-img-preview');
    const playBtn = document.getElementById('hero-play-video-btn');
    const bubble = document.getElementById('hero-floating-bubble');
    const label = document.getElementById('hero-video-label');

    if (!video) return;

    if (video.classList.contains('hidden')) {
      img.classList.add('hidden');
      if (bubble) bubble.classList.add('hidden');
      if (playBtn) playBtn.classList.add('hidden');
      video.classList.remove('hidden');
      video.play().catch(e => console.log('Autoplay check', e));
      if (label) label.textContent = 'Pause Video Protocol';
    } else {
      if (video.paused) {
        video.play();
        if (label) label.textContent = 'Pause Video Protocol';
      } else {
        video.pause();
        if (label) label.textContent = 'Play Video Protocol';
      }
    }
    if (window.lucide) window.lucide.createIcons();
  }

  showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global helper for toast
window.showAppToast = function(msg) {
  if (window.app) window.app.showToast(msg);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AnchorRootsApp();
});
