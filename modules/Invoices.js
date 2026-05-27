window.Invoices = {

items: [],

render: function(){

return `

<div class="page" style="padding:20px;">

<h2>Facture</h2>

<!-- CLIENT INFO -->

<div class="invoice-box">

<h3>Client Information</h3>

<input id="invClient"
class="input"
placeholder="Client Name">

<input id="invMF"
class="input"
placeholder="Matricule Fiscal">

<input id="invPhone"
class="input"
placeholder="Phone">

<input id="invAddress"
class="input"
placeholder="Address">

</div>

<!-- WORK -->

<div class="invoice-box">

<h3>Work Items</h3>

<input id="itemDesc"
class="input"
placeholder="Description">

<input id="itemPrice"
class="input"
type="number"
placeholder="Price">

<button onclick="Invoices.addItem()"
class="main-btn">
Add Item
</button>

</div>

<!-- ITEMS -->

<div id="invoiceItems"></div>

<!-- TOTALS -->

<div class="invoice-box">

<div class="totals-row">
<span>Total HT</span>
<span id="totalHT">0.000 TND</span>
</div>

<div class="totals-row">
<span>TVA 19%</span>
<span id="totalTVA">0.000 TND</span>
</div>

<div class="totals-row">
<span>Timbre</span>
<span>1.000 TND</span>
</div>

<div class="totals-row total-final">
<span>TTC</span>
<span id="totalTTC">1.000 TND</span>
</div>

</div>

<!-- ACTION -->

<button onclick="Invoices.generatePDF()"
class="main-btn"
style="margin-top:20px;">
Generate Facture PDF
</button>

</div>

`;

},

/* ======================= */

addItem: function(){

const desc =
document.getElementById("itemDesc").value;

const price =
Number(document.getElementById("itemPrice").value);

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

/* ======================= */

renderItems: function(){

const box =
document.getElementById("invoiceItems");

let html = "";

let totalHT = 0;

this.items.forEach((item,index)=>{

totalHT += item.price;

html += `

<div class="invoice-item">

<div>

<h4>${item.desc}</h4>

<p>${item.price.toFixed(3)} TND</p>

</div>

<button onclick="Invoices.removeItem(${index})"
class="delete-btn">
Delete
</button>

</div>

`;

});

box.innerHTML = html;

/* TOTALS */

const tva = totalHT * 0.19;

const ttc = totalHT + tva + 1;

document.getElementById("totalHT")
.innerText =
totalHT.toFixed(3) + " TND";

document.getElementById("totalTVA")
.innerText =
tva.toFixed(3) + " TND";

document.getElementById("totalTTC")
.innerText =
ttc.toFixed(3) + " TND";

},

/* ======================= */

removeItem: function(index){

this.items.splice(index,1);

this.renderItems();

},

/* ======================= */

generatePDF: function(){

const client =
document.getElementById("invClient").value;

const mf =
document.getElementById("invMF").value;

const phone =
document.getElementById("invPhone").value;

const address =
document.getElementById("invAddress").value;

if(!client){
alert("Client required");
return;
}

const totalHT =
this.items.reduce((a,b)=>a+b.price,0);

const tva = totalHT * 0.19;

const ttc = totalHT + tva + 1;

/* PDF */

const win =
window.open("", "_blank");

let itemsHTML = "";

this.items.forEach(item=>{

itemsHTML += `

<tr>
<td>${item.desc}</td>
<td>${item.price.toFixed(3)} TND</td>
</tr>

`;

});

win.document.write(`

<html>

<head>

<title>Facture</title>

<style>

body{
font-family:Arial;
padding:40px;
color:#111;
}

.header{
display:flex;
justify-content:space-between;
align-items:start;
border-bottom:2px solid #111;
padding-bottom:20px;
margin-bottom:30px;
}

.logo{
font-size:28px;
font-weight:bold;
}

.sub{
color:#666;
}

.box{
margin-bottom:25px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th,td{
border:1px solid #ddd;
padding:12px;
text-align:left;
}

th{
background:#111;
color:white;
}

.total{
margin-top:20px;
width:300px;
margin-left:auto;
}

.total div{
display:flex;
justify-content:space-between;
padding:8px 0;
}

.final{
font-size:22px;
font-weight:bold;
border-top:2px solid #111;
margin-top:10px;
padding-top:10px;
}

</style>

</head>

<body>

<div class="header">

<div>

<div class="logo">
⚡ NEXVOLT
</div>

<div class="sub">
TRAVAUX ELECTRICITE BATIMENT
</div>

<br>

<div>
Mohamed Salim Mrad
</div>

<div>
MF: 1860282/TAC/000
</div>

<div>
GSM: 56130571
</div>

<div>
Akouda
</div>

<div>
mohamedsalimmrad@gmail.com
</div>

</div>

<div>

<h2>FACTURE</h2>

<div>
${new Date().toLocaleDateString()}
</div>

</div>

</div>

<div class="box">

<h3>Client</h3>

<div>${client}</div>
<div>${mf}</div>
<div>${phone}</div>
<div>${address}</div>

</div>

<table>

<tr>
<th>Description</th>
<th>Price</th>
</tr>

${itemsHTML}

</table>

<div class="total">

<div>
<span>HT</span>
<span>${totalHT.toFixed(3)} TND</span>
</div>

<div>
<span>TVA 19%</span>
<span>${tva.toFixed(3)} TND</span>
</div>

<div>
<span>Timbre</span>
<span>1.000 TND</span>
</div>

<div class="final">
<span>TTC</span>
<span>${ttc.toFixed(3)} TND</span>
</div>

</div>

<script>
window.print()
</script>

</body>

</html>

`);

/* SAVE */

DB.state.invoices.push({

id:Date.now(),

client,

ttc,

date:new Date().toLocaleDateString(),

items:this.items

});

DB.save();

/* RESET */

this.items = [];

Router.go("Invoices");

}

};
