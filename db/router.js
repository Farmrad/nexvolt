window.Router = {
  go: (module) => {
    document.getElementById('app').innerHTML = window[module] ? window[module].render() : 'Module not found';
  }
};
