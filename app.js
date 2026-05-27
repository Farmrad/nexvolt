function initApp(){
loadPage("dashboard");
}

/* MENU */
function toggleMenu(){

document.getElementById("sideMenu").classList.toggle("active");
document.getElementById("overlay").classList.toggle("active");

}

/* PAGE LOADER */
async function loadPage(page){

const res = await fetch(`pages/${page}.html`);
const html = await res.text();

document.getElementById("content").innerHTML = html;

/* optional hooks */
if(page === "dashboard") loadDashboard();

}

/* DASHBOARD */
function loadDashboard(){

document.getElementById("content").innerHTML = `

<div class="card">
<h2>📊 Dashboard</h2>
<p>Welcome to your business system</p>
</div>

<div class="card">
<h3>Income</h3>
<p id="income">0 TND</p>
</div>

<div class="card">
<h3>Expenses</h3>
<p id="expense">0 TND</p>
</div>

<div class="card">
<h3>Profit</h3>
<p id="profit">0 TND</p>
</div>

`;

}
