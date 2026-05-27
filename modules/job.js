function init_jobs(){
renderJobs();
fillClients();
}

/* FILL CLIENT SELECT */
function fillClients(){

const clients = DB.get("clients");

const select = document.getElementById("clientSelect");
if(!select) return;

select.innerHTML = "";

clients.forEach((c,i)=>{
select.innerHTML += `
<option value="${i}">
${c.name}
</option>
`;
});
}

/* ADD JOB */
function addJob(){

const clientIndex = clientSelect.value;
const type = jobType.value;
const total = jobTotal.value;

if(!type || !total) return alert("Missing data");

const clients = DB.get("clients");

DB.push("jobs",{
client: clients[clientIndex]?.name || "Unknown",
type,
total:Number(total),
date:new Date().toLocaleDateString()
});

renderJobs();

/* IMPORTANT: refresh AI if dashboard exists */
if(window.updateAI) updateAI();
}

/* RENDER JOBS */
function renderJobs(){

const jobs = DB.get("jobs");

list.innerHTML = jobs.map((j,i)=>`

<div class="card">
<h3>${j.type}</h3>
<p>Client: ${j.client}</p>
<p>${j.total} TND</p>
<p>${j.date}</p>

<button onclick="deleteJob(${i})">Delete</button>
</div>

`).join("");
}

/* DELETE JOB */
function deleteJob(i){
const jobs = DB.get("jobs");
jobs.splice(i,1);
DB.set("jobs",jobs);

renderJobs();
if(window.updateAI) updateAI();
}
