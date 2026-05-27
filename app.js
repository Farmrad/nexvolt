document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize DB if it exists
  if (typeof DB !== 'undefined' && DB.init) {
    DB.init();
  }

  // 2. Set today's date
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', day: 'numeric', month: 'long' 
    });
  }

  // 3. Start the app - MUST match the variable name in your module (Dashboard)
  if (typeof Router !== 'undefined') {
    Router.go('Dashboard'); 
  } else {
    console.error("Router is not loaded!");
  }
});
