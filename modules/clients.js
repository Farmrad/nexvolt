function init_clients(){ renderClients(); }

function addClient(){

DB.push("clients",{
name: name.value,
phone: phone.value,
cin: cin.value,
mf: mf.value
});

renderClients();
}

function renderClients(){

const data = DB.get("clients");

list.innerHTML = data.map((c,i)=>`
<div class="card">
<h3>${c.name}</h3>
<p>${c.phone}</p>
<p>CIN:${c.cin || "-"}</p>
<p>MF:${c.mf || "-"}</p>
</div>
`).join("");
}
