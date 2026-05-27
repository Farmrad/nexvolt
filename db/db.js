window.DB = (() => {
  const STORE = 'nexvolt_v1';
  
  // Data cache
  let _cache = {
    clients: [],
    invoices: [],
    expenses: [],
    jobs: [],
    settings: { company: 'Nexvolt', phone: '56 130 571' }
  };

  function init() {
    ['clients', 'invoices', 'expenses', 'jobs', 'settings'].forEach(key => {
      const data = localStorage.getItem(STORE + '_' + key);
      if (data) _cache[key] = JSON.parse(data);
    });
  }

  function save() {
    for (let key in _cache) {
      localStorage.setItem(STORE + '_' + key, JSON.stringify(_cache[key]));
    }
  }

  function insert(coll, data) {
    data.id = Date.now().toString();
    _cache[coll].push(data);
    save();
  }

  function getAll(coll) { return _cache[coll]; }

  function getStats() {
    const revenue = _cache.invoices.filter(i => i.status === 'payée').reduce((a, b) => a + b.ttc, 0);
    const expenses = _cache.expenses.reduce((a, b) => a + b.amount, 0);
    return {
      revenue,
      expenses,
      jobs: _cache.jobs.filter(j => j.status !== 'Terminé').length,
      clients: _cache.clients.length
    };
  }

  return { init, insert, getAll, getStats };
})();
