window.Clients = {
  render: function() {
    let html = `<div class="page" style="padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3>Clients</h3>
        <button onclick="Clients.openForm()" style="background:#ff9f43; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">+ Add Client</button>
      </div>`;
    
    DB.state.clients.forEach((c, index) => {
      html += `
        <div style="background:#151a23; padding:15px; border-radius:12px; margin-bottom:10px; border:1px solid #222;">
          <strong>${c.name}</strong> <small style="color:#8b949e">(ID: ${c.id})</small><br>
          <div style="font-size:13px; margin-top:8px;">
            📞 ${c.phone} | 📍 ${c.loc}<br>
            Deal: <span style="color:#3498db">${c.deal}</span> | Price: <strong>${c.price} TND</strong>
          </div>
        </div>
      `;
    });
    return html + `</div>`;
  },

  openForm: function() {
    const modal = document.createElement('div');
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:1000;";
    modal.innerHTML = `
      <div style="background:#151a23; padding:20px; border-radius:12px; width:90%; max-width:400px; border:1px solid #333;">
        <h4 style="margin-top:0;">New Client</h4>
        <input type="text" id="c-name" placeholder="Name" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <input type="text" id="c-id" placeholder="Client ID" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <input type="text" id="c-phone" placeholder="Phone" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <input type="text" id="c-loc" placeholder="Location" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <input type="text" id="c-deal" placeholder="Deal Status" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <input type="number" id="c-price" placeholder="Total Price (TND)" style="width:100%; margin-bottom:10px; padding:10px; background:#0a0e17; border:1px solid #333; color:#fff;">
        <button onclick="Clients.save()" style="width:100%; padding:10px; background:#2ecc71; border:none; border-radius:6px; cursor:pointer;">Save Client</button>
        <button onclick="this.parentElement.parentElement.remove()" style="width:100%; margin-top:10px; background:transparent; border:1px solid #444; color:#fff; padding:10px; cursor:pointer;">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  save: function() {
    DB.state.clients.push({
      name: document.getElementById('c-name').value,
      id: document.getElementById('c-id').value,
      phone: document.getElementById('c-phone').value,
      loc: document.getElementById('c-loc').value,
      deal: document.getElementById('c-deal').value,
      price: document.getElementById('c-price').value
    });
    DB.save();
    Router.go('Clients');
  }
};
