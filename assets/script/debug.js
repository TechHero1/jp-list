import * as manage from "./manage.js";

function switch_debug() {
  if (document.querySelector(".debug_dropdown").classList.contains('hidden')) {
    document.querySelector(".debug_dropdown").classList.remove('hidden');
    return
  }
  document.querySelector(".debug_dropdown").classList.add('hidden');
}

window.switch_debug = switch_debug;

window.addEventListener('click', function(e){   
  if (!document.querySelector('.debug_dropdown_area').contains(e.target)){
    document.querySelector(".debug_dropdown").classList.add('hidden');
  }
});

export var debug_action = "";

function set_debug_action(action) {
  document.querySelector(".debug_dropdown").classList.add('hidden');
  debug_action = action;
  document.querySelector(".debug_cancel_button").classList.remove('hidden');
}

window.set_debug_action = set_debug_action;

function cancel_debug_action() {
  debug_action = "";
  document.querySelector(".debug_cancel_button").classList.add('hidden');
}

window.cancel_debug_action = cancel_debug_action;

export function do_debug_action(id) {
  console.log(debug_action);
  //DO DEBUG ACTION
  if (debug_action == "chap_prog_moji") {
    manage.list.itens[id].dados.nota += "{chap_prog_moji}";
    manage.list.itens[id].dados.custom_values += "atual=1\nproximo=2\ncomeco=0\nfim=10";
  }

  if (debug_action == "chap_prog_page") {
    manage.list.itens[id].dados.nota += "{chap_prog_page}";
    manage.list.itens[id].dados.custom_values += "atual=1\nproximo=2\ncomeco=0\npages=0\nfim=10";
    manage.list.itens[id].dados.last_edited = Date.now();
  }

  if (debug_action == "chap_prog_arc") {
    manage.list.itens[id].dados.nota += "{chap_prog_arc}";
    manage.list.itens[id].dados.custom_values += "atual=1\nproximo=2\ncomeco_real=0\ncomeco=0\natual_real=0\nfim=10";
    manage.list.itens[id].dados.last_edited = Date.now();
  }

  if (debug_action == "chap_prog_arc_audiobook") {
    manage.list.itens[id].dados.nota += "{chap_prog_arc}\\n\\n{calc:tempo:sub:$atual_tempo:$comeco_tempo} de $final_tempo";
    manage.list.itens[id].dados.custom_values += "atual=1\nproximo=2\ncomeco_real=0\ncomeco=0\natual_real=0\nfim=10\ncomeco_tempo=0-00-00\natual_tempo=0-00-00\nfinal_tempo=0:00:00";
    manage.list.itens[id].dados.last_edited = Date.now();
  }
  if (debug_action == "meitantei") {
    manage.list.itens[id].tipo = "Anime";
    manage.list.itens[id].dados.status = "Progredindo";
    manage.list.itens[id].dados.titulo = "名探偵プリキュア！";
    manage.list.itens[id].dados.progresso = "35";
    manage.list.itens[id].dados.final = "51";
    manage.list.itens[id].dados.autotime = true;
    manage.list.itens[id].dados.prog_min = "25";
    manage.list.itens[id].dados.nota = "[fltr:saturate:200][fltr:hue-rotate:150][pre:profecia]que temporada boa[/pre][/fltr][/fltr]";
    manage.list.itens[id].dados.img = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx202957-fxZGgJTvwXzP.jpg";
    manage.list.itens[id].dados.last_edited = Date.now();
  }

  debug_action = "";
  document.querySelector(".debug_cancel_button").classList.add('hidden');
  process_order_list(manage.list.view_mode[0],manage.list.view_mode[1]);
}
