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
    let debug_nota = "{chap_prog_moji}";
    let debug_values = "atual=1\nproximo=2\ncomeco=0\nfim=10";

    if (manage.list.itens[id].dados.nota == "") manage.list.itens[id].dados.nota = debug_nota;
    else manage.list.itens[id].dados.nota += "\\n" + debug_nota;

    if (manage.list.itens[id].dados.custom_values == "") manage.list.itens[id].dados.custom_values = debug_values;
    else manage.list.itens[id].dados.custom_values += "\n" + debug_values;

    manage.list.itens[id].dados.last_edited = Date.now();
  }

  if (debug_action == "chap_prog_page") {
    let debug_nota = "{chap_prog_page}";
    let debug_values = "atual=1\nproximo=2\ncomeco=0\npages=0\nfim=10";

    if (manage.list.itens[id].dados.nota == "") manage.list.itens[id].dados.nota = debug_nota;
    else manage.list.itens[id].dados.nota += "\\n" + debug_nota;

    if (manage.list.itens[id].dados.custom_values == "") manage.list.itens[id].dados.custom_values = debug_values;
    else manage.list.itens[id].dados.custom_values += "\n" + debug_values;

    manage.list.itens[id].dados.last_edited = Date.now();
  }

  if (debug_action == "chap_prog_arc") {
    let debug_nota = "{chap_prog_arc}";
    let debug_values = "atual=1\nproximo=2\ncomeco_real=0\ncomeco=0\natual_real=0\nfim=10";

    if (manage.list.itens[id].dados.nota == "") manage.list.itens[id].dados.nota = debug_nota;
    else manage.list.itens[id].dados.nota += "\\n" + debug_nota;

    if (manage.list.itens[id].dados.custom_values == "") manage.list.itens[id].dados.custom_values = debug_values;
    else manage.list.itens[id].dados.custom_values += "\n" + debug_values;

    manage.list.itens[id].dados.last_edited = Date.now();
  }

  if (debug_action == "chap_prog_arc_audiobook") {
    let debug_nota = "{chap_prog_arc}\\n\\n{calc:tempo:sub:$atual_tempo:$comeco_tempo} de $final_tempo";
    let debug_values = "atual=1\nproximo=2\ncomeco_real=0\ncomeco=0\natual_real=0\nfim=10\ncomeco_tempo=0-00-00\natual_tempo=0-00-00\nfinal_tempo=0:00:00";

    if (manage.list.itens[id].dados.nota == "") manage.list.itens[id].dados.nota = debug_nota;
    else manage.list.itens[id].dados.nota += "\\n" + debug_nota;

    if (manage.list.itens[id].dados.custom_values == "") manage.list.itens[id].dados.custom_values = debug_values;
    else manage.list.itens[id].dados.custom_values += "\n" + debug_values;

    manage.list.itens[id].dados.last_edited = Date.now();
  }

  debug_action = "";
  document.querySelector(".debug_cancel_button").classList.add('hidden');
  process_order_list(manage.list.view_mode[0],manage.list.view_mode[1]);
}
