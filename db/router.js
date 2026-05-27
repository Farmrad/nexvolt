window.Router = (() => {
  const pages = {
    dashboard: () => typeof Dashboard !== 'undefined' && Dashboard.render(),
    invoices:  () => typeof InvoicesPage !== 'undefined' && InvoicesPage.render(),
    expenses:  () => typeof ExpensesPage !== 'undefined' && ExpensesPage.render(),
    clients:   () => typeof ClientsPage !== 'undefined' && ClientsPage.render(),
    finance:   () => typeof FinancePage !== 'undefined' && FinancePage.render(),
    settings:  () => typeof SettingsPage !== 'undefined' && SettingsPage.render()
  };

  function go(pageName) {
    // Update bottom navigation UI
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });
    
    // Close any open modals when navigating
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';

    // Load the page
    if(pages[pageName]) {
      pages[pageName]();
    } else {
      document.getElementById('app').innerHTML = `<div class="empty">Page not found</div>`;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  return { go };
})();
