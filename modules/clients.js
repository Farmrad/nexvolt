/* ============================================================
   NEXVOLT — modules/clients.js
   Client management: add, edit, view, delete
   ============================================================ */

const Clients = (() => {

  /* ---------- Modal: Add / Edit client ---------- */
  function showAddModal(prefill = {}) {
    openModal(`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-hdr">
            <span class="modal-title">👤 New Client</span>
            <button class="modal-close" onclick="closeModal()">✕ Close</button>
          </div>

          <div class="form-group">
            <label class="form-label">Full Name / Company</label>
            <input class="form-input" id="cl-name" placeholder="Comptoir Moderne..." value="${prefill.name || ''}">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Client ID (international)</label>
              <input class="form-input" id="cl-cid" placeholder="12803954" value="${prefill.clientId || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Matricule Fiscale</label>
              <input class="form-input" id="cl-mf" placeholder="160571 XBM 000" value="${prefill.mf || ''}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input class="form-input" id="cl-phone" type="tel" placeholder="+216 XX XXX XXX" value="${prefill.phone || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Location / City</label>
              <input class="form-input" id="cl-loc" placeholder="Akouda, Sousse" value="${prefill.loc || ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-input" id="cl-type">
              <option value="Particulier" ${prefill.type === 'Particulier' ? 'selected' : ''}>Particulier</option>
              <option value="Société" ${prefill.type === 'Société' ? 'selected' : ''}>Société / Commerce</option>
              <option value="Café/Restaurant" ${prefill.type === 'Café/Restaurant' ? 'selected' : ''}>Café / Restaurant</option>
              <option value="Sous-traitant" ${prefill.type === 'Sous-traitant' ? 'selected' : ''}>Sous-traitant</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-input form-textarea" id="cl-notes" placeholder="Payment habits, location notes...">${prefill.notes || ''}</textarea>
          </div>

          <button class="btn btn-primary btn-full" onclick="Clients.save('${prefill.id || ''}')">
            💾 Save Client
          </button>
        </div>
      </div>
    `);
  }

  /* ---------- Save ---------- */
  function save(editId = '') {
    const name = document.getElementById('cl-name').value.trim();
    if (!name) { showToast('⚠️ Name is required'); return; }

    const data = {
      name,
      clientId: document.getElementById('cl-cid').value.trim(),
      mf:       document.getElementById('cl-mf').value.trim(),
      phone:    document.getElementById('cl-phone').value.trim(),
      loc:      document.getElementById('cl-loc').value.trim(),
      type:     document.getElementById('cl-type').value,
      notes:    document.getElementById('cl-notes').value.trim(),
    };

    if (editId) {
      DB.update('clients', editId, data);
      showToast('✅ Client updated');
    } else {
      DB.insert('clients', data);
      showToast('✅ Client added');
    }

    closeModal();
    if (Router.current() === 'clients') Router.go('clients');
    if (Router.current() === 'dashboard') Router.go('dashboard');
  }

  /* ---------- Detail modal ---------- */
  function showDetail(id) {
    const c    = DB.getById('clients', id);
    if (!c) return;
    const invs = DB.getAll('invoices').filter(i => i.clientId === id);
    const total  = invs.reduce((a, i) => a + (i.ttc || 0), 0);
    const paid   = invs.filter(i => i.status === 'paid').reduce((a, i) => a + (i.ttc || 0), 0);
    const unpaid = total - paid;

    openModal(`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-hdr">
            <span class="modal-title">${c.name}</span>
            <button class="modal-close" onclick="closeModal()">✕ Close</button>
          </div>

          <div class="card" style="margin-bottom:12px">
            ${row('Type', c.type)}
            ${c.clientId ? row('Client ID', `<span style="font-family:var(--mono)">${c.clientId}</span>`) : ''}
            ${c.mf ? row('M.F', `<span style="font-family:var(--mono)">${c.mf}</span>`) : ''}
            ${c.phone ? row('Phone', `<a href="tel:${c.phone}" style="color:var(--blue)">${c.phone}</a>`) : ''}
            ${c.loc ? row('Location', c.loc) : ''}
          </div>

          <div class="stats" style="margin-bottom:12px">
            <div class="stat"><div class="stat-label">Total Invoiced</div><div class="stat-val accent">${total.toFixed(3)}</div><div class="stat-sub">TND</div></div>
            <div class="stat"><div class="stat-label">Collected</div><div class="stat-val green">${paid.toFixed(3)}</div><div class="stat-sub">TND</div></div>
            <div class="stat"><div class="stat-label">Outstanding</div><div class="stat-val red">${unpaid.toFixed(3)}</div><div class="stat-sub">TND</div></div>
            <div class="stat"><div class="stat-label">Invoices</div><div class="stat-val blue">${invs.length}</div><div class="stat-sub">Total</div></div>
          </div>

          ${c.notes ? `<div class="card-sm" style="font-size:13px;color:var(--muted);margin-bottom:12px">${c.notes}</div>` : ''}

          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary btn-full" onclick="closeModal();Clients.showAddModal(${JSON.stringify(c).replace(/"/g,'&quot;')})">✏️ Edit</button>
            <button class="btn btn-danger btn-full" onclick="Clients.remove('${id}')">🗑️ Delete</button>
          </div>
          <button class="btn btn-primary btn-full" style="margin-top:8px" onclick="closeModal();Invoices.showAddModal('${id}')">📄 New Invoice</button>
        </div>
      </div>
    `);
  }

  function row(label, val) {
    return `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border)">
      <span style="color:var(--muted)">${label}</span><span>${val}</span>
    </div>`;
  }

  /* ---------- Delete ---------- */
  function remove(id) {
    if (!confirm('Delete this client? Their invoices will remain.')) return;
    DB.remove('clients', id);
    showToast('🗑️ Client deleted');
    closeModal();
    Router.go('clients');
  }

  /* ---------- Render list ---------- */
  function renderList(container, filter = '') {
    let list = DB.getAll('clients');
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.loc || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.createdAt - a.createdAt);

    if (!list.length) {
      container.innerHTML = `<div class="empty"><span class="empty-icon">👤</span><div class="empty-text">${filter ? 'No results' : 'No clients yet'}</div></div>`;
      return;
    }

    const typeIcon = { Particulier: '🏠', Société: '🏢', 'Café/Restaurant': '☕', Sous-traitant: '🔌' };
    const typeColor= { Particulier: 'yellow', Société: 'blue', 'Café/Restaurant': 'green', Sous-traitant: 'purple' };

    container.innerHTML = list.map(c => {
      const invs  = DB.getAll('invoices').filter(i => i.clientId === c.id);
      const total = invs.reduce((a, i) => a + (i.ttc || 0), 0);
      return `
        <div class="item" onclick="Clients.showDetail('${c.id}')">
          <div class="item-icon ${typeColor[c.type] || 'yellow'}">${typeIcon[c.type] || '👤'}</div>
          <div class="item-body">
            <div class="item-name">${c.name}</div>
            <div class="item-sub">${c.phone || ''}${c.loc ? ' · ' + c.loc : ''}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${total.toFixed(0)} TND</div>
            <div class="item-date">${invs.length} invoice${invs.length !== 1 ? 's' : ''}</div>
          </div>
        </div>`;
    }).join('');
  }

  return { showAddModal, save, showDetail, remove, renderList };
})();
