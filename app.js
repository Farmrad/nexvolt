function initApp() {
  initDB();
  loadJobs();
}

// -------------------- CLIENT --------------------
function addClient() {
  let name = prompt("Client name:");
  let phone = prompt("Phone:");

  let tx = db.transaction("clients", "readwrite");
  let store = tx.objectStore("clients");

  store.add({
    name,
    phone,
    createdAt: new Date()
  });

  alert("Client added");
}

// -------------------- JOB --------------------
function addJob() {
  let type = prompt("Job type (dépannage / installation):");
  let total = prompt("Total price:");

  let tx = db.transaction("jobs", "readwrite");
  let store = tx.objectStore("jobs");

  store.add({
    type,
    total,
    status: "active",
    createdAt: new Date()
  });

  loadJobs();
}

// -------------------- LOAD JOBS --------------------
function loadJobs() {
  let tx = db.transaction("jobs", "readonly");
  let store = tx.objectStore("jobs");

  let request = store.getAll();

  request.onsuccess = function () {
    let jobs = request.result;

    let html = "";
    jobs.forEach(job => {
      html += `
        <div style="padding:10px; background:#111827; margin:5px; border-radius:6px;">
          <b>${job.type}</b> - ${job.total} TND
        </div>
      `;
    });

    document.getElementById("jobsList").innerHTML = html;
  };
}

// -------------------- EXPENSE --------------------
function addExpense() {
  let category = prompt("Category (fuel/materials/etc):");
  let amount = prompt("Amount:");

  let tx = db.transaction("expenses", "readwrite");
  let store = tx.objectStore("expenses");

  store.add({
    category,
    amount,
    date: new Date()
  });

  alert("Expense added");
}
