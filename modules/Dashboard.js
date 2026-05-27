window.Dashboard = {
  render: function() {
    const s = DB.getStats();
    return `
      <div class="page">
        <div class="stats-grid">
          <div class="stat-card">
            <div>THIS MONTH</div>
            <div class="stat-val orange">${s.revenue} TND</div>
            <div style="font-size:12px; color:var(--text-muted)">Revenue</div>
          </div>
          <div class="stat-card">
            <div>UNPAID</div>
            <div class="stat-val red">${s.unpaid} TND</div>
            <div style="font-size:12px; color:var(--text-muted)">To collect</div>
          </div>
          <div class="stat-card">
            <div>JOBS</div>
            <div class="stat-val blue">${s.jobs}</div>
            <div style="font-size:12px; color:var(--text-muted)">In progress</div>
          </div>
          <div class="stat-card">
            <div>CLIENTS</div>
            <div class="stat-val green">${s.clients}</div>
            <div style="font-size:12px; color:var(--text-muted)">Total</div>
          </div>
        </div>
      </div>
    `;
  }
};
