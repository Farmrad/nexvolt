function initApp() {
  initDB();

  // Small delay to ensure DB is ready
  setTimeout(() => {
    loadJobs();
    loadClients();
  }, 200);
}

// ---------------- NAVIGATION ----------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

// ---------------- SAVE JOB ----------------
function saveJob() {
  const type = document.getElementById("jobType").value;
  const total = document.getElementById("jobTotal").value;

  if (!type || !total) {
    alert("Please fill all fields");
    return;
  }

  let tx = db.transaction("jobs", "readwrite");
  let store = tx.objectStore("jobs");

  store.add({
    type,
    total,
    status: "active",
    createdAt: new Date()
  });

  tx.oncomplete = () => {
    document.getElementById("jobType").value = "";
    document.getElementById("jobTotal").value = "";

    loadJobs();
  };
}

// ---------------- LOAD JOBS ----------------
function loadJobs() {
  let tx = db.transaction("jobs", "readonly");
  let store = tx.objectStore("jobs");

  let req = store.getAll();

  req.onsuccess = () => {
    let html = "";

    req.result.reverse().forEach(job => {
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

// ---------------- SAVE CLIENT ----------------
function saveClient() {
  const name = document.getElementById("clientName").value;
  const phone = document.getElementById("clientPhone").value;

  if (!name || !phone) {
    alert("Please fill all fields");
    return;
  }

  let tx = db.transaction("clients", "readwrite");
  let store = tx.objectStore("clients");

  store.add({
    name,
    phone,
    createdAt: new Date()
  });

  tx.oncomplete = () => {
    document.getElementById("clientName").value = "";
    document.getElementById("clientPhone").value = "";

    loadClients();
  };
}

// ---------------- LOAD CLIENTS ----------------
function loadClients() {
  let tx = db.transaction("clients", "readonly");
  let store = tx.objectStore("clients");

  let req = store.getAll();

  req.onsuccess = () => {
    let html = "";

    req.result.reverse().forEach(client => {
      html += `
        <div class="card">
          <b>${client.name}</b><br>
          ${client.phone}
        </div>
      `;
    });

    document.getElementById("clientsList").innerHTML = html;
  };
}
