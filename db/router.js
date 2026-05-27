async function navigate(page){

State.setPage(page);

const res = await fetch(`pages/${page}.html`);
const html = await res.text();

document.getElementById("app").innerHTML = html;

/* AUTO INIT MODULES */
if(window[`init_${page}`]){
window[`init_${page}`]();
}

}
