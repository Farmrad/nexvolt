window.Dashboard = {
  render: () => {
    const s = DB.getStats();
    return `
      <div class="page">
        <h3>Analytics</h3>
        <div class="stats-grid">
          <div class="stat-card">Revenu: ${s.revenue} TND</div>
          <div class="stat-card">Dépenses: ${s.expenses} TND</div>
          <div class="stat-card">Chantiers: ${s.jobs}</div>
          <div class="stat-card">Clients: ${s.clients}</div>
        </div>
        <button onclick="DB.exportData()">Backup Data (Copy to Clipboard)</button>
      </div>
    `;
  }
};
