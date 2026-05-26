function initApp() {
  initDB();
  loadJobs();
  loadClients();
}

// NAVIGATION
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

// ---------------- JOBS ----------------
function openJobForm() {
  const type = prompt("Job type:");
  const total = prompt("Total price:");

  let tx = db.transaction("jobs", "readwrite");
  let store = tx.objectStore("jobs");

  store.add({
    type,
    total,
    createdAt: new Date()
  });

  loadJobs();
}

function loadJobs() {
  let tx = db.transaction("jobs", "readonly");
  let store = tx.objectStore("jobs");

  let req = store.getAll();

  req.onsuccess = () => {
    let html = "";
    req.result.forEach(job => {
      html += `
        <div class="card">
          <b>${job.type}</b><br>
          ${job.total} TND
        </div>
      `;
    });

    document.getElementById("jobsList").innerHTML = html;
  };
}

// ---------------- CLIENTS ----------------
function openClientForm() {
  const name = prompt("Client name:");
  const phone = prompt("Phone:");

  let tx = db.transaction("clients", "readwrite");
  let store = tx.objectStore("clients");

  store.add({
    name,
    phone,
    createdAt: new Date()
  });

  loadClients();
}

function loadClients() {
  let tx = db.transaction("clients", "readonly");
  let store = tx.objectStore("clients");

  let req = store.getAll();

  req.onsuccess = () => {
    let html = "";
    req.result.forEach(c => {
      html += `
        <div class="card">
          <b>${c.name}</b><br>
          ${c.phone}
        </div>
      `;
    });

    document.getElementById("clientsList").innerHTML = html;
  };
}
