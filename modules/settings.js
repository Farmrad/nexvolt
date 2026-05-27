window.Settings = {
  render: () => {
    return `<div>
      <h3>Settings</h3>
      <button onclick="navigator.clipboard.writeText(DB.exportData())">Copy Backup</button>
      <button onclick="const d = prompt('Paste backup JSON:'); DB.importData(d); Router.go('Dashboard');">Restore Backup</button>
    </div>`;
  }
};
