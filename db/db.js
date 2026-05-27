/* ============================================================
   NEXVOLT — db.js
   IndexedDB storage with localStorage fallback
   ============================================================ */

const DB = (() => {
  const STORE = 'nexvolt_v1';
  const KEYS  = ['clients','invoices','expenses','jobs','settings'];

  // Internal cache — always in sync with storage
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

  /* ---------- helpers ---------- */
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
    // Merge defaults into settings if keys missing
    const def = _cache.settings;
    const defaults = {
      company:'Mohamed Salim Mrad', activity:'Travaux Electricité Bâtiment',
      mf:'1860282/TAC/000', phone:'56 130 571', address:'Sousse, Tunisie',
      tva:19, timbre:1, invoicePrefix:'F', nextNum:1
    };
    _cache.settings = Object.assign({}, defaults, def);
    console.log('[DB] Initialized. Clients:', _cache.clients.length, '| Invoices:', _cache.invoices.length);
  }

  /* ---------- generic CRUD ---------- */
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

  /* ---------- settings ---------- */
  function getSettings() {
    return { ..._cache.settings };
  }

  function saveSettings(data) {
    _cache.settings = { ..._cache.settings, ...data };
    _save('settings');
    return _cache.settings;
  }

  /* ---------- invoice number ---------- */
  function nextInvoiceNumber() {
    const s = _cache.settings;
    const num = `${s.invoicePrefix || 'F'}-${s.nextNum || 1}-${new Date().getFullYear()}`;
    return num;
  }

  function incrementInvoiceNumber() {
    _cache.settings.nextNum = (_cache.settings.nextNum || 1) + 1;
    _save('settings');
  }

  /* ---------- export / import ---------- */
  function exportAll() {
    return {
      _version: 2,
      exportedAt: new Date().toISOString(),
      clients:  _cache.clients,
      invoices: _cache.invoices,
      expenses: _cache.expenses,
      jobs:     _cache.jobs,
      settings: _cache.settings,
    };
  }

  function importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid backup file');
    ['clients','invoices','expenses','jobs','settings'].forEach(k => {
      if (data[k] !== undefined) {
        _cache[k] = data[k];
        _save(k);
      }
    });
  }

  function resetAll() {
    KEYS.forEach(k => localStorage.removeItem(STORE + '_' + k));
    location.reload();
  }

  /* ---------- stats helpers ---------- */
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

    const totalPaid     = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + (i.ttc || 0), 0);
    const totalUnpaid   = invoices.filter(i => i.status === 'pending').reduce((a, i) => a + (i.ttc || 0), 0);
    const monthRevenue  = monthInvoices.filter(i => i.status === 'paid').reduce((a, i) => a + (i.ttc || 0), 0);
    const totalExpenses = expenses.reduce((a, e) => a + (e.amount || 0), 0);
    const netProfit     = totalPaid - totalExpenses;
    const marginPct     = totalPaid > 0 ? (netProfit / totalPaid) * 100 : 0;

    const expByCat = { car: 0, tools: 0, materials: 0, other: 0 };
    expenses.forEach(e => {
      if (expByCat[e.cat] !== undefined) expByCat[e.cat] += e.amount || 0;
      else expByCat.other += e.amount || 0;
    });

    return {
      totalClients: _cache.clients.length,
      totalInvoices: invoices.length,
      totalPaid, totalUnpaid, monthRevenue,
      totalExpenses, netProfit, marginPct,
      expByCat,
      activeJobs: invoices.filter(i => i.status !== 'paid').length,
    };
  }

  return { init, uid, getAll, getById, insert, update, remove,
           getSettings, saveSettings,
           nextInvoiceNumber, incrementInvoiceNumber,
           exportAll, importAll, resetAll, stats };
})();
