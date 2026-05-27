document.addEventListener('DOMContentLoaded', () => {
  // Initialize Database
  DB.init();

  // Set today's date in the top bar
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('fr-FR', options);
  }

  // Register Service Worker for Offline Mode
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Error', err));
  }

  // Load the Dashboard by default
  Router.go('dashboard');
});

// Global helper for toast notifications
window.showToast = (message) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};
