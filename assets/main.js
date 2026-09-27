import * as manage from "./script/manage.js";
import * as streamings from "./script/streamings.js";
import * as stats from "./script/stats.js";

var i;
const nf = new Intl.NumberFormat('fr-FR');

function remote_open_tab(tab_name) {
  if (!document.body.contains(document.getElementById(tab_name))) return remote_open_tab("Erro");
  var tablinks;
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    if (tab_name+"_tab" == tablinks[i].id) {
      tablinks[i].click();
      return
    }
  }
}

function open_tab(evt, tab_name) {
  if (evt == "" || evt == undefined || evt == null) return remote_open_tab("Erro");
  if (!document.body.contains(document.getElementById(tab_name))) return remote_open_tab("Erro");
  var tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tab_name).style.display = "block";
  evt.currentTarget.className += " active";
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

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.querySelector('#Arquivo');

  dropZone.addEventListener('dragover', (event) =>{
    event.preventDefault();

  });

  dropZone.addEventListener('drop', (event) =>{
    event.preventDefault();
    const files = event.dataTransfer.files;
    upload_list(files[0]);
  });
});
