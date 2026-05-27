let db;
let historyStack = [];
let invoiceCounter = 1;

/* ================= INIT ================= */

function initApp() {
  initDB();

  setTimeout(() => {
    loadClients();
    loadClientOptions();
    loadJobs();
    loadExpenses();
    loadInvoices();
    loadDashboard();
    loadSettings();
  }, 300);
}

/* ================= NAVIGATION ================= */

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

function showPage(id) {
  const current = document.querySelector(".page.active");

  if (current) {
    historyStack.push(current.id);
  }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.getElementById("sideMenu").classList.remove("open");
}

function goBack() {
  const last = historyStack.pop();
  if (!last) return;

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(last).classList.add("active");
}

/* ================= SETTINGS ================= */

function saveSettings() {
  const settings = {
    businessName: businessName.value,
    businessPhone: businessPhone.value,
    businessCity: businessCity.value
  };

  localStorage.setItem("nexvolt_settings", JSON.stringify(settings));
  alert("Paramètres enregistrés");
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("nexvolt_settings"));

  if (!settings) return;

  businessName.value = settings.businessName || "";
  businessPhone.value = settings.businessPhone || "";
  businessCity.value = settings.businessCity || "";
}

/* ================= CLIENTS ================= */

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

function deleteClient(id) {
  let tx = db.transaction("clients", "readwrite");
  tx.objectStore("clients").delete(id);

  tx.oncomplete = () => {
    loadClients();
    loadClientOptions();
  };
}

function loadClients() {
  let tx = db.transaction("clients", "readonly");
  let req = tx.objectStore("clients").getAll();

  req.onsuccess = () => {
    clientsList.innerHTML = req.result
      .slice()
      .reverse()
      .map(c => `
        <div class="job-card">
          ${c.name}<br>
          ${c.phone}
          <button onclick="deleteClient(${c.id})">Delete</button>
        </div>
      `).join("");
  };
}

function loadClientOptions() {
  let tx = db.transaction("clients", "readonly");
  let req = tx.objectStore("clients").getAll();

  req.onsuccess = () => {
    const html = req.result.map(c =>
      `<option value="${c.id}">${c.name}</option>`
    ).join("");

    jobClient.innerHTML = html;
    invoiceJob.innerHTML = html;
  };
}

/* ================= JOBS ================= */

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

function deleteJob(id) {
  let tx = db.transaction("jobs", "readwrite");
  tx.objectStore("jobs").delete(id);

  tx.oncomplete = () => {
    loadJobs();
    loadDashboard();
  };
}

function loadJobs() {
  let tx = db.transaction(["jobs", "clients"], "readonly");

  let jobsReq = tx.objectStore("jobs").getAll();
  let clientsStore = tx.objectStore("clients");

  jobsReq.onsuccess = async () => {
    let html = "";

    for (let j of jobsReq.result.slice().reverse()) {

      let c = await new Promise(resolve => {
        let req = clientsStore.get(j.clientId);
        req.onsuccess = () => resolve(req.result);
      });

      html += `
        <div class="job-card">
          ${j.type}<br>
          ${c?.name || "Client inconnu"}<br>
          ${j.total} TND - ${j.status}
          <button onclick="deleteJob(${j.id})">Delete</button>
        </div>
      `;
    }

    jobsList.innerHTML = html;
  };
}

/* ================= EXPENSES ================= */

function saveExpense() {
  let tx = db.transaction("expenses", "readwrite");

  tx.objectStore("expenses").add({
    category: expenseCategory.value,
    amount: Number(expenseAmount.value)
  });

  tx.oncomplete = () => {
    loadExpenses();
    loadDashboard();
  };
}

function deleteExpense(id) {
  let tx = db.transaction("expenses", "readwrite");
  tx.objectStore("expenses").delete(id);

  tx.oncomplete = () => {
    loadExpenses();
    loadDashboard();
  };
}

function loadExpenses() {
  let tx = db.transaction("expenses", "readonly");
  let req = tx.objectStore("expenses").getAll();

  req.onsuccess = () => {
    expensesList.innerHTML = req.result
      .slice()
      .reverse()
      .map(e => `
        <div class="job-card">
          ${e.category}<br>
          ${e.amount} TND
          <button onclick="deleteExpense(${e.id})">Delete</button>
        </div>
      `).join("");
  };
}

/* ================= INVOICES (FRENCH FACTURE) ================= */

function createInvoice() {

  let tx = db.transaction(["jobs", "clients", "invoices"], "readwrite");

  let jobStore = tx.objectStore("jobs");
  let clientStore = tx.objectStore("clients");
  let invoiceStore = tx.objectStore("invoices");

  let jobReq = jobStore.get(Number(invoiceJob.value));

  jobReq.onsuccess = () => {

    let job = jobReq.result;
    if (!job) return;

    let clientReq = clientStore.get(job.clientId);

    clientReq.onsuccess = () => {

      let client = clientReq.result;

      let tva = Number(tvaRate.value || 19);
      let tvaAmount = job.total * tva / 100;
      let totalTTC = job.total + tvaAmount;

      let number = String(invoiceCounter).padStart(4, "0");

      invoiceStore.add({
        number: number,
        clientName: client?.name || "Client inconnu",
        clientPhone: client?.phone || "",
        jobType: job.type,
        subtotal: job.total,
        tva: tva,
        tvaAmount: tvaAmount,
        total: totalTTC,
        date: new Date().toLocaleDateString("fr-FR")
      });

      invoiceCounter++;

      tx.oncomplete = () => {
        loadInvoices();
      };
    };
  };
}

function deleteInvoice(id) {
  let tx = db.transaction("invoices", "readwrite");
  tx.objectStore("invoices").delete(id);

  tx.oncomplete = () => {
    loadInvoices();
  };
}

function loadInvoices() {
  let tx = db.transaction("invoices", "readonly");
  let req = tx.objectStore("invoices").getAll();

  req.onsuccess = () => {

    invoiceList.innerHTML = req.result
      .slice()
      .reverse()
      .map(i => `

<div class="job-card" style="padding:15px">

<h3>FACTURE N° ${i.number}</h3>

<hr>

<strong>Mohamed Salim Mrad</strong><br>
TRAVAUX ELECTRICITE BATIMENT<br>
M.F: 1860282/TAC/000<br>
GSM: 56130571<br>

<hr>

<strong>Client :</strong> ${i.clientName}<br>
<strong>Téléphone :</strong> ${i.clientPhone}<br>

<hr>

<strong>Travaux :</strong> ${i.jobType}<br>

<hr>

<strong>Montant HT :</strong> ${i.subtotal} TND<br>
<strong>TVA (${i.tva}%) :</strong> ${i.tvaAmount.toFixed(2)} TND<br>
<strong>Total TTC :</strong> ${i.total.toFixed(2)} TND<br>

<hr>

<strong>Date :</strong> ${i.date}

<button onclick="deleteInvoice(${i.id})">Delete</button>

</div>

      `).join("");
  };
}

/* ================= DASHBOARD ================= */

function loadDashboard() {
  let tx = db.transaction(["jobs", "expenses"], "readonly");

  let jReq = tx.objectStore("jobs").getAll();
  let eReq = tx.objectStore("expenses").getAll();

  jReq.onsuccess = () => {
    eReq.onsuccess = () => {

      let income = jReq.result.reduce((a, b) => a + b.total, 0);
      let expense = eReq.result.reduce((a, b) => a + b.amount, 0);

      totalIncome.innerText = income + " TND";
      totalExpenses.innerText = expense + " TND";
      profit.innerText = (income - expense) + " TND";
      totalJobs.innerText = jReq.result.length;
    };
  };
}
