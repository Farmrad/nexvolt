window.DB = (() => {
  const STORE = 'nexvolt_v1';
  const KEYS  = ['clients', 'invoices', 'expenses', 'jobs', 'settings'];

  // Internal cache — always in sync with local storage
  const _cache = {
    clients:  [],
    invoices: [],
    expenses: [],
    jobs:     [],
    settings: {
      company:  'Mohamed Salim Mrad',
      activity: 'Travaux Electricité Bâtiment',
      mf:       '1860282/TAC/000',
      phone:    '56 130 571',
      address:  'Sousse, Tunisie',
      tva:      19,
      timbre:   1,
      invoicePrefix: 'F',
      nextNum:  1,
    }
  };

  /* ---------- Helpers ---------- */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function _load(key) {
    try {
      const raw = localStorage.getItem(STORE + '_' + key);
      if (!raw) return;
      _cache[key] = JSON.parse(raw);
    } catch (e) { console.warn('DB load error', key, e); }
  }

  function _save(key) {
    try {
      localStorage.setItem(STORE + '_' + key, JSON.stringify(_cache[key]));
    } catch (e) { console.warn('DB save error', key, e); }
  }

  function init() {
    KEYS.forEach(_load);
    // Merge defaults into settings if keys are missing
    const def = _cache.settings;
    const defaults = {
      company: 'Mohamed Salim Mrad', activity: 'Travaux Electricité Bâtiment',
      mf: '1860282/TAC/000', phone: '56 130 571', address: 'Sousse, Tunisie',
      tva: 19, timbre: 1, invoicePrefix: 'F', nextNum: 1
    };
    _cache.settings = Object.assign({}, defaults, def);
    console.log('[DB] Initialized. Clients:', _cache.clients.length, '| Invoices:', _cache.invoices.length);
  }

  /* ---------- Generic CRUD ---------- */
  function getAll(collection) {
    return [...(_cache[collection] || [])];
  }

  function getById(collection, id) {
    return (_cache[collection] || []).find(r => r.id === id) || null;
  }

  function insert(collection, data) {
    const record = { ...data, id: uid(), createdAt: Date.now() };
    _cache[collection].push(record);
    _save(collection);
    return record;
  }

  function update(collection, id, data) {
    const idx = _cache[collection].findIndex(r => r.id === id);
    if (idx === -1) return null;
    _cache[collection][idx] = { ..._cache[collection][idx], ...data, updatedAt: Date.now() };
    _save(collection);
    return _cache[collection][idx];
  }

  function remove(collection, id) {
    const before = _cache[collection].length;
    _cache[collection] = _cache[collection].filter(r => r.id !== id);
    _save(collection);
    return _cache[collection].length < before;
  }

  /* ---------- Settings & Invoice Numbers ---------- */
  function getSettings() {
    return { ..._cache.settings };
  }

  function saveSettings(data) {
    _cache.settings = { ..._cache.settings, ...data };
    _save('settings');
    return _cache.settings;
  }

  function nextInvoiceNumber() {
    const s = _cache.settings;
    return `${s.invoicePrefix || 'F'}-${s.nextNum || 1}-${new Date().getFullYear()}`;
  }

  function incrementInvoiceNumber() {
    _cache.settings.nextNum = (_cache.settings.nextNum || 1) + 1;
    _save('settings');
  }

  /* ---------- Dashboard Stats ---------- */
  function stats() {
    const invoices = _cache.invoices;
    const expenses = _cache.expenses;
    const now      = new Date();
    const thisM    = now.getMonth();
    const thisY    = now.getFullYear();

    const monthInvoices = invoices.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === thisM && d.getFullYear() === thisY;
    });

    const totalPaid     = invoices.filter(i => i.status === 'payée').reduce((a, i) => a + (i.ttc || 0), 0);
    const totalUnpaid   = invoices.filter(i => i.status === 'en attente').reduce((a, i) => a + (i.ttc || 0), 0);
    const monthRevenue  = monthInvoices.filter(i => i.status === 'payée').reduce((a, i) => a + (i.ttc || 0), 0);
    const totalExpenses = expenses.reduce((a, e) => a + (e.amount || 0), 0);
    
    return {
      totalClients: _cache.clients.length,
      totalInvoices: invoices.length,
      totalPaid, 
      totalUnpaid, 
      monthRevenue,
      totalExpenses
    };
  }

  return { init, getAll, getById, insert, update, remove, getSettings, saveSettings, nextInvoiceNumber, incrementInvoiceNumber, stats };
})();
