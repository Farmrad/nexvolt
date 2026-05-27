window.Clients = {

render: function(){

let html = `

<div class="page" style="padding:20px;">

<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
">

<h2>Clients</h2>

<button onclick="Clients.showAddForm()"
style="
background:#ff9f43;
border:none;
padding:10px 15px;
border-radius:8px;
color:white;
font-weight:bold;
">
+ Add
</button>

</div>

<!-- SEARCH -->

<input
id="clientSearch"
placeholder="Search client..."
onkeyup="Clients.search()"
style="
width:100%;
padding:14px;
border:none;
border-radius:10px;
background:#151a23;
color:white;
margin-bottom:20px;
"
/>

<!-- ADD FORM -->

<div id="clientForm"
style="
display:none;
background:#151a23;
padding:15px;
border-radius:12px;
margin-bottom:20px;
">

<input id="clientName"
placeholder="Client Name"
class="input"/>

<input id="clientPhone"
placeholder="Phone"
class="input"/>

<input id="clientMF"
placeholder="Matricule Fiscal"
class="input"/>

<input id="clientAddress"
placeholder="Address"
class="input"/>

<button onclick="Clients.save()"
class="main-btn">
Save Client
</button>

</div>

<!-- LIST -->

<div id="clientsList">

${this.renderList(DB.state.clients)}

</div>

</div>

`;

return html;

},

/* ========================= */

renderList: function(clients){

if(clients.length===0){

return `
<div style="
color:#8b949e;
text-align:center;
padding:40px;
">
No clients yet
</div>
`;

}

let html = "";

clients.forEach((c,index)=>{

/* TOTAL CLIENT MONEY */
const total =
DB.state.invoices
.filter(i=>i.client===c.name)
.reduce((a,b)=>a+Number(b.ttc||0),0);

html += `

<div class="client-card">

<div>

<h3>${c.name}</h3>

<p>📞 ${c.phone || "-"}</p>

<p>📍 ${c.address || "-"}</p>

<p>🏛 ${c.mf || "-"}</p>

<p style="color:#2ecc71;">
💰 ${total.toFixed(3)} TND
</p>

</div>

<div style="
display:flex;
flex-direction:column;
gap:10px;
">

<button onclick="Clients.remove(${index})"
class="delete-btn">
Delete
</button>

</div>

</div>

`;

});

return html;

},

/* ========================= */

showAddForm: function(){

const form =
document.getElementById("clientForm");

form.style.display =
form.style.display==="none"
? "block"
: "none";

},

/* ========================= */

save: function(){

const name =
document.getElementById("clientName").value;

if(!name){
alert("Client name required");
return;
}

DB.state.clients.push({

name:name,

phone:
document.getElementById("clientPhone").value,

mf:
document.getElementById("clientMF").value,

address:
document.getElementById("clientAddress").value

});

DB.save();

Router.go("Clients");

},

/* ========================= */

remove: function(index){

if(!confirm("Delete client?"))
return;

DB.state.clients.splice(index,1);

DB.save();

Router.go("Clients");

},

/* ========================= */

search: function(){

const q =
document.getElementById("clientSearch")
.value
.toLowerCase();

const filtered =
DB.state.clients.filter(c=>

c.name.toLowerCase().includes(q)

);

document.getElementById(
"clientsList"
).innerHTML =
this.renderList(filtered);

}

};
