import * as nota from "./nota.js";
import * as style_tags from "./style_tags.js";
import * as constants from "./constants.js";

var i;
const nf = new Intl.NumberFormat('fr-FR');

export var list = {
  "itens": [],
  "list_mode": "grid",
  "cores": true,
  "apoio": false,
  "values_open": false,
  "last_filter": ['Tudo_tipo','Tudo_status'],
  "view_mode": ['add','normal'],
  "manual_order": []
};

export var ordered_list = [];

function update_old_data() {
  if (!list.hasOwnProperty("last_filter")) list.last_filter = ['Tudo_tipo','Tudo_status'];
  if (!list.hasOwnProperty("view_mode")) list.view_mode = ['add','normal'];

  let create_manual_order = "false";
  if (!list.hasOwnProperty("manual_order") || list.manual_order == "") {
    list.manual_order = [];
    create_manual_order = "true";
  }
  if (list.hasOwnProperty("manual_order") && list.itens.length > list.manual_order.length) {
    create_manual_order = "add";
  }

  if (list.manual_order.includes(null)) reset_manual_order();

  for (var i = 0; i < list.itens.length; i++) {
    if (list.itens[i].dados.status == "Dropado") list.itens[i].dados.status = "Abandonado";
    if (!list.itens[i].dados.hasOwnProperty("last_edited")) list.itens[i].dados.last_edited = 0;
    if (!list.itens[i].dados.hasOwnProperty("autotime")) list.itens[i].dados.autotime = false;
    if (!list.itens[i].dados.hasOwnProperty("prog_min")) list.itens[i].dados.prog_min = 0;
    if (!list.itens[i].dados.hasOwnProperty("final")) list.itens[i].dados.final = 0;
    if (!list.itens[i].dados.hasOwnProperty("repeticoes")) list.itens[i].dados.repeticoes = 0;
    if (!list.itens[i].dados.hasOwnProperty("nota")) list.itens[i].dados.nota = "";
    if (!list.itens[i].dados.hasOwnProperty("custom_values")) list.itens[i].dados.custom_values = "";
    if (!list.itens[i].hasOwnProperty("custom_media_name")) list.itens[i].custom_media_name = "";
    if (!list.itens[i].hasOwnProperty("custom_media_color")) list.itens[i].custom_media_color = constants.SITE_COLORS.default;

    list.itens[i].dados.nota = style_tags.update_old_tags(list.itens[i].dados.nota);

    if (!list.itens[i].hasOwnProperty("id")) list.itens[i].id = i;
    list.itens[i].id = Number(list.itens[i].id);

    if (create_manual_order == "true") list.manual_order.push(i);
    if (create_manual_order == "add" && !list.manual_order.includes(i)) list.manual_order.push(i);
  }

  recalculate_ids(list.itens,list.manual_order);
}

//LIST OPTIONS

function check_initial_conditions() {
  if (document.querySelector(".content_list").classList.contains("grid-list-view") && list.list_mode == "grid") button.click();
  if (!document.querySelector(".content_list").classList.contains("grid-list-view") && list.list_mode == "list") button.click();

  if (list.apoio) {
    document.querySelector(".iichan_tab").classList.remove('hidden');
    document.querySelector(".iichan_nav").classList.remove('hidden');
  }

  if (!list.cores) {
    document.querySelector(".cores_btn").classList.remove('opacity-100');
    document.querySelector(".cores_btn").classList.add('opacity-30');
  }

  if (!list.hasOwnProperty("values_open") || !list.values_open) list.values_open = false;
  document.querySelector(".values_details").open = list.values_open;
}

