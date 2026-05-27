function init_clients(){
renderClients();
}

function addClient(){

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const cin = document.getElementById("cin").value;
const mf = document.getElementById("mf").value;

if(!name) return alert("Name required");
if(!cin && !mf) return alert("CIN or MF required");

DB.push("clients",{
id: "CL-" + Date.now(),
name,
phone,
cin,
mf
});

renderClients();
}

function renderClients(){

const clients = DB.get("clients");

document.getElementById("list").innerHTML =
clients.map((c,i)=>`

<div class="card">
<h3>${c.name}</h3>
<p>${c.phone}</p>
<p>CIN: ${c.cin || "-"}</p>
<p>MF: ${c.mf || "-"}</p>

<button onclick="DB.delete('clients',${i}); renderClients()">
Delete
</button>
</div>

`).join("");

}
