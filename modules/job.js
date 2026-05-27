window.JobPage = (() => {
  function render() {
    const app = document.getElementById('app');
    const jobs = DB.getAll('jobs').sort((a, b) => b.createdAt - a.createdAt);

    let html = `
      <div class="page">
        <div class="section-hdr">
          <div class="section-title">Chantiers / Travaux</div>
          <button class="btn btn-primary btn-sm" onclick="JobPage.openForm()">+ Job</button>
        </div>
    `;

    if (jobs.length === 0) {
      html += `<div class="empty">Aucun chantier en cours.</div>`;
    } else {
      jobs.forEach(j => {
        html += `
          <div class="item">
            <div class="item-icon blue">⚡</div>
            <div class="item-body">
              <div class="item-name">${j.title}</div>
              <div class="item-sub">Client: ${j.client}</div>
            </div>
            <div class="item-right">
              <div class="status ${j.status === 'Terminé' ? 'paid' : 'unpaid'}">${j.status}</div>
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
            <div class="modal-title">Nouveau Chantier</div>
            <button class="modal-close" onclick="JobPage.closeForm()">Fermer</button>
          </div>
          <div class="form-group">
            <input type="text" id="job-title" class="form-input" placeholder="Nom du chantier / Travail">
          </div>
          <div class="form-group">
            <input type="text" id="job-client" class="form-input" placeholder="Client">
          </div>
          <button class="btn btn-primary btn-full" onclick="JobPage.saveJob()">Enregistrer</button>
        </div>
      </div>
    `;
  }

  function saveJob() {
    const title = document.getElementById('job-title').value;
    const client = document.getElementById('job-client').value;

    if (!title) return alert("Nom du chantier obligatoire.");

    DB.insert('jobs', { title, client, status: 'En cours' });
    closeForm();
    render();
  }

  function closeForm() {
    document.getElementById('modal-root').innerHTML = '';
  }

  return { render, openForm, closeForm, saveJob };
})();
