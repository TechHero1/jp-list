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
      "img": document.querySelector(".img_input").value,
      "custom_values": document.querySelector(".values_input").value
    }
  };
}

export function update_preview() {
  get_preview_item();

  let nota_input = document.querySelector(".nota_input").value;
  let preview_html;
  try {
    preview_html = estilos.style_text_with_tags(nota_input,cur_preview_item.dados);
  } catch (err) {
    console.error(err);
    preview_html = "<span class='text-danger'>Erro ao interpretar a anotação.</span>";
  }
  document.querySelector(".nota_input_preview").innerHTML = preview_html;
  if (nota_input.includes("\\") || nota_input.includes("[") || nota_input.includes("$") || nota_input.includes("{") || /[\S]+\.[\S]+/g.test(nota_input)) document.querySelector(".nota_preview_container").classList.remove('hidden');
  else document.querySelector(".nota_preview_container").classList.add('hidden');
}

window.update_preview_nota = update_preview;

export function get_nota(item) {
  try {
    return estilos.style_text_with_tags(String(item.dados.nota ?? ""),item.dados);
  } catch (err) {
    console.error(err);
    return "<span class='text-danger'>Erro ao interpretar a anotação.</span>";
  }
}