function change_option(option) {
  switch (option) {
    case "view":
      //SWITCH OPTION VIEW
      let content_list = document.querySelector(".content_list");
      let button = document.querySelector(".switch_view_btn");
      if (content_list.classList.contains("grid-list-view")) {
        content_list.classList.remove("grid-list-view");
        list.list_mode = "grid";
        button.innerHTML = `<i class="fa-solid fa-table-cells-large"></i>`;
        return
      }
      content_list.classList.add("grid-list-view");
      list.list_mode = "list";
      button.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    break;
    case "cores":
      //SWITCH OPTION CORES
      if (!list.cores) {
        list.cores = true;
        hook = true;
        document.querySelector(".cores_btn").classList.remove('opacity-30');
        document.querySelector(".cores_btn").classList.add('opacity-100');
        process_order_list(list.view_mode[0],list.view_mode[1]);
        return
      }
      list.cores = false;
      hook = true;
      document.querySelector(".cores_btn").classList.remove('opacity-100');
      document.querySelector(".cores_btn").classList.add('opacity-30');
      process_order_list(list.view_mode[0],list.view_mode[1]);
    break;
    case "apoio":
      //SWITCH OPTION APOIO
      if (!list.apoio) {
        list.apoio = true;
        hook = true;
        document.querySelector(".iichan_tab").classList.remove('hidden');
        document.querySelector(".iichan_nav").classList.remove('hidden');
        return
      }
      list.apoio = false;
      hook = true;
      document.querySelector(".iichan_tab").classList.add('hidden');
      document.querySelector(".iichan_nav").classList.add('hidden');
    break;
  }
}

window.change_option = change_option;

function update_values_open() {
  list.values_open = document.querySelector(".values_details").open;
}

window.update_values_open = update_values_open;

//REAL MANAGE LIST

var cur_editing_id;
var last_item_pos;

function edit_item(id) {
  hook = true;
  last_item_pos = window.scrollY;
  set_scroll();
  cur_editing_id = id;
  remote_open_tab('Editar');

  if (id == "new") {
    document.querySelector(".edit_title").innerHTML = "<i class='fa-solid fa-plus'></i> Adicionar um novo item";

    document.querySelector(".name_input").value = "";
    document.querySelector(".progresso_input").value = 0;
    document.querySelector(".final_input").value = 0;
    document.querySelector(".volumes_input").value = 0;
    document.querySelector(".repeticoes_input").value = 0;
    document.querySelector(".moji_input").value = 0;
    document.querySelector(".horas_input").value = 0;
    document.querySelector(".minutos_input").value = 0;
    document.querySelector(".autotime_input").checked = false;
    document.querySelector(".prog_min_input").value = 0;
    document.querySelector(".nota_input").value = "";
    document.querySelector(".values_input").value = "";

    document.querySelector(".img_input").value = "";
    document.querySelector(".img_preview").src = "";
    document.querySelector(".img_preview").classList.add('hidden');

    update_autotime();
    nota.update_preview();
    nota.update_values("");
    check_selected_type(document.querySelector(".tipo_input").value);
  } else {
    //não resetar em new
    document.querySelector(".tipo_input").value = list.itens[id].tipo;
    document.querySelector(".status_input").value = list.itens[id].dados.status;
    document.querySelector(".custom_media_name_input").value = list.itens[id].custom_media_name;
    document.querySelector(".custom_media_color_input").value = list.itens[id].custom_media_color;

    document.querySelector(".edit_title").innerHTML = "<i class='fa-solid fa-pencil'></i> Editar item \""+list.itens[id].dados.titulo+"\"";

    document.querySelector(".name_input").value = list.itens[id].dados.titulo;
    document.querySelector(".progresso_input").value = list.itens[id].dados.progresso;
    document.querySelector(".final_input").value = list.itens[id].dados.final;
    document.querySelector(".volumes_input").value = list.itens[id].dados.volumes;
    document.querySelector(".repeticoes_input").value = list.itens[id].dados.repeticoes;
    document.querySelector(".moji_input").value = list.itens[id].dados.moji;
    document.querySelector(".horas_input").value = list.itens[id].dados.horas;
    document.querySelector(".minutos_input").value = list.itens[id].dados.minutos;
    document.querySelector(".autotime_input").checked = list.itens[id].dados.autotime;
    document.querySelector(".prog_min_input").checked = list.itens[id].dados.prog_min;
    document.querySelector(".nota_input").value = list.itens[id].dados.nota;
    document.querySelector(".values_input").value = list.itens[id].dados.custom_values;

    document.querySelector(".img_input").value = list.itens[id].dados.img;
    document.querySelector(".img_preview").src = list.itens[id].dados.img;
    if (document.querySelector(".img_input").value == "") document.querySelector(".img_preview").classList.add('hidden');
    else document.querySelector(".img_preview").classList.remove('hidden');

    update_autotime();
    nota.update_preview();
    nota.update_values(list.itens[id].dados.custom_values);
    check_selected_type(list.itens[id].tipo);
  }

  if (document.querySelector('.nota_link') != null) {
    window.addEventListener('click', function(e){   
      if (document.querySelector('.nota_link').contains(e.target)){
        remote_open_tab('Visualizar');
      }
    });
  }
}

