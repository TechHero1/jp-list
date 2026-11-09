function sample(array) {
  return array[Math.floor(Math.random()*array.length)];
}

function clear_active_tabs() {
  for (const tab of document.getElementsByClassName("tablinks")) {
    tab.classList.toggle("active", false);
  }
}

function remote_open_tab(tab_name) {
  clear_active_tabs();
  const tab = [...document.getElementsByClassName("tablinks")].find(t => t.id == tab_name+"_tab");
  if (tab) tab.click();
}

function open_tab(evt, tab_name) {
  for (const content of document.getElementsByClassName("tabcontent")) {
    content.classList.toggle("hidden", true);
  }
  clear_active_tabs();
  document.getElementById(tab_name).classList.toggle("hidden", false);
  evt.currentTarget.classList.toggle("active", true);
}

var site_content = {};

function upload_content(files) {
  try {
    let reader = new FileReader();

    reader.onload = function(e) {
      site_content = JSON.parse(e.target.result);
      load_content();
      for (const tab of ["info_tab", "user_tab", "cemiterio_tab"]) {
        document.querySelector("."+tab).classList.toggle("hidden", false);
      }
      remote_open_tab('Visualizar');
    }

    reader.readAsText(files);
  } catch (err) {
    console.error(err);
  }
}

function load_content() {
  if (site_content.options.debug) debug();
  document.title = site_content.title;

  const content_list = document.querySelector(".content_list");
  content_list.innerHTML = "";

  const cemiterio_list = document.querySelector(".cemiterio_list");
  cemiterio_list.innerHTML = "";

  for (const category_id of Object.keys(site_content.categorias)) {
    render_category(category_id, "content",   site_content.conteudo,  content_list);
    render_category(category_id, "cemiterio", site_content.cemiterio, cemiterio_list);
  }

  load_usernames();
}

function render_category(category_id, type, source, list) {
  if (!Object.hasOwn(source, category_id)) return;

  list.insertAdjacentHTML('beforeend', create_category(category_id, type));
  const category_class = `.category-${type}-${category_id}`;

  source[category_id].forEach((item, index) => {
    if (Object.hasOwn(item, "conjunto")) {
      const conjunto_name = `conjunto-${type}-${category_id}-${index}`;
      document.querySelector(category_class).insertAdjacentHTML('beforeend', create_conjunto(conjunto_name));
      for (const sub_item of item.items) add_item("."+conjunto_name, sub_item, true);
    }
    else {
      add_item(category_class, item);
    }
  });
}

function add_item(container_class, item, conjunto = false) {
  const plataforma = get_plataforma(item.url);
  const status = get_status(item.status);
  const notas = Object.hasOwn(item, "notas") ? create_notas(item.notas) : "";
  const img = Object.hasOwn(item, "img") && site_content.options.img ? create_img(site_content.img[item.img]) : "";
  const chips = Object.hasOwn(item, "chips") ? create_chips(item.chips) : "";

  create_item(container_class, item.url, item.nome, status, plataforma, notas, img, chips, conjunto);
}

function load_usernames() {
  const user_list = document.querySelector(".user_list");
  user_list.innerHTML = "";

  for (const [username, urls] of Object.entries(site_content.usernames)) {
    user_list.insertAdjacentHTML('beforeend', `
      <div class="p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 transition-all duration-150 group hover:bg-gray-200">
        <div class="user_item item-${username} p-1 w-[100%]">
          <b>${username}</b>
          <br>
          <p class="flex flex-col gap-2">
            <span>Visto em:</span>
            <div class="item-${username}_tags flex flex-wrap gap-2"></div>
          </p>
        </div>
      </div>
    `);

    for (const url of urls) document.querySelector(`.item-${username}_tags`).insertAdjacentHTML('beforeend', get_plataforma(url));
  }
}

function get_plataforma(url) {
  for (const [id, plataforma] of Object.entries(site_content.plataformas)) {
    const { nome, cor } = plataforma;

    if (url.includes(id)) {
      const classe_cor = site_content.options.plataforma_color ? cor : "bg-blue-200";
      return `<span class="${classe_cor} rounded-md shadow-md py-1 px-2 h-min w-fit">${nome}</span>`;
    }
  }
}

function get_status(id) {
  for (const [status_id, nome] of Object.entries(site_content.status)) {
    if (id == status_id) return nome;
  }
}

