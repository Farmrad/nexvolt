function init_expenses(){ render(); }

function addExpense(){

DB.push("expenses",{
type: type.value,
amount: Number(amount.value)
});

render();
}

function render(){

const data = DB.get("expenses");

list.innerHTML = data.map(e=>`
<div class="card">
<h3>${e.type}</h3>
<p>${e.amount} TND</p>
</div>
`).join("");
}