window.edit_item = edit_item;

function save_item() {
  //se id for "new", add[id], return
  if (cur_editing_id == "new") {
    let new_id = list.itens.length;
    
    list.itens[new_id] = {
      "tipo":document.querySelector(".tipo_input").value,
      "custom_media_name":document.querySelector(".custom_media_name_input").value,
      "custom_media_color":document.querySelector(".custom_media_color_input").value,
      "id":new_id,
      "dados": {
        "titulo": document.querySelector(".name_input").value,
        "status": document.querySelector(".status_input").value,
        "progresso": document.querySelector(".progresso_input").value,
        "final": document.querySelector(".final_input").value,
        "volumes": document.querySelector(".volumes_input").value,
        "repeticoes": document.querySelector(".repeticoes_input").value,
        "moji": document.querySelector(".moji_input").value,
        "horas": document.querySelector(".horas_input").value,
        "minutos": document.querySelector(".minutos_input").value,
        "autotime": document.querySelector(".autotime_input").checked,
        "prog_min": document.querySelector(".prog_min_input").value,
        "nota": document.querySelector(".nota_input").value,
        "img": document.querySelector(".img_input").value,
        "custom_values": document.querySelector(".values_input").value,
        "last_edited": Date.now()
      }
    };
    remote_open_tab('Visualizar');
    update_old_data();
    process_order_list(list.view_mode[0],list.view_mode[1]);
    set_scroll(last_item_pos);
    return;
  }
  //substituir[id]
  list.itens[cur_editing_id] = {
    "tipo":document.querySelector(".tipo_input").value,
    "custom_media_name":document.querySelector(".custom_media_name_input").value,
    "custom_media_color":document.querySelector(".custom_media_color_input").value,
    "id":Number(cur_editing_id),
    "dados": {
      "titulo": document.querySelector(".name_input").value,
      "status": document.querySelector(".status_input").value,
      "progresso": document.querySelector(".progresso_input").value,
      "final": document.querySelector(".final_input").value,
      "volumes": document.querySelector(".volumes_input").value,
      "repeticoes": document.querySelector(".repeticoes_input").value,
      "moji": document.querySelector(".moji_input").value,
      "horas": document.querySelector(".horas_input").value,
      "minutos": document.querySelector(".minutos_input").value,
      "autotime": document.querySelector(".autotime_input").checked,
      "prog_min": document.querySelector(".prog_min_input").value,
      "nota": document.querySelector(".nota_input").value,
      "img": document.querySelector(".img_input").value,
      "custom_values": document.querySelector(".values_input").value,
      "last_edited": Date.now()
    }
  };
  update_old_data();
  reset_name_filters();
  process_order_list(list.view_mode[0],list.view_mode[1]);
  remote_open_tab('Visualizar');
  set_scroll(last_item_pos);
}

window.save_item = save_item;

function delete_item(){
  //se id não for "new", remove[id]
  if (cur_editing_id != "new") {
    list.itens = list.itens.filter(item => item !== list.itens[cur_editing_id]);
  }

  list.manual_order = remove_all_of_element(list.manual_order,cur_editing_id);

  recalculate_ids(list.itens,list.manual_order);

  remote_open_tab('Visualizar');
  update_old_data();
  reset_name_filters();
  process_order_list(list.view_mode[0],list.view_mode[1]);
  set_scroll(last_item_pos);

  if (list.itens == "") hook = false;
}

window.delete_item = delete_item;

function cancel_item(){
  remote_open_tab('Visualizar');
  set_scroll(last_item_pos);

  if (list.itens == "") hook = false;
}

window.cancel_item = cancel_item;

var listname = "";

