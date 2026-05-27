/* =====================================
   ELECTRICIAN OS PRO
   AI BUSINESS ENGINE (LOCAL SMART AI)
===================================== */

/* =========================
   1. ANALYZE BUSINESS HEALTH
========================= */

function analyzeBusiness(){

const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const clients = JSON.parse(localStorage.getItem("clients")) || [];

/* TOTALS */
const income = jobs.reduce((a,b)=> a + Number(b.total),0);
const expense = expenses.reduce((a,b)=> a + Number(b.amount),0);
const profit = income - expense;

/* AVERAGE JOB VALUE */
const avgJob = jobs.length ? income / jobs.length : 0;

/* RISK ANALYSIS */
let warnings = [];

if(profit < 0){
warnings.push("⚠️ Business is losing money");
}

if(avgJob < 100){
warnings.push("⚠️ Job prices are very low — increase pricing");
}

if(clients.length < 3){
warnings.push("⚠️ Too few clients — focus on acquisition");
}

/* RESULT */
return {
income,
expense,
profit,
avgJob,
warnings
};

}

/* =========================
   2. DASHBOARD AI REPORT
========================= */

function generateAIReport(){

const data = analyzeBusiness();

const container = document.getElementById("aiReport");

if(!container) return;

container.innerHTML = "";

/* HEADER */
container.innerHTML += `
<div class="card">
<h3>🤖 AI Business Report</h3>

<p>Income: ${data.income.toFixed(2)} TND</p>
<p>Expenses: ${data.expense.toFixed(2)} TND</p>
<p>Profit: ${data.profit.toFixed(2)} TND</p>
<p>Average Job: ${data.avgJob.toFixed(2)} TND</p>
</div>
`;

/* WARNINGS */
if(data.warnings.length > 0){

container.innerHTML += `
<div class="card">
<h3>⚠️ AI Alerts</h3>
${data.warnings.map(w=>`<p>${w}</p>`).join("")}
</div>
`;

}else{

container.innerHTML += `
<div class="card">
<h3>✅ AI Status</h3>
<p>Business is stable and healthy</p>
</div>
`;

}

}

/* =========================
   3. SMART PRICING SUGGESTION
========================= */

function suggestPrice(jobType){

const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

const similarJobs = jobs.filter(j =>
j.type.toLowerCase().includes(jobType.toLowerCase())
);

if(similarJobs.length === 0){
return 120; // default price
}

const avg =
similarJobs.reduce((a,b)=> a + Number(b.total),0)
/ similarJobs.length;

/* AI RULE: increase profit margin */
return avg * 1.15;

}

/* =========================
   4. CLIENT RISK CHECK
========================= */

function checkClientRisk(clientName){

const history =
JSON.parse(localStorage.getItem("invoiceHistory")) || [];

const clientInvoices =
history.filter(h => h.client === clientName);

if(clientInvoices.length === 0){
return "🟢 New client";
}

const total = clientInvoices.reduce((a,b)=> a + Number(b.amount),0);

if(total > 5000){
return "🟡 High value client";
}

if(total < 300){
return "🟠 Low value client";
}

return "🟢 Normal client";

}
