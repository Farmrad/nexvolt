let db;
let history = [];
let invoiceId = 1;

function initApp(){
initDB();
setTimeout(()=>{
loadClients();
loadClientOptions();
loadJobs();
loadExpenses();
loadInvoices();
loadDashboard();
loadCashflow();
},300);
}

/* NAV */
function toggleMenu(){
document.getElementById("sideMenu").classList.toggle("open");
}

function showPage(id){
let current=document.querySelector(".page.active");
if(current)history.push(current.id);

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

function goBack(){
let last=history.pop();
if(!last)return;

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(last).classList.add("active");
}

/* CLIENTS */
function saveClient(){
let tx=db.transaction("clients","readwrite");
tx.objectStore("clients").add({
name:clientName.value,
phone:clientPhone.value
});
tx.oncomplete=loadClients;
}

/* JOBS */
function saveJob(){
let tx=db.transaction("jobs","readwrite");
tx.objectStore("jobs").add({
clientId:Number(jobClient.value),
type:jobType.value,
total:Number(jobTotal.value)
});
tx.oncomplete=loadJobs;
}

/* EXPENSES */
function saveExpense(){
let tx=db.transaction("expenses","readwrite");
tx.objectStore("expenses").add({
category:expenseCategory.value,
amount:Number(expenseAmount.value)
});
tx.oncomplete=loadExpenses;
}

/* INVOICES */
function createInvoice(){

let tx=db.transaction(["jobs","clients","invoices"],"readwrite");

let jobStore=tx.objectStore("jobs");
let clientStore=tx.objectStore("clients");
let invStore=tx.objectStore("invoices");

let jobReq=jobStore.get(Number(invoiceJob.value));

jobReq.onsuccess=()=>{

let job=jobReq.result;
let clientReq=clientStore.get(job.clientId);

clientReq.onsuccess=()=>{

let client=clientReq.result;

let tva=Number(tvaRate.value||19);
let tvaAmount=job.total*tva/100;

let number=String(invoiceId++).padStart(4,"0");

invStore.add({
number,
clientName:client.name,
jobType:job.type,
subtotal:job.total,
tva,
tvaAmount,
total:job.total+tvaAmount,
paid:false,
date:new Date().toLocaleDateString()
});

tx.oncomplete=loadInvoices;
};
};
}

/* CASHFLOW */
function loadCashflow(){

let tx=db.transaction("invoices","readonly");
let req=tx.objectStore("invoices").getAll();

req.onsuccess=()=>{

let unpaid=req.result.filter(i=>!i.paid);

unpaidList.innerHTML=unpaid.map(i=>`
<div class="unpaid">
${i.number} - ${i.clientName}<br>
${i.total} TND
<button onclick="markPaid(${i.id})">Paid</button>
</div>
`).join("");

unpaidTotal.innerText=unpaid.reduce((a,b)=>a+b.total,0)+" TND";
};
}

function markPaid(id){
let tx=db.transaction("invoices","readwrite");
let store=tx.objectStore("invoices");

let req=store.get(id);
req.onsuccess=()=>{
let i=req.result;
i.paid=true;
store.put(i);
loadCashflow();
};
}

/* DASHBOARD */
function loadDashboard(){

let tx=db.transaction(["jobs","expenses"],"readonly");

let j=tx.objectStore("jobs").getAll();
let e=tx.objectStore("expenses").getAll();

j.onsuccess=()=>{
e.onsuccess=()=>{

let income=j.result.reduce((a,b)=>a+b.total,0);
let expense=e.result.reduce((a,b)=>a+b.amount,0);

income.innerText=income;
expense.innerText=expense;
profit.innerText=income-expense;
};
};
}

/* PLACEHOLDERS (DB + LOAD FUNCTIONS EXIST IN YOUR PROJECT) */
