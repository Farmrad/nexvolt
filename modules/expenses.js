function init_expenses(){
renderExpenses();
}

function addExpense(){

const type = document.getElementById("type").value;
const amount = document.getElementById("amount").value;

DB.push("expenses",{
id:"EX-"+Date.now(),
type,
amount: Number(amount),
date: new Date().toLocaleDateString()
});

renderExpenses();
}

function renderExpenses(){

const data = DB.get("expenses");

document.getElementById("list").innerHTML =
data.map((e,i)=>`

<div class="card">
<h3>${e.type}</h3>
<p>${e.amount} TND</p>
<p>${e.date}</p>

<button onclick="DB.delete('expenses',${i}); renderExpenses()">
Delete
</button>

</div>

`).join("");

}