function create_item(category_class,url,nome,status,plataforma,notas,img="",chips="",conjunto=false) {
  let flex_direction = "flex-row";
  if (conjunto) flex_direction = "flex-col xl:flex-row";
  document.querySelector(category_class).insertAdjacentHTML('beforeend', `
    <a class="content_item w-full" href="${url}" target="_blank">
      <div class="p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 cursor-pointer transition-all duration-150 group hover:bg-gray-200">
        <div class="p-1 w-[100%]">
          <div class="flex ${flex_direction} gap-2 items-center w-fit">
            ${img}
            <b>${nome}</b>
          </div>
          <p class="item_status">${status}</p>
          <br>
          <p class="item_plataforma_tags flex flex-col gap-2">${plataforma}</p>
          ${notas}
          ${chips}
        </div>
      </div>
    </a>
  `);
}

function create_conjunto(conjunto_name) {
  return `<div class="${conjunto_name} content_item flex flex-row items-stretch overflow-x-auto"></div>`;
}

function create_category(id,type) {
  let open = "";
  if (site_content.categorias_open.includes(id) && type != "cemiterio") open = "open";

  return `<details ${open}><summary>
    <span class="text-xl select-none category-title-${id}">
      ${site_content.categorias[id]}
    </span></summary>
    <div class="category-${type}-${id} p-2 grid grid-cols-1 gap-2"></div></details>`;
}

function create_notas(string) {
  return `<br>
    <p class="flex flex-col gap-2">
      <span>${string}</span>
    </p>`;
}

function create_img(string) {
  return `<img src="${string}" class="w-[50px] h-[50px] rounded-full">`;
}

function create_simple_chip(text) {
  return `<span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-normal bg-[#2c2c2c] text-white">${text}</span>`;
}

function create_chips(chips) {
  let resultado = "";
  for (const item of chips) {
    let item_chips = "";
    for (const cur_chip of item.itens) {
      item_chips += create_simple_chip(cur_chip);
    }
    resultado += `<div class="flex flex-wrap gap-1 py-1">
      <span>${item.label}</span>
      ${item_chips}
    </div>`;
  }
  return resultado;
}

function update_string(id) {
  if (id == "update") {
    document.querySelector(".update_string").innerHTML = `${site_content.update.label} ${create_simple_chip(site_content.update.string)}`;
  }
  else if (id == "cemiterio") {
    document.querySelector(".cemiterio_string").innerHTML = `${sample(site_content.tumulos)}`;
  }
}

var debugged = false;

function debug() {
  if (debugged || !Object.hasOwn(site_content, "update")) return;

  document.body.insertAdjacentHTML('beforeend', `<div id="Debug" class="tabcontent rounded-md m-2 sm:p-5 bg-white shadow-md hidden"></div>`);
  document.querySelector(".tab").insertAdjacentHTML('beforeend', `<button class="tablinks cursor-pointer p-3 bg-inherit transition-all duration-150" onclick="open_tab(event, 'Debug')" id="Debug_tab"><i class="fa-solid fa-gear"></i></button>`);

  const debug_tab = document.querySelector("#Debug");

  for (const [key, value] of Object.entries(site_content)) {
    if (key == "plataformas") {
      debug_tab.insertAdjacentHTML('beforeend', `
        <br>
        <b>${key}</b><br>
        <div class="flex flex-wrap gap-2 plataformas_all whitespace-nowrap overflow-x-auto py-3"></div>`);
      for (const id of Object.keys(value)) {
        document.querySelector(".plataformas_all").insertAdjacentHTML('beforeend', get_plataforma(id));
      }
    }

    else if (key == "img") {
      debug_tab.insertAdjacentHTML('beforeend', `
        <br>
        <b>${key}</b><br>
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2 items-center img_all"></div>`);
      for (const [img_name, img_src] of Object.entries(value)) {
        document.querySelector(".img_all").insertAdjacentHTML('beforeend', `<img class="w-auto max-w-[200px] h-auto max-h-[200px] m-auto" src="${img_src}" title="${img_name}">`);
      }
    }

    else {
      debug_tab.insertAdjacentHTML('beforeend', `
        <br><p>
        <b>${key}</b><br>
        <span>${JSON.stringify(value)}</span>
        </p>`);
    }
  }
  debugged = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.querySelector('#Arquivo');

  dropZone.addEventListener('dragover', (event) =>{
    event.preventDefault();

  });

  dropZone.addEventListener('drop', (event) =>{
    event.preventDefault();
    const files = event.dataTransfer.files;
    upload_content(files[0]);
  });
});
