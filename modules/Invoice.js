window.Invoices = {
  render: function() {
    let html = `
      <div class="page" style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3>Invoices</h3>
          <button onclick="Router.go('Dashboard')" style="background:#444; border:none; padding:8px 16px; border-radius:6px; color:white; cursor:pointer;">Back</button>
        </div>
        ${DB.state.invoices.length === 0 ? '<div style="color:#8b949e; text-align:center;">No invoices yet.</div>' : 
          DB.state.invoices.map(i => `
            <div style="background:#151a23; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #222;">
              <div><strong>${i.client}</strong><br><small style="color:#8b949e;">${i.date} • ${i.ttc} TND</small></div>
              <div>
                <button onclick="Invoices.exportPDF('${i.id}')" style="background:none; border:1px solid #ff9f43; color:#ff9f43; padding:5px 10px; border-radius:4px; cursor:pointer;">PDF</button>
              </div>
            </div>
          `).join('')}
      </div>
    `;
    return html;
  },

  exportPDF: function(id) {
    const inv = DB.state.invoices.find(i => i.id === id);
    if (!inv) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><body style="font-family:sans-serif; padding:40px;">
      <h1 style="color:#0a0e17;">INVOICE</h1>
      <hr><p><strong>Client:</strong> ${inv.client}</p>
      <p><strong>Total TTC:</strong> ${inv.ttc} TND</p>
      <p><strong>Date:</strong> ${inv.date}</p>
      <script>window.print();</script>
    </body></html>`);
  }
};
