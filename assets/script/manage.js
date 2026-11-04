import * as nota from "./nota.js";
import * as estilos from "./style_tags.js";
import * as constants from "./constants.js";
import * as debug from "./debug.js";
import * as util from "./util.js";

const nf = new Intl.NumberFormat('fr-FR');

export var list = {
  "itens": [],
  "list_mode": "grid",
  "cores": true,
  "apoio": false,
  "values_open": false,
  "debug_mode": false,
  "last_filter": ['Tudo_tipo','Tudo_status'],
  "view_mode": ['add','normal'],
  "manual_order": []
};

export var ordered_list = [];

const NUMERIC_FIELDS = ["progresso", "final", "volumes", "repeticoes", "moji", "horas", "minutos", "prog_min"];
const VIEW_MODES = ["add", "edit", "alphabet", "manual"];

//import ou rascunho -> lista limpa
function normalize_list(data) {
  if (!data || typeof data !== "object" || Array.isArray(data) || !Array.isArray(data.itens)) {
    throw new Error("o arquivo não parece ser uma lista válida.");
  }

  const original_length = data.itens.length;
  data.itens = data.itens.filter(item => item && typeof item === "object" && !Array.isArray(item));

  for (const item of data.itens) {
    const dados = (item.dados && typeof item.dados === "object") ? item.dados : {};
    dados.titulo = String(dados.titulo ?? "");
    dados.status = String(dados.status ?? "Planejo");
    dados.img = String(dados.img ?? "");
    dados.nota = String(dados.nota ?? "");
    dados.custom_values = String(dados.custom_values ?? "");
    for (const field of NUMERIC_FIELDS) dados[field] = util.safe_number(dados[field]);
    dados.autotime = Boolean(dados.autotime);
    item.dados = dados;

    item.tipo = String(item.tipo ?? "Personalizado");
    item.custom_media_name = String(item.custom_media_name ?? "");
    item.custom_media_color = util.safe_color(item.custom_media_color, constants.SITE_COLORS.default);
  }

  //id errado -> refaz ids e ordem manual
  const ids = data.itens.map(item => Number(item.id));
  const ids_valid = ids.every(Number.isInteger) && new Set(ids).size === ids.length;
  if (!ids_valid) {
    data.itens.forEach((item, index) => { item.id = index; });
    data.manual_order = [];
  }
  if (data.itens.length !== original_length) data.manual_order = [];
  //a ordem manual só vale se for uma lista de ids existentes, sem repetição
  const valid_ids = new Set(data.itens.map(item => item.id));
  if (!Array.isArray(data.manual_order)
      || !data.manual_order.every(id => valid_ids.has(id))
      || new Set(data.manual_order).size !== data.manual_order.length) data.manual_order = [];

  data.list_mode = data.list_mode === "list" ? "list" : "grid";
  data.cores = data.cores !== false;
  data.apoio = Boolean(data.apoio);
  data.values_open = Boolean(data.values_open);
  data.debug_mode = Boolean(data.debug_mode);

  if (!Array.isArray(data.last_filter) || data.last_filter.length < 2) data.last_filter = ['Tudo_tipo','Tudo_status'];
  if (!Array.isArray(data.view_mode) || data.view_mode.length < 2 || !VIEW_MODES.includes(data.view_mode[0])) data.view_mode = ['add','normal'];

  return data;
}

//UPDATE LEGACY DATA (MIGRAR E REINDEX)

function migrate_legacy_data() {
  for (const item of list.itens) {
    if (item.dados.status == "Dropado") item.dados.status = "Abandonado";
    if (!Object.hasOwn(item.dados, "last_edited")) item.dados.last_edited = 0;
    item.dados.nota = estilos.update_old_tags(item.dados.nota);
  }
}

function reindex_list() {
  list.itens.forEach((item, position) => {
    item.id = Object.hasOwn(item, "id") ? Number(item.id) : position;
  });

  const existing_ids = new Set(list.itens.map(item => item.id));
  const order = Array.isArray(list.manual_order) ? list.manual_order : [];
  const kept = order.filter(id => existing_ids.has(id));
  const missing = list.itens.map(item => item.id).filter(id => !kept.includes(id));

  recalculate_ids(list.itens, [...kept, ...missing]);
}

//LIST OPTIONS

