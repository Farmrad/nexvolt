let db;

/* INIT */
function initApp(){
initDB();
loadAll();
drawChart();
}

/* NAV */
function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

/* THEME */
function setTheme(mode){
if(mode==="dark"){
document.body.style.background="#0b1220";
document.body.style.color="white";
}
if(mode==="light"){
document.body.style.background="#f1f5f9";
document.body.style.color="black";
}
}

/* LOAD DATA */
function loadAll(){
loadDashboard();
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

document.getElementById("income").innerText=income;
document.getElementById("expense").innerText=expense;
document.getElementById("profit").innerText=income-expense;

};
};
}

/* CHART */
function drawChart(){

const ctx=document.getElementById("chart");

new Chart(ctx,{
type:"doughnut",
data:{
labels:["Income","Expenses","Profit"],
datasets:[{
data:[60,25,15],
backgroundColor:["#22c55e","#ef4444","#3b82f6"]
}]
}
});
}
