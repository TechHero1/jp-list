Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function remote_open_tab(tab_name) {
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

var site_content = {};

function upload_content(files) {
  try {
    let reader = new FileReader();

    reader.onload = function(e) {
      let result = JSON.parse(e.target.result);
      let formatted = JSON.stringify(result, null, 2);
      site_content = JSON.parse(formatted);
      load_content();
      document.querySelector(".info_tab").classList.remove("hidden");
      document.querySelector(".user_tab").classList.remove("hidden");
      document.querySelector(".cemiterio_tab").classList.remove("hidden");
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

  //PRINCIPAL
  let content_list = document.querySelector(".content_list");
  content_list.innerHTML = "";

  //CEMITÉRIO
  let cemiterio_list = document.querySelector(".cemiterio_list");
  cemiterio_list.innerHTML = "";

  for (var cur_category = 0; cur_category < Object.keys(site_content.categorias).length; cur_category++) {
    let category_id = Object.keys(site_content.categorias)[cur_category];

    //PRINCIPAL
    if (site_content.conteudo.hasOwnProperty(category_id)) {
      let cur_category_content = site_content.conteudo[Object.keys(site_content.categorias)[cur_category]];
      let category_name = site_content.categorias[Object.keys(site_content.categorias)[cur_category]];
      let category_items = "";

      content_list.innerHTML += create_category(category_id,"content");

      for (var cur_item = 0; cur_item < cur_category_content.length; cur_item++) {
        if(cur_category_content[cur_item].hasOwnProperty("conjunto")) {
          document.querySelector(".category-content-"+category_id).innerHTML += `
            <div class="conjunto-content-${category_id}-${cur_item} content_item flex flex-row items-stretch overflow-x-auto">
            </div>
          `;

          for (var cur_conjunto_item = 0; cur_conjunto_item < cur_category_content[cur_item].items.length; cur_conjunto_item++) {
            let item_plataforma = get_plataforma(cur_category_content[cur_item].items[cur_conjunto_item].url);
            let item_status = get_status(cur_category_content[cur_item].items[cur_conjunto_item].status);
            let item_notas = "";
            let img_data = "";

            if (cur_category_content[cur_item].items[cur_conjunto_item].hasOwnProperty("notas")) {
              item_notas = create_notas(cur_category_content[cur_item].items[cur_conjunto_item].notas);
            }

            if (cur_category_content[cur_item].items[cur_conjunto_item].hasOwnProperty("img") && site_content.options.img) {
              img_data = create_img(site_content.img[cur_category_content[cur_item].items[cur_conjunto_item].img]);
            }

            create_item(`.conjunto-content-${category_id}-${cur_item}`,cur_category_content[cur_item].items[cur_conjunto_item].url,cur_category_content[cur_item].items[cur_conjunto_item].nome,item_status,item_plataforma,item_notas,img_data,true);
          }
        }
        else {
          let item_plataforma = get_plataforma(cur_category_content[cur_item].url);
          let item_status = get_status(cur_category_content[cur_item].status);
          let item_notas = "";
          let img_data = "";

          if (cur_category_content[cur_item].hasOwnProperty("notas")) {
            item_notas = create_notas(cur_category_content[cur_item].notas);
          }

          if (cur_category_content[cur_item].hasOwnProperty("img") && site_content.options.img) {
            img_data = create_img(site_content.img[cur_category_content[cur_item].img]);
          }

          create_item(`.category-content-${category_id}`,cur_category_content[cur_item].url,cur_category_content[cur_item].nome,item_status,item_plataforma,item_notas,img_data);
        }
      }
    }

    //CEMITÉRIO
    if (site_content.cemiterio.hasOwnProperty(category_id)) {
      let cur_category_content = site_content.cemiterio[Object.keys(site_content.categorias)[cur_category]];
      let category_name = site_content.categorias[Object.keys(site_content.categorias)[cur_category]];
      let category_items = "";

      cemiterio_list.innerHTML += create_category(category_id,"cemiterio");

      for (var cur_item = 0; cur_item < cur_category_content.length; cur_item++) {
        if(cur_category_content[cur_item].hasOwnProperty("conjunto")) {
          document.querySelector(".category-cemiterio-"+category_id).innerHTML += `
            <div class="conjunto-cemiterio-${category_id}-${cur_item} content_item flex flex-row items-stretch overflow-x-auto">
            </div>
          `;

          for (var cur_conjunto_item = 0; cur_conjunto_item < cur_category_content[cur_item].items.length; cur_conjunto_item++) {
            let item_plataforma = get_plataforma(cur_category_content[cur_item].items[cur_conjunto_item].url);
            let item_status = get_status(cur_category_content[cur_item].items[cur_conjunto_item].status);
            let item_notas = "";
            let img_data = "";

            if (cur_category_content[cur_item].items[cur_conjunto_item].hasOwnProperty("notas")) {
              item_notas = create_notas(cur_category_content[cur_item].items[cur_conjunto_item].notas);
            }

            if (cur_category_content[cur_item].items[cur_conjunto_item].hasOwnProperty("img") && site_content.options.img) {
              img_data = create_img(site_content.img[cur_category_content[cur_item].items[cur_conjunto_item].img]);
            }

            create_item(`.conjunto-cemiterio-${category_id}-${cur_item}`,cur_category_content[cur_item].items[cur_conjunto_item].url,cur_category_content[cur_item].items[cur_conjunto_item].nome,item_status,item_plataforma,item_notas,img_data,true);
          }
        }
        else {
          let item_plataforma = get_plataforma(cur_category_content[cur_item].url);
          let item_status = get_status(cur_category_content[cur_item].status);
          let item_notas = "";
          let img_data = "";

          if (cur_category_content[cur_item].hasOwnProperty("notas")) {
            item_notas = create_notas(cur_category_content[cur_item].notas);
          }

          if (cur_category_content[cur_item].hasOwnProperty("img") && site_content.options.img) {
            img_data = create_img(site_content.img[cur_category_content[cur_item].img]);
          }

          create_item(`.category-cemiterio-${category_id}`,cur_category_content[cur_item].url,cur_category_content[cur_item].nome,item_status,item_plataforma,item_notas,img_data);
        }
      }
    }

  }

  let user_list = document.querySelector(".user_list");
  user_list.innerHTML = "";

  for (var cur_user = 0; cur_user < Object.keys(site_content.usernames).length; cur_user++) {
    let cur_username = Object.keys(site_content.usernames)[cur_user];
    let cur_user_plat = site_content.usernames[cur_username];

    document.querySelector(`.user_list`).innerHTML += `
      <div class="p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 transition-all duration-150 group hover:bg-gray-200">
          <div class="user_item item-${cur_username} p-1 w-[100%]">
              <b>${cur_username}</b>
              <br>
              <p class="flex flex-col gap-2">
                <span>Visto em:</span>
                <div class="item-${cur_username}_tags flex flex-row gap-2"></div>
              </p>
          </div>
      </div>
    `;

    for (var cur_plat = 0; cur_plat < cur_user_plat.length; cur_plat++) document.querySelector(`.item-${cur_username}_tags`).innerHTML += get_plataforma(cur_user_plat[cur_plat]);
  }
}

function get_plataforma(url) {
  for (var i = 0; i < Object.keys(site_content.plataformas).length; i++) {

    let cur_plataforma_id = Object.keys(site_content.plataformas)[i];
    let cur_plataforma_nome = site_content.plataformas[cur_plataforma_id].nome;
    let cur_plataforma_cor = site_content.plataformas[cur_plataforma_id].cor;

    if (url.includes(cur_plataforma_id)) {
      if (site_content.options.plataforma_color) return `<span class="${cur_plataforma_cor} rounded-md shadow-md py-1 px-2 h-min w-fit">${cur_plataforma_nome}</span>`;
      else return `<span class="bg-blue-200 rounded-md shadow-md py-1 px-2 h-min w-fit">${cur_plataforma_nome}</span>`;
    }
  }
}

function get_status(id) {
  for (var i = 0; i < Object.keys(site_content.status).length; i++) {

    let cur_status_id = Object.keys(site_content.status)[i];
    let cur_status_nome = site_content.status[Object.keys(site_content.status)[i]];

    if (id == cur_status_id) {
      return cur_status_nome;
    }
  }
}

function create_item(category_class,url,nome,status,plataforma,notas,img="",conjunto=false) {
  let flex_direction = "flex-row";
  if (conjunto) flex_direction = "flex-col xl:flex-row";
  document.querySelector(category_class).innerHTML += `
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
          </div>
      </div>
    </a>
  `;
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

function create_img(string,conjunto=false) {
  return `<img src="${string}" class="w-[50px] h-[50px] rounded-full">`;
}

function update_string(id) {
  if (id == "update") {
    document.querySelector(".update_string").innerHTML = `Última atualização: ${site_content.update}`;
    return;
  }
  if (id == "cemiterio") {
    document.querySelector(".cemiterio_string").innerHTML = `${site_content.tumulos.sample()}`;
    return;
  }
}

var debugged = false;

function debug() {
  if (!debugged && site_content.hasOwnProperty("update")) {
    document.body.innerHTML += `<div id="Debug" class="tabcontent rounded-md m-2 sm:p-5 bg-white shadow-md hidden">`;
    document.querySelector(".tab").innerHTML += `<button class="tablinks cursor-pointer p-3 bg-inherit transition-all duration-150" onclick="open_tab(event, 'Debug')" id="Debug_tab"><i class="fa-solid fa-gear"></i></button>`;
    
    for (var i = 0; i < (Object.keys(site_content)).length; i++) {
      if (Object.keys(site_content)[i] == "plataformas") {
        document.querySelector("#Debug").innerHTML += `
          <br>
          <b>${Object.keys(site_content)[i]}</b><br>
          <div class="flex flex-row gap-2 plataformas_all whitespace-nowrap overflow-x-auto py-3"></div>`;
        for (var cur_plat = 0; cur_plat < (Object.keys(site_content.plataformas)).length; cur_plat++) {
          document.querySelector(".plataformas_all").innerHTML += get_plataforma(Object.keys(site_content.plataformas)[cur_plat]);
        }
      }

      else if (Object.keys(site_content)[i] == "img") {
        document.querySelector("#Debug").innerHTML += `
          <br>
          <b>${Object.keys(site_content)[i]}</b><br>
          <div class="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2 items-center img_all"></div>`;
        for (var cur_img = 0; cur_img < (Object.keys(site_content.img)).length; cur_img++) {
          document.querySelector(".img_all").innerHTML += `<img class="w-auto max-w-[200px] h-auto max-h-[200px] m-auto" src="${site_content.img[Object.keys(site_content.img)[cur_img]]}" title="${Object.keys(site_content.img)[cur_img]}">`;
        }
      }

      else {
        document.querySelector("#Debug").innerHTML += `
          <br><p>
          <b>${Object.keys(site_content)[i]}</b><br>
          <span>${JSON.stringify(site_content[Object.keys(site_content)[i]])}</span>
          </p>`;
      }
    }
    debugged = true;
  }
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