function upload_list(files) {
  try {
    let reader = new FileReader();

    reader.onload = function(e) {
      let result = JSON.parse(e.target.result);
      let formatted = JSON.stringify(result, null, 2);
      list = JSON.parse(formatted);
      update_old_data();
      reset_name_filters();
      change_filter(list.last_filter[0],list.last_filter[1],false);
      process_order_list(list.view_mode[0],list.view_mode[1]);
      listname = files.name.replaceAll(/.json/g,"");
      document.querySelector(".file_name_input").value = listname;
      remote_open_tab('Visualizar');
      hook = true;
    }

    reader.readAsText(files);
  } catch (err) {
    console.error(err);
  }
}

window.upload_list = upload_list;

function download_list() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
  var dlAnchorElem = document.querySelector('.download_link');
  dlAnchorElem.setAttribute("href", dataStr);
  listname = document.querySelector(".file_name_input").value;
  dlAnchorElem.setAttribute("download", listname+".json");
  dlAnchorElem.click();
  hook = false;
}

window.download_list = download_list;

function update_autotime() {
  if (document.querySelector(".autotime_input").checked) {
    document.querySelector(".autotime_number").classList.remove("hidden");
    document.querySelector(".normaltime_number").classList.add("hidden");
  } else {
    document.querySelector(".autotime_number").classList.add("hidden");
    document.querySelector(".normaltime_number").classList.remove("hidden");
  }
}

function check_selected_type(type) {
  if (type == "Personalizado") document.querySelector(".personalizado_info").classList.remove("hidden");
  else  document.querySelector(".personalizado_info").classList.add("hidden");
}

window.check_selected_type = check_selected_type;

//PERSONALIZADO FILTERS

var unique_name_filter = [];

function add_name_filter(name) {
  if (!unique_name_filter.includes(name)) unique_name_filter.push(name);
}

function reset_name_filters() {
  unique_name_filter = [];
}

function create_name_filters() {
  let container = document.querySelector(".custom_each_filters");
  container.classList.add("hidden");
  container.innerHTML = "";

  if (unique_name_filter.length <= 0) return;

  container.classList.remove("hidden");
  for (var i = 0; i < unique_name_filter.length; i++) {
    container.innerHTML += `
      <a tabindex="-1" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-150 cursor-pointer max-w-[230px] overflow-hidden text-ellipsis" onclick="change_filter('${unique_name_filter[i]}','')">
        <span class="icon_${unique_name_filter[i]} hidden"><i class="fa-solid fa-check"></i> </span>${unique_name_filter[i]}
      </a>
    `;
  }
  update_filter_checks();
}

//FILTERS
var cur_filter_tipo = "Tudo_tipo";
var cur_filter_status = "Tudo_status";

function switch_filter() {
  if (document.querySelector(".filter_dropdown").classList.contains('hidden')) {
    document.querySelector(".filter_dropdown").classList.remove('hidden');
    return
  }
  document.querySelector(".filter_dropdown").classList.add('hidden');
}

window.switch_filter = switch_filter;

function change_filter(filter_tipo,filter_status,reload=true) {
  if (filter_tipo != "") cur_filter_tipo = filter_tipo;
  if (filter_status != "") cur_filter_status = filter_status;
  if (reload) process_order_list(list.view_mode[0],list.view_mode[1]);
  //if (reload) load_list();
  list.last_filter = [cur_filter_tipo,cur_filter_status];
  hook = true;
  update_filter_checks();
}

window.change_filter = change_filter;

window.addEventListener('click', function(e){   
  if (!document.querySelector('.filter_dropdown_area').contains(e.target)){
    document.querySelector(".filter_dropdown").classList.add('hidden');
  }
});

