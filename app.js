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
    initSignaturePad();
  }, 300);
}

/* ================= NAVIGATION ================= */

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

function showPage(id) {
  const current = document.querySelector(".page.active");
  if (current) historyStack.push(current.id);

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

/* ================= SIGNATURE ================= */

let canvas, ctx, drawing = false;

function initSignaturePad() {
  canvas = document.getElementById("signaturePad");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mousemove", draw);
}

function startDraw(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDraw() {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
  const signature = canvas.toDataURL();

  localStorage.setItem("job_signature", signature);
  alert("Signature saved");
}

/* ================= PHOTOS ================= */

function addJobPhoto() {
  const file = document.getElementById("jobPhoto").files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    let img = document.createElement("img");
    img.src = e.target.result;
    img.style.width = "100px";
    img.style.margin = "5px";

    document.getElementById("photoPreview").appendChild(img);

    let photos = JSON.parse(localStorage.getItem("job_photos") || "[]");
    photos.push(e.target.result);

    localStorage.setItem("job_photos", JSON.stringify(photos));
  };

  reader.readAsDataURL(file);
}

/* ================= BACKUP SYSTEM ================= */

function exportBackup() {

  let data = {
    clients: [],
    jobs: [],
    expenses: [],
    invoices: []
  };

  let stores = ["clients","jobs","expenses","invoices"];

  let tx = db.transaction(stores, "readonly");

  let promises = stores.map(store => {
    return new Promise(resolve => {
      let req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve({ [store]: req.result });
    });
  });

  Promise.all(promises).then(results => {

    results.forEach(r => Object.assign(data, r));

    let blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nexvolt_backup.json";
    a.click();
  });
}

function importBackup(event) {

  let file = event.target.files[0];
  let reader = new FileReader();

  reader.onload = function(e) {

    let data = JSON.parse(e.target.result);

    let stores = Object.keys(data);

    let tx = db.transaction(stores, "readwrite");

    stores.forEach(store => {

      let os = tx.objectStore(store);

      data[store].forEach(item => {
        os.put(item);
      });
    });

    alert("Backup restored");
  };

  reader.readAsText(file);
}

/* ================= PLACEHOLDER (KEEP YOUR OLD SYSTEMS) ================= */

/* KEEP ALL YOUR PREVIOUS FUNCTIONS:
   - clients
   - jobs
   - invoices
   - expenses
   - dashboard
   - pdf
   - whatsapp
   (unchanged, still working)
*/
