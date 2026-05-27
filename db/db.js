window.DB = {
  state: JSON.parse(localStorage.getItem('nexvolt_data')) || {
    clients: [], invoices: [], expenses: [], jobs: [], settings: {}
  },
  init: function() {
    console.log("DB Initialized");
  },
  save: function() {
    localStorage.setItem('nexvolt_data', JSON.stringify(this.state));
  },
  getStats: function() {
    const revenue = this.state.invoices.filter(i => i.status === 'paid').reduce((a, b) => a + Number(b.ttc || 0), 0);
    const unpaid = this.state.invoices.filter(i => i.status === 'unpaid').reduce((a, b) => a + Number(b.ttc || 0), 0);
    return {
      revenue: revenue.toFixed(3),
      unpaid: unpaid.toFixed(3),
      jobs: this.state.jobs.length,
      clients: this.state.clients.length
    };
  },
  exportData: () => JSON.stringify(window.DB.state),
  importData: (json) => {
    window.DB.state = JSON.parse(json);
    window.DB.save();
  }
};
