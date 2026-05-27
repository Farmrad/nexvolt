window.InvoicesPage = (() => {
  function render() {
    const app = document.getElementById('app');
    const invs = DB.getAll('invoices');
    
    let html = `<div class="page"><h3>Factures</h3><button onclick="InvoicesPage.openForm()">+ Nouvelle Facture</button>`;
    invs.forEach(i => {
      html += `<div class="item">
        <div><strong>${i.clientName}</strong><br>N° ${i.invoiceNo} | ${i.date}</div>
        <div>${i.ttc.toFixed(3)} DT<br>
             <button onclick="InvoicesPage.exportPDF('${i.id}')">PDF</button>
             <button onclick="InvoicesPage.exportExcel('${i.id}')">Excel</button>
        </div>
      </div>`;
    });
    app.innerHTML = html + `</div>`;
  }

  function saveInvoice() {
    // Logic to handle multiple items
    const clientName = document.getElementById('inv-client').value;
    const items = JSON.parse(document.getElementById('inv-items').value); // Expecting [{desc, qte, pu}]
    
    let totalHT = items.reduce((sum, item) => sum + (item.qte * item.pu), 0);
    let tva = totalHT * 0.19;
    let ttc = totalHT + tva + 1.000; // 1DT Timbre

    DB.insert('invoices', { clientName, items, totalHT, tva, ttc, invoiceNo: 'F-' + Date.now().toString().slice(-4), date: new Date().toLocaleDateString() });
    render();
  }

  function exportPDF(id) {
    const inv = DB.getAll('invoices').find(i => i.id === id);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text("FACTURE", 20, 20);
    doc.text(`Client: ${inv.clientName}`, 20, 30);
    doc.text(`Total TTC: ${inv.ttc.toFixed(3)} DT`, 20, 40);
    doc.save(`Facture_${inv.invoiceNo}.pdf`);
  }

  function exportExcel(id) {
    const inv = DB.getAll('invoices').find(i => i.id === id);
    const ws = XLSX.utils.json_to_sheet(inv.items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facture");
    XLSX.writeFile(wb, `Facture_${inv.invoiceNo}.xlsx`);
  }

  return { render, saveInvoice, exportPDF, exportExcel };
})();
