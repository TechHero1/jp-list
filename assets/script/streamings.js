var i;

//DROPDOWN
function switch_streaming_dropdown(option) {
  if (document.querySelector("."+option).classList.contains('hidden')) {
    document.querySelector("."+option).classList.remove('hidden');
    return
  }
  document.querySelector("."+option).classList.add('hidden');
}

window.switch_streaming_dropdown = switch_streaming_dropdown;

window.addEventListener('click', function(e) {   
  if (!document.querySelector('.streaming_filter_dropdown_area').contains(e.target)) {
    document.querySelector(".streaming_filter_dropdown").classList.add('hidden');
  }

  if (!document.querySelector('.streaming_config_dropdown_area').contains(e.target)) {
    document.querySelector(".streaming_config_dropdown").classList.add('hidden');
  }
});

//FILTROS
function change_streaming_filter(midia) {
  let streaming_items;
  streaming_items = document.getElementsByClassName("streaming_item");

  if (midia != "tudo") {
    for (i = 0; i < streaming_items.length; i++) {
      streaming_items[i].classList.add('hidden');
      if (streaming_items[i].classList.contains("streaming_item_"+midia)) {
        streaming_items[i].classList.remove('hidden');
      }
    }
  } else {
    for (i = 0; i < streaming_items.length; i++) {
      streaming_items[i].classList.remove('hidden');
    }
  }

  switch_streaming_dropdown("streaming_filter_dropdown");
}

window.change_streaming_filter = change_streaming_filter;

//CONFIGS
var exibir_eos = false;

function change_streaming_config(option) {
  if (option == "eos") {
    if (exibir_eos) {
      exibir_eos = false;
      update_streaming_config();
      load_streaming_items();
      return
    } else {
      exibir_eos = true;
      update_streaming_config();
      load_streaming_items();
      return
    }
  }
}

window.change_streaming_config = change_streaming_config;

function update_streaming_config() {
  if (exibir_eos) document.querySelector(".check_exibir_eos").classList.remove('hidden');
  else document.querySelector(".check_exibir_eos").classList.add('hidden');
}

window.update_streaming_config = update_streaming_config;

//CONTEUDO
var streaming_items_data = [];

async function fetch_streaming_items() {
  if (streaming_items_data == "") {
    let file_object = await fetch("data/streamings.json");
    let json_data = await file_object.json();

    streaming_items_data = json_data;
  }

  load_streaming_items();
}

window.fetch_streaming_items = fetch_streaming_items;

function load_streaming_items() {
  document.querySelector(".streaming_list").innerHTML = "";

  for (var i = 0; i<streaming_items_data.sites.length; i++) {
    let item_nome = streaming_items_data.sites[i].nome;
    let item_midia = streaming_items_data.sites[i].midia;
    let item_classes = streaming_items_data.sites[i].classes;
    let item_link = streaming_items_data.sites[i].link;
    let item_tags = streaming_items_data.sites[i].tags;
    let item_descricao = streaming_items_data.sites[i].desc;
    let item_ativo = streaming_items_data.sites[i].ativo;

    let item_ativo_classe = "";
    if (!item_ativo) item_ativo_classe = " streaming_item_eos opacity-50";

    let item_html_tags = create_streaming_tags(item_tags);

    if (exibir_eos || !exibir_eos && item_ativo) {
      document.querySelector(".streaming_list").innerHTML += `
        <a class="streaming_item ${item_classes}${item_ativo_classe}" href="${item_link}" target="_blank">
          <div class="p-1 rounded-md m-2 sm:p-5 shadow-md border border-gray-200 cursor-pointer transition-all duration-150 group hover:bg-gray-200">
            <div class="p-1 w-[100%]">
              <b>${item_nome}</b>
              <br>
              <p>${item_midia}</p>
              <br>
              <p class="streaming_tags flex flex-col gap-2">${item_html_tags}</p>
              <br>
              <div class="streaming_notas flex flex-col gap-4 items-stretch">${item_descricao}</div>
            </div>
          </div>
        </a>`;
    }
  }
}

function create_streaming_tags(array) {
  let result = "";

  for (var i = 0; i<array.length; i++) {
    result += `<span class="bg-item-${array[i].tipo} rounded-md shadow-md py-1 px-2 h-min w-fit">${array[i].texto}</span>`;
  }

  return result;
}
