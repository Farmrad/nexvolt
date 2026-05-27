window.ExpensesPage = (() => {
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page">
        <div class="section-title">Dépenses</div>
        <div class="empty">En développement...</div>
      </div>
    `;
  }
  return { render };
})();
