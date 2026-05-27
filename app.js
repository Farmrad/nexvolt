let db;

/* INIT */
function initApp(){
initDB();
setTimeout(()=>{
loadAll();
renderChart();
toast("System Ready ⚡");
},300);
}

/* LOAD */
function loadAll(){
loadDashboard();
loadClients();
loadClientOptions();
loadJobs();
loadExpenses();
loadInvoices();
}

/* NAV */
function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

/* DASHBOARD */
function loadDashboard(){

let tx=db.transaction(["jobs","expenses","invoices"],"readonly");

let j=tx.objectStore("jobs").getAll();
let e=tx.objectStore("expenses").getAll();
let i=tx.objectStore("invoices").getAll();

j.onsuccess=()=>{
e.onsuccess=()=>{
i.onsuccess=()=>{

let income=j.result.reduce((a,b)=>a+b.total,0);
let expense=e.result.reduce((a,b)=>a+b.amount,0);
let unpaid=i.result.filter(x=>!x.paid).reduce((a,b)=>a+b.total,0);

set("income",income);
set("expense",expense);
set("profit",income-expense);
set("unpaid",unpaid);

};
};
};
}

/* SET UI */
function set(id,val){
document.getElementById(id).innerText=val+" TND";
}

/* CHART */
function renderChart(){
const ctx=document.getElementById("chart");

new Chart(ctx,{
type:"line",
data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat"],
datasets:[
{
label:"Income",
data:[120,200,150,300,250,400],
borderColor:"#22c55e",
tension:0.4
},
{
label:"Expenses",
data:[80,100,90,120,110,150],
borderColor:"#ef4444",
tension:0.4
}
]
},
options:{
responsive:true,
plugins:{legend:{labels:{color:"white"}}}
}
});
}

/* TOAST */
function toast(msg){
let t=document.getElementById("toast");
t.innerText=msg;
t.style.opacity=1;
t.style.transform="translateY(0)";

setTimeout(()=>{
t.style.opacity=0;
t.style.transform="translateY(20px)";
},2000);
}