function reset_filter_checks(type) {
  if (type == "tipo") {
    document.querySelector(".icon_tipo_tudo").classList.add("hidden");
    document.querySelector(".icon_tipo_midia").classList.add("hidden");
    document.querySelector(".icon_tipo_short_fanfic").classList.add("hidden");

    document.querySelector(".icon_tipo_novel").classList.add("hidden");
    document.querySelector(".icon_tipo_anime").classList.add("hidden");
    document.querySelector(".icon_tipo_manga").classList.add("hidden");
    document.querySelector(".icon_tipo_jogo").classList.add("hidden");
    document.querySelector(".icon_tipo_filme").classList.add("hidden");
    document.querySelector(".icon_tipo_audio").classList.add("hidden");
    document.querySelector(".icon_tipo_doramaserie").classList.add("hidden");
    document.querySelector(".icon_tipo_stage").classList.add("hidden");
    document.querySelector(".icon_tipo_fanfic").classList.add("hidden");
    document.querySelector(".icon_tipo_shortstory").classList.add("hidden");
    document.querySelector(".icon_tipo_ensaio").classList.add("hidden");

    document.querySelector(".icon_tipo_custom").classList.add("hidden");

    for (var i = 0; i < unique_name_filter.length; i++) {
      if (unique_name_filter[i] != cur_filter_tipo) document.querySelector(".icon_"+unique_name_filter[i]).classList.add("hidden");
    }

    return;
  }
  if (type == "status") {
    document.querySelector(".icon_status_tudo").classList.add("hidden");
    document.querySelector(".icon_status_pendente").classList.add("hidden");
    document.querySelector(".icon_status_planejando").classList.add("hidden");
    document.querySelector(".icon_status_repetindo").classList.add("hidden");
    document.querySelector(".icon_status_concluido").classList.add("hidden");
    document.querySelector(".icon_status_pausado").classList.add("hidden");
    document.querySelector(".icon_status_abandonado").classList.add("hidden");
    
    return;
  }
}

function update_filter_checks() {
  reset_filter_checks("tipo");

  switch(cur_filter_tipo) {
    case "Mídia":
      document.querySelector(".icon_tipo_midia").classList.remove("hidden");
      break;
    case "Short Stories e Fanfics":
      document.querySelector(".icon_tipo_short_fanfic").classList.remove("hidden");
      break;
    case "Tudo_tipo":
      document.querySelector(".icon_tipo_tudo").classList.remove("hidden");
      break;
    case "Novel":
      document.querySelector(".icon_tipo_novel").classList.remove("hidden");
      break;
    case "Anime":
      document.querySelector(".icon_tipo_anime").classList.remove("hidden");
      break;
    case "Mangá":
      document.querySelector(".icon_tipo_manga").classList.remove("hidden");
      break;
    case "Jogo":
      document.querySelector(".icon_tipo_jogo").classList.remove("hidden");
      break;
    case "Filme":
      document.querySelector(".icon_tipo_filme").classList.remove("hidden");
      break;
    case "Áudio":
      document.querySelector(".icon_tipo_audio").classList.remove("hidden");
      break;
    case "Dorama/Série":
      document.querySelector(".icon_tipo_doramaserie").classList.remove("hidden");
      break;
    case "Stage":
      document.querySelector(".icon_tipo_stage").classList.remove("hidden");
      break;
    case "Fanfic":
      document.querySelector(".icon_tipo_fanfic").classList.remove("hidden");
      break;
    case "Short Story":
      document.querySelector(".icon_tipo_shortstory").classList.remove("hidden");
      break;
    case "Ensaio":
      document.querySelector(".icon_tipo_ensaio").classList.remove("hidden");
      break;
    case "Personalizados":
      document.querySelector(".icon_tipo_custom").classList.remove("hidden");
      break;
  }

  if (!Object.keys(constants.FILTERS).includes(cur_filter_tipo) && document.body.contains(document.querySelector(".icon_"+cur_filter_tipo))) {
    document.querySelector(".icon_"+cur_filter_tipo).classList.remove("hidden");
  }

  reset_filter_checks("status");

  switch(cur_filter_status) {
    case "Tudo_status":
      document.querySelector(".icon_status_tudo").classList.remove("hidden");
      break;
    case "Pendente":
      document.querySelector(".icon_status_pendente").classList.remove("hidden");
      break;
    case "Planejamento":
      document.querySelector(".icon_status_planejando").classList.remove("hidden");
      break;
    case "Repetindo":
      document.querySelector(".icon_status_repetindo").classList.remove("hidden");
      break;
    case "Concluído":
      document.querySelector(".icon_status_concluido").classList.remove("hidden");
      break;
    case "Pausado":
      document.querySelector(".icon_status_pausado").classList.remove("hidden");
      break;
    case "Abandonado":
      document.querySelector(".icon_status_abandonado").classList.remove("hidden");
      break;
  }
}

