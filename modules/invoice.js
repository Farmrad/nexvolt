window.InvoicesPage = (() => {
  let currentItems = [];

  function render() {
    const app = document.getElementById('app');
    const invoices = DB.getAll('invoices').sort((a, b) => b.createdAt - a.createdAt);

    let html = `
      <div class="page">
        <div class="section-hdr">
          <div class="section-title">Factures</div>
          <button class="btn btn-primary btn-sm" onclick="InvoicesPage.openForm()">+ Nouvelle Facture</button>
        </div>
    `;

    if (invoices.length === 0) {
      html += `
        <div class="empty">
          <div class="empty-icon">📄</div>
          <div class="empty-text">Aucune facture pour le moment.</div>
        </div>
      `;
    } else {
      invoices.forEach(inv => {
        let statusClass = inv.status === 'payée' ? 'paid' : 'pending';
        html += `
          <div class="item" onclick="InvoicesPage.viewInvoice('${inv.id}')">
            <div class="item-icon blue">📄</div>
            <div class="item-body">
              <div class="item-name">${inv.clientName || 'Client Inconnu'}</div>
              <div class="item-sub">${inv.number} • ${new Date(inv.date).toLocaleDateString('fr-FR')}</div>
              <span class="badge ${statusClass}" style="margin-top:4px;">${inv.status}</span>
            </div>
            <div class="item-right">
              <div class="item-amount">${inv.ttc.toFixed(3)} DT</div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    app.innerHTML = html;
  }

  function openForm() {
    currentItems = []; // Reset items
    const num = DB.nextInvoiceNumber();
    const today = new Date().toISOString().split('T')[0];

    const modal = document.getElementById('modal-root');
    modal.innerHTML = `
      <div class="modal-overlay open" id="inv-modal">
        <div class="modal" style="max-width: 600px;">
          <div class="modal-hdr">
            <div class="modal-title">Créer Facture</div>
            <button class="modal-close" onclick="InvoicesPage.closeForm()">Fermer</button>
          </div>
          
          <div class="form-group">
            <label class="form-label">Client / Entreprise</label>
            <input type="text" id="inv-client" class="form-input" placeholder="Ex: Comptoir Moderne">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Matricule Fiscale (M.F)</label>
              <input type="text" id="inv-mf" class="form-input" placeholder="Ex: 160571/XBM/000">
            </div>
            <div class="form-group">
              <label class="form-label">Lieu / Adresse</label>
              <input type="text" id="inv-lieu" class="form-input" placeholder="Ex: Akouda">
            </div>
          </div>

          <div class="divider"></div>
          <div class="section-title" style="margin-bottom:8px;">Articles / Services</div>
          
          <div id="inv-items-list"></div>

          <div class="form-row-3" style="margin-bottom: 16px;">
            <input type="text" id="item-desc" class="form-input" placeholder="Description (ex: coffret 6v)">
            <input type="number" id="item-qty" class="form-input" placeholder="Qté" value="1" min="1">
            <input type="number" id="item-price" class="form-input" placeholder="P.U HT">
            <button class="btn btn-secondary" onclick="InvoicesPage.addItem()">+</button>
          </div>

          <div class="totals-box">
            <div class="totals-row"><span>Total H.T</span><span id="calc-ht">0.000 DT</span></div>
            <div class="totals-row"><span>TVA (19%)</span><span id="calc-tva">0.000 DT</span></div>
            <div class="totals-row"><span>Droit de timbre</span><span>1.000 DT</span></div>
            <div class="totals-final"><span>Total TTC</span><span id="calc-ttc">0.000 DT</span></div>
          </div>

          <button class="btn btn-primary btn-full" onclick="InvoicesPage.saveInvoice()">Enregistrer la facture</button>
        </div>
      </div>
    `;
    updateTotals();
  }

  function addItem() {
    const desc = document.getElementById('item-desc').value;
    const qty = parseFloat(document.getElementById('item-qty').value);
    const price = parseFloat(document.getElementById('item-price').value);

    if (!desc || !qty || !price) return;

    currentItems.push({ desc, qty, price, totalHT: qty * price });
    
    document.getElementById('item-desc').value = '';
    document.getElementById('item-qty').value = '1';
    document.getElementById('item-price').value = '';
    
    renderItemsList();
    updateTotals();
  }

  function renderItemsList() {
    const list = document.getElementById('inv-items-list');
    list.innerHTML = currentItems.map((item, index) => `
      <div class="desc-line">
        <div class="dl-desc form-input" style="background:var(--bg2)">${item.desc}</div>
        <div class="dl-qty form-input" style="background:var(--bg2); text-align:center;">${item.qty}</div>
        <div class="dl-price form-input" style="background:var(--bg2); text-align:right;">${item.totalHT.toFixed(3)}</div>
        <button class="btn-icon" onclick="InvoicesPage.removeItem(${index})">✕</button>
      </div>
    `).join('');
  }

  function removeItem(index) {
    currentItems.splice(index, 1);
    renderItemsList();
    updateTotals();
  }

  function updateTotals() {
    const totalHT = currentItems.reduce((sum, item) => sum + item.totalHT, 0);
    const tva = totalHT * 0.19;
    const timbre = 1.000;
    const ttc = totalHT + tva + timbre;

    if(document.getElementById('calc-ht')) {
      document.getElementById('calc-ht').innerText = totalHT.toFixed(3) + ' DT';
      document.getElementById('calc-tva').innerText = tva.toFixed(3) + ' DT';
      document.getElementById('calc-ttc').innerText = ttc.toFixed(3) + ' DT';
    }
  }

  function saveInvoice() {
    const clientName = document.getElementById('inv-client').value;
    const clientMF = document.getElementById('inv-mf').value;
    const clientLieu = document.getElementById('inv-lieu').value;

    if (!clientName || currentItems.length === 0) {
      alert("Veuillez ajouter un client et au moins un article.");
      return;
    }

    const totalHT = currentItems.reduce((sum, item) => sum + item.totalHT, 0);
    const tva = totalHT * 0.19;
    const timbre = 1.000;
    const ttc = totalHT + tva + timbre;

    const invoice = {
      number: DB.nextInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      clientName,
      clientMF,
      clientLieu,
      items: currentItems,
      totalHT,
      tva,
      timbre,
      ttc,
      status: 'en attente'
    };

    DB.insert('invoices', invoice);
    DB.incrementInvoiceNumber();
    closeForm();
    render();
    
    // Optional: Show Toast
    const toast = document.getElementById('toast');
    toast.innerText = "Facture enregistrée !";
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function closeForm() {
    document.getElementById('modal-root').innerHTML = '';
  }

  function viewInvoice(id) {
    const inv = DB.getById('invoices', id);
    const set = DB.getSettings();
    if (!inv) return;

    const modal = document.getElementById('modal-root');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal" style="max-width: 800px; background: #fff;">
          
          <div class="no-print" style="display:flex; justify-content:flex-end; gap:10px; margin-bottom: 20px;">
            <button class="btn btn-secondary" onclick="InvoicesPage.closeForm()">Fermer</button>
            <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / PDF</button>
          </div>

          <div class="invoice-doc">
            <div class="inv-hdr">
              <div>
                <div class="inv-co">${set.company}</div>
                <div class="inv-co-sub">${set.activity}<br>M.F: ${set.mf}<br>GSM: ${set.phone}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 5px;">FACTURE N° : ${inv.number}</div>
                <div>Date: ${new Date(inv.date).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>

            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 20px; border: 1px solid #000;">
              <tr style="background: #f8f8f8;">
                <th style="padding: 8px; border: 1px solid #000;">Client</th>
                <th style="padding: 8px; border: 1px solid #000;">M.F</th>
                <th style="padding: 8px; border: 1px solid #000;">Lieu</th>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #000; font-weight:bold;">${inv.clientName}</td>
                <td style="padding: 8px; border: 1px solid #000;">${inv.clientMF || '-'}</td>
                <td style="padding: 8px; border: 1px solid #000;">${inv.clientLieu || '-'}</td>
              </tr>
            </table>

            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 10px; border: 1px solid #000;">
              <tr style="background: #f8f8f8;">
                <th style="padding: 8px; border: 1px solid #000;">Description</th>
                <th style="padding: 8px; border: 1px solid #000; text-align:center;">Qte</th>
                <th style="padding: 8px; border: 1px solid #000; text-align:right;">P.UHT</th>
                <th style="padding: 8px; border: 1px solid #000; text-align:right;">Montant HT</th>
              </tr>
              ${inv.items.map(i => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #000;">${i.desc}</td>
                  <td style="padding: 8px; border: 1px solid #000; text-align:center;">${i.qty}</td>
                  <td style="padding: 8px; border: 1px solid #000; text-align:right;">${i.price.toFixed(3)}</td>
                  <td style="padding: 8px; border: 1px solid #000; text-align:right;">${i.totalHT.toFixed(3)}</td>
                </tr>
              `).join('')}
            </table>

            <div style="display:flex; justify-content: flex-end;">
              <table border="1" style="width: 250px; border-collapse: collapse; border: 1px solid #000;">
                <tr>
                  <td style="padding: 6px 8px; font-weight: bold; border: 1px solid #000;">Total H.T</td>
                  <td style="padding: 6px 8px; text-align: right; border: 1px solid #000;">${inv.totalHT.toFixed(3)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border: 1px solid #000;">Tva 19% (*)</td>
                  <td style="padding: 6px 8px; text-align: right; border: 1px solid #000;">${inv.tva.toFixed(3)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border: 1px solid #000;">Droit de timbre</td>
                  <td style="padding: 6px 8px; text-align: right; border: 1px solid #000;">${inv.timbre.toFixed(3)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; font-size: 14px; background: #eee; border: 1px solid #000;">Total TTC</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 14px; background: #eee; border: 1px solid #000;">${inv.ttc.toFixed(3)}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 30px; font-weight: bold; font-size: 12px;">
              La présente facture est arrêtée à la somme de : ..............................................................
            </div>
            
            <div style="text-align: right; margin-top: 40px; font-weight: bold; font-size: 13px;">
              cachet et signature
            </div>

          </div>
        </div>
      </div>
    `;
  }

  return { render, openForm, closeForm, addItem, removeItem, saveInvoice, viewInvoice };
})();
