window.Router = {
  go: function(moduleName) {
    const app = document.getElementById('app');
    if (window[moduleName] && typeof window[moduleName].render === 'function') {
      app.innerHTML = window[moduleName].render();
      
      // Update active nav state
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === moduleName);
      });
    } else {
      console.error("Module not found: " + moduleName);
      app.innerHTML = `<div style="padding:20px; color:white;">Error: Module ${moduleName} not found.</div>`;
    }
  }
};