//LOAD LIST

function load_list() {
  document.querySelector(".content_list").innerHTML = "";

  check_initial_conditions();

  let filtered_list = [];
  if (!Object.keys(constants.FILTERS).includes(cur_filter_tipo)) {
    for (i = 0; i < ordered_list.length; i++) {
      if (ordered_list[i].hasOwnProperty("custom_media_name")) {
        if (cur_filter_tipo == ordered_list[i].custom_media_name && JSON.parse(constants.FILTERS[cur_filter_status]).includes(ordered_list[i].dados.status)) {
          filtered_list.push(i);
        }
      }
    }
  } else {
    for (i = 0; i < ordered_list.length; i++) {
      if (JSON.parse(constants.FILTERS[cur_filter_tipo]).includes(ordered_list[i].tipo) && JSON.parse(constants.FILTERS[cur_filter_status]).includes(ordered_list[i].dados.status)) {
        filtered_list.push(i);
      }
    }
  }

  for (i = 0; i < ordered_list.length; i++) {
    if (ordered_list[i].tipo == "Personalizado") add_name_filter(ordered_list[i].custom_media_name);

    if (filtered_list.includes(i)) {
      let bg_color = get_bg_color(ordered_list[i]);

      let img_hidden = "";
      if (ordered_list[i].dados.img == "") img_hidden = "hidden";

      let anotacao = nota.get_nota(ordered_list[i]);

      document.querySelector(".content_list").innerHTML += `
        <div class="bg-[${bg_color}] flex flex-col p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 cursor-pointer transition-all duration-150 group/title hover:border-gray-400" id="${ordered_list[i].id}" onclick="edit_item(this.id)">
          <div class="p-1 flex flex-row gap-2">
            <img src="${ordered_list[i].dados.img}" class="w-[170px] h-[225px] aspect-[1/1.33] object-contain ${img_hidden}">
            ${manage_item_strings(ordered_list[i])}
          </div>
          <div class="nota_div p-1">${anotacao}</div>
        </div>
        `;
    }

  }

  create_name_filters();
}

function manage_item_strings(item) {
  let final = "";
  if (item.dados.final > 0) final = ` de ${nf.format(item.dados.final)}`;

  let repeticoes = "";
  if (item.dados.repeticoes > 0) repeticoes = ` - <i class="fa-solid fa-rotate-right"></i> ${nf.format(item.dados.repeticoes)}`;

  let progresso_string = "";
  let volumes_string = "";
  let progresso_traco = "";

  if ((item.dados.progresso == 1 && item.dados.final == 0) || item.dados.final == 1) {
    progresso_string = nf.format(item.dados.progresso) + final + constants.STRINGS_BY_TYPE.singular[item.tipo];
  }
  else progresso_string = nf.format(item.dados.progresso) + final + constants.STRINGS_BY_TYPE.plural[item.tipo];

  if (constants.STRINGS_BY_TYPE.volumes.includes(item.tipo)) {
    if (item.dados.volumes <= 1) volumes_string = nf.format(item.dados.volumes) + " volume";
    else volumes_string = nf.format(item.dados.volumes) + " volumes";
    progresso_traco = " - ";
  }

  if (item.tipo == "Personalizado" && item.dados.volumes == 0) {
    volumes_string = "";
    progresso_traco = "";
  }

  if (constants.STRINGS_BY_TYPE.nada.includes(item.tipo)) progresso_string = "";

  if (item.dados.status == "Planejo" && item.dados.progresso == 0) {
    progresso_string = "";
    volumes_string = "";
    progresso_traco = "";
  }

  let progresso = progresso_string + progresso_traco + volumes_string;
  
  let progress_element = "";
  if (item.dados.progresso > 0 && item.dados.final > 0) {
    progress_element = `<progress class="rounded-md shadow-md border border-gray-400" id="progress_bar" value="${item.dados.progresso}" max="${item.dados.final}"></progress>`;
  }

  let moji = "";
  if (item.dados.moji == 1) moji = nf.format(item.dados.moji) + " caractere";
  if (item.dados.moji > 1) moji = nf.format(item.dados.moji) + " caracteres";

  let tempo = get_time(item);

  let item_tipo = item.tipo;
  if (item.tipo == "Personalizado") item_tipo = item.custom_media_name;

  let result = `
    <div class="w-full">
      <b>${item.dados.titulo}</b>
      <button class="pl-2 float-right sm:opacity-0 group-hover/title:opacity-100"><i class="fa-solid fa-pencil"></i></button>
      <br><br>
      <p class="overflow-hidden text-ellipsis">${item_tipo}</p>
      <p>${item.dados.status}${repeticoes}</p>
      <p class="flex flex-row gap-2 items-center"><span>${progresso}</span></p>
      <p>${progress_element}</p>
      <p>${tempo}</p>
      <p>${moji}</p>
    </div>`;

  return result;
}

