window.InvoicesPage = (() => {
  function render() {
    const app = document.getElementById('app');
    const invoices = DB.getAll('invoices').sort((a, b) => b.createdAt - a.createdAt);

    let html = `
      <div class="page">
        <div class="section-hdr">
          <div class="section-title">Factures</div>
          <button class="btn btn-primary btn-sm" onclick="InvoicesPage.openForm()">+ Facture</button>
        </div>
    `;

    if (invoices.length === 0) {
      html += `<div class="empty">Aucune facture.</div>`;
    } else {
      invoices.forEach(i => {
        html += `
          <div class="item">
            <div class="item-icon">📄</div>
            <div class="item-body">
              <div class="item-name">${i.clientName}</div>
              <div class="item-sub">${i.invoiceNo} • ${i.date}</div>
            </div>
            <div class="item-right">
              <div class="item-amount">${i.ttc.toFixed(3)} DT</div>
              <div class="status ${i.status}">${i.status}</div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    app.innerHTML = html;
  }

  function openForm() {
    const modal = document.getElementById('modal-root');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal">
          <div class="modal-hdr">
            <div class="modal-title">Nouvelle Facture</div>
            <button class="modal-close" onclick="InvoicesPage.closeForm()">Fermer</button>
          </div>
          <div class="form-group">
            <input type="text" id="inv-client" class="form-input" placeholder="Nom du Client">
          </div>
          <div class="form-group">
            <input type="number" id="inv-amount" class="form-input" placeholder="Montant HT">
          </div>
          <button class="btn btn-primary btn-full" onclick="InvoicesPage.saveInvoice()">Enregistrer</button>
        </div>
      </div>
    `;
  }

  function saveInvoice() {
    const clientName = document.getElementById('inv-client').value;
    const amountHT = parseFloat(document.getElementById('inv-amount').value);
    
    if (!clientName || !amountHT) return alert("Remplissez tout svp.");

    const tva = amountHT * 0.19;
    const ttc = amountHT + tva + 1; // +1 DT Timbre

    DB.insert('invoices', {
      invoiceNo: DB.nextInvoiceNumber(),
      clientName,
      ht: amountHT,
      ttc,
      status: 'en attente',
      date: new Date().toLocaleDateString()
    });

    DB.incrementInvoiceNumber();
    closeForm();
    render();
  }

  function closeForm() {
    document.getElementById('modal-root').innerHTML = '';
  }

  return { render, openForm, closeForm, saveInvoice };
})();
