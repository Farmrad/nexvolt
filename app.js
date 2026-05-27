/* =========================
   ELECTRICIAN OS PRO CORE
========================= */

function initApp(){
loadPage("dashboard");
}

/* PAGE SYSTEM */
async function loadPage(page){

const res = await fetch(`pages/${page}.html`);
const html = await res.text();

document.getElementById("content").innerHTML = html;

/* INIT PER PAGE */
if(page === "clients") loadClients();
if(page === "expenses") loadExpenses();
if(page === "dashboard") loadDashboard();

}

/* =========================
   CLIENT SYSTEM
========================= */

function saveClient(){

const name = document.getElementById("clientName").value;
const phone = document.getElementById("clientPhone").value;
const location = document.getElementById("clientLocation").value;

if(!name) return alert("Client name required");

addClient({name,phone,location});

loadClients();
}

function loadClients(){

let clients = get("clients");

const list = document.getElementById("clientsList");
if(!list) return;

list.innerHTML = "";

clients.forEach((c,i)=>{

list.innerHTML += `
<div class="card">
<p>${c.name}</p>
<p>${c.phone}</p>
<p>${c.location}</p>

<button onclick="deleteClient(${i}); loadClients()">
Delete
</button>

</div>
`;

});
}

/* =========================
   EXPENSE SYSTEM
========================= */

function saveExpense(){

const type = document.getElementById("expenseType").value;
const amount = document.getElementById("expenseAmount").value;

if(!type || !amount) return alert("Fill all fields");

addExpense({type,amount,date:new Date().toLocaleDateString()});

loadExpenses();
}

function loadExpenses(){

let expenses = get("expenses");

const list = document.getElementById("expensesList");
if(!list) return;

list.innerHTML = "";

expenses.forEach((e,i)=>{

list.innerHTML += `
<div class="card">
<p>${e.type}</p>
<p>${e.amount} TND</p>
<p>${e.date}</p>

</div>
`;

});
}

/* =========================
   DASHBOARD
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