function get_time(item) {
  let horas = String(item.dados.horas).padStart(2, '0');
  let minutos = String(item.dados.minutos).padStart(2, '0');

  if (!item.dados.autotime) {
    if (item.dados.horas == 0 && item.dados.minutos == 0) return "";
    return horas+":"+minutos;
  }
  else {
    if (item.dados.prog_min == 0) return "";
    return String(Math.trunc((item.dados.progresso*item.dados.prog_min)/60)).padStart(2, '0')+":"+String((item.dados.progresso*item.dados.prog_min)%60).padStart(2, '0');
  }
}

function get_bg_color(item) {
  if (!list.cores) return constants.SITE_COLORS.default;

  if (item.tipo == "Personalizado") return item.custom_media_color;

  if (constants.SITE_COLORS.types[item.tipo] == null) return constants.SITE_COLORS.default;

  return constants.SITE_COLORS.types[item.tipo];
}

function upload_image(files) {
  try {
    let reader = new FileReader();

    reader.onload = function(e) {
      let result = e.target.result;
      document.querySelector(".img_input").value = result;
      update_preview_image();
    }

    reader.readAsDataURL(files);
  } catch (err) {
    console.error(err);
  }
}

window.upload_image = upload_image;

function clear_image() {
  document.querySelector(".img_input").value = "";
  document.querySelector(".img_preview").classList.add('hidden');
}

window.clear_image = clear_image;

function update_preview_image() {
  document.querySelector(".img_preview").src = document.querySelector(".img_input").value;
  document.querySelector(".img_preview").classList.remove('hidden');

  if (document.querySelector(".img_input").value == "") clear_image();
}

window.update_preview_image = update_preview_image;

//PROCESS LIST ORDER
function switch_order() {
  if (document.querySelector(".order_dropdown").classList.contains('hidden')) {
    document.querySelector(".order_dropdown").classList.remove('hidden');
    return
  }
  document.querySelector(".order_dropdown").classList.add('hidden');
}

window.switch_order = switch_order;

window.addEventListener('click', function(e){   
  if (!document.querySelector('.order_dropdown_area').contains(e.target)){
    document.querySelector(".order_dropdown").classList.add('hidden');
  }
});

function process_order_list(mode, direction) {
  list.view_mode = [mode,direction];
  ordered_list = [];

  //MANUAL
  if (mode == "manual") {
    ordered_list = list.manual_order.map(index => list.itens[index]);
    document.querySelector(".manual_reorder_button").classList.remove("hidden");
    load_list();
    return;
  }

  document.querySelector(".manual_reorder_button").classList.add("hidden");

  //ADD
  if (mode == "add") {
    if (direction == "normal") {
      //ADD - CRESCENTE
      ordered_list = list.itens;
      load_list();
      return;
    } else {
      //ADD - DECRESCENTE
      ordered_list = list.itens.toReversed();
      load_list();
      return;
    }
  }

  //EDIT
  if (mode == "edit") {
    if (direction == "normal") {
      //EDIT - CRESCENTE
      ordered_list = list.itens.toSorted((a, b) => a.dados.last_edited - b.dados.last_edited);
      load_list();
      return;
    } else {
      //EDIT - DECRESCENTE
      ordered_list = list.itens.toSorted((a, b) => b.dados.last_edited - a.dados.last_edited);
      load_list();
      return;
    }
  }

  //ALPHABET
  if (mode == "alphabet") {
    if (direction == "normal") {
      //ALPHABET - CRESCENTE
      ordered_list = list.itens.toSorted((a, b) => a.dados.titulo.localeCompare(b.dados.titulo));
      load_list();
      return;
    } else {
      //ALPHABET - DECRESCENTE
      ordered_list = list.itens.toSorted((a, b) => b.dados.titulo.localeCompare(a.dados.titulo));
      load_list();
      return;
    }
  }
}

