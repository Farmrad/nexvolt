window.DB = (() => {
  const STORE = 'nexvolt_data';
  let _state = { clients: [], invoices: [], expenses: [], jobs: [], settings: {} };

  function init() {
    const saved = localStorage.getItem(STORE);
    if (saved) _state = JSON.parse(saved);
  }

  function save() {
    localStorage.setItem(STORE, JSON.stringify(_state));
  }

  // Backup & Restore
  const exportData = () => JSON.stringify(_state);
  const importData = (json) => { _state = JSON.parse(json); save(); };

  function getStats() {
    const revenue = _state.invoices.filter(i => i.status === 'payée').reduce((a, b) => a + (Number(b.ttc) || 0), 0);
    const expenses = _state.expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0);
    return {
      revenue: revenue.toFixed(3),
      expenses: expenses.toFixed(3),
      jobs: _state.jobs.filter(j => j.status !== 'Terminé').length,
      clients: _state.clients.length
    };
  }

  return { init, state: _state, save, exportData, importData, getStats };
})();
