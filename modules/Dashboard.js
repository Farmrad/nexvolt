window.Dashboard = (() => {
  function render() {
    const s = DB.getStats();
    document.getElementById('app').innerHTML = `
      <div class="page">
        <div class="stats">
          <div class="stat"><div class="stat-label">Revenus</div><div class="stat-val accent">${s.revenue.toFixed(3)}</div></div>
          <div class="stat"><div class="stat-label">Chantiers</div><div class="stat-val blue">${s.jobs}</div></div>
          <div class="stat"><div class="stat-label">Clients</div><div class="stat-val green">${s.clients}</div></div>
          <div class="stat"><div class="stat-label">Dépenses</div><div class="stat-val red">${s.expenses.toFixed(3)}</div></div>
        </div>
      </div>`;
  }
  return { render };
})();
