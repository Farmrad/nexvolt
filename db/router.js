window.Router = (() => {
  const pages = {
    dashboard: () => typeof Dashboard !== 'undefined' && Dashboard.render(),
    invoices:  () => typeof InvoicesPage !== 'undefined' && InvoicesPage.render(),
    expenses:  () => typeof ExpensesPage !== 'undefined' && ExpensesPage.render(),
    clients:   () => typeof ClientsPage !== 'undefined' && ClientsPage.render()
  };

  function go(pageName) {
    // 1. Update bottom navigation UI active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.dataset.page === pageName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // 2. Close any open modals
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      const overlay = modalRoot.querySelector('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => modalRoot.innerHTML = '', 300); // Wait for animation
      } else {
        modalRoot.innerHTML = '';
      }
    }

    // 3. Load the requested page
    const appContainer = document.getElementById('app');
    if (pages[pageName]) {
      pages[pageName]();
    } else {
      appContainer.innerHTML = `<div class="empty">Page introuvable</div>`;
    }
    
    // 4. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return { go };
})();
