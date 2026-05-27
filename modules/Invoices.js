window.Invoices = {

items: [],

render(){

return `

<div style="padding:20px;">

<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
">

<h2>Factures</h2>

<button onclick="Invoices.showForm()"
style="
background:#ff9f43;
border:none;
padding:12px 18px;
border-radius:10px;
color:white;
font-weight:bold;
">
+ Nouvelle Facture
</button>

</div>

<!-- FACTURE FORM -->

<div id="invoiceForm"
style="
display:none;
background:#151a23;
padding:20px;
border-radius:16px;
margin-bottom:20px;
">

<h3>Client Information</h3>

<input id="clientName"
class="input"
placeholder="Client Name">

<input id="clientMF"
class="input"
placeholder="Matricule Fiscal">

<input id="clientPhone"
class="input"
placeholder="Phone">

<input id="clientAddress"
class="input"
placeholder="Address">

<hr style="margin:20px 0;border-color:#222;">

<h3>Add Work</h3>

<input id="itemDesc"
class="input"
placeholder="Description">

<input id="itemPrice"
type="number"
class="input"
placeholder="Price">

<button onclick="Invoices.addItem()"
class="main-btn">
Add Item
</button>

<!-- ITEMS -->

<div id="invoiceItems"
style="margin-top:20px;"></div>

<!-- TOTALS -->

<div style="
margin-top:20px;
background:#0f141c;
padding:15px;
border-radius:12px;
">

<div class="totals">
<span>HT</span>
<span id="htValue">0.000 TND</span>
</div>

<div class="totals">
<span>TVA 19%</span>
<span id="tvaValue">0.000 TND</span>
</div>

<div class="totals">
<span>Timbre</span>
<span>1.000 TND</span>
</div>

<div class="totals final-total">
<span>TTC</span>
<span id="ttcValue">1.000 TND</span>
</div>

</div>

<button onclick="Invoices.saveFacture()"
style="
margin-top:20px;
width:100%;
background:#2ecc71;
border:none;
padding:15px;
border-radius:12px;
font-size:16px;
font-weight:bold;
color:white;
">
Generate Facture
</button>

</div>

<!-- FACTURE HISTORY -->

<div id="factureHistory">

${this.renderHistory()}

</div>

</div>

`;

},

/* ========================= */

showForm(){

const form =
document.getElementById("invoiceForm");

form.style.display =
form.style.display==="none"
? "block"
: "none";

},

/* ========================= */

addItem(){

const desc =
document.getElementById("itemDesc").value;

const price =
Number(
document.getElementById("itemPrice").value
);

if(!desc || !price){

alert("Fill all fields");

return;

}

this.items.push({
desc,
price
});

document.getElementById("itemDesc").value="";
document.getElementById("itemPrice").value="";

this.renderItems();

},

/* ========================= */

renderItems(){

const box =
document.getElementById("invoiceItems");

let html = "";

let total = 0;

this.items.forEach((item,index)=>{

total += item.price;

html += `

<div style="
background:#0f141c;
padding:15px;
border-radius:12px;
margin-bottom:10px;
display:flex;
justify-content:space-between;
align-items:center;
">

<div>

<h4 style="margin:0;">
${item.desc}
</h4>

<p style="
margin-top:5px;
color:#8b949e;
">
${item.price.toFixed(3)} TND
</p>

</div>

<button onclick="Invoices.deleteItem(${index})"
style="
background:#ff4d4d;
border:none;
padding:10px;
border-radius:8px;
color:white;
">
Delete
</button>

</div>

`;

});

box.innerHTML = html;

/* TOTALS */

const tva = total * 0.19;

const ttc = total + tva + 1;

document.getElementById("htValue")
.innerText =
total.toFixed(3) + " TND";

document.getElementById("tvaValue")
.innerText =
tva.toFixed(3) + " TND";

document.getElementById("ttcValue")
.innerText =
ttc.toFixed(3) + " TND";

},

/* ========================= */

deleteItem(index){

this.items.splice(index,1);

this.renderItems();

},

/* ========================= */

saveFacture(){

const total =
this.items.reduce((a,b)=>a+b.price,0);

const tva = total * 0.19;

const ttc = total + tva + 1;

const facture = {

id: Date.now(),

client:
document.getElementById("clientName").value,

mf:
document.getElementById("clientMF").value,

phone:
document.getElementById("clientPhone").value,

address:
document.getElementById("clientAddress").value,

items:this.items,

ht:total,

tva,

ttc,

date:
new Date().toLocaleDateString()

};

DB.state.invoices.push(facture);

DB.save();

alert("Facture Saved");

this.items=[];

Router.go("Invoices");

},

/* ========================= */

renderHistory(){

if(DB.state.invoices.length===0){

return `

<div style="
text-align:center;
color:#8b949e;
padding:40px;
">
No factures yet
</div>

`;

}

let html = "";

DB.state.invoices
.slice()
.reverse()
.forEach(f=>{

html += `

<div style="
background:#151a23;
padding:15px;
border-radius:14px;
margin-bottom:15px;
">

<h3 style="margin-top:0;">
${f.client}
</h3>

<p>📅 ${f.date}</p>

<p>💰 ${f.ttc.toFixed(3)} TND</p>

<p>📦 ${f.items.length} item(s)</p>

</div>

`;

});

return html;

}

};
