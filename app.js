function initApp() {
  initDB();

  setTimeout(() => {
    loadClients();
    loadClientOptions();
    loadJobs();
  }, 300);
}

// ---------------- NAVIGATION ----------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
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
    loadClientOptions();
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
        <div class="job-card">
          <b>${client.name}</b><br>
          ${client.phone}
        </div>
      `;
    });

    document.getElementById("clientsList").innerHTML = html;
  };
}

// ---------------- CLIENT OPTIONS ----------------
function loadClientOptions() {
  let tx = db.transaction("clients", "readonly");
  let store = tx.objectStore("clients");

  let req = store.getAll();

  req.onsuccess = () => {
    let html = `<option value="">Select Client</option>`;

    req.result.forEach(client => {
      html += `
        <option value="${client.id}">
          ${client.name}
        </option>
      `;
    });

    document.getElementById("jobClient").innerHTML = html;
  };
}

// ---------------- SAVE JOB ----------------
function saveJob() {
  const clientId = Number(document.getElementById("jobClient").value);
  const type = document.getElementById("jobType").value;
  const total = document.getElementById("jobTotal").value;
  const status = document.getElementById("jobStatus").value;

  if (!clientId || !type || !total) {
    alert("Please fill all fields");
    return;
  }

  let tx = db.transaction("jobs", "readwrite");
  let store = tx.objectStore("jobs");

  store.add({
    clientId,
    type,
    total,
    status,
    createdAt: new Date()
  });

  tx.oncomplete = () => {
    document.getElementById("jobClient").value = "";
    document.getElementById("jobType").value = "";
    document.getElementById("jobTotal").value = "";

    loadJobs();
  };
}

// ---------------- LOAD JOBS ----------------
function loadJobs() {
  let tx = db.transaction(["jobs", "clients"], "readonly");

  let jobsStore = tx.objectStore("jobs");
  let clientsStore = tx.objectStore("clients");

  let req = jobsStore.getAll();

  req.onsuccess = async () => {
    let jobs = req.result.reverse();

    let html = "";

    for (const job of jobs) {
      let clientReq = clientsStore.get(job.clientId);

      await new Promise(resolve => {
        clientReq.onsuccess = () => {
          const client = clientReq.result;

          html += `
            <div class="job-card">
              <b>${job.type}</b><br>
              Client: ${client ? client.name : "Unknown"}<br>
              ${job.total} TND<br>
              Status: ${job.status}
            </div>
          `;

          resolve();
        };
      });
    }

    document.getElementById("jobsList").innerHTML = html;
  };
}
