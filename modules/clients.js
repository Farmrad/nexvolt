window.ClientsPage = (() => {
  function render() {
    const app = document.getElementById('app');
    const clients = DB.getAll('clients').sort((a, b) => b.createdAt - a.createdAt);

    let html = `
      <div class="page">
        <div class="section-hdr">
          <div class="section-title">Clients</div>
          <button class="btn btn-primary btn-sm" onclick="ClientsPage.openForm()">+ Client</button>
        </div>
    `;

    if (clients.length === 0) {
      html += `
        <div class="empty">
          <div class="empty-icon">👥</div>
          <div class="empty-text">Aucun client enregistré.</div>
        </div>
      `;
    } else {
      clients.forEach(c => {
        html += `
          <div class="item">
            <div class="item-icon">👤</div>
            <div class="item-body">
              <div class="item-name">${c.name}</div>
              <div class="item-sub">M.F: ${c.mf || '-'}</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="ClientsPage.deleteClient('${c.id}')">Suppr</button>
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
            <div class="modal-title">Nouveau Client</div>
            <button class="modal-close" onclick="ClientsPage.closeForm()">Fermer</button>
          </div>
          
          <div class="form-group">
            <input type="text" id="cli-name" class="form-input" placeholder="Nom du Client / Entreprise">
          </div>
          <div class="form-group">
            <input type="text" id="cli-mf" class="form-input" placeholder="Matricule Fiscale">
          </div>
          <button class="btn btn-primary btn-full" onclick="ClientsPage.saveClient()">Enregistrer</button>
        </div>
      </div>
    `;
  }

  function saveClient() {
    const name = document.getElementById('cli-name').value;
    if (!name) return alert("Le nom est obligatoire.");

    DB.insert('clients', {
      name,
      mf: document.getElementById('cli-mf').value
    });

    closeForm();
    render();
  }

  function deleteClient(id) {
    if (confirm("Supprimer ce client ?")) {
      DB.remove('clients', id);
      render();
    }
  }

  function closeForm() {
    document.getElementById('modal-root').innerHTML = '';
  }

  return { render, openForm, closeForm, saveClient, deleteClient };
})();
