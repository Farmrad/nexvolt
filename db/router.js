window.Router = (() => {
  const pages = {
    dashboard: () => typeof Dashboard !== 'undefined' && Dashboard.render(),
    invoices:  () => typeof InvoicesPage !== 'undefined' && InvoicesPage.render(),
    expenses:  () => typeof ExpensesPage !== 'undefined' && ExpensesPage.render(),
    clients:   () => typeof ClientsPage !== 'undefined' && ClientsPage.render()
  };

  function go(pageName) {
    // 1. Highlight the correct button in the bottom menu
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.dataset.page === pageName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // 2. Close any open popups/modals securely
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      const overlay = modalRoot.querySelector('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => modalRoot.innerHTML = '', 300); // Wait for slide-down animation
      } else {
        modalRoot.innerHTML = '';
      }
    }

    // 3. Load the requested page content into the main <main id="app"> container
    const appContainer = document.getElementById('app');
    if (pages[pageName]) {
      pages[pageName]();
    } else {
      appContainer.innerHTML = `<div class="empty">Page introuvable ou en construction.</div>`;
    }
    
    // 4. Scroll back to top automatically
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return { go };
})();
