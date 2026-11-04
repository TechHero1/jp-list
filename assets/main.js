import * as manage from "./script/manage.js";
import * as streamings from "./script/streamings.js";
import * as stats from "./script/stats.js";

function remote_open_tab(tab_name) {
  if (!document.body.contains(document.getElementById(tab_name))) return remote_open_tab("Erro");
  var tablinks;
  tablinks = document.getElementsByClassName("tablinks");
  for (const link of tablinks) {
    link.classList.toggle("active", false);
    if (tab_name+"_tab" == link.id) {
      link.click();
      return;
    }
  }
}

function open_tab(evt, tab_name) {
  if (evt == "" || evt == undefined || evt == null) return remote_open_tab("Erro");
  if (!document.body.contains(document.getElementById(tab_name))) return remote_open_tab("Erro");

  let tabcontent = document.getElementsByClassName("tabcontent");
  for (const tab of tabcontent) tab.classList.toggle("hidden", true);

  let tablinks = document.getElementsByClassName("tablinks");
  for (const link of tablinks) link.classList.toggle("active", false);

  document.getElementById(tab_name).classList.toggle("hidden", false);
  evt.currentTarget.classList.toggle("active", true);
}

window.open_tab = open_tab;
window.remote_open_tab = remote_open_tab;
remote_open_tab('Arquivo');

function set_scroll(target=0) { window.scrollTo(window.scrollY, target); }

window.set_scroll = set_scroll;

function remove_all_of_element(array,element) {
  return array.filter(val => val != element);
}

window.remove_all_of_element = remove_all_of_element;

function set_debug_theme(theme) {
  document.documentElement.setAttribute("data-theme",theme);
}

window.set_debug_theme = set_debug_theme;

//IMPORTAR - DRAG AND DROP
const dropZone = document.querySelector('#Arquivo');

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) upload_list(file);
});

//DROPDOWN - TECLADO
document.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('a[role="menuitem"]')) {
    event.preventDefault();
    event.target.click();
  }
  if (event.key === 'Escape') document.body.click();
});
