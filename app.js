/* =========================
   ELECTRICIAN OS PRO
========================= */

let db;

/* INIT */
function initApp(){

initDB();

loadPage("dashboard");

}

/* LOAD PAGES */
async function loadPage(page){

const content =
document.getElementById("content");

const res =
await fetch(`pages/${page}.html`);

const html =
await res.text();

content.innerHTML = html;

/* LOAD PAGE DATA */
if(page==="dashboard"){
loadDashboard();
drawChart();
}

if(page==="jobs"){
loadClientsIntoSelect();
}

}

/* DASHBOARD */
function loadDashboard(){

document.getElementById("income").innerText =
"5200 TND";

document.getElementById("expense").innerText =
"1800 TND";

document.getElementById("profit").innerText =
"3400 TND";

}
