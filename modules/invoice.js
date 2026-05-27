/* ============================================================
   NEXVOLT — modules/invoices.js
   Invoice management: create, preview (French), print, mark paid
   ============================================================ */

const Invoices = (() => {
  let _descLines = [];

  /* ---------- Modal: Add Invoice ---------- */
  function showAddModal(preselectedClientId = '') {
    const clients = DB.getAll('clients');
    const s       = DB.getSettings();
    const invNum  = DB.nextInvoiceNumber();

    const clientOptions = clients.map(c =>
      `<option value="${c.id}" ${c.id === preselectedClientId ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    openModal(`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-hdr">
            <span class="modal-title">📄 New Invoice</span>
            <button class="modal-close" onclick="closeModal()">✕ Close</button>
          </div>

          <div class="form-group">
            <label class="form-label">Client</label>
            <select class="form-input" id="inv-client">
              <option value="">— Select a client —</option>
              ${clientOptions}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Invoice No.</label>
              <input class="form-input" id="inv-num" value="${invNum}">
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input class="form-input" type="date" id="inv-date" value="${today()}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Job Type</label>
            <select class="form-input" id="inv-type">
              <option>Installation électrique</option>
              <option>Dépannage</option>
              <option>Smart Home</option>
              <option>Maintenance</option>
              <option>Câblage réseau / caméras</option>
              <option>Sous-traitance</option>
              <option>Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Work Description (lines)</label>
            <div id="desc-lines-wrap" class="desc-lines-wrap"></div>
            <button class="btn btn-outline btn-sm" onclick="Invoices.addLine()" style="margin-top:4px">+ Add line</button>
          </div>

          <div class="form-group">
            <label class="form-label">Payment Status</label>
            <select class="form-input" id="inv-status">
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div class="totals-box" id="inv-totals-box">
            <div class="totals-row"><span>Total HT</span><span id="calc-ht">0.000 TND</span></div>
            <div class="totals-row"><span>TVA (${s.tva}%)</span><span id="calc-tva">0.000 TND</span></div>
            <div class="totals-row"><span>Droit de timbre</span><span id="calc-timbre">${(s.timbre || 1).toFixed(3)} TND</span></div>
            <div class="totals-final">
              <span style="color:var(--accent)">Total TTC</span>
              <span id="calc-ttc" style="color:var(--accent)">0.000 TND</span>
            </div>
          </div>

          <button class="btn btn-primary btn-full" onclick="Invoices.save()">
            💾 Save Invoice
          </button>
        </div>
      </div>
    `);

    // Init description lines
    _descLines = [];
    addLine();
    addLine();
  }

  /* ---------- Description lines ---------- */
  function addLine() {
    const id = 'dl-' + Date.now() + Math.random().toString(36).slice(2, 5);
    _descLines.push(id);
    const wrap = document.getElementById('desc-lines-wrap');
    if (!wrap) return;
    const div = document.createElement('div');
    div.className = 'desc-line';
    div.id = id;
    div.innerHTML = `
      <input class="form-input dl-desc" placeholder="e.g. Tirage câble 2.5mm²" oninput="Invoices.calcTotals()">
      <input class="form-input dl-qty"  type="number" value="1" min="0.01" step="0.1" placeholder="Qty" oninput="Invoices.calcTotals()" style="width:64px">
      <input class="form-input dl-price" type="number" placeholder="P.U HT" step="0.001" oninput="Invoices.calcTotals()" style="width:96px">
      <button class="btn-icon" onclick="Invoices.removeLine('${id}')">✕</button>`;
    wrap.appendChild(div);
  }

  function removeLine(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
    _descLines = _descLines.filter(x => x !== id);
    calcTotals();
  }

  function getLines() {
    const wrap = document.getElementById('desc-lines-wrap');
    if (!wrap) return [];
    return Array.from(wrap.querySelectorAll('.desc-line')).map(row => ({
      desc:  row.querySelector('.dl-desc').value.trim(),
      qty:   parseFloat(row.querySelector('.dl-qty').value) || 1,
      price: parseFloat(row.querySelector('.dl-price').value) || 0,
    })).filter(l => l.desc || l.price > 0);
  }

  function calcTotals() {
    const lines  = getLines();
    const s      = DB.getSettings();
    const ht     = lines.reduce((a, l) => a + l.qty * l.price, 0);
    const tvaAmt = ht * ((s.tva || 19) / 100);
    const timbre = s.timbre || 1;
    const ttc    = ht + tvaAmt + timbre;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('calc-ht',  ht.toFixed(3) + ' TND');
    set('calc-tva', tvaAmt.toFixed(3) + ' TND');
    set('calc-timbre', timbre.toFixed(3) + ' TND');
    set('calc-ttc', ttc.toFixed(3) + ' TND');
  }

  /* ---------- Save ---------- */
  function save() {
    const clientId = document.getElementById('inv-client').value;
    if (!clientId) { showToast('⚠️ Select a client first'); return; }
    const lines = getLines();
    if (!lines.length) { showToast('⚠️ Add at least one work line'); return; }

    const s      = DB.getSettings();
    const ht     = lines.reduce((a, l) => a + l.qty * l.price, 0);
    const tvaAmt = ht * ((s.tva || 19) / 100);
    const timbre = s.timbre || 1;
    const ttc    = ht + tvaAmt + timbre;

    const inv = DB.insert('invoices', {
      num:      document.getElementById('inv-num').value,
      clientId,
      date:     document.getElementById('inv-date').value,
      type:     document.getElementById('inv-type').value,
      lines,
      ht, tvaAmt, timbre, ttc,
      status:   document.getElementById('inv-status').value,
    });

    DB.incrementInvoiceNumber();
    closeModal();
    showToast('✅ Invoice N°' + inv.num + ' saved');
    Router.go(Router.current() === 'invoices' ? 'invoices' : 'dashboard');
  }

  /* ---------- Preview (French invoice doc) ---------- */
  function preview(id) {
    const inv = DB.getById('invoices', id);
    if (!inv) return;
    const cl = DB.getById('clients', inv.clientId);
    const s  = DB.getSettings();

    const rows = (inv.lines || []).map(l => `
      <tr>
        <td>${l.desc}</td>
        <td>${l.qty}</td>
        <td>${(l.price).toFixed(3)}</td>
        <td>${(l.qty * l.price).toFixed(3)}</td>
      </tr>`).join('');

    openModal(`
      <div class="modal-overlay">
        <div class="modal" style="max-width:540px">
          <div class="modal-hdr no-print">
            <span class="modal-title">🖨️ Invoice Preview</span>
            <button class="modal-close" onclick="closeModal()">✕ Close</button>
          </div>

          <div class="invoice-doc" id="inv-print-area">
            <!-- HEADER -->
            <div class="inv-hdr">
              <div>
                <div class="inv-co">${s.company || 'Votre Entreprise'}</div>
                <div class="inv-co-sub">
                  ${s.activity || ''}<br>
                  M.F : ${s.mf || '—'}<br>
                  GSM : ${s.phone || '—'}<br>
                  ${s.address || ''}
                </div>
              </div>
              <div style="text-align:right">
                <div class="inv-badge">FACTURE N° ${inv.num}</div>
                <div style="font-size:11px;color:#555;margin-top:8px">Date : ${fmtDate(inv.date)}</div>
                <div style="font-size:11px;color:#555">Lieu : ${cl ? (cl.loc || s.address || '') : ''}</div>
              </div>
            </div>

            <!-- PARTIES -->
            <div class="inv-parties">
              <div>
                <div class="inv-party-lbl">Fournisseur</div>
                <div class="inv-party-name">${s.company || '—'}</div>
                <div class="inv-party-det">
                  M.F : ${s.mf || '—'}<br>
                  Tél : ${s.phone || '—'}<br>
                  ${s.address || ''}
                </div>
              </div>
              <div>
                <div class="inv-party-lbl">Client</div>
                <div class="inv-party-name">${cl ? cl.name : '—'}</div>
                <div class="inv-party-det">
                  ${cl && cl.clientId ? 'ID : ' + cl.clientId + '<br>' : ''}
                  ${cl && cl.mf ? 'M.F : ' + cl.mf + '<br>' : ''}
                  ${cl && cl.phone ? 'Tél : ' + cl.phone + '<br>' : ''}
                  ${cl && cl.loc ? cl.loc : ''}
                </div>
              </div>
            </div>

            <!-- TYPE -->
            <div style="font-size:11px;color:#555;margin-bottom:12px">
              Objet : <strong style="color:#111">${inv.type || ''}</strong>
            </div>

            <!-- TABLE -->
            <table class="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qté</th>
                  <th>P.U HT</th>
                  <th>Montant HT</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <!-- TOTALS -->
            <div class="inv-totals">
              <div class="inv-total-row"><span>Total H.T</span><span>${(inv.ht || 0).toFixed(3)} TND</span></div>
              <div class="inv-total-row"><span>TVA ${s.tva || 19}%</span><span>${(inv.tvaAmt || 0).toFixed(3)} TND</span></div>
              <div class="inv-total-row"><span>Droit de timbre</span><span>${(inv.timbre || 1).toFixed(3)} TND</span></div>
              <div class="inv-total-final"><span>Total TTC</span><span>${(inv.ttc || 0).toFixed(3)} TND</span></div>
            </div>

            <!-- FOOTER -->
            <div class="inv-footer">
              La présente facture est arrêtée à la somme de :<br>
              <strong>${numToWords(inv.ttc)}</strong> dinars tunisiens<br>
            </div>

            <!-- SIGNATURE -->
            <div class="inv-signature">
              <div class="inv-signature-box">Cachet et Signature</div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div style="display:flex;gap:8px;margin-top:16px" class="no-print">
            <button class="btn btn-secondary btn-full" onclick="window.print()">🖨️ Print</button>
            <button class="btn btn-primary btn-full" onclick="Invoices.markPaid('${id}')">✅ Mark Paid</button>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px" class="no-print">
            <button class="btn btn-danger btn-full" onclick="Invoices.remove('${id}')">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `);
  }

  /* ---------- Mark Paid ---------- */
  function markPaid(id) {
    DB.update('invoices', id, { status: 'paid' });
    showToast('✅ Invoice marked as paid');
    closeModal();
    Router.go(Router.current());
  }

  /* ---------- Delete ---------- */
  function remove(id) {
    if (!confirm('Delete this invoice? This cannot be undone.')) return;
    DB.remove('invoices', id);
    showToast('🗑️ Invoice deleted');
    closeModal();
    Router.go('invoices');
  }

  /* ---------- Render list ---------- */
  function renderList(container, statusFilter = 'all') {
    let list = DB.getAll('invoices');
    if (statusFilter !== 'all') list = list.filter(i => i.status === statusFilter);
    list.sort((a, b) => b.createdAt - a.createdAt);

    if (!list.length) {
      container.innerHTML = `<div class="empty"><span class="empty-icon">🧾</span><div class="empty-text">No invoices${statusFilter !== 'all' ? ' with this status' : ''}</div></div>`;
      return;
    }

    container.innerHTML = list.map(inv => {
      const cl = DB.getById('clients', inv.clientId);
      return `
        <div class="item" onclick="Invoices.preview('${inv.id}')">
          <div class="item-icon ${statusClass(inv.status)}">📄</div>
          <div class="item-body">
            <div class="item-name">${cl ? cl.name : '—'}</div>
            <div class="item-sub">N° ${inv.num} · ${fmtDate(inv.date)} · ${inv.type || ''}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${(inv.ttc || 0).toFixed(3)}</div>
            <div class="item-date"><span class="badge ${inv.status}">${statusLabel(inv.status)}</span></div>
          </div>
        </div>`;
    }).join('');
  }

  return { showAddModal, addLine, removeLine, calcTotals, save, preview, markPaid, remove, renderList };
})();
