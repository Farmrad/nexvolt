/* =========================================
   ELECTRICIAN OS PRO
   MODERN INVOICE ENGINE
========================================= */

let invoiceCounter = localStorage.getItem("invoiceCounter") || 1;

/* GENERATE PDF */
function generateModernInvoice(data){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

/* COLORS */
const dark = [15,23,42];
const blue = [37,99,235];
const gray = [100,116,139];

/* HEADER BG */
doc.setFillColor(...dark);
doc.rect(0,0,210,40,"F");

/* LOGO / TITLE */
doc.setTextColor(255,255,255);
doc.setFontSize(24);
doc.text("⚡ NEXVOLT",15,20);

doc.setFontSize(11);
doc.text("Travaux Electricité Bâtiment",15,30);

/* COMPANY INFO */
doc.setTextColor(...gray);

doc.setFontSize(10);

doc.text("Mohamed Salim Mrad",15,50);
doc.text("Akouda, Sousse",15,56);
doc.text("MF: 1860282/TAC/000",15,62);
doc.text("GSM: 56 130 571",15,68);
doc.text("Email: mohamedsalimmrad@gmail.com",15,74);

/* INVOICE INFO */
doc.setTextColor(...dark);

doc.setFontSize(18);
doc.text("FACTURE",150,50);

doc.setFontSize(11);

const invoiceNumber =
invoiceCounter + "-" + new Date().getFullYear();

doc.text("Facture N°: " + invoiceNumber,150,60);

const today = new Date().toLocaleDateString();

doc.text("Date: " + today,150,68);

/* CLIENT BOX */
doc.setFillColor(245,247,250);
doc.roundedRect(15,85,180,30,4,4,"F");

doc.setTextColor(...dark);

doc.setFontSize(12);
doc.text("Client",20,95);

doc.setFontSize(11);

doc.text(data.client,20,104);

if(data.clientMF){
doc.text("MF: " + data.clientMF,20,111);
}

/* TABLE HEADER */
doc.setFillColor(...blue);

doc.rect(15,130,180,10,"F");

doc.setTextColor(255,255,255);

doc.text("Description",20,137);
doc.text("Qte",110,137);
doc.text("PU HT",135,137);
doc.text("Montant",170,137);

/* TABLE BODY */
doc.setTextColor(...dark);

let y = 150;

data.items.forEach(item=>{

doc.text(item.description,20,y);
doc.text(String(item.qty),112,y);
doc.text(item.price.toFixed(3),135,y);
doc.text((item.qty * item.price).toFixed(3),170,y);

y += 10;

});

/* TOTALS */
const totalHT = data.items.reduce((a,b)=>
a + (b.qty * b.price),0);

const tva = totalHT * 0.19;

const timbre = 1;

const totalTTC = totalHT + tva + timbre;

/* TOTAL BOX */
doc.setFillColor(248,250,252);

doc.roundedRect(120,y+10,75,40,4,4,"F");

doc.text("HT:",130,y+20);
doc.text(totalHT.toFixed(3) + " TND",165,y+20);

doc.text("TVA 19%:",130,y+28);
doc.text(tva.toFixed(3) + " TND",165,y+28);

doc.text("Timbre:",130,y+36);
doc.text("1.000 TND",165,y+36);

doc.setFontSize(13);

doc.text("TTC:",130,y+48);
doc.text(totalTTC.toFixed(3) + " TND",165,y+48);

/* FOOTER */
doc.setFontSize(9);

doc.setTextColor(...gray);

doc.text(
"Merci pour votre confiance.",
15,
280
);

/* SAVE */
doc.save("Facture-" + invoiceNumber + ".pdf");

/* UPDATE COUNTER */
invoiceCounter++;

localStorage.setItem(
"invoiceCounter",
invoiceCounter
);

}

/* TEST FUNCTION */
function testInvoice(){

generateModernInvoice({

client:"Comptoir Moderne",
clientMF:"160571XBM000",

items:[

{
description:"Installation électrique",
qty:1,
price:350
},

{
description:"Coffret 12V",
qty:1,
price:250
},

{
description:"Panneau Cat6",
qty:1,
price:140
}

]

});

}
