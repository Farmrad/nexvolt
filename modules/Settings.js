window.Settings = {
  render: function() {
    return `
      <div class="page" style="padding:20px;">
        <h3>Settings & Backup</h3>
        <button onclick="navigator.clipboard.writeText(DB.exportData()); alert('Data copied!');" style="width:100%; padding:15px; background:#3498db; border:none; color:white; border-radius:8px; cursor:pointer;">Copy Backup Data</button>
        <button onclick="const d = prompt('Paste Backup JSON:'); if(d) DB.importData(d);" style="width:100%; padding:15px; margin-top:10px; background:#444; border:none; color:white; border-radius:8px; cursor:pointer;">Restore from Backup</button>
      </div>
    `;
  }
};
