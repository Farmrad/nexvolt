/* ============================
   ELECTRICIAN OS PRO
============================ */

let db;

/* INIT */
function initApp(){

initDB();

loadPage("dashboard");

}

/* LOAD PAGE */
async function loadPage(page){

const content =
document.getElementById("content");

const res =
await fetch(`pages/${page}.html`);

const html =
await res.text();

content.innerHTML = html;

/* PAGE EVENTS */
if(page==="dashboard"){

loadDashboard();

drawChart();

}

if(page==="jobs"){

loadClientsIntoSelect();

}

if(page==="invoices"){

initInvoicePage();

}

}

/* DASHBOARD */
function loadDashboard(){

const jobs =
JSON.parse(localStorage.getItem("jobs")) || [];

const expenses =
JSON.parse(localStorage.getItem("expenses")) || [];

const income =
jobs.reduce((a,b)=>
a + Number(b.total),0);

const expense =
expenses.reduce((a,b)=>
a + Number(b.amount),0);

const profit =
income - expense;

document.getElementById("income").innerText =
income + " TND";

document.getElementById("expense").innerText =
expense + " TND";

document.getElementById("profit").innerText =
profit + " TND";

}