window.process_order_list = process_order_list;

var temp_manual_order = [];

function reset_manual_order() {
  temp_manual_order = [];
  list.manual_order = [];
  for (var i = 0; i < list.itens.length; i++) list.manual_order.push(i);
  process_order_list(list.view_mode[0],list.view_mode[1]);
  cancel_item();
}

window.reset_manual_order = reset_manual_order;

function load_manual_items(temp_list=[]) {
  //se temp_list vazio = carregando, se não = recarregando
  if (temp_list == "") temp_list = list.manual_order;
  temp_manual_order = temp_list;

  let temp_editing_list = temp_list.map(index => list.itens[index]);
  document.querySelector(".reorder_list").innerHTML = "";
  for (var i = 0; i < temp_editing_list.length; i++) {
    let item_img = "";
    if (temp_editing_list[i].dados.img != "") item_img = `<img src="${temp_editing_list[i].dados.img}" class="h-[125px] aspect-[1/1.33] object-contain grow-0">`;

    let item_tipo = temp_editing_list[i].tipo;
    if (item_tipo == "Personalizado") item_tipo = temp_editing_list[i].custom_media_name;

    document.querySelector(".reorder_list").innerHTML += `
      <div class="bg-[${get_bg_color(temp_editing_list[i])}] flex flex-col p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 transition-all duration-150 group/title hover:border-gray-400" id="0">
        <div class="p-1 flex flex-col sm:flex-row gap-2 item-center w-full">
          <div class="flex flex-row gap-2 items-center w-full">
            ${item_img}
            <div class="w-full grow">
              <b>${temp_editing_list[i].dados.titulo}</b>
              <br><br>
              <p class="overflow-hidden text-ellipsis">${item_tipo}</p>
              <p>${temp_editing_list[i].dados.status}</p>
            </div>
          </div>
          <div class="w-max grow-0 text-center place-self-center flex flex-row items-center gap-5">
            <input id="input-${i}" value="${i+1}" onchange="change_manual_item([${temp_list}],${i},this.value-1)" inputmode="numeric" class="textinput h-[42px] bg-white! max-w-[150px]">
            <div class="flex flex-col gap-2 h-full">
              <button onclick="change_manual_item([${temp_list}],${i},${i-1})" class="button bg-white! hover:bg-gray-200!"><i class="fa-solid fa-sort-up"></i></button>
              <button onclick="change_manual_item([${temp_list}],${i},${i+1})" class="button bg-white! hover:bg-gray-200!"><i class="fa-solid fa-sort-down"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

window.load_manual_items = load_manual_items;

function change_manual_item(order,current_id,new_id) {
  if (new_id < 0) return;
  if (new_id > order.length) return;

  let original1 = order.slice(0, current_id);
  let original2 = order.slice(current_id+1, order.length);

  let new_order = original1.concat(original2);

  let part1;
  let part2;

  part1 = new_order.slice(0, new_id);
  part2 = new_order.slice(new_id, new_order.length);

  part1.push(order[current_id]);
  new_order = part1.concat(part2);
  load_manual_items(new_order);
}

window.change_manual_item = change_manual_item;

function save_manual_order() {
  list.manual_order = temp_manual_order;

  process_order_list(list.view_mode[0],list.view_mode[1]);
  set_scroll();
  remote_open_tab('Visualizar');
}

window.save_manual_order = save_manual_order;

function recalculate_ids(itens,manual_order) {
  const ids_left = itens.map(i => i.id).sort((a, b) => a - b);

  const id_map = new Map();
  ids_left.forEach((old_id, index) => {
    id_map.set(old_id, index);
  });

  itens.forEach(item => {
    item.id = id_map.get(item.id);
  });

  const new_manual_order = manual_order.map(id => id_map.get(id));

  list.itens = itens;
  list.manual_order = new_manual_order;
}
