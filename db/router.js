window.Router = {
  go: (moduleName) => {
    const app = document.getElementById('app');
    if (window[moduleName] && typeof window[moduleName].render === 'function') {
      app.innerHTML = window[moduleName].render();
    } else {
      app.innerHTML = `<div style="padding:20px; color:white;">Module "${moduleName}" not found. Check your file names!</div>`;
      console.error("Router Error: Cannot find module", moduleName);
    }
  }
};
