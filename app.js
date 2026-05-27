document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize DB
  DB.init();

  // 2. Set today's date
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', day: 'numeric', month: 'long' 
    });
  }

  // 3. Register Service Worker (Offline capability)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.log('SW Registration failed', err));
  }

  // 4. Start the app
  Router.go('dashboard');
});
