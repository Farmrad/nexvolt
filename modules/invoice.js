window.Invoices = {
  render: function() {
    let html = `
      <div class="page">
        <h3>Invoices</h3>
        <button onclick="Invoices.openForm()">+ New Invoice</button>
        <div style="margin-top:20px;">
          ${DB.state.invoices.map(i => `
            <div class="stat-card" style="margin-bottom:10px; display:flex; justify-content:space-between;">
              <div><strong>${i.client}</strong><br>${i.date} - ${i.ttc} TND</div>
              <div>
                <button onclick="Invoices.exportPDF('${i.id}')">PDF</button>
                <button onclick="Invoices.exportExcel('${i.id}')">Excel</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return html;
  },

  // Simple PDF Export using browser Print function for your PDF layout
  exportPDF: function(id) {
    const inv = DB.state.invoices.find(i => i.id === id);
    const win = window.open('', '_blank');
    win.document.write(`
      <html><body>
        <h1>INVOICE ${inv.invoiceNo}</h1>
        <p>Client: ${inv.client}</p>
        <p>Total TTC: ${inv.ttc} TND</p>
        <script>window.print();</script>
      </body></html>
    `);
  },

  // Simple CSV Export for Excel
  exportExcel: function(id) {
    const inv = DB.state.invoices.find(i => i.id === id);
    let csv = "Description,Amount\n" + inv.items.map(it => `${it.desc},${it.price}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Invoice_${inv.invoiceNo}.csv`; a.click();
  }
};
