import * as estilos from "./style_tags.js";

var cur_preview_item = "";

function get_preview_item() {
  cur_preview_item = {
    "tipo":document.querySelector(".tipo_input").value,
    "custom_media_name":document.querySelector(".custom_media_name_input").value,
    "custom_media_color":document.querySelector(".custom_media_color_input").value,
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
      "img": document.querySelector(".img_input").value
    }
  };
}

export function update_preview() {
  get_preview_item();

  let nota_input = document.querySelector(".nota_input").value;
  document.querySelector(".nota_input_preview").innerHTML = estilos.style_text_with_tags(nota_input,cur_preview_item.dados);
  if (nota_input.includes("\\") || nota_input.includes("[") || nota_input.includes("$") || nota_input.includes("{")) document.querySelector(".nota_preview_container").classList.remove('hidden');
  else document.querySelector(".nota_preview_container").classList.add('hidden');
}

window.update_preview_nota = update_preview;

var item_custom_values = {};
const values_regex = /^(?<nome>.+?)=(?<valor>.+?)$/g;

export function update_values(text) {
  item_custom_values = {};
  let text_lines = text.split("\n");
  for (var i = 0; i < text_lines.length; i++) {
    for (var itag = 0; itag < (text_lines[i].match(values_regex) || []).length; itag++) {
      let values_regex_match;

      while ((values_regex_match = values_regex.exec(text_lines[i])) !== null) {
        item_custom_values[values_regex_match.groups.nome] = values_regex_match.groups.valor;
        update_preview();
      }
    }
  }
}

export function get_nota(item) {
  let result = item.dados.nota;
  result = result.linkify({
    className: "nota_link text-blue-500",
    target: "_blank"
  });
  result = estilos.style_text_with_tags(result,item.dados);

  return result;
}
