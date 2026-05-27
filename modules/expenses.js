window.ExpensesPage = (() => {
  let selectedCategory = 'car';

  function render() {
    const app = document.getElementById('app');
    const expenses = DB.getAll('expenses').sort((a, b) => b.createdAt - a.createdAt);

    let html = `
      <div class="page">
        <div class="section-hdr">
          <div class="section-title">Dépenses</div>
          <button class="btn btn-primary btn-sm" onclick="ExpensesPage.openForm()">+ Dépense</button>
        </div>
    `;

    if (expenses.length === 0) {
      html += `
        <div class="empty">
          <div class="empty-icon">💸</div>
          <div class="empty-text">Aucune dépense enregistrée.</div>
        </div>
      `;
    } else {
      expenses.forEach(exp => {
        let icon = '📝';
        let colorClass = 'purple';
        
        if (exp.category === 'car') { icon = '🚗'; colorClass = 'red'; }
        if (exp.category === 'tools') { icon = '🛠️'; colorClass = 'blue'; }
        if (exp.category === 'materials') { icon = '📦'; colorClass = 'yellow'; }

        const catNames = { car: 'Voiture', tools: 'Outils', materials: 'Matériel', other: 'Autre' };

        html += `
          <div class="item">
            <div class="item-icon ${colorClass}">${icon}</div>
            <div class="item-body">
              <div class="item-name">${exp.description}</div>
              <div class="item-sub">${catNames[exp.category]}</div>
            </div>
            <div class="item-right">
              <div class="item-amount" style="color: var(--red);">- ${exp.amount.toFixed(3)} DT</div>
              <div class="item-date">${new Date(exp.date).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    app.innerHTML = html;
  }

  function openForm() {
    selectedCategory = 'car';
    const modal = document.getElementById('modal-root');
    modal.innerHTML = `
      <div class="modal-overlay open">
        <div class="modal">
          <div class="modal-hdr">
            <div class="modal-title">Ajouter une dépense</div>
            <button class="modal-close" onclick="ExpensesPage.closeForm()">Fermer</button>
          </div>
          
          <div class="form-group">
            <label class="form-label">Catégorie</label>
            <div class="exp-cats">
              <div class="exp-cat selected" id="cat-car" onclick="ExpensesPage.setCat('car')">
                <span class="exp-cat-icon">🚗</span>
                <span class="exp-cat-name">Voiture</span>
                <span class="exp-cat-sub">Carburant, réparations</span>
              </div>
              <div class="exp-cat" id="cat-tools" onclick="ExpensesPage.setCat('tools')">
                <span class="exp-cat-icon">🛠️</span>
                <span class="exp-cat-name">Outils</span>
                <span class="exp-cat-sub">Pinces, vis, matériel pro</span>
              </div>
              <div class="exp-cat" id="cat-materials" onclick="ExpensesPage.setCat('materials')">
                <span class="exp-cat-icon">📦</span>
                <span class="exp-cat-name">Matériel</span>
                <span class="exp-cat-sub">Câbles, coffrets...</span>
              </div>
              <div class="exp-cat" id="cat-other" onclick="ExpensesPage.setCat('other')">
                <span class="exp-cat-icon">📝</span>
                <span class="exp-cat-name">Autre</span>
                <span class="exp-cat-sub">Café, repas, divers</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description détaillée</label>
            <input type="text" id="exp-desc" class="form-input" placeholder="Ex: Plein gasoil, Achat de vis...">
          </div>

          <div class="form-group">
            <label class="form-label">Montant (DT)</label>
            <input type="number" id="exp-amount" class="form-input" placeholder="0.000" step="0.001">
          </div>

          <button class="btn btn-primary btn-full" style="margin-top:20px;" onclick="ExpensesPage.saveExpense()">Enregistrer</button>
        </div>
      </div>
    `;
  }

  function setCat(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.exp-cat').forEach(el => el.classList.remove('selected'));
    document.getElementById('cat-' + cat).classList.add('selected');
  }

  function saveExpense() {
    const desc = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);

    if (!desc || !amount) {
      alert("Veuillez remplir la description et le montant.");
      return;
    }

    DB.insert('expenses', {
      category: selectedCategory,
      description: desc,
      amount: amount,
      date: new Date().toISOString()
    });

    closeForm();
    render();
  }

  function closeForm() {
    document.getElementById('modal-root').innerHTML = '';
  }

  return { render, openForm, closeForm, setCat, saveExpense };
})();
