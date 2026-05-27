window.DB = {
  state: JSON.parse(localStorage.getItem('nexvolt_data')) || {
    clients: [], invoices: [], expenses: [], jobs: []
  },
  save: function() {
    localStorage.setItem('nexvolt_data', JSON.stringify(this.state));
  },
  getStats: function() {
    const revenue = this.state.invoices.filter(i => i.status === 'paid').reduce((a, b) => a + Number(b.ttc), 0);
    const unpaid = this.state.invoices.filter(i => i.status === 'unpaid').reduce((a, b) => a + Number(b.ttc), 0);
    return {
      revenue: revenue.toFixed(3),
      unpaid: unpaid.toFixed(3),
      jobs: this.state.jobs.filter(j => j.status !== 'Done').length,
      clients: this.state.clients.length
    };
  },
  backup: function() {
    return JSON.stringify(this.state);
  },
  restore: function(json) {
    this.state = JSON.parse(json);
    this.save();
  }
};
