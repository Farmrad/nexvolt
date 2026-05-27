async function navigate(page){

const res = await fetch("pages/" + page + ".html");
const html = await res.text();

document.getElementById("app").innerHTML = html;

/* INIT PAGE MODULE */
if(window["init_" + page]){
window["init_" + page]();
}

/* AUTO AI ON DASHBOARD ONLY */
if(page === "dashboard"){
updateAI();
}

}
