window.Dashboard = (() => {
  function render() {
    const app = document.getElementById('app');
    const s = DB.stats(); // Gets numbers from your db.js
    
    app.innerHTML = `
      <div class="page">
        <div class="stats">
          <div class="stat">
            <div class="stat-label">Revenus (Ce mois)</div>
            <div class="stat-val accent">${s.monthRevenue.toFixed(3)} TND</div>
          </div>
          <div class="stat">
            <div class="stat-label">Impayés</div>
            <div class="stat-val red">${s.totalUnpaid.toFixed(3)} TND</div>
          </div>
          <div class="stat">
            <div class="stat-label">Chantiers</div>
            <div class="stat-val blue">${s.totalInvoices}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Clients</div>
            <div class="stat-val green">${s.totalClients}</div>
          </div>
        </div>

        <div class="section-hdr" style="margin-top: 30px;">
          <div class="section-title">Dernières Factures</div>
          <button class="btn btn-primary btn-sm" onclick="Router.go('invoices')">+ Facture</button>
        </div>
        
        <div class="empty">
          <div class="empty-icon">📄</div>
          <div>Aucune facture</div>
        </div>

        <div class="section-title" style="margin-top: 30px; margin-bottom: 15px;">Actions Rapides</div>
        <div class="hscroll">
          <div class="hcard" onclick="Router.go('invoices')">
            <div class="hcard-label">Nouvelle</div>
            <div class="hcard-val">Facture</div>
          </div>
          <div class="hcard" onclick="Router.go('clients')">
            <div class="hcard-label">Ajouter</div>
            <div class="hcard-val">Client</div>
          </div>
          <div class="hcard" onclick="Router.go('expenses')">
            <div class="hcard-label">Dépense</div>
            <div class="hcard-val">Enregistrer</div>
          </div>
        </div>
      </div>
    `;
  }

  return { render };
})();
