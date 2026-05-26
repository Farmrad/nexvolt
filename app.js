function initApp() {
  initDB();

  setTimeout(() => {
    loadClients();
    loadClientOptions();
    loadJobs();
    loadExpenses();
    loadInvoices();
    loadDashboard();
  }, 300);
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* CLIENTS */
function saveClient() {
  let tx = db.transaction("clients", "readwrite");
  tx.objectStore("clients").add({
    name: clientName.value,
    phone: clientPhone.value
  });
  tx.oncomplete = () => {
    loadClients();
    loadClientOptions();
  };
}

function loadClients() {
  let tx = db.transaction("clients", "readonly");
  let req = tx.objectStore("clients").getAll();

  req.onsuccess = () => {
    clientsList.innerHTML = req.result.map(c =>
      `<div class="job-card">${c.name} - ${c.phone}</div>`
    ).reverse().join("");
  };
}

function loadClientOptions() {
  let tx = db.transaction("clients", "readonly");
  let req = tx.objectStore("clients").getAll();

  req.onsuccess = () => {
    jobClient.innerHTML = req.result.map(c =>
      `<option value="${c.id}">${c.name}</option>`
    ).join("");
  };
}

/* JOBS */
function saveJob() {
  let tx = db.transaction("jobs", "readwrite");

  tx.objectStore("jobs").add({
    clientId: Number(jobClient.value),
    type: jobType.value,
    total: Number(jobTotal.value),
    status: jobStatus.value
  });

  tx.oncomplete = () => {
    loadJobs();
    loadDashboard();
  };
}

function loadJobs() {
  let tx = db.transaction(["jobs","clients"],"readonly");

  let jobsReq = tx.objectStore("jobs").getAll();
  let clientsStore = tx.objectStore("clients");

  jobsReq.onsuccess = async () => {
    let html = "";

    for (let j of jobsReq.result.reverse()) {
      let c = await new Promise(r => {
        let req = clientsStore.get(j.clientId);
        req.onsuccess = () => r(req.result);
      });

      html += `<div class="job-card">
        ${j.type}<br>${c?.name}<br>${j.total} TND - ${j.status}
      </div>`;
    }

    jobsList.innerHTML = html;
  };
}

/* EXPENSES */
function saveExpense() {
  let tx = db.transaction("expenses","readwrite");

  tx.objectStore("expenses").add({
    category: expenseCategory.value,
    amount: Number(expenseAmount.value)
  });

  tx.oncomplete = () => {
    loadExpenses();
    loadDashboard();
  };
}

function loadExpenses() {
  let tx = db.transaction("expenses","readonly");
  let req = tx.objectStore("expenses").getAll();

  req.onsuccess = () => {
    expensesList.innerHTML = req.result.map(e =>
      `<div class="job-card">${e.category} - ${e.amount}</div>`
    ).reverse().join("");
  };
}

/* INVOICES */
function createInvoice() {
  let tx = db.transaction(["jobs","invoices"],"readwrite");

  let jobStore = tx.objectStore("jobs");
  let invStore = tx.objectStore("invoices");

  let req = jobStore.get(Number(invoiceJob.value));

  req.onsuccess = () => {
    let job = req.result;
    let tva = Number(tvaRate.value || 19);

    let tvaAmount = job.total * tva / 100;

    invStore.add({
      jobId: job.id,
      subtotal: job.total,
      tva,
      total: job.total + tvaAmount
    });

    tx.oncomplete = loadInvoices;
  };
}

function loadInvoices() {
  let tx = db.transaction("invoices","readonly");
  let req = tx.objectStore("invoices").getAll();

  req.onsuccess = () => {
    invoiceList.innerHTML = req.result.map(i =>
      `<div class="job-card">
        Sub:${i.subtotal} | TVA:${i.tva}% | Total:${i.total}
      </div>`
    ).reverse().join("");
  };
}

function loadDashboard() {
  let tx = db.transaction(["jobs","expenses"],"readonly");

  let jReq = tx.objectStore("jobs").getAll();
  let eReq = tx.objectStore("expenses").getAll();

  jReq.onsuccess = () => {
    eReq.onsuccess = () => {

      let income = jReq.result.reduce((a,b)=>a+b.total,0);
      let expense = eReq.result.reduce((a,b)=>a+b.amount,0);

      totalIncome.innerText = income+" TND";
      totalExpenses.innerText = expense+" TND";
      profit.innerText = (income-expense)+" TND";
      totalJobs.innerText = jReq.result.length;
    };
  };
}