function apply_list_options() {
  const is_list = list.list_mode == "list";
  document.querySelector(".content_list").classList.toggle("grid-list-view", is_list);
  document.querySelector(".switch_view_btn").innerHTML = is_list ? `<i class="fa-solid fa-bars" aria-hidden="true"></i>` : `<i class="fa-solid fa-table-cells-large" aria-hidden="true"></i>`;

  document.querySelector(".iichan_tab").classList.toggle('hidden', !list.apoio);
  document.querySelector(".iichan_nav").classList.toggle('hidden', !list.apoio);

  document.querySelector(".cores_btn").classList.toggle('opacity-100', list.cores);
  document.querySelector(".cores_btn").classList.toggle('opacity-30', !list.cores);

  document.querySelector(".values_details").open = list.values_open;

  document.querySelector(".debug_button").classList.toggle('hidden', !list.debug_mode);
}

function change_option(option) {
  switch (option) {
    case "view":
      list.list_mode = list.list_mode == "list" ? "grid" : "list";
      apply_list_options();
    break;
    case "cores":
      list.cores = !list.cores;
      util.mark_dirty();
      apply_list_options();
      process_order_list(list.view_mode[0],list.view_mode[1]);
    break;
    case "apoio":
      list.apoio = !list.apoio;
      util.mark_dirty();
      apply_list_options();
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

function edit_item(id, event) {
  if (event && event.target.closest && event.target.closest("a.nota_link")) return;
  if (debug.debug_action != "" && id == "new") cancel_debug_action();
  if (debug.debug_action != "") {
    debug.do_debug_action(id);
    return;
  }
  if (id != "new" && !list.itens[id]) return;
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
    check_selected_type(document.querySelector(".tipo_input").value);
    document.querySelector(".name_input").focus({ preventScroll: true });
  } else {
    //não resetar em new
    document.querySelector(".tipo_input").value = list.itens[id].tipo;
    document.querySelector(".status_input").value = list.itens[id].dados.status;
    document.querySelector(".custom_media_name_input").value = list.itens[id].custom_media_name;
    document.querySelector(".custom_media_color_input").value = list.itens[id].custom_media_color;

    document.querySelector(".edit_title").innerHTML = "<i class='fa-solid fa-pencil'></i> Editar item \""+util.escape_text(list.itens[id].dados.titulo)+"\"";

    document.querySelector(".name_input").value = list.itens[id].dados.titulo;
    document.querySelector(".progresso_input").value = list.itens[id].dados.progresso;
    document.querySelector(".final_input").value = list.itens[id].dados.final;
    document.querySelector(".volumes_input").value = list.itens[id].dados.volumes;
    document.querySelector(".repeticoes_input").value = list.itens[id].dados.repeticoes;
    document.querySelector(".moji_input").value = list.itens[id].dados.moji;
    document.querySelector(".horas_input").value = list.itens[id].dados.horas;
    document.querySelector(".minutos_input").value = list.itens[id].dados.minutos;
    document.querySelector(".autotime_input").checked = list.itens[id].dados.autotime;
    document.querySelector(".prog_min_input").value = list.itens[id].dados.prog_min;
    document.querySelector(".nota_input").value = list.itens[id].dados.nota;
    document.querySelector(".values_input").value = list.itens[id].dados.custom_values;

    document.querySelector(".img_input").value = list.itens[id].dados.img;
    document.querySelector(".img_preview").src = util.safe_image_src(list.itens[id].dados.img);
    if (document.querySelector(".img_input").value == "") document.querySelector(".img_preview").classList.add('hidden');
    else document.querySelector(".img_preview").classList.remove('hidden');

    update_autotime();
    nota.update_preview();
    check_selected_type(list.itens[id].tipo);
  }
}

window.edit_item = edit_item;

function quick_edit(id) {
  const item = list.itens[id];
  if (!item) return;
  item.dados.progresso = util.safe_number(item.dados.progresso) + 1;
  if (item.dados.final > 0 && item.dados.progresso >= item.dados.final) item.dados.status = "Completo";
  item.dados.last_edited = Date.now();
  util.mark_dirty();
  process_order_list(list.view_mode[0],list.view_mode[1]);
}

window.quick_edit = quick_edit;

function read_form() {
  return {
    "tipo": document.querySelector(".tipo_input").value,
    "custom_media_name": document.querySelector(".custom_media_name_input").value.trim(),
    "custom_media_color": util.safe_color(document.querySelector(".custom_media_color_input").value, constants.SITE_COLORS.default),
    "dados": {
      "titulo": document.querySelector(".name_input").value.trim(),
      "status": document.querySelector(".status_input").value,
      "progresso": util.safe_number(document.querySelector(".progresso_input").value),
      "final": util.safe_number(document.querySelector(".final_input").value),
      "volumes": util.safe_number(document.querySelector(".volumes_input").value),
      "repeticoes": util.safe_number(document.querySelector(".repeticoes_input").value),
      "moji": util.safe_number(document.querySelector(".moji_input").value),
      "horas": util.safe_number(document.querySelector(".horas_input").value),
      "minutos": util.safe_number(document.querySelector(".minutos_input").value),
      "autotime": document.querySelector(".autotime_input").checked,
      "prog_min": util.safe_number(document.querySelector(".prog_min_input").value),
      "nota": estilos.update_old_tags(document.querySelector(".nota_input").value),
      //"nota": estilos.update_old_tags(document.querySelector(".nota_input").value).replaceAll(/\n/g,"\\n"),
      "img": document.querySelector(".img_input").value.trim(),
      "custom_values": document.querySelector(".values_input").value,
      "last_edited": Date.now()
    }
  };
}

function save_item() {
  const form = read_form();
  if (form == null) return;

  if (cur_editing_id == "new") {
    let new_id = list.itens.length;
    list.itens[new_id] = { ...form, "id": new_id };
  } else {
    //mantém dados extras ou que ainda não existem
    const old = list.itens[cur_editing_id];
    list.itens[cur_editing_id] = {
      ...old,
      ...form,
      "id": Number(cur_editing_id),
      "dados": { ...old.dados, ...form.dados }
    };
  }

  util.mark_dirty();
  reindex_list();
  reset_name_filters();
  process_order_list(list.view_mode[0],list.view_mode[1]);
  remote_open_tab('Visualizar');
  set_scroll(last_item_pos);
}

window.save_item = save_item;

function delete_item(){
  //se id não for "new", remove[id]
  if (cur_editing_id != "new") {
    const title = list.itens[cur_editing_id]?.dados.titulo ?? "";
    if (!confirm(`Deletar "${title}"? Esta ação não pode ser desfeita.`)) return;
    list.itens = list.itens.filter(item => item !== list.itens[cur_editing_id]);
    util.mark_dirty();
  }

  reindex_list();

  remote_open_tab('Visualizar');
  reset_name_filters();
  process_order_list(list.view_mode[0],list.view_mode[1]);
  set_scroll(last_item_pos);

  if (list.itens.length == 0) {
    util.mark_clean();
    clear_draft();
  }
}

window.delete_item = delete_item;

function cancel_item(){
  remote_open_tab('Visualizar');
  set_scroll(last_item_pos);

  if (list.itens.length == 0) util.mark_clean();
}

window.cancel_item = cancel_item;

//IMPORTAR / EXPORTAR

//importar e rascunho
function apply_loaded_list(data, name, dirty = false) {
  list = normalize_list(data);
  migrate_legacy_data();
  reindex_list();
  reset_name_filters();

  search_query = "";
  const search_input = document.querySelector(".search_input");
  if (search_input) search_input.value = "";

  change_filter(list.last_filter[0],list.last_filter[1],false);
  process_order_list(list.view_mode[0],list.view_mode[1]);
  document.querySelector(".file_name_input").value = name;
  remote_open_tab('Visualizar');

  //rascunho = dirty, import = !dirty
  if (dirty) util.mark_dirty();
  else util.mark_clean();
}

function upload_list(file) {
  const input = document.getElementById("jsonfile");
  if (!file) return;

  if (window.hook && list.itens.length > 0 && !confirm("Importar um arquivo vai substituir a lista atual, e as alterações não salvas serão perdidas. Continuar?")) {
    if (input) input.value = "";
    return;
  }

  let reader = new FileReader();

  reader.onerror = function() {
    util.show_message("Não foi possível ler o arquivo.", "error");
  };

  reader.onload = function(e) {
    try {
      apply_loaded_list(JSON.parse(e.target.result), file.name.replace(/\.json$/i, ""));
    } catch (err) {
      console.error(err);
      const reason = err instanceof SyntaxError ? "o arquivo não é um JSON válido." : err.message;
      util.show_message("Não foi possível importar: " + reason, "error");
    }
  };

  reader.readAsText(file);
  //permite escolher o mesmo arquivo de novo depois
  if (input) input.value = "";
}

window.upload_list = upload_list;

function download_list() {
  const name = (document.querySelector(".file_name_input").value.trim() || "lista").replace(/[\\/:*?"<>|]/g, "_");
  const url = URL.createObjectURL(new Blob([JSON.stringify(list, null, 2)], { type: "application/json" }));
  const dlAnchorElem = document.querySelector('.download_link');
  dlAnchorElem.setAttribute("href", url);
  dlAnchorElem.setAttribute("download", name+".json");
  dlAnchorElem.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);

  util.mark_clean();
  clear_draft();
}

window.download_list = download_list;

//RASCUNHO AUTOMÁTICO (backup em localStorage)

const DRAFT_KEY = "jp-list:rascunho";
var draft_timer = null;
var draft_warned = false;

function set_draft_status(text) {
  const status = document.querySelector(".draft_status");
  if (status) status.textContent = text;
}

function save_draft() {
  if (list.itens.length == 0) return clear_draft();
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      "saved_at": Date.now(),
      "name": document.querySelector(".file_name_input").value,
      "list": list
    }));
    set_draft_status("Rascunho salvo automaticamente neste navegador às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + ". Baixe a lista para não perder as alterações.");
  } catch (err) {
    console.warn("rascunho não salvo", err);
    set_draft_status("Não foi possível guardar o rascunho automático.");
    if (!draft_warned) {
      draft_warned = true;
      util.show_message("Não foi possível guardar o rascunho automático (limite de espaço do navegador). Baixe a lista para não perder as alterações.", "error");
    }
  }
}

