window.ClientsPage = (() => {
  function render() {
    const clients = DB.getAll('clients');
    let html = `<div class="page"><div class="section-hdr"><h3>Clients</h3><button onclick="ClientsPage.openForm()">+ Client</button></div>`;
    clients.forEach(c => {
      html += `<div class="item">
        <div><strong>${c.name}</strong><br><small>${c.phone} - ${c.location}</small></div>
        <div>Deal: ${c.deal} (${c.price} DT)</div>
      </div>`;
    });
    document.getElementById('app').innerHTML = html + `</div>`;
  }

  function openForm() {
    document.getElementById('modal-root').innerHTML = `
      <div class="modal-overlay open">
        <div class="modal">
          <input type="text" id="c-name" placeholder="Nom">
          <input type="text" id="c-phone" placeholder="Téléphone">
          <input type="text" id="c-loc" placeholder="Localisation">
          <input type="number" id="c-price" placeholder="Prix Total (DT)">
          <select id="c-deal"><option>En cours</option><option>Négociation</option></select>
          <button onclick="ClientsPage.save()">Enregistrer</button>
        </div>
      </div>`;
  }

  function save() {
    DB.insert('clients', {
      name: document.getElementById('c-name').value,
      phone: document.getElementById('c-phone').value,
      location: document.getElementById('c-loc').value,
      price: document.getElementById('c-price').value,
      deal: document.getElementById('c-deal').value
    });
    document.getElementById('modal-root').innerHTML = '';
    render();
  }
  return { render, openForm, save };
})();
