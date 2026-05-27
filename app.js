let db;

/* INIT */
function initApp(){
initDB();
loadAll();
drawCharts();
}

/* MENU */
function toggleMenu(){
document.getElementById("sideMenu").classList.toggle("open");
}

/* NAV */
function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

/* SETTINGS */
function setTheme(mode){
if(mode==="dark"){
document.body.style.background="#0b1220";
}
if(mode==="light"){
document.body.style.background="#f1f5f9";
document.body.style.color="#000";
}
}

function setLang(lang){
localStorage.setItem("lang",lang);
alert("Language set: "+lang);
}

/* DASHBOARD DATA */
function loadDashboard(){

let tx=db.transaction(["jobs","expenses"],"readonly");

let j=tx.objectStore("jobs").getAll();
let e=tx.objectStore("expenses").getAll();

j.onsuccess=()=>{
e.onsuccess=()=>{

let income=j.result.reduce((a,b)=>a+b.total,0);
let expense=e.result.reduce((a,b)=>a+b.amount,0);

incomeEl.innerText=income;
expenseEl.innerText=expense;
profitEl.innerText=income-expense;

};
};
}

/* CHARTS */
function drawCharts(){

const bar=document.getElementById("barChart");
const pie=document.getElementById("pieChart");

/* BAR */
new Chart(bar,{
type:"bar",
data:{
labels:["Mon","Tue","Wed","Thu","Fri"],
datasets:[{
label:"Income",
data:[120,200,150,300,250],
backgroundColor:"#3b82f6"
}]
}
});

/* PIE */
new Chart(pie,{
type:"pie",
data:{
labels:["Jobs","Expenses","Profit"],
datasets:[{
data:[60,25,15],
backgroundColor:["#22c55e","#ef4444","#3b82f6"]
}]
}
});
}
