/* =========================
   ELECTRICIAN OS PRO CORE
   CLIENT SYSTEM FULL VERSION
========================= */

function initApp(){
loadPage("dashboard");
}

/* PAGE LOADER */
async function loadPage(page){

const res = await fetch(`pages/${page}.html`);
const html = await res.text();

document.getElementById("content").innerHTML = html;

if(page === "clients") loadClients();
if(page === "dashboard") loadDashboard();

}

/* =========================
   LOCAL STORAGE HELPERS
========================= */

function get(key){
return JSON.parse(localStorage.getItem(key)) || [];
}

function set(key,value){
localStorage.setItem(key, JSON.stringify(value));
}

/* =========================
   CLIENT SYSTEM (FULL)
========================= */

function generateClientID(){
return "CL-" + Date.now();
}

function saveClient(){

const name = document.getElementById("clientName").value;
const phone = document.getElementById("clientPhone").value;
const location = document.getElementById("clientLocation").value;

const cin = document.getElementById("clientCIN").value;
const mf = document.getElementById("clientMF").value;

/* VALIDATION */
if(!name) return alert("Client name required");

if(!cin && !mf){
return alert("You must enter CIN or MF");
}

let clients = get("clients");

clients.push({
id: generateClientID(),
name,
phone,
location,
cin: cin || null,
mf: mf || null
});

set("clients", clients);

clearClientForm();
loadClients();
}

function clearClientForm(){

document.getElementById("clientName").value = "";
document.getElementById("clientPhone").value = "";
document.getElementById("clientLocation").value = "";
document.getElementById("clientCIN").value = "";
document.getElementById("clientMF").value = "";

}

function loadClients(){

let clients = get("clients");

const list = document.getElementById("clientsList");
if(!list) return;

list.innerHTML = "";

clients.forEach((c,i)=>{

list.innerHTML += `
<div class="card">

<h3>${c.name}</h3>

<p>📞 ${c.phone}</p>
<p>📍 ${c.location}</p>

<p>🆔 ID: ${c.id}</p>

<p>🪪 CIN: ${c.cin ? c.cin : "—"}</p>
<p>🏢 MF: ${c.mf ? c.mf : "—"}</p>

<button onclick="deleteClient(${i}); loadClients()">
Delete
</button>

</div>
`;
});

}

function deleteClient(index){

let clients = get("clients");

clients.splice(index,1);

set("clients", clients);

loadClients();

}

/* =========================
   DASHBOARD BASIC
========================= */

function loadDashboard(){

let jobs = get("jobs");
let expenses = get("expenses");

let income = jobs.reduce((a,b)=>a + Number(b.total || 0),0);
let expense = expenses.reduce((a,b)=>a + Number(b.amount || 0),0);

document.getElementById("income").innerText = income + " TND";
document.getElementById("expense").innerText = expense + " TND";
document.getElementById("profit").innerText = (income-expense) + " TND";

}