function clear_draft() {
  clearTimeout(draft_timer);
  try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* localStorage indisponível */ }
  set_draft_status("");
  const banner = document.querySelector(".draft_banner");
  if (banner) banner.classList.add("hidden");
}

function read_draft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (draft && draft.list && Array.isArray(draft.list.itens) && draft.list.itens.length > 0) return draft;
  } catch (err) { /* rascunho ilegível: ignora */ }
  return null;
}

function check_draft() {
  const draft = read_draft();
  const banner = document.querySelector(".draft_banner");
  if (!draft || !banner) return;

  const when = new Date(draft.saved_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  banner.querySelector(".draft_text").textContent = `Há um rascunho não baixado de ${when} (${draft.list.itens.length} itens${draft.name ? ", \"" + draft.name + "\"" : ""}).`;
  banner.classList.remove("hidden");
}

function restore_draft() {
  const draft = read_draft();
  if (!draft) return clear_draft();
  try {
    apply_loaded_list(draft.list, draft.name ?? "", true);
  } catch (err) {
    console.error(err);
    util.show_message("Não foi possível restaurar o rascunho: " + err.message, "error");
    clear_draft();
  }
}

function discard_draft() {
  if (!confirm("Descartar o rascunho salvo neste navegador?")) return;
  clear_draft();
}

window.restore_draft = restore_draft;
window.discard_draft = discard_draft;

util.on_dirty(() => {
  clearTimeout(draft_timer);
  draft_timer = setTimeout(save_draft, 1000);
});

function update_autotime() {
  if (document.querySelector(".autotime_input").checked) {
    document.querySelector(".autotime_number").classList.remove("hidden");
    document.querySelector(".normaltime_number").classList.add("hidden");
  } else {
    document.querySelector(".autotime_number").classList.add("hidden");
    document.querySelector(".normaltime_number").classList.remove("hidden");
  }
}

window.update_autotime = update_autotime;

function check_selected_type(type) {
  if (type == "Personalizado") document.querySelector(".personalizado_info").classList.remove("hidden");
  else  document.querySelector(".personalizado_info").classList.add("hidden");
}

window.check_selected_type = check_selected_type;

//PERSONALIZADO FILTERS

var unique_name_filter = [];

function add_name_filter(name) {
  if (name && !unique_name_filter.includes(name)) unique_name_filter.push(name);
}

function reset_name_filters() {
  unique_name_filter = [];
}

function create_name_filters() {
  let container = document.querySelector(".custom_each_filters");
  container.replaceChildren();
  container.classList.toggle("hidden", unique_name_filter.length <= 0);

  for (const name of unique_name_filter) {
    const link = document.createElement("a");
    link.className = "block px-4 py-2 text-sm text-content-dropdown hover:bg-background-dropdown transition-all duration-150 cursor-pointer max-w-[230px] overflow-hidden text-ellipsis";
    link.tabIndex = 0;
    link.setAttribute("role", "menuitem");
    link.addEventListener("click", () => change_filter(name, ""));
    link.addEventListener("keydown", e => { if (e.key == "Enter" || e.key == " ") { e.preventDefault(); link.click(); } });

    const check = document.createElement("span");
    check.className = "custom_filter_check hidden";
    check.dataset.name = name;
    check.innerHTML = '<i class="fa-solid fa-check"></i> ';

    link.append(check, document.createTextNode(name));
    container.append(link);
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
  list.last_filter = [cur_filter_tipo,cur_filter_status];
  util.mark_dirty();
  update_filter_checks();
}

window.change_filter = change_filter;

window.addEventListener('click', function(e){
  if (!e.composedPath().includes(document.querySelector('.filter_dropdown_area'))){
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

    document.querySelectorAll(".custom_filter_check").forEach(check => check.classList.add("hidden"));

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

  if (!Object.hasOwn(constants.FILTERS, cur_filter_tipo)) {
    document.querySelectorAll(".custom_filter_check").forEach(check => check.classList.toggle("hidden", check.dataset.name != cur_filter_tipo));
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

//BUSCA

var search_query = "";
var search_timer = null;

//case insensitive e sem considerar acentos
function normalize_search(text) {
  return String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function search_list(value) {
  clearTimeout(search_timer);
  search_timer = setTimeout(() => {
    search_query = normalize_search(value).trim();
    process_order_list(list.view_mode[0],list.view_mode[1]);
  }, 150);
}

window.search_list = search_list;

function matches_search(item) {
  if (search_query == "") return true;
  const item_tipo = item.tipo == "Personalizado" ? item.custom_media_name : item.tipo;
  return normalize_search(item.dados.titulo + " " + item_tipo).includes(search_query);
}

function update_list_count(shown) {
  const counter = document.querySelector(".list_count");
  if (!counter) return;
  const total = list.itens.length;
  if (total == 0) counter.textContent = "A lista está vazia. Use o botão + para adicionar um item, ou importe um arquivo na aba Arquivo.";
  else if (shown == 0) counter.textContent = "Nenhum item encontrado com o filtro/busca atual.";
  else if (shown == total) counter.textContent = total + (total == 1 ? " item" : " itens");
  else counter.textContent = "Mostrando " + shown + " de " + total + " itens";
}

//LOAD LIST

function filter_set(key) {
  if (key == "Tudo_tipo" || key == "Tudo_status" || !Object.hasOwn(constants.FILTERS, key)) return null;
  return new Set(JSON.parse(constants.FILTERS[key]));
}

function load_list() {
  apply_list_options();

  for (const item of ordered_list) {
    if (item.tipo == "Personalizado") add_name_filter(item.custom_media_name);
  }

  //filtro de nome personalizado que não existe mais -> volta para "Tudo_tipo"
  const is_named_filter = !Object.hasOwn(constants.FILTERS, cur_filter_tipo);
  if (is_named_filter && !unique_name_filter.includes(cur_filter_tipo)) cur_filter_tipo = "Tudo_tipo";

  const tipo_set = is_named_filter ? null : filter_set(cur_filter_tipo);
  const status_set = filter_set(cur_filter_status);

  const cards = [];
  for (const item of ordered_list) {
    const tipo_ok = is_named_filter ? item.custom_media_name == cur_filter_tipo : (tipo_set == null || tipo_set.has(item.tipo));
    if (!tipo_ok) continue;
    if (status_set != null && !status_set.has(item.dados.status)) continue;
    if (!matches_search(item)) continue;
    cards.push(card_html(item));
  }

  document.querySelector(".content_list").innerHTML = cards.join("");
  update_list_count(cards.length);
  create_name_filters();
}

function card_html(item) {
  const bg_color = util.safe_color(get_bg_color(item), constants.SITE_COLORS.default);
  const img = util.safe_image_src(item.dados.img);
  const img_html = img == "" ? "" : `<img src="${util.escape_attr(img)}" alt="Capa de ${util.escape_attr(item.dados.titulo)}" loading="lazy" decoding="async" class="w-[170px] h-[225px] aspect-[1/1.33] object-contain">`;

  return `
    <div style="background-color:${bg_color}" class="flex flex-col p-1 rounded-md m-2 sm:p-5 shadow-md border border-border-list cursor-pointer transition-all duration-150 group/title hover:border-border-list-hover text-content-list" id="${item.id}" onclick="edit_item(this.id, event)">
      <div class="p-1 flex flex-row gap-2">
        ${img_html}
        ${manage_item_strings(item)}
      </div>
      <div class="nota_div p-1">${nota.get_nota(item)}</div>
    </div>
    `;
}

function manage_item_strings(item) {
  let final = "";
  if (item.dados.final > 0) final = ` de ${nf.format(item.dados.final)}`;

  let repeticoes = "";
  if (item.dados.repeticoes > 0) repeticoes = ` - <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> ${nf.format(item.dados.repeticoes)}`;

  let progresso_string = "";
  let volumes_string = "";

  const singular = constants.STRINGS_BY_TYPE.singular[item.tipo] ?? "";
  const plural = constants.STRINGS_BY_TYPE.plural[item.tipo] ?? "";

  if ((item.dados.progresso == 1 && item.dados.final == 0) || item.dados.final == 1) {
    progresso_string = nf.format(item.dados.progresso) + final + singular;
  }
  else progresso_string = nf.format(item.dados.progresso) + final + plural;

  if (constants.STRINGS_BY_TYPE.volumes.includes(item.tipo)) {
    if (item.dados.volumes <= 1) volumes_string = nf.format(item.dados.volumes) + " volume";
    else volumes_string = nf.format(item.dados.volumes) + " volumes";
  }

  if (item.tipo == "Personalizado" && item.dados.volumes == 0) {
    volumes_string = "";
  }

  if (constants.STRINGS_BY_TYPE.nada.includes(item.tipo)) progresso_string = "";

  if (item.dados.status == "Planejo" && item.dados.progresso == 0) {
    progresso_string = "";
    volumes_string = "";
  }

  let add_button = ` <button type="button" aria-label="Avançar progresso (+1)" title="Avançar progresso (+1)" class="button button-list px-[0.4rem]! py-[0.25rem]! quick_edit_button" onclick="quick_edit(${item.id});event.stopPropagation();"><i class="fa-solid fa-plus fa-xs fa-canvas-square" aria-hidden="true"></i></button>`;
  if (item.dados.status == "Completo" || item.dados.status == "Planejo" || item.dados.status == "Abandonado" || item.dados.status == "Pausado") add_button = "";
  if (Number(item.dados.final) > 0 && Number(item.dados.progresso) >= Number(item.dados.final)) add_button = "";

  let progresso = progresso_string + add_button;

  let progress_element = "";
  if (item.dados.progresso > 0 && item.dados.final > 0) {
    progress_element = `<div class="py-1"><progress class="rounded-md shadow-md border border-gray-400" aria-label="Progresso" value="${item.dados.progresso}" max="${item.dados.final}"></progress></div>`;
  }

  let moji = "";
  if (item.dados.moji == 1) moji = nf.format(item.dados.moji) + " caractere";
  if (item.dados.moji > 1) moji = nf.format(item.dados.moji) + " caracteres";

  let tempo = get_time(item);

  let item_tipo = item.tipo;
  if (item.tipo == "Personalizado") item_tipo = item.custom_media_name;

  let result = `
    <div class="w-full">
      <b>${util.escape_text(item.dados.titulo)}</b>
      <button type="button" aria-label="Editar item" title="Editar" class="pl-2 float-right sm:opacity-0 group-hover/title:opacity-100 focus:opacity-100 cursor-pointer"><i class="fa-solid fa-pencil" aria-hidden="true"></i></button>
      <br><br>
      <p class="overflow-hidden text-ellipsis">${util.escape_text(item_tipo)}</p>
      <p>${util.escape_text(item.dados.status)}${repeticoes}</p>
      <p class="flex flex-row gap-2 items-center">${progresso}</p>
      <p>${progress_element}</p>
      <p class="flex flex-row gap-2 items-center">${volumes_string}</p>
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

//REDUZIR TAMANHO DAS CAPAS (UPLOAD)

const COVER_MAX_WIDTH = 450;
const COVER_MAX_HEIGHT = 600;

async function shrink_image(file) {
  if (!/^image\/(jpeg|png|webp|bmp)$/i.test(file.type)) return null;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, COVER_MAX_WIDTH / bitmap.width, COVER_MAX_HEIGHT / bitmap.height);
  if (scale == 1 && file.size < 150 * 1024) { bitmap.close(); return null; }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.85);
}

function read_as_data_url(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function upload_image(file) {
  if (!file) return;
  try {
    let result = null;
    try { result = await shrink_image(file); } catch (err) { console.warn("não foi possível reduzir a imagem", err); }
    document.querySelector(".img_input").value = result ?? await read_as_data_url(file);
    update_preview_image();
  } catch (err) {
    console.error(err);
    util.show_message("Não foi possível carregar a imagem.", "error");
  }
}

window.upload_image = upload_image;

function clear_image() {
  document.querySelector(".img_input").value = "";
  document.querySelector(".img_preview").classList.add('hidden');
}

window.clear_image = clear_image;

function update_preview_image() {
  document.querySelector(".img_preview").src = util.safe_image_src(document.querySelector(".img_input").value);
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
    ordered_list = list.manual_order.map(index => list.itens[index]).filter(Boolean);
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
  util.mark_dirty();
  process_order_list(list.view_mode[0],list.view_mode[1]);
  cancel_item();
}

window.reset_manual_order = reset_manual_order;

function load_manual_items(temp_list=[]) {
  //se temp_list vazio = carregando, se não = recarregando
  if (temp_list == "") temp_list = list.manual_order;
  temp_manual_order = [...temp_list];

  document.querySelector(".reorder_list").innerHTML = temp_manual_order.map((item_index, i) => {
    const item = list.itens[item_index];
    if (!item) return "";

    let item_img = "";
    const img = util.safe_image_src(item.dados.img);
    if (img != "") item_img = `<img src="${util.escape_attr(img)}" alt="Capa de ${util.escape_attr(item.dados.titulo)}" loading="lazy" decoding="async" class="h-[125px] aspect-[1/1.33] object-contain grow-0">`;

    let item_tipo = item.tipo;
    if (item_tipo == "Personalizado") item_tipo = item.custom_media_name;

    return `
      <div style="background-color:${util.safe_color(get_bg_color(item), constants.SITE_COLORS.default)}" class="flex flex-col p-1 rounded-md m-2 sm:p-5 shadow-md border border-border-list transition-all duration-150 group/title hover:border-border-list-hover text-content-list">
        <div class="p-1 flex flex-col sm:flex-row gap-2 item-center w-full">
          <div class="flex flex-row gap-2 items-center w-full">
            ${item_img}
            <div class="w-full grow">
              <b>${util.escape_text(item.dados.titulo)}</b>
              <br><br>
              <p class="overflow-hidden text-ellipsis">${util.escape_text(item_tipo)}</p>
              <p>${util.escape_text(item.dados.status)}</p>
            </div>
          </div>
          <div class="w-max grow-0 text-center place-self-center flex flex-row items-center gap-5">
            <input id="input-${i}" aria-label="Posição de ${util.escape_attr(item.dados.titulo)}" value="${i+1}" onchange="move_manual_item(${i},this.value-1)" inputmode="numeric" class="textinput textinput-list h-[42px] bg-white! max-w-[150px]">
            <div class="flex flex-col gap-2 h-full">
              <button type="button" aria-label="Mover para cima" title="Mover para cima" onclick="move_manual_item(${i},${i-1})" class="button button-list bg-white! hover:bg-border-list!"><i class="fa-solid fa-sort-up" aria-hidden="true"></i></button>
              <button type="button" aria-label="Mover para baixo" title="Mover para baixo" onclick="move_manual_item(${i},${i+1})" class="button button-list bg-white! hover:bg-border-list!"><i class="fa-solid fa-sort-down" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.load_manual_items = load_manual_items;

function change_manual_item(order,current_id,new_id) {
  if (!Number.isInteger(new_id)) return;
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

function move_manual_item(current_id, new_id) {
  change_manual_item(temp_manual_order, current_id, Number(new_id));
}

window.move_manual_item = move_manual_item;

function save_manual_order() {
  list.manual_order = temp_manual_order;
  util.mark_dirty();

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

//INICIALIZAÇÃO

check_draft();
