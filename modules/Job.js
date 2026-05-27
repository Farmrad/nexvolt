window.Job = {
  render: function() {
    let html = `<div class="page" style="padding:20px;"><h3>Jobs in Progress</h3>`;
    DB.state.jobs.forEach(j => {
      html += `<div style="background:#151a23; padding:15px; border-radius:12px; margin-bottom:10px; border:1px solid #222;">
        <strong>${j.title}</strong><br><small style="color:#3498db;">${j.status}</small>
      </div>`;
    });
    return html + `</div>`;
  }
};
