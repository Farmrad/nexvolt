window.Dashboard = {
  render: function() {
    const s = DB.getStats();
    return `
      <div class="page" style="padding:20px;">
        <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
          <div class="stat-card" style="background:#151a23; padding:15px; border-radius:12px; border:1px solid #222;">
            <div style="font-size:12px; color:#8b949e;">REVENUE</div>
            <div style="font-size:20px; font-weight:bold; color:#ff9f43; margin-top:5px;">${s.revenue} TND</div>
          </div>
          <div class="stat-card" style="background:#151a23; padding:15px; border-radius:12px; border:1px solid #222;">
            <div style="font-size:12px; color:#8b949e;">UNPAID</div>
            <div style="font-size:20px; font-weight:bold; color:#ff4d4d; margin-top:5px;">${s.unpaid} TND</div>
          </div>
          <div class="stat-card" style="background:#151a23; padding:15px; border-radius:12px; border:1px solid #222;">
            <div style="font-size:12px; color:#8b949e;">JOBS</div>
            <div style="font-size:20px; font-weight:bold; color:#3498db; margin-top:5px;">${s.jobs}</div>
          </div>
          <div class="stat-card" style="background:#151a23; padding:15px; border-radius:12px; border:1px solid #222;">
            <div style="font-size:12px; color:#8b949e;">CLIENTS</div>
            <div style="font-size:20px; font-weight:bold; color:#2ecc71; margin-top:5px;">${s.clients}</div>
          </div>
        </div>
      </div>
    `;
  }
};
