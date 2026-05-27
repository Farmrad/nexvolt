function analyze(){

const jobs = DB.get("jobs");
const expenses = DB.get("expenses");
const clients = DB.get("clients");

const income = jobs.reduce((a,b)=>a+Number(b.total||0),0);
const expense = expenses.reduce((a,b)=>a+Number(b.amount||0),0);
const profit = income - expense;

let warnings = [];

if(profit < 0) warnings.push("Loss detected");
if(clients.length < 3) warnings.push("Low clients");

return {income,expense,profit,warnings};
}

function updateAI(){

const d = analyze();
const box = document.getElementById("aiBox");
if(!box) return;

box.innerHTML = `
<div class="card">
<h3>AI Report</h3>
<p>Income: ${d.income}</p>
<p>Expense: ${d.expense}</p>
<p>Profit: ${d.profit}</p>
</div>

${d.warnings.length ?
`<div class="card">${d.warnings.map(w=>`<p>${w}</p>`).join("")}</div>`
:
`<div class="card">System OK</div>`
}
`;
}
