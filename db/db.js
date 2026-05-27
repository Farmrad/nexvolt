/* =========================
   LOCAL DATABASE ENGINE
========================= */

function get(key){
return JSON.parse(localStorage.getItem(key)) || [];
}

function set(key,value){
localStorage.setItem(key, JSON.stringify(value));
}

/* CLIENTS */
function addClient(client){
let clients = get("clients");
clients.push(client);
set("clients",clients);
}

function deleteClient(index){
let clients = get("clients");
clients.splice(index,1);
set("clients",clients);
}

/* JOBS */
function addJob(job){
let jobs = get("jobs");
jobs.push(job);
set("jobs",jobs);
}

/* EXPENSES */
function addExpense(expense){
let expenses = get("expenses");
expenses.push(expense);
set("expenses",expenses);
}
