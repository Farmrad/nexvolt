let db;

/* INIT */
function initApp(){
initDB();
setTimeout(()=>{
loadDashboard();
loadClients();
loadClientOptions();
loadJobs();
loadExpenses();
loadInvoices();
renderChart();
},300);
}

/* DASHBOARD NUMBERS */
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

incomeEl.innerText=income+" TND";
expenseEl.innerText=expense+" TND";
profit.innerText=(income-expense)+" TND";
unpaidEl.innerText=unpaid+" TND";

};
};
};
}

/* CHART (FINTECH STYLE GRAPH) */
function renderChart(){

let ctx=document.getElementById("chart");

new Chart(ctx,{
type:"line",
data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat"],
datasets:[{
label:"Income",
data:[120,200,150,300,250,400],
borderColor:"#22c55e"
},{
label:"Expenses",
data:[80,100,90,120,110,150],
borderColor:"#ef4444"
}]
}
});
}
