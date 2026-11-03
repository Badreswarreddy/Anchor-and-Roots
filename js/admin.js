/**
 * Anchor & Roots - Content Management & Admin Panel (CMS)
 * Enables the site owner to add, edit, and manage:
 * - Services & Pricing
 * - Care Plans
 * - Notice / Announcement Banner
 * - Contact Details & Settings
 * - Testimonials & Family Reviews
 * - FAQs
 * - Client Leads & Inquiry Inbox with CSV export
 * - Backup & Restore (JSON)
 */

class AdminManager {
  constructor() {
    this.isOpen = false;
    this.activeTab = 'services';
    this.init();
  }

  init() {
    this.injectAdminModal();
    this.bindEvents();
    
    // Check if URL has #admin
    if (window.location.hash === '#admin') {
      this.open();
    }
  }

  bindEvents() {
    // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Listen for custom open events
    window.addEventListener('openAdminPanel', () => this.open());
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    const settings = window.siteStore.data.settings;
    if (settings.pinProtected && sessionStorage.getItem('ar_admin_auth') !== 'true') {
      this.promptPin();
      return;
    }
    this.isOpen = true;
    const modal = document.getElementById('admin-modal-container');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.renderCurrentTab();
    }
  }

  promptPin() {
    const existing = document.getElementById('admin-pin-dialog');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'admin-pin-dialog';
    dialog.className = 'fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    dialog.innerHTML = `
      <div class="bg-stone-900 border border-amber-600/40 rounded-2xl p-6 max-w-sm w-full text-stone-100 shadow-2xl space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            <i data-lucide="lock" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-serif font-bold text-lg text-amber-200">Owner CMS Access</h3>
            <p class="text-xs text-stone-400">Enter Admin PIN to unlock</p>
          </div>
        </div>

        <form id="admin-pin-form" class="space-y-3">
          <input type="password" id="admin-pin-input" autofocus placeholder="Enter PIN (Default: anchor2026)" class="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-center text-sm tracking-widest text-white outline-none focus:border-amber-400" />
          <div id="admin-pin-err" class="text-xs text-rose-400 hidden text-center">Incorrect PIN. Please try again.</div>
          <div class="flex items-center justify-end space-x-2 pt-2">
            <button type="button" id="admin-pin-cancel" class="px-3.5 py-2 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 text-xs bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold rounded-xl shadow-md">Unlock CMS</button>
          </div>
          <p class="text-[10px] text-stone-500 text-center pt-1">Default PIN: <code class="text-amber-300">anchor2026</code> (changeable in Settings)</p>
        </form>
      </div>
    `;

    document.body.appendChild(dialog);
    if (window.lucide) window.lucide.createIcons();

    const pinInput = document.getElementById('admin-pin-input');
    pinInput.focus();

    document.getElementById('admin-pin-cancel').onclick = () => dialog.remove();
    dialog.onclick = (e) => { if (e.target === dialog) dialog.remove(); };

    document.getElementById('admin-pin-form').onsubmit = (e) => {
      e.preventDefault();
      const entered = pinInput.value.trim();
      const expected = window.siteStore.data.settings.adminPin || 'anchor2026';
      if (entered === expected) {
        sessionStorage.setItem('ar_admin_auth', 'true');
        dialog.remove();
        this.open();
        this.showToast('Admin Studio unlocked!');
      } else {
        const err = document.getElementById('admin-pin-err');
        err.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
      }
    };
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('admin-modal-container');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (window.location.hash === '#admin') {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }

  switchTab(tab) {
    this.activeTab = tab;
    // update tab button styles on both desktop and mobile
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      if (btn.dataset.tab === tab) {
        btn.classList.add('bg-emerald-900', 'text-amber-300', 'font-semibold');
        btn.classList.remove('text-stone-300', 'hover:bg-emerald-950');
      } else {
        btn.classList.remove('bg-emerald-900', 'text-amber-300', 'font-semibold');
        btn.classList.add('text-stone-300', 'hover:bg-emerald-950');
      }
    });
    this.renderCurrentTab();
  }

  updateKPIBadges() {
    const svcs = (window.siteStore.data.services || []).length;
    const plans = (window.siteStore.data.plans || []).length;
    const leads = (window.siteStore.data.leads || []).length;

    document.querySelectorAll('.svc-count-badge').forEach(el => el.textContent = svcs);
    document.querySelectorAll('.plans-count-badge').forEach(el => el.textContent = plans);
    document.querySelectorAll('.leads-count-badge').forEach(el => el.textContent = leads);
    document.querySelectorAll('.header-kpi-services').forEach(el => el.textContent = svcs);
    document.querySelectorAll('.header-kpi-plans').forEach(el => el.textContent = plans);
    document.querySelectorAll('.header-kpi-leads').forEach(el => el.textContent = leads);
  }

  injectAdminModal() {
    if (document.getElementById('admin-modal-container')) return;

    const div = document.createElement('div');
    div.id = 'admin-modal-container';
    div.className = 'fixed inset-0 z-[100] hidden flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md';
    div.innerHTML = `
      <div class="bg-stone-900 border border-amber-600/30 rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        <!-- Admin Executive Header & Status Strip -->
        <div class="px-4 sm:px-6 py-3.5 bg-emerald-950/90 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="font-serif text-base sm:text-lg font-bold text-amber-200">Anchor & Roots OS Studio</h2>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                    🟢 Live Synced
                  </span>
                </div>
                <p class="text-[11px] text-stone-400 hidden sm:block">Executive Content Management & Real-Time Client Lead CRM</p>
              </div>
            </div>
            <!-- Mobile Close Button -->
            <button id="admin-close-btn-mobile" class="sm:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-emerald-900/60 transition">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Quick KPIs & Actions -->
          <div class="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
            <div class="hidden lg:flex items-center gap-2 text-[11px] text-stone-300 bg-stone-950/60 px-3 py-1.5 rounded-xl border border-stone-800">
              <span>Services: <strong class="text-amber-300 header-kpi-services">${window.siteStore.data.services.length}</strong></span>
              <span class="text-stone-600">|</span>
              <span>Plans: <strong class="text-amber-300 header-kpi-plans">${window.siteStore.data.plans.length}</strong></span>
              <span class="text-stone-600">|</span>
              <span>Leads: <strong class="text-emerald-400 header-kpi-leads">${window.siteStore.data.leads ? window.siteStore.data.leads.length : 0}</strong></span>
            </div>

            <div class="flex items-center space-x-1.5">
              <button id="admin-export-btn" class="px-2.5 sm:px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 flex items-center gap-1.5 transition">
                <i data-lucide="download" class="w-3.5 h-3.5 text-amber-400"></i> <span class="hidden sm:inline">Export</span> Backup
              </button>
              <label class="px-2.5 sm:px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 cursor-pointer flex items-center gap-1.5 transition">
                <i data-lucide="upload" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="hidden sm:inline">Restore</span> Backup
                <input type="file" id="admin-import-file" class="hidden" accept=".json" />
              </label>
              <button id="admin-close-btn" class="hidden sm:flex p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-emerald-900/60 transition ml-1">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Horizontal Tab Bar (< md) -->
        <div class="flex md:hidden overflow-x-auto p-2 bg-stone-950 border-b border-stone-800 gap-1.5 scrollbar-none shrink-0">
          <button data-tab="services" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition bg-emerald-900 text-amber-300 font-semibold shrink-0">
            <i data-lucide="layers" class="w-3.5 h-3.5"></i> Services (<span class="svc-count-badge">${window.siteStore.data.services.length}</span>)
          </button>
          <button data-tab="plans" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition text-stone-300 hover:bg-emerald-950 shrink-0">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Plans (<span class="plans-count-badge">${window.siteStore.data.plans.length}</span>)
          </button>
          <button data-tab="leads" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition text-stone-300 hover:bg-emerald-950 shrink-0">
            <i data-lucide="inbox" class="w-3.5 h-3.5"></i> Leads (<span class="leads-count-badge">${window.siteStore.data.leads ? window.siteStore.data.leads.length : 0}</span>)
          </button>
          <button data-tab="testimonials" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition text-stone-300 hover:bg-emerald-950 shrink-0">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i> Reviews
          </button>
          <button data-tab="faqs" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition text-stone-300 hover:bg-emerald-950 shrink-0">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> FAQs
          </button>
          <button data-tab="settings" class="admin-nav-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition text-stone-300 hover:bg-emerald-950 shrink-0">
            <i data-lucide="settings" class="w-3.5 h-3.5"></i> Settings
          </button>
        </div>

        <!-- Body Layout -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Desktop Sidebar Nav (>= md) -->
          <div class="hidden md:flex w-60 bg-stone-950/90 border-r border-stone-800 p-3 flex-col space-y-1 shrink-0">
            <button data-tab="services" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between transition bg-emerald-900 text-amber-300 font-semibold">
              <div class="flex items-center gap-2.5"><i data-lucide="layers" class="w-4 h-4"></i> Services</div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-amber-200 svc-count-badge">${window.siteStore.data.services.length}</span>
            </button>
            <button data-tab="plans" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between transition text-stone-300 hover:bg-emerald-950">
              <div class="flex items-center gap-2.5"><i data-lucide="shield-check" class="w-4 h-4"></i> Care Plans</div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-stone-900 text-stone-300 plans-count-badge">${window.siteStore.data.plans.length}</span>
            </button>
            <button data-tab="leads" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between transition text-stone-300 hover:bg-emerald-950">
              <div class="flex items-center gap-2.5"><i data-lucide="inbox" class="w-4 h-4"></i> Leads & Audits</div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold leads-count-badge">${window.siteStore.data.leads ? window.siteStore.data.leads.length : 0}</span>
            </button>
            <button data-tab="testimonials" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between transition text-stone-300 hover:bg-emerald-950">
              <div class="flex items-center gap-2.5"><i data-lucide="message-square" class="w-4 h-4"></i> Testimonials</div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-stone-900 text-stone-300">${window.siteStore.data.testimonials.length}</span>
            </button>
            <button data-tab="faqs" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between transition text-stone-300 hover:bg-emerald-950">
              <div class="flex items-center gap-2.5"><i data-lucide="help-circle" class="w-4 h-4"></i> FAQs</div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-stone-900 text-stone-300">${window.siteStore.data.faqs.length}</span>
            </button>
            <button data-tab="settings" class="admin-nav-btn w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition text-stone-300 hover:bg-emerald-950">
              <i data-lucide="settings" class="w-4 h-4"></i> Notice & Settings
            </button>

            <div class="pt-4 mt-auto border-t border-stone-800">
              <button id="admin-reset-btn" class="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition flex items-center gap-2">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset to Defaults
              </button>
            </div>
          </div>

          <!-- Main Content Area -->
          <div id="admin-tab-content" class="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-900/60">
            <!-- Dynamic Content -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    // Event listeners
    const closeAdmin = () => this.close();
    const closeBtn = document.getElementById('admin-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeAdmin);
    const closeBtnMobile = document.getElementById('admin-close-btn-mobile');
    if (closeBtnMobile) closeBtnMobile.addEventListener('click', closeAdmin);

    div.addEventListener('click', (e) => {
      if (e.target === div) this.close();
    });

    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    document.getElementById('admin-reset-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data back to original defaults? This will erase custom additions.')) {
        window.siteStore.resetToDefaults();
        this.updateKPIBadges();
        this.renderCurrentTab();
        this.showToast('Reset to default data successfully!');
      }
    });

    // Export Backup JSON
    document.getElementById('admin-export-btn').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.siteStore.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `anchor_roots_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast('Backup JSON downloaded!');
    });

    // Restore Backup JSON
    document.getElementById('admin-import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.services && imported.plans) {
            window.siteStore.data = imported;
            window.siteStore.save();
            this.updateKPIBadges();
            this.renderCurrentTab();
            this.showToast('Data imported and restored successfully!');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Could not parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  showToast(msg) {
    if (window.showAppToast) {
      window.showAppToast(msg);
    } else {
      alert(msg);
    }
  }

  renderCurrentTab() {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    switch (this.activeTab) {
      case 'services':
        this.renderServicesTab(container);
        break;
      case 'plans':
        this.renderPlansTab(container);
        break;
      case 'leads':
        this.renderLeadsTab(container);
        break;
      case 'testimonials':
        this.renderTestimonialsTab(container);
        break;
      case 'faqs':
        this.renderFaqsTab(container);
        break;
      case 'settings':
        this.renderSettingsTab(container);
        break;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- SERVICES TAB ---
  renderServicesTab(container) {
    const services = window.siteStore.data.services || [];
    container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold text-amber-200">Manage Services</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${services.length} Total</span>
          </div>
          <p class="text-xs text-stone-400">Add new NRI services, update descriptions, features, and starting rates.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="admin-svc-search" placeholder="Search services..." class="bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none w-44 sm:w-56" />
          </div>
          <button id="add-service-btn" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition shrink-0">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Service
          </button>
        </div>
      </div>

      <div id="admin-services-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Rendered by renderServicesList -->
      </div>
    `;

    const renderServicesList = (list) => {
      const grid = document.getElementById('admin-services-grid');
      if (!grid) return;
      if (!list.length) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12 bg-stone-950 border border-stone-800 rounded-2xl">
            <i data-lucide="layers" class="w-8 h-8 text-stone-600 mx-auto mb-2"></i>
            <p class="text-stone-300 text-sm">No services found matching search query.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      grid.innerHTML = list.map((s) => `
        <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-600/40 transition">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 text-xs rounded-full bg-emerald-900/80 text-emerald-300 font-medium">${s.badge || 'Service'}</span>
              <span class="text-xs font-semibold text-amber-400">₹${Number(s.priceINR).toLocaleString('en-IN')} <span class="text-stone-400 font-normal">${s.priceNote || ''}</span></span>
            </div>
            <h4 class="font-bold text-white text-base mb-1">${s.title}</h4>
            <p class="text-xs text-stone-400 line-clamp-2 mb-3">${s.shortDesc}</p>
            <div class="text-[11px] text-stone-500 mb-2">${s.features ? s.features.length : 0} feature bullet points · Category: <span class="text-stone-300 uppercase">${s.category || 'all'}</span></div>
          </div>
          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800/80">
            <button onclick="window.adminManager.editService('${s.id}')" class="px-3 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg flex items-center gap-1 transition">
              <i data-lucide="edit" class="w-3.5 h-3.5"></i> Edit
            </button>
            <button onclick="window.adminManager.deleteService('${s.id}')" class="px-3 py-1 text-xs bg-stone-800 hover:bg-rose-950 text-rose-300 rounded-lg flex items-center gap-1 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    renderServicesList(services);

    const searchInput = document.getElementById('admin-svc-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = services.filter(s => 
          (s.title || '').toLowerCase().includes(q) || 
          (s.shortDesc || '').toLowerCase().includes(q) || 
          (s.category || '').toLowerCase().includes(q) ||
          (s.badge || '').toLowerCase().includes(q)
        );
        renderServicesList(filtered);
      });
    }

    document.getElementById('add-service-btn').addEventListener('click', () => this.showServiceModal());
  }

  showServiceModal(service = null) {
    const isEdit = !!service;
    const s = service || {
      id: 'service_' + Date.now(),
      title: '',
      badge: 'Specialized',
      category: 'elder-care',
      priceINR: 4999,
      priceNote: 'per month',
      shortDesc: '',
      image: 'assets/images/elder-care.jpg',
      features: ['24/7 dedicated support', 'Photo & video proof of work', 'Vetted local personnel'],
      sampleUpdate: {
        title: 'Inspection or Visit Report',
        tasks: 'Check-in completed successfully.',
        note: 'Everything is in order.'
      }
    };

    const modal = document.createElement('div');
    modal.id = 'service-edit-modal';
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-stone-900 border border-amber-600/40 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 text-stone-100 shadow-2xl">
        <div class="flex items-center justify-between pb-3.5 border-b border-stone-800 mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-base sm:text-lg font-bold text-amber-200">${isEdit ? 'Edit Service' : 'Add New Service'}</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Live Visual Editor</span>
          </div>
          <button id="close-service-modal" class="text-stone-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Form Section (7 cols) -->
          <form id="service-form" class="lg:col-span-7 space-y-3.5 text-xs sm:text-sm">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-stone-400 mb-1">Service Title *</label>
                <input type="text" id="svc-title" value="${s.title}" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="e.g. Physiotherapy & Home Nursing" />
              </div>
              <div>
                <label class="block text-stone-400 mb-1">Badge Tag</label>
                <input type="text" id="svc-badge" value="${s.badge || ''}" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="e.g. New Special" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label class="block text-stone-400 mb-1">Category</label>
                <select id="svc-cat" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none">
                  <option value="elder-care" ${s.category === 'elder-care' ? 'selected' : ''}>Elder Care</option>
                  <option value="property" ${s.category === 'property' ? 'selected' : ''}>Property Watch</option>
                  <option value="errands" ${s.category === 'errands' ? 'selected' : ''}>Errands & Legal</option>
                  <option value="concierge" ${s.category === 'concierge' ? 'selected' : ''}>Travel / Concierge</option>
                </select>
              </div>
              <div>
                <label class="block text-stone-400 mb-1">Price (₹ INR) *</label>
                <input type="number" id="svc-price" value="${s.priceINR}" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label class="block text-stone-400 mb-1">Price Note</label>
                <input type="text" id="svc-pricenote" value="${s.priceNote || ''}" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="e.g. per month" />
              </div>
            </div>

            <div>
              <label class="block text-stone-400 mb-1">Short Summary / Description *</label>
              <textarea id="svc-desc" rows="2" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none">${s.shortDesc || ''}</textarea>
            </div>

            <div>
              <label class="block text-stone-400 mb-1">Image URL or Local Asset Path</label>
              <input type="text" id="svc-image" value="${s.image || ''}" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="assets/images/elder-care.jpg" />
            </div>

            <div>
              <label class="block text-stone-400 mb-1">Feature Bullet Points (one per line)</label>
              <textarea id="svc-features" rows="3" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none font-mono text-xs">${(s.features || []).join('\n')}</textarea>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
              <button type="button" id="cancel-service-modal" class="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg">Save Service</button>
            </div>
          </form>

          <!-- Live Card Preview (5 cols) -->
          <div class="lg:col-span-5 bg-stone-950/80 border border-stone-800 p-4 rounded-2xl sticky top-2 space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Live Card Preview
              </span>
              <span class="text-[10px] text-stone-500">Live Client View</span>
            </div>

            <!-- Preview Card -->
            <div class="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md text-stone-900">
              <div class="relative h-32 w-full overflow-hidden bg-stone-100">
                <img id="svc-prev-img" src="${s.image}" alt="Preview" class="w-full h-full object-cover" onerror="this.src='assets/images/hero-team.jpg'" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute top-2.5 left-2.5">
                  <span id="svc-prev-badge" class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/95 text-emerald-900 shadow-2xs border border-emerald-100">
                    ${s.badge || 'NRI Support'}
                  </span>
                </div>
                <div class="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between text-white">
                  <span class="text-[9px] font-semibold uppercase tracking-wider text-amber-300">Starting from</span>
                  <span class="font-serif text-sm font-bold"><span id="svc-prev-price">₹${Number(s.priceINR).toLocaleString('en-IN')}</span> <span id="svc-prev-pricenote" class="text-[10px] font-sans font-normal opacity-90">${s.priceNote || ''}</span></span>
                </div>
              </div>
              <div class="p-3">
                <h4 id="svc-prev-title" class="font-serif text-sm font-bold text-stone-900 mb-1 leading-snug">${s.title || 'Service Title'}</h4>
                <p id="svc-prev-desc" class="text-[11px] text-stone-600 line-clamp-2 mb-2 leading-relaxed">${s.shortDesc || 'Short description...'}</p>
                <div class="p-1.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between text-[10px] font-bold text-emerald-900">
                  <span>Full Scope →</span>
                  <span class="px-2 py-0.5 rounded bg-emerald-950 text-amber-200">Book Audit</span>
                </div>
              </div>
            </div>
            <p class="text-[10px] text-stone-500 italic text-center">Card updates in real-time as you type.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    // Wire live preview typing
    const titleInput = document.getElementById('svc-title');
    const badgeInput = document.getElementById('svc-badge');
    const priceInput = document.getElementById('svc-price');
    const priceNoteInput = document.getElementById('svc-pricenote');
    const descInput = document.getElementById('svc-desc');
    const imgInput = document.getElementById('svc-image');

    const updatePreview = () => {
      const prevTitle = document.getElementById('svc-prev-title');
      if (prevTitle) prevTitle.textContent = titleInput.value || 'Service Title';
      const prevBadge = document.getElementById('svc-prev-badge');
      if (prevBadge) prevBadge.textContent = badgeInput.value || 'NRI Support';
      const prevPrice = document.getElementById('svc-prev-price');
      if (prevPrice) prevPrice.textContent = '₹' + Number(priceInput.value || 0).toLocaleString('en-IN');
      const prevPriceNote = document.getElementById('svc-prev-pricenote');
      if (prevPriceNote) prevPriceNote.textContent = priceNoteInput.value;
      const prevDesc = document.getElementById('svc-prev-desc');
      if (prevDesc) prevDesc.textContent = descInput.value || 'Short description...';
      const prevImg = document.getElementById('svc-prev-img');
      if (prevImg && imgInput.value) prevImg.src = imgInput.value;
    };

    [titleInput, badgeInput, priceInput, priceNoteInput, descInput, imgInput].forEach(inp => {
      if (inp) inp.addEventListener('input', updatePreview);
    });

    const closeModal = () => modal.remove();
    document.getElementById('close-service-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-service-modal').addEventListener('click', closeModal);

    document.getElementById('service-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        id: s.id,
        title: titleInput.value.trim(),
        badge: badgeInput.value.trim(),
        category: document.getElementById('svc-cat').value,
        priceINR: Number(priceInput.value),
        priceNote: priceNoteInput.value.trim(),
        shortDesc: descInput.value.trim(),
        image: imgInput.value.trim() || 'assets/images/elder-care.jpg',
        features: document.getElementById('svc-features').value.split('\n').map(x => x.trim()).filter(Boolean),
        sampleUpdate: s.sampleUpdate || { title: 'Update', tasks: 'Completed' }
      };

      if (isEdit) {
        const idx = window.siteStore.data.services.findIndex(x => x.id === s.id);
        if (idx !== -1) window.siteStore.data.services[idx] = updated;
      } else {
        window.siteStore.data.services.push(updated);
      }

      window.siteStore.save();
      this.updateKPIBadges();
      closeModal();
      this.renderCurrentTab();
      this.showToast('Service saved successfully!');
    });
  }

  editService(id) {
    const s = window.siteStore.data.services.find(x => x.id === id);
    if (s) this.showServiceModal(s);
  }

  deleteService(id) {
    if (confirm('Delete this service?')) {
      window.siteStore.data.services = window.siteStore.data.services.filter(x => x.id !== id);
      window.siteStore.save();
      this.updateKPIBadges();
      this.renderCurrentTab();
      this.showToast('Service deleted.');
    }
  }

  // --- PLANS TAB ---
  renderPlansTab(container) {
    const plans = window.siteStore.data.plans || [];
    container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold text-amber-200">Manage Care Plans</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${plans.length} Total</span>
          </div>
          <p class="text-xs text-stone-400">Configure subscription packages, monthly/annual rates, and SLA highlights.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="admin-plan-search" placeholder="Search plans..." class="bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none w-44 sm:w-56" />
          </div>
          <button id="add-plan-btn" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition shrink-0">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Plan
          </button>
        </div>
      </div>

      <div id="admin-plans-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Rendered dynamically -->
      </div>
    `;

    const renderPlansList = (list) => {
      const grid = document.getElementById('admin-plans-grid');
      if (!grid) return;
      if (!list.length) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12 bg-stone-950 border border-stone-800 rounded-2xl">
            <i data-lucide="shield-check" class="w-8 h-8 text-stone-600 mx-auto mb-2"></i>
            <p class="text-stone-300 text-sm">No care plans match search query.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      grid.innerHTML = list.map(p => `
        <div class="bg-stone-950 border ${p.popular ? 'border-amber-500/70' : 'border-stone-800'} rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/80 transition">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 text-xs rounded-full ${p.popular ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'}">${p.badge || 'Plan'}</span>
              ${p.popular ? '<span class="text-[11px] text-amber-400 font-semibold">★ Featured Choice</span>' : ''}
            </div>
            <h4 class="font-bold text-white text-lg mb-1">${p.name}</h4>
            <p class="text-xs text-stone-400 mb-3">${p.description}</p>
            <div class="flex items-baseline gap-3 mb-3 text-sm">
              <div><span class="text-amber-300 font-bold">₹${Number(p.priceINRMonthly).toLocaleString('en-IN')}</span> <span class="text-stone-400 text-xs">/mo</span></div>
              <div><span class="text-stone-300 font-semibold">₹${Number(p.priceINRAnnual).toLocaleString('en-IN')}</span> <span class="text-stone-400 text-xs">/yr</span></div>
            </div>
            <ul class="text-xs text-stone-400 space-y-1 mb-3">
              ${(p.features || []).slice(0, 3).map(f => `<li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> ${f}</li>`).join('')}
              ${p.features && p.features.length > 3 ? `<li class="text-[11px] text-stone-500 italic">+${p.features.length - 3} more included services</li>` : ''}
            </ul>
          </div>
          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800">
            <button onclick="window.adminManager.editPlan('${p.id}')" class="px-3 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg flex items-center gap-1">
              <i data-lucide="edit" class="w-3.5 h-3.5"></i> Edit
            </button>
            <button onclick="window.adminManager.deletePlan('${p.id}')" class="px-3 py-1 text-xs bg-stone-800 hover:bg-rose-950 text-rose-300 rounded-lg flex items-center gap-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    renderPlansList(plans);

    const searchInput = document.getElementById('admin-plan-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = plans.filter(p => 
          (p.name || '').toLowerCase().includes(q) || 
          (p.description || '').toLowerCase().includes(q) || 
          (p.badge || '').toLowerCase().includes(q)
        );
        renderPlansList(filtered);
      });
    }

    document.getElementById('add-plan-btn').addEventListener('click', () => this.showPlanModal());
  }

  showPlanModal(plan = null) {
    const isEdit = !!plan;
    const p = plan || {
      id: 'plan_' + Date.now(),
      name: '',
      badge: 'Comprehensive',
      priceINRMonthly: 7999,
      priceINRAnnual: 79990,
      description: '',
      popular: false,
      features: ['Regular scheduled visits', 'Emergency response', 'Photo updates via WhatsApp']
    };

    const modal = document.createElement('div');
    modal.id = 'plan-edit-modal';
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-stone-900 border border-amber-600/40 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 text-stone-100 shadow-2xl">
        <div class="flex items-center justify-between pb-3.5 border-b border-stone-800 mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-base sm:text-lg font-bold text-amber-200">${isEdit ? 'Edit Care Plan' : 'Add New Care Plan'}</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Visual Plan Editor</span>
          </div>
          <button id="close-plan-modal" class="text-stone-400 hover:text-white p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Form Section (7 cols) -->
          <form id="plan-form" class="lg:col-span-7 space-y-3.5 text-xs sm:text-sm">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-stone-400 mb-1">Plan Name *</label>
                <input type="text" id="pl-name" value="${p.name}" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="e.g. Care Premium" />
              </div>
              <div>
                <label class="block text-stone-400 mb-1">Badge Tag</label>
                <input type="text" id="pl-badge" value="${p.badge || ''}" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" placeholder="e.g. MOST CHOSEN" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-stone-400 mb-1">Monthly Price (₹ INR) *</label>
                <input type="number" id="pl-monthly" value="${p.priceINRMonthly}" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label class="block text-stone-400 mb-1">Annual Price (₹ INR) *</label>
                <input type="number" id="pl-annual" value="${p.priceINRAnnual}" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-stone-400 mb-1">Description *</label>
              <textarea id="pl-desc" rows="2" required class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none">${p.description || ''}</textarea>
            </div>

            <div class="flex items-center space-x-2 pt-1">
              <input type="checkbox" id="pl-popular" ${p.popular ? 'checked' : ''} class="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500" />
              <label for="pl-popular" class="text-stone-300 font-medium cursor-pointer">Highlight this plan as "Most Chosen by NRI Families"</label>
            </div>

            <div>
              <label class="block text-stone-400 mb-1">Included Features (one item per line)</label>
              <textarea id="pl-features" rows="4" class="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 outline-none font-mono text-xs">${(p.features || []).join('\n')}</textarea>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
              <button type="button" id="cancel-plan-modal" class="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg">Save Plan</button>
            </div>
          </form>

          <!-- Live Card Preview (5 cols) -->
          <div class="lg:col-span-5 bg-stone-950/80 border border-stone-800 p-4 rounded-2xl sticky top-2 space-y-3">
            <div class="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Live Plan Preview
              </span>
              <span class="text-[10px] text-stone-500">Live Client View</span>
            </div>

            <!-- Preview Card -->
            <div id="plan-prev-card" class="relative bg-white rounded-2xl p-4 border ${p.popular ? 'border-amber-500 shadow-md ring-2 ring-amber-400/30' : 'border-stone-200 shadow-xs'} text-stone-900">
              <div id="plan-prev-popular-tag" class="${p.popular ? '' : 'hidden'} text-center mb-2">
                <span class="bg-amber-600 text-stone-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  ★ Most Chosen ★
                </span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span id="plan-prev-badge" class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${p.badge || 'Care Plan'}</span>
              </div>
              <h4 id="plan-prev-name" class="font-serif text-base font-bold text-stone-900 mb-1">${p.name || 'Plan Name'}</h4>
              <p id="plan-prev-desc" class="text-xs text-stone-600 mb-3 line-clamp-2">${p.description || 'Plan description...'}</p>
              <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-100 mb-3 flex items-baseline justify-between">
                <div>
                  <span id="plan-prev-price" class="font-serif text-lg font-bold text-emerald-950">₹${Number(p.priceINRMonthly).toLocaleString('en-IN')}</span>
                  <span class="text-[10px] text-stone-500 font-medium">/ month</span>
                </div>
                <span class="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded">Annual discount</span>
              </div>
              <div id="plan-prev-features-count" class="text-[11px] text-stone-500 italic mb-3">
                ${(p.features || []).length} features included
              </div>
              <div class="w-full py-2 rounded-lg bg-emerald-950 text-amber-200 text-xs font-bold text-center">
                Schedule Free Audit
              </div>
            </div>
            <p class="text-[10px] text-stone-500 italic text-center">Updates dynamically as you edit rates and perks.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    // Wire live preview typing
    const nameInput = document.getElementById('pl-name');
    const badgeInput = document.getElementById('pl-badge');
    const monthlyInput = document.getElementById('pl-monthly');
    const annualInput = document.getElementById('pl-annual');
    const descInput = document.getElementById('pl-desc');
    const popularInput = document.getElementById('pl-popular');
    const featInput = document.getElementById('pl-features');

    const updatePlanPreview = () => {
      const prevName = document.getElementById('plan-prev-name');
      if (prevName) prevName.textContent = nameInput.value || 'Plan Name';
      const prevBadge = document.getElementById('plan-prev-badge');
      if (prevBadge) prevBadge.textContent = badgeInput.value || 'Care Plan';
      const prevPrice = document.getElementById('plan-prev-price');
      if (prevPrice) prevPrice.textContent = '₹' + Number(monthlyInput.value || 0).toLocaleString('en-IN');
      const prevDesc = document.getElementById('plan-prev-desc');
      if (prevDesc) prevDesc.textContent = descInput.value || 'Plan description...';
      const popTag = document.getElementById('plan-prev-popular-tag');
      if (popTag) {
        if (popularInput.checked) popTag.classList.remove('hidden');
        else popTag.classList.add('hidden');
      }
      const featCount = document.getElementById('plan-prev-features-count');
      if (featCount) {
        const count = featInput.value.split('\n').filter(x => x.trim()).length;
        featCount.textContent = `${count} features included`;
      }
    };

    [nameInput, badgeInput, monthlyInput, annualInput, descInput, popularInput, featInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', updatePlanPreview);
        inp.addEventListener('change', updatePlanPreview);
      }
    });

    const closeModal = () => modal.remove();
    document.getElementById('close-plan-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-plan-modal').addEventListener('click', closeModal);

    document.getElementById('plan-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        id: p.id,
        name: nameInput.value.trim(),
        badge: badgeInput.value.trim(),
        priceINRMonthly: Number(monthlyInput.value),
        priceINRAnnual: Number(annualInput.value),
        description: descInput.value.trim(),
        popular: popularInput.checked,
        features: featInput.value.split('\n').map(x => x.trim()).filter(Boolean)
      };

      if (isEdit) {
        const idx = window.siteStore.data.plans.findIndex(x => x.id === p.id);
        if (idx !== -1) window.siteStore.data.plans[idx] = updated;
      } else {
        window.siteStore.data.plans.push(updated);
      }

      window.siteStore.save();
      this.updateKPIBadges();
      closeModal();
      this.renderCurrentTab();
      this.showToast('Care Plan saved!');
    });
  }

  editPlan(id) {
    const p = window.siteStore.data.plans.find(x => x.id === id);
    if (p) this.showPlanModal(p);
  }

  deletePlan(id) {
    if (confirm('Delete this care plan?')) {
      window.siteStore.data.plans = window.siteStore.data.plans.filter(x => x.id !== id);
      window.siteStore.save();
      this.updateKPIBadges();
      this.renderCurrentTab();
      this.showToast('Plan deleted.');
    }
  }

  // --- LEADS & AUDITS INBOX TAB ---
  renderLeadsTab(container) {
    const leads = window.siteStore.data.leads || [];
    this.currentLeadFilter = this.currentLeadFilter || 'all';
    this.currentLeadSearch = this.currentLeadSearch || '';

    container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold text-amber-200">Leads & Audits Inbox</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${leads.length} Total</span>
          </div>
          <p class="text-xs text-stone-400">All submissions from the website contact and booking forms are stored here.</p>
        </div>
        <div class="flex items-center space-x-2">
          <button id="export-leads-csv" class="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export CSV
          </button>
          <button id="clear-leads-btn" class="px-3 py-1.5 bg-stone-800 hover:bg-rose-950 text-rose-300 rounded-lg text-xs flex items-center gap-1">
            <i data-lucide="trash" class="w-3.5 h-3.5"></i> Clear All
          </button>
        </div>
      </div>

      <!-- Instant Search & Status Filter Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 p-2 bg-stone-950 border border-stone-800 rounded-xl">
        <div class="relative flex-1">
          <i data-lucide="search" class="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="admin-lead-search" value="${this.currentLeadSearch}" placeholder="Search leads by name, phone, email, or locality..." class="w-full bg-transparent pl-8 pr-3 py-1 text-xs text-white placeholder-stone-500 outline-none" />
        </div>
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0 shrink-0 text-xs">
          <button class="lead-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentLeadFilter === 'all' ? 'bg-emerald-900 text-amber-300' : 'text-stone-400 hover:text-white'}" data-status="all">All (${leads.length})</button>
          <button class="lead-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentLeadFilter === 'New' ? 'bg-emerald-900 text-amber-300' : 'text-stone-400 hover:text-white'}" data-status="New">New (${leads.filter(l => (l.status || 'New') === 'New').length})</button>
          <button class="lead-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentLeadFilter === 'Contacted' ? 'bg-emerald-900 text-amber-300' : 'text-stone-400 hover:text-white'}" data-status="Contacted">Contacted (${leads.filter(l => l.status === 'Contacted').length})</button>
          <button class="lead-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentLeadFilter === 'Audited' ? 'bg-emerald-900 text-amber-300' : 'text-stone-400 hover:text-white'}" data-status="Audited">Audited (${leads.filter(l => l.status === 'Audited').length})</button>
          <button class="lead-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentLeadFilter === 'Converted' ? 'bg-emerald-900 text-amber-300' : 'text-stone-400 hover:text-white'}" data-status="Converted">Converted (${leads.filter(l => l.status === 'Converted').length})</button>
        </div>
      </div>

      <div id="admin-leads-list" class="space-y-3">
        <!-- Rendered dynamically -->
      </div>
    `;

    const renderLeadsItems = () => {
      const listContainer = document.getElementById('admin-leads-list');
      if (!listContainer) return;

      let filtered = leads;
      if (this.currentLeadFilter !== 'all') {
        filtered = filtered.filter(l => (l.status || 'New') === this.currentLeadFilter);
      }
      if (this.currentLeadSearch) {
        const q = this.currentLeadSearch.toLowerCase().trim();
        filtered = filtered.filter(l => 
          (l.name || '').toLowerCase().includes(q) ||
          (l.phone || '').toLowerCase().includes(q) ||
          (l.email || '').toLowerCase().includes(q) ||
          (l.locality || '').toLowerCase().includes(q) ||
          (l.service || '').toLowerCase().includes(q) ||
          (l.message || '').toLowerCase().includes(q)
        );
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-12 bg-stone-950 border border-stone-800 rounded-2xl">
            <i data-lucide="inbox" class="w-8 h-8 text-stone-600 mx-auto mb-2"></i>
            <p class="text-stone-300 font-medium text-sm">No leads match this view</p>
            <p class="text-xs text-stone-500 mt-0.5">Try searching for a different keyword or resetting your filter.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      listContainer.innerHTML = filtered.map(lead => {
        const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
        const waMsg = encodeURIComponent(`Namaste ${lead.name || 'Sir/Madam'}, this is Anchor & Roots Hyderabad following up on your inquiry for ${lead.service || 'Care assessment'} in ${lead.locality || 'Hyderabad'}. How can we assist your family today?`);
        const status = lead.status || 'New';
        const statusColors = {
          'New': 'bg-emerald-950 text-emerald-300 border border-emerald-800/80',
          'Contacted': 'bg-blue-950 text-blue-300 border border-blue-800/80',
          'Audited': 'bg-purple-950 text-purple-300 border border-purple-800/80',
          'Converted': 'bg-amber-950 text-amber-300 border border-amber-800/80'
        };

        return `
          <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-amber-600/30 transition">
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-white text-sm">${lead.name || 'Anonymous Client'}</span>
                
                <!-- 1-Click Status Cycling Pill -->
                <button onclick="window.adminManager.cycleLeadStatus('${lead.id}')" title="1-Click: Click to cycle status (New → Contacted → Audited → Converted)" class="cursor-pointer select-none text-[11px] font-bold px-2.5 py-0.5 rounded-full transition hover:scale-105 active:scale-95 flex items-center gap-1 ${statusColors[status] || statusColors['New']}">
                  <span>●</span>
                  <span>${status}</span>
                  <span class="text-[9px] opacity-60">↻</span>
                </button>

                <span class="text-[11px] text-stone-500">${new Date(lead.timestamp).toLocaleString()}</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
                <span class="flex items-center gap-1 text-amber-300"><i data-lucide="phone" class="w-3 h-3"></i> ${lead.phone || 'N/A'}</span>
                <span class="flex items-center gap-1"><i data-lucide="mail" class="w-3 h-3"></i> ${lead.email || 'N/A'}</span>
                <span class="flex items-center gap-1 text-stone-400"><i data-lucide="map-pin" class="w-3 h-3"></i> Locality: ${lead.locality || 'Hyderabad'}</span>
                <span class="flex items-center gap-1 text-emerald-300"><i data-lucide="tag" class="w-3 h-3"></i> Service: ${lead.service || 'Care Assessment'}</span>
              </div>
              ${lead.message ? `<p class="text-xs text-stone-400 bg-stone-900/70 p-2 rounded-lg mt-2 font-sans border border-stone-800">"${lead.message}"</p>` : ''}
            </div>

            <div class="flex items-center gap-2 self-end md:self-center shrink-0">
              <select onchange="window.adminManager.updateLeadStatus('${lead.id}', this.value)" class="bg-stone-900 text-xs text-stone-200 border border-stone-700 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="New" ${status === 'New' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Audited" ${status === 'Audited' ? 'selected' : ''}>Audited</option>
                <option value="Converted" ${status === 'Converted' ? 'selected' : ''}>Converted</option>
              </select>
              ${cleanPhone ? `
                <a href="https://wa.me/${cleanPhone}?text=${waMsg}" target="_blank" class="px-2.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs" title="Prefilled WhatsApp follow-up">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp
                </a>
              ` : ''}
              <button onclick="window.adminManager.deleteLead('${lead.id}')" class="p-1.5 bg-stone-800 hover:bg-rose-950 text-rose-300 rounded-lg text-xs transition" title="Delete lead">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    renderLeadsItems();

    // Wire search and filter buttons
    const searchInput = document.getElementById('admin-lead-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentLeadSearch = e.target.value;
        renderLeadsItems();
      });
    }

    document.querySelectorAll('.lead-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentLeadFilter = btn.dataset.status;
        document.querySelectorAll('.lead-filter-btn').forEach(b => {
          b.classList.remove('bg-emerald-900', 'text-amber-300');
          b.classList.add('text-stone-400');
        });
        btn.classList.add('bg-emerald-900', 'text-amber-300');
        btn.classList.remove('text-stone-400');
        renderLeadsItems();
      });
    });

    // Export CSV
    const exportBtn = document.getElementById('export-leads-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (!leads.length) return alert('No leads to export.');
        const headers = ["ID", "Date", "Name", "Phone", "Email", "Locality", "Service", "Status", "Message"];
        const rows = leads.map(l => [
          `"${l.id}"`,
          `"${l.timestamp}"`,
          `"${(l.name || '').replace(/"/g, '""')}"`,
          `"${(l.phone || '').replace(/"/g, '""')}"`,
          `"${(l.email || '').replace(/"/g, '""')}"`,
          `"${(l.locality || '').replace(/"/g, '""')}"`,
          `"${(l.service || '').replace(/"/g, '""')}"`,
          `"${l.status || 'New'}"`,
          `"${(l.message || '').replace(/"/g, '""')}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `anchor_roots_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    }

    const clearBtn = document.getElementById('clear-leads-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all leads?')) {
          window.siteStore.data.leads = [];
          window.siteStore.save();
          this.updateKPIBadges();
          this.renderCurrentTab();
        }
      });
    }
  }

  cycleLeadStatus(id) {
    const lead = (window.siteStore.data.leads || []).find(l => l.id === id);
    if (!lead) return;
    const cycle = ['New', 'Contacted', 'Audited', 'Converted'];
    const curIdx = cycle.indexOf(lead.status || 'New');
    const nextStatus = cycle[(curIdx + 1) % cycle.length];
    lead.status = nextStatus;
    window.siteStore.save();
    this.showToast(`Lead status updated to "${nextStatus}"`);
    this.renderCurrentTab();
  }

  updateLeadStatus(id, newStatus) {
    const lead = (window.siteStore.data.leads || []).find(l => l.id === id);
    if (lead) {
      lead.status = newStatus;
      window.siteStore.save();
      this.showToast(`Lead marked as ${newStatus}`);
      this.renderCurrentTab();
    }
  }

  deleteLead(id) {
    window.siteStore.data.leads = (window.siteStore.data.leads || []).filter(l => l.id !== id);
    window.siteStore.save();
    this.updateKPIBadges();
    this.renderCurrentTab();
    this.showToast('Lead deleted.');
  }

  // --- TESTIMONIALS TAB ---
  renderTestimonialsTab(container) {
    const testimonials = window.siteStore.data.testimonials || [];
    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-amber-200">Client Testimonials & Stories</h3>
          <p class="text-xs text-stone-400">Manage real feedback from NRI families in USA, UK, UAE, etc.</p>
        </div>
        <button id="add-test-btn" class="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-sm rounded-xl flex items-center gap-2 shadow-lg transition">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Review
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${testimonials.map(t => `
          <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-amber-400 text-sm">★★★★★</span>
                <span class="text-xs text-stone-500">${t.date || ''}</span>
              </div>
              <p class="text-xs text-stone-300 italic mb-3">"${t.quote}"</p>
              <div class="text-xs font-semibold text-white">${t.name}</div>
              <div class="text-[11px] text-amber-300/80">${t.location} · <span class="text-stone-400">${t.service}</span></div>
            </div>
            <div class="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800 mt-3">
              <button onclick="window.adminManager.deleteTestimonial('${t.id}')" class="px-3 py-1 text-xs bg-stone-800 hover:bg-rose-950 text-rose-300 rounded-lg flex items-center gap-1">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('add-test-btn').addEventListener('click', () => {
      const name = prompt('Client / Family Name (e.g. Anand & Deepa K.):');
      if (!name) return;
      const location = prompt('NRI Location (e.g. Seattle, Washington):') || 'USA';
      const service = prompt('Service Used (e.g. Elder Care & Property Watch):') || 'Elder Care';
      const quote = prompt('Review / Testimonial content:');
      if (!quote) return;

      window.siteStore.data.testimonials.push({
        id: 't_' + Date.now(),
        name,
        location,
        service,
        quote,
        rating: 5,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      window.siteStore.save();
      this.renderCurrentTab();
      this.showToast('Testimonial added!');
    });
  }

  deleteTestimonial(id) {
    if (confirm('Delete this testimonial?')) {
      window.siteStore.data.testimonials = window.siteStore.data.testimonials.filter(t => t.id !== id);
      window.siteStore.save();
      this.renderCurrentTab();
    }
  }

  // --- FAQS TAB ---
  renderFaqsTab(container) {
    const faqs = window.siteStore.data.faqs || [];
    container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold text-amber-200">Frequently Asked Questions</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${faqs.length} Total</span>
          </div>
          <p class="text-xs text-stone-400">Add answers to common questions about vetting, geo-tagged proof, billing, etc.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="admin-faq-search" placeholder="Search FAQs..." class="bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none w-44 sm:w-56" />
          </div>
          <button id="add-faq-btn" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition shrink-0">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Add FAQ
          </button>
        </div>
      </div>

      <div id="admin-faqs-list" class="space-y-3">
        <!-- Rendered dynamically -->
      </div>
    `;

    const renderFaqsList = (list) => {
      const listEl = document.getElementById('admin-faqs-list');
      if (!listEl) return;
      if (!list.length) {
        listEl.innerHTML = `
          <div class="text-center py-12 bg-stone-950 border border-stone-800 rounded-2xl">
            <i data-lucide="help-circle" class="w-8 h-8 text-stone-600 mx-auto mb-2"></i>
            <p class="text-stone-300 text-sm">No FAQs match search query.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      listEl.innerHTML = list.map((f, i) => `
        <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-start justify-between gap-4">
          <div class="space-y-1">
            <span class="text-[10px] font-semibold text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-950">${f.category || 'General'}</span>
            <h5 class="text-sm font-bold text-white">${f.question}</h5>
            <p class="text-xs text-stone-400">${f.answer}</p>
          </div>
          <button onclick="window.adminManager.deleteFaq(${i})" class="text-stone-500 hover:text-rose-400 p-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    renderFaqsList(faqs);

    const faqSearch = document.getElementById('admin-faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = faqs.filter(f => 
          (f.question || '').toLowerCase().includes(q) || 
          (f.answer || '').toLowerCase().includes(q) || 
          (f.category || '').toLowerCase().includes(q)
        );
        renderFaqsList(filtered);
      });
    }

    document.getElementById('add-faq-btn').addEventListener('click', () => {
      const question = prompt('Question:');
      if (!question) return;
      const answer = prompt('Answer:');
      if (!answer) return;
      const category = prompt('Category (e.g. Elder Care, Property Watch, Billing, Coverage):') || 'General';

      window.siteStore.data.faqs.push({ question, answer, category });
      window.siteStore.save();
      this.renderCurrentTab();
      this.showToast('FAQ added!');
    });
  }

  deleteFaq(idx) {
    window.siteStore.data.faqs.splice(idx, 1);
    window.siteStore.save();
    this.renderCurrentTab();
  }

  // --- SETTINGS TAB ---
  renderSettingsTab(container) {
    const s = window.siteStore.data.settings;
    container.innerHTML = `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-amber-200">Site Settings & Announcement Banner</h3>
        <p class="text-xs text-stone-400">Update company phone, WhatsApp, email, office address, and top notice bar.</p>
      </div>

      <form id="settings-form" class="space-y-4 max-w-2xl bg-stone-950 border border-stone-800 p-5 rounded-2xl">
        <div class="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <i data-lucide="megaphone" class="w-4 h-4"></i> Top Announcement Banner
            </label>
            <input type="checkbox" id="set-ann-enabled" ${s.announcement?.enabled ? 'checked' : ''} class="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700" />
          </div>
          <input type="text" id="set-ann-text" value="${s.announcement?.text || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400" placeholder="e.g. 🌱 Welcoming new NRI families in Hyderabad..." />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label class="block text-stone-400 mb-1">Brand Name</label>
            <input type="text" id="set-brand" value="${s.brandName || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" />
          </div>
          <div>
            <label class="block text-stone-400 mb-1">Tagline</label>
            <input type="text" id="set-tagline" value="${s.tagline || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label class="block text-stone-400 mb-1">Phone Number (Display)</label>
            <input type="text" id="set-phone" value="${s.phone || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" />
          </div>
          <div>
            <label class="block text-stone-400 mb-1">WhatsApp Number (with country code)</label>
            <input type="text" id="set-wa" value="${s.whatsapp || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" placeholder="+919100084729" />
          </div>
        </div>

        <div class="text-xs sm:text-sm">
          <label class="block text-stone-400 mb-1">Support Email</label>
          <input type="email" id="set-email" value="${s.email || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" />
        </div>

        <div class="text-xs sm:text-sm">
          <label class="block text-stone-400 mb-1">Physical Address in Hyderabad</label>
          <input type="text" id="set-addr" value="${s.address || ''}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-400" />
        </div>

        <div class="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <i data-lucide="shield" class="w-4 h-4"></i> Admin Studio PIN Protection
            </label>
            <input type="checkbox" id="set-pin-enabled" ${s.pinProtected ? 'checked' : ''} class="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700" />
          </div>
          <div>
            <label class="block text-stone-400 mb-1 text-xs">Admin Passcode / PIN</label>
            <input type="password" id="set-pin-value" value="${s.adminPin || 'anchor2026'}" class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400" placeholder="e.g. anchor2026" />
            <p class="text-[10px] text-stone-500 mt-1">Default PIN is <code>anchor2026</code>. When enabled, unlocking the CMS requires this PIN.</p>
          </div>
        </div>

        <div class="pt-3 border-t border-stone-800 flex justify-end">
          <button type="submit" class="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg transition">Save Settings</button>
        </div>
      </form>
    `;

    document.getElementById('settings-form').addEventListener('submit', (e) => {
      e.preventDefault();
      window.siteStore.data.settings.brandName = document.getElementById('set-brand').value.trim();
      window.siteStore.data.settings.tagline = document.getElementById('set-tagline').value.trim();
      window.siteStore.data.settings.phone = document.getElementById('set-phone').value.trim();
      window.siteStore.data.settings.whatsapp = document.getElementById('set-wa').value.trim();
      window.siteStore.data.settings.email = document.getElementById('set-email').value.trim();
      window.siteStore.data.settings.address = document.getElementById('set-addr').value.trim();
      window.siteStore.data.settings.pinProtected = document.getElementById('set-pin-enabled').checked;
      window.siteStore.data.settings.adminPin = document.getElementById('set-pin-value').value.trim() || 'anchor2026';
      window.siteStore.data.settings.announcement = {
        enabled: document.getElementById('set-ann-enabled').checked,
        text: document.getElementById('set-ann-text').value.trim()
      };

      window.siteStore.save();
      this.showToast('Settings updated successfully!');
    });
  }
}

// Instantiate and expose globally
window.adminManager = new AdminManager();
