window.Clients = {
  render: () => {
    let html = `<div><h3>Clients</h3><button onclick="Clients.add()">+ Add Client</button>`;
    DB.state.clients.forEach(c => {
      html += `<div class="client-item">
        <strong>${c.name}</strong> (ID: ${c.id})<br>
        ${c.phone} | ${c.loc}<br>
        Deal: ${c.deal} | Price: ${c.price} TND
      </div>`;
    });
    return html + `</div>`;
  },
  add: () => {
    // Simply prompt for fields or open a modal
    const name = prompt("Name:");
    const id = prompt("ID:");
    const phone = prompt("Phone:");
    const loc = prompt("Location:");
    const deal = prompt("Status (e.g. Negotiation):");
    const price = prompt("Total Price:");
    
    DB.state.clients.push({ name, id, phone, loc, deal, price });
    DB.save();
    Router.go('Dashboard');
  }
};
