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
  if (debug_action == "teste") {
    manage.list.itens[id].dados.nota += "teste\\n\\n$teste2";
    manage.list.itens[id].dados.custom_values += "teste=teste\nteste2=teste 2";
    console.log(manage.list.itens[id])
  }

  debug_action = "";
  document.querySelector(".debug_cancel_button").classList.add('hidden');
  process_order_list(manage.list.view_mode[0],manage.list.view_mode[1]);
}
