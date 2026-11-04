import * as dicts from "../yomitan/japanese-kana-romaji-dicts.js";
import * as nota from "./nota.js";
import * as constants from "./constants.js";
import * as util from "./util.js";

export function update_old_tags(text="") {
  //old umineko ids
  text = text.replaceAll("vermelho_umineko_ps3","vermelho_umineko_mod");
  text = text.replaceAll("azul_umineko_ps3","azul_umineko_mod");
  text = text.replaceAll("roxo_umineko_ps3","roxo_umineko_mod");
  text = text.replaceAll("dourado_umineko_ps3","dourado_umineko_mod");
  text = text.replaceAll("verde_umineko_ps3","verde_umineko_mod");

  //old preset tag
  text = text.replaceAll("[estilo:","[pre:");
  text = text.replaceAll("[/estilo]","[/pre]");

  //old old gradpercent tag
  text = text.replaceAll("[gradient_percent:","[grd:");
  text = text.replaceAll("[/gradient_percent]","[/grd]");

  //tags without att
  text = text.replaceAll("[bold]","[b]");
  text = text.replaceAll("[/bold]","[/b]");

  text = text.replaceAll("[italic]","[i]");
  text = text.replaceAll("[/italic]","[/i]");

  //tags with att
  text = text.replaceAll("[color:","[cor:");
  text = text.replaceAll("[/color]","[/cor]");

  text = text.replaceAll("[badge:","[bdg:");
  text = text.replaceAll("[/badge]","[/bdg]");

  text = text.replaceAll("[border:","[brd:");
  text = text.replaceAll("[/border]","[/brd]");

  text = text.replaceAll("[shadow:","[sdw:");
  text = text.replaceAll("[/shadow]","[/sdw]");

  text = text.replaceAll("[solidshadow:","[ssdw:");
  text = text.replaceAll("[/solidshadow]","[/ssdw]");

  text = text.replaceAll("[gradient:","[grd:");
  text = text.replaceAll("[/gradient]","[/grd]");

  text = text.replaceAll("[gradpercent:","[grd:");
  text = text.replaceAll("[/gradpercent]","[/grd]");

  text = text.replaceAll("[furigana:","[furi:");
  text = text.replaceAll("[/furigana]","[/furi]");

  text = text.replaceAll("[halfkana:","[hkat:");
  text = text.replaceAll("[/halfkana]","[/hkat]");

  text = text.replaceAll("[fullkana:","[fkat:");
  text = text.replaceAll("[/fullkana]","[/fkat]");

  text = text.replaceAll(/\[mark:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:simples}`;
  });

  text = text.replaceAll(/\[mark_p:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:porcentagem}`;
  });

  text = text.replaceAll(/\[bar_mark:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:barra}`;
  });

  //tags pre rework
  text = text.replaceAll("[grdp:","[grd:");
  text = text.replaceAll("[/grdp]","[/grd]");

  text = text.replaceAll(/\[icon:(?<id>.+?):(?<style>.+?)]/g,(match, ...args) => {
    const { id, style } = args.at(-1);
    return `{icon:${id}:${style}}`;
  });

  text = text.replaceAll(/\[bar:(?<value>.+?):(?<max>.+?)]/g,(match, ...args) => {
    const { value, max } = args.at(-1);
    return `{bar:${value}:${max}}`;
  });

  text = text.replaceAll(/\[mrk:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:simples}`;
  });

  text = text.replaceAll(/\[mrkp:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:porcentagem}`;
  });

  text = text.replaceAll(/\[barm:(?<start>.+?):(?<value>.+?):(?<end>.+?)]/g,(match, ...args) => {
    const { start, value, end } = args.at(-1);
    return `{mark:${start}:${value}:${end}:barra}`;
  });

  return text;
}

//yomitan function
function convertToHiragana(text) {
  let newText = text.toLowerCase();
  for (const [romaji, kana] of Object.entries(dicts.ROMAJI_TO_HIRAGANA)) {
      newText = newText.replaceAll(romaji, kana);
  }
  newText = fillSokuonGaps(newText);
  return newText;
}

function convertToKatakana(text) {
  let newText = text.toLowerCase();
  for (const [romaji, kana] of Object.entries(dicts.ROMAJI_TO_KATAKANA)) {
      newText = newText.replaceAll(romaji, kana);
  }
  newText = fillSokuonGaps(newText);
  return newText;
}

//yomitan function
function fillSokuonGaps(text) {
    return text.replaceAll(/っ[a-z](?=っ)/g, 'っっ').replaceAll(/ッ[A-Z](?=ッ)/g, 'ッッ');
}

function kanaFullToHalf(text) {
  let newText = text.toLowerCase();
  for (const [full, half] of Object.entries(dicts.KATAKANA_FULLWIDTH_TO_HALFWIDTH)) {
      newText = newText.replaceAll(full, half);
  }
  return newText;
}

function kanaHalfToFull(text) {
  let newText = text.toLowerCase();
  for (const [full, half] of Object.entries(dicts.KATAKANA_FULLWIDTH_TO_HALFWIDTH)) {
      newText = newText.replaceAll(half, full);
  }
  return newText;
}

function map_text_nodes(html, convert) {
  return html
    .split(/(<[^>]*>|&[a-zA-Z0-9#]+;)/)
    .map((part, index) => (index % 2 === 1 ? part : convert(part)))
    .join("");
}

//CUSTOMIZAÇÃO - LAYOUT
function switch_custom_dropdown(dropdown_id) {
  if (document.querySelector(".custom_dropdown_"+dropdown_id).classList.contains('hidden')) {
    document.querySelector(".custom_dropdown_"+dropdown_id).classList.remove('hidden');
    document.querySelector(".custom_dropdown_icon_"+dropdown_id).classList.remove('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_"+dropdown_id).classList.add('fa-angle-up');
    nota_can_add_excecao = true;
    return
  }
  document.querySelector(".custom_dropdown_"+dropdown_id).classList.add('hidden');
  document.querySelector(".custom_dropdown_icon_"+dropdown_id).classList.add('fa-angle-down');
  document.querySelector(".custom_dropdown_icon_"+dropdown_id).classList.remove('fa-angle-up');
}

window.switch_custom_dropdown = switch_custom_dropdown;

//click fora do dropdown -> fecha
const CUSTOM_DROPDOWNS = ["gradient", "shadow", "mark", "progress", "styles", "values", "kana", "calc", "fltr"];

window.addEventListener('click', function(e){
  for (const id of CUSTOM_DROPDOWNS) {
    const button = document.querySelector(".custom_dropdown_button_"+id);
    if (!button || button.contains(e.target)) continue;
    document.querySelector(".custom_dropdown_"+id)?.classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_"+id)?.classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_"+id)?.classList.remove('fa-angle-up');
  }
});

//CUSTOMIZAÇÃO - FUNCIONALIDADE
var nota_can_add = false;
var nota_can_add_excecao = false;
var nota_pos_start = 0;
var nota_pos_end = 0;

function select_field (element,status) {
  if (status) nota_can_add = status;
  else setTimeout(function () {nota_can_add = status}, 1000);
}

window.select_field = select_field;

function set_selection(start,end) {
  nota_pos_start = start;
  nota_pos_end = end;
}

window.set_selection = set_selection;

function force_selection(element,start,end) {
  element.selectionStart = start;
  element.selectionEnd = end;
  set_selection(start,end);
}

window.force_selection = force_selection;

function nota_add_style(tag,dropdown=false) {
  let element = document.querySelector(".nota_input");

  if (nota_can_add || (dropdown && nota_can_add_excecao)) {
    const selected_text = element.value.substring(nota_pos_start, nota_pos_end);
    let replace_text = constants.TAGS_TO_ADD[tag].replaceAll("$text",() => selected_text);
    if (nota_pos_start == nota_pos_end) replace_text = constants.TAGS_TO_ADD[tag].replaceAll("$text","texto");

    element.value = element.value.slice(0, nota_pos_start) + replace_text + element.value.slice(nota_pos_end);
  } else element.value += constants.TAGS_TO_ADD[tag].replaceAll("$text","texto");
  nota_can_add = false;
  if (tag=="newline") {
    force_selection(element,nota_pos_start+2,nota_pos_start+2);
    nota_can_add = true;
  }
  if (nota_can_add_excecao) set_selection(element.textLength,element.textLength);
  nota_can_add_excecao = false;
}

window.nota_add_style = nota_add_style;

function parse_custom_values(text) {
  const values = {};
  for (const line of String(text ?? "").split(/\r?\n/)) {
    const match = line.match(/^(?<nome>.+?)=(?<valor>.+?)$/);
    if (match) values[match.groups.nome.trim()] = match.groups.valor;
  }
  return values;
}

function update_item_values() {
  nota.update_preview();
}

window.update_item_values = update_item_values;

function get_string_url(text) {
  return text.linkify({
    className: "nota_link text-blue-500",
    target: "_blank",
    attributes: { rel: "noopener noreferrer" }
  });
}

export function style_text_with_tags(text,item_data) {
  text = get_string_url(text);

  //SECRET ELEMENTS
  text = text.replaceAll(/(?<!\\)\{chap_prog_moji}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$moji:$fim:barra}<br>{mark:$comeco:$moji:$fim:simples} ({mark:$comeco:$moji:$fim:porcentagem})");
  text = text.replaceAll(/(?<!\\)\{chap_prog_page}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$pages:$fim:barra}<br>{mark:$comeco:$pages:$fim:simples} ({mark:$comeco:$pages:$fim:porcentagem})");
  text = text.replaceAll(/(?<!\\)\{chap_prog_arc}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$atual_real:$fim:barra}<br>{mark:$comeco:$atual_real:$fim:simples} ({mark:$comeco:$atual_real:$fim:porcentagem})<hr>{mark:$comeco_real:$atual_real:$fim:simples}");
  text = text.replaceAll(/(?<!\\)\{mashutan}/g,"<img src='assets/img/mashutan.png' class='w-[59px] h-[68px] inline'>");
  text = text.replaceAll(/(?<!\\)\{mashutan_med}/g,"<img src='assets/img/mashutan.png' class='w-[131px] h-[151px] inline'>");
  text = text.replaceAll(/(?<!\\)\{mashutan_big}/g,"<img src='assets/img/mashutan.png' class='w-[227px] h-[262px] inline'>");
  text = text.replaceAll(/(?<!\\)\{mashutanzilla}/g,"<img src='assets/img/mashutan.png' class='max-w-[revert] w-[717px] h-[830px] inline'>");
  text = text.replaceAll(/(?<!\\)\{iichan}/g,"<img src='assets/img/iichan.png' class='w-full'>");
  text = text.replaceAll(/(?<!\\)\{iichan_face}/g,"<img src='assets/img/iichan_face.png' class='w-[96px] h-[103px] inline'>");
  text = text.replaceAll(/(?<!\\)\{eto_bleh}/g,"<img src='https://media.tenor.com/XnGK5CaQTt4AAAAd/ah-eto-bleh-anime.gif' class='w-full'>");

  text = text.replaceAll(/(?<!\\)\{stars-0}/g,"{icon:star:regular}{icon:star:regular}{icon:star:regular}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-1}/g,"{icon:star:solid}{icon:star:regular}{icon:star:regular}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-2}/g,"{icon:star:solid}{icon:star:solid}{icon:star:regular}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-3}/g,"{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-4}/g,"{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-5}/g,"{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:solid}");

  text = text.replaceAll(/(?<!\\)\{stars-0.5}/g,"{icon:star-half-stroke:solid}{icon:star:regular}{icon:star:regular}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-1.5}/g,"{icon:star:solid}{icon:star-half-stroke:solid}{icon:star:regular}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-2.5}/g,"{icon:star:solid}{icon:star:solid}{icon:star-half-stroke:solid}{icon:star:regular}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-3.5}/g,"{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star-half-stroke:solid}{icon:star:regular}");
  text = text.replaceAll(/(?<!\\)\{stars-4.5}/g,"{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star:solid}{icon:star-half-stroke:solid}");

  //VALORES PADRÕES
  const total_minutos = (Number(item_data.progresso) || 0) * (Number(item_data.prog_min) || 0);
  const tempo_horas = Math.trunc(total_minutos / 60);
  const tempo_minutos = Math.trunc(total_minutos % 60);
  const builtin_values = {
    progresso: item_data.progresso,
    final: item_data.final,
    moji: item_data.moji,
    volumes: item_data.volumes,
    repeticoes: item_data.repeticoes,
    h: item_data.horas,
    H: String(item_data.horas).padStart(2, '0'),
    m: item_data.minutos,
    M: String(item_data.minutos).padStart(2, '0'),
    prog_min: item_data.prog_min,
    tempo: String(tempo_horas).padStart(2, '0')+":"+String(total_minutos%60).padStart(2, '0'),
    tempo_h: tempo_horas,
    tempo_H: String(tempo_horas).padStart(2, '0'),
    tempo_m: tempo_minutos,
    tempo_M: String(tempo_minutos).padStart(2, '0'),
  };

  for (const [name, value] of Object.entries(builtin_values)) {
    text = text.replaceAll(new RegExp(String.raw`(?<!\\)\$${name}\b`, "g"), () => util.escape_text(value));
  }

  //VALORES PERSONALIZADOS
  for (const [name, value] of Object.entries(parse_custom_values(item_data.custom_values))) {
    const regex = new RegExp(String.raw`\$${util.escape_regex(name)}(?![\p{L}\p{N}_])`, "gu");
    text = text.replaceAll(regex, () => util.escape_text(value));
  }

  //NEWLINE TAG
  text = text.replaceAll(/\\n/g,"<br>");

  //LINE TAG
  text = text.replaceAll(/\\l/g,"<hr>");

  text = apply_tags(text);

  text = text.replace(/\\(\[)/g, "[");
  text = text.replace(/\\(\])/g, "]");

  text = text.replace(/\\(\{)/g, "{");
  text = text.replace(/\\(\})/g, "}");

  return text;
}

const tag_regex = /(?<!\\)\[(?<tag>[a-zA-Z_]+)(?::(?<params>[^\]]*))?\](?<real_text>(?:(?!(?<!\\)\[\/?[a-zA-Z_]+[:\]])[\s\S])*?)(?<!\\)\[\/\k<tag>\]/g;
const tag_regex_notext = /(?<!\\)\{(?<tag>[a-zA-Z_]+)(?::(?<params>[^{}]*))?\}/g;

//GRADIENT DIRECTION
const direction_classes = {
  horizontal: "bg-linear-to-r",
  vertical:   "bg-linear-to-b",
  diagonal:   "bg-linear-to-br",
};

const all_presets = {
  legenda:                text => `<span class="bg-black text-white px-1">${text}</span>`,
  sombra:                 text => `<span class="text-shadow-md text-shadow-black/20">${text}</span>`,

  badge_pos:              text => `<span class="bg-[#d4edbc] rounded-md shadow-md py-1 px-2 h-min w-fit">${text}</span>`,
  badge_neg:              text => `<span class="bg-[#ff8787] rounded-md shadow-md py-1 px-2 h-min w-fit">${text}</span>`,

  rainbow_h:              text => `<b class="bg-linear-[to_right,red,orange,yellow,green,blue,indigo,violet] bg-clip-text text-transparent">${text}</b>`,
  rainbow_v:              text => `<b class="bg-linear-[to_bottom,red,orange,yellow,green,blue,indigo,violet] bg-clip-text text-transparent">${text}</b>`,
  rainbow_dg:             text => `<b class="bg-linear-[to_bottom_right,red,orange,yellow,green,blue,indigo,violet] bg-clip-text text-transparent">${text}</b>`,

  sombra_deltarune:       text => `<span class="font-(family-name:--8bitoperator) text-[1.2rem] text-white drop-shadow-[1px_1px_#0f0f70]">${text}</span>`,
  sombra_deltarune_cor:   text => `<span class="text-white drop-shadow-[0.7px_0.7px_#0f0f70]">${text}</span>`,

  amarelo_deltarune:      text => `<span class="font-(family-name:--8bitoperator) text-[1.2rem] bg-linear-to-b from-[#ffffc3] from-[25%] to-[#ffff2c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#4c4c00]">${text}</span>`,
  vermelho_deltarune:     text => `<span class="font-(family-name:--8bitoperator) text-[1.2rem] bg-linear-to-b from-[#ffc3c3] from-[25%] to-[#ff1c1c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#4c0000]">${text}</span>`,
  azul_deltarune:         text => `<span class="font-(family-name:--8bitoperator) text-[1.2rem] bg-linear-to-b from-[#c3c3ff] from-[25%] to-[#1c1cff] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#00004c]">${text}</span>`,
  verde_deltarune:        text => `<span class="font-(family-name:--8bitoperator) text-[1.2rem] bg-linear-to-b from-[#a8ffa8] from-[25%] to-[#0cff0c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#004c00]">${text}</span>`,

  amarelo_deltarune_cor:  text => `<span class="bg-linear-to-b from-[#ffffc3] from-[25%] to-[#ffff2c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#4c4c00]">${text}</span>`,
  vermelho_deltarune_cor: text => `<span class="bg-linear-to-b from-[#ffc3c3] from-[25%] to-[#ff1c1c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#4c0000]">${text}</span>`,
  azul_deltarune_cor:     text => `<span class="bg-linear-to-b from-[#c3c3ff] from-[25%] to-[#1c1cff] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#00004c]">${text}</span>`,
  verde_deltarune_cor:    text => `<span class="bg-linear-to-b from-[#a8ffa8] from-[25%] to-[#0cff0c] to-[80%] bg-clip-text text-transparent drop-shadow-[1px_1px_#004c00]">${text}</span>`,

  profecia:               text => `<div class="text-center [animation:floating_3s_ease-in-out_alternate_infinite]"><span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat [animation:scroll-background_30s_linear_infinite]">${text}</span></div>`,
  profecia_cor:           text => `<div class="text-center [animation:floating_3s_ease-in-out_alternate_infinite]"><span class="bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat [animation:scroll-background_30s_linear_infinite]">${text}</span></div>`,
  profecia_simples:       text => `<span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat [animation:scroll-background_30s_linear_infinite]">${text}</span>`,
  profecia_cor_simples:   text => `<span class="bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat [animation:scroll-background_30s_linear_infinite]">${text}</span>`,
  profecia_sangue:        text => `<div class="text-center hue-rotate-165 saturate-300 [animation:floating_3s_ease-in-out_alternate_infinite]"><span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat [animation:scroll-background_30s_linear_infinite]">${text}</span></div>`,

  vermelho_umineko:       text => `<span class="text-[#F50000] drop-shadow-[1px_1px_#000000]">${text}</span>`,
  vermelho_umineko_mod:   text => `<b class="bg-linear-to-b from-[#ff0000] from-[40%] to-[#ff8b8b] to-[95%] bg-clip-text text-transparent drop-shadow-[-0.04rem_0px_#000000,0px_-0.04rem_#000000,0px_0.04rem_#000000,0.04rem_0px_#000000]">${text}</b>`,
  azul_umineko:           text => `<span class="text-[#5DECFF] drop-shadow-[1px_1px_#000000]">${text}</span>`,
  azul_umineko_mod:       text => `<b class="bg-linear-to-b from-[#1d97c9] from-[40%] to-[#7ff1f3] to-[95%] bg-clip-text text-transparent drop-shadow-[-0.04rem_0px_#000000,0px_-0.04rem_#000000,0px_0.04rem_#000000,0.04rem_0px_#000000]">${text}</b>`,
  roxo_umineko:           text => `<span class="text-[#CC99FF] drop-shadow-[1px_1px_#000000]">${text}</span>`,
  roxo_umineko_mod:       text => `<b class="bg-linear-to-b from-[#6b5dab] from-[40%] to-[#e7d0f1] to-[80%] bg-clip-text text-transparent drop-shadow-[-0.04rem_0px_#000000,0px_-0.04rem_#000000,0px_0.04rem_#000000,0.04rem_0px_#000000]">${text}</b>`,
  dourado_umineko:        text => `<span class="text-[#DAA520] drop-shadow-[1px_1px_#000000]">${text}</span>`,
  dourado_umineko_mod:    text => `<b class="bg-linear-to-b from-[#d19214] from-[40%] to-[#f8df59] to-[75%] bg-clip-text text-transparent drop-shadow-[-0.04rem_0px_#000000,0px_-0.04rem_#000000,0px_0.04rem_#000000,0.04rem_0px_#000000]">${text}</b>`,
  verde_umineko_mod:      text => `<b class="bg-linear-to-b from-[#78cf79] from-[40%] to-[#ddffef] to-[75%] bg-clip-text text-transparent drop-shadow-[-0.04rem_0px_#000000,0px_-0.04rem_#000000,0px_0.04rem_#000000,0.04rem_0px_#000000]">${text}</b>`,
};

//TAGS (WITH PARAMETERS)
const style_tags = {
  pre: (text, [nome]) => (Object.hasOwn(all_presets, nome) ? all_presets[nome](text) : text),

  cor: (text, [color]) => {
    const c = util.safe_param(color);
    if (!c) return text;
    return `<span class="text-[${c}]">${text}</span>`;
  },

  bg: (text, [color]) => {
    const c = util.safe_param(color);
    if (!c) return text;
    return `<span class="bg-[${c}]">${text}</span>`;
  },

  grd: (text, [direction, color1, color2, position1 = "", position2 = ""]) => {
    const dir_class = Object.hasOwn(direction_classes, direction) ? direction_classes[direction] : direction_classes.horizontal;
    const c1 = util.safe_param(color1);
    const c2 = util.safe_param(color2);
    if (!c1 || !c2) return text;
    const p1 = util.safe_param(position1);
    const p2 = util.safe_param(position2);
    if (p1 && p2) return `<span class="${dir_class} from-[${c1}] from-[${p1}] to-[${c2}] to-[${p2}] bg-clip-text text-transparent">${text}</span>`;
    return `<span class="${dir_class} from-[${c1}] to-[${c2}] bg-clip-text text-transparent">${text}</span>`;
  },

  brd: (text, params) => {
    let size = "1";
    let color = "";
    //tanto faz a ordem, se X ou XX = tamanho, se não = cor
    for (const param of params) {
      if (/^\d{1,2}$/.test(param)) size = param;
      else if (param !== "") color = param;
    }
    const c = util.safe_param(color);
    if (!c) return `<span class="border-${size}">${text}</span>`;
    return `<span class="border-${size} border-[${c}]">${text}</span>`;
  },

  sdw: (text, [color, size = "md", opacity]) => {
    const c = util.safe_param(color);
    if (!c) return text;
    const s = util.safe_token(size, "md");
    const o = /^\d{1,3}$/.test(opacity ?? "") ? `/${opacity}` : "";
    return `<span class="text-shadow-${s} text-shadow-[${c}]${o}">${text}</span>`;
  },

  ssdw: (text, [color, x = "1px", y = "1px"]) => {
    const c = util.safe_param(color);
    if (!c) return text;
    const sx = util.safe_param(x, "1px");
    const sy = util.safe_param(y, "1px");
    return `<span class="drop-shadow-[${sx}_${sy}_${c}]">${text}</span>`;
  },

  bdg: (text, [text_color, bg_color]) => {
    const tc = util.safe_param(text_color);
    const bc = util.safe_param(bg_color);
    if (!tc || !bc) return text;
    return `<span class="text-[${tc}] bg-[${bc}] rounded-md shadow-md py-1 px-2 h-min w-fit">${text}</span>`;
  },

  furi: (text, [furigana = ""]) => {
    return `<ruby>${text}<rt>${util.escape_text(furigana)}</rt></ruby>`;
  },

  fltr: (text, [type, value]) => {
    const filters = ["blur", "brightness", "contrast", "grayscale", "hue-rotate", "invert", "saturate", "sepia"];
    const v = util.safe_token(value);
    if (!filters.includes(type) || !v) return text;
    return `<span class="${type}-${v}">${text}</span>`;
  },

  b: (text, []) => {
    return `<b>${text}</b>`;
  },

  i: (text, []) => {
    return `<i>${text}</i>`;
  },

  hira: (text, []) => {
    return `<span>${map_text_nodes(text, convertToHiragana)}</span>`;
  },

  kata: (text, []) => {
    return `<span>${map_text_nodes(text, convertToKatakana)}</span>`;
  },

  hkat: (text, []) => {
    return `<span>${map_text_nodes(text, kanaFullToHalf)}</span>`;
  },

  fkat: (text, []) => {
    return `<span>${map_text_nodes(text, kanaHalfToFull)}</span>`;
  },
};

//ELEMENTS (TAGS NO TEXT)
const style_tags_notext = {
  icon: ([id, style]) => {
    return `<i class="fa-${util.safe_token(style, "solid")} fa-${util.safe_token(id, "circle-question")}"></i>`;
  },

  bar: ([value, max]) => {
    return `<progress class="rounded-md shadow-md border border-gray-400" value="${util.finite_number(value)}" max="${util.finite_number(max)}"></progress>`;
  },

  mark: ([start, value, end, type = "simples"]) => {
    //inválido -> 0, final = começo -> 0%
    const real_value = util.finite_number(value) - util.finite_number(start);
    const max = util.finite_number(end) - util.finite_number(start);
    const result_show = max !== 0 ? Math.trunc((100 * real_value) / max) : 0;

    if (type == "porcentagem") return `<span>${result_show}%</span>`;
    if (type == "barra") return `<progress class="rounded-md shadow-md border border-gray-400" value="${real_value}" max="${max}"></progress>`;
    return `<span>${real_value}/${max}</span>`;
  },

  calc: ([tipo, operacao, valor1, valor2]) => {
    //inválido -> 0
    const number = (value) => (Number.isFinite(value) ? value : 0);

    if (tipo == "normal") {
      if (operacao == "soma") return `<span>${number(Number(valor1) + Number(valor2))}</span>`;
      if (operacao == "sub") return `<span>${number(Number(valor1) - Number(valor2))}</span>`;
      if (operacao == "mult") return `<span>${number(Number(valor1) * Number(valor2))}</span>`;
      if (operacao == "div") return `<span>${number(Number(valor1) / Number(valor2))}</span>`;
    }

    if (tipo == "tempo") {
      if (operacao == "soma" || operacao == "sub") return get_tempo_procentagem(operacao, valor1, valor2);
    }

    if (tipo == "especial") {
      if (operacao == "porcentagem") return `<span>${number((Number(valor1) / Number(valor2)) * 100)}%</span>`;
    }

    return undefined;
  },
};

function get_tempo_procentagem(operacao, valor1, valor2) {
  //00:00:00 = tempoX[0],tempoX[1],tempoX[2]
  let tempo1 = String(valor1 ?? "").split("-");
  let tempo2 = String(valor2 ?? "").split("-");

  tempo1 = [util.finite_number(tempo1[0]), util.finite_number(tempo1[1]), util.finite_number(tempo1[2])];
  tempo2 = [util.finite_number(tempo2[0]), util.finite_number(tempo2[1]), util.finite_number(tempo2[2])];

  tempo1[0] = tempo1[0] * 60 * 60;
  tempo1[1] = tempo1[1] * 60;

  tempo2[0] = tempo2[0] * 60 * 60;
  tempo2[1] = tempo2[1] * 60;

  let resultado_interno = tempo1[0] + tempo1[1] + tempo1[2];
  if (operacao == "soma") resultado_interno += tempo2[0] + tempo2[1] + tempo2[2];
  if (operacao == "sub") resultado_interno -= tempo2[0] + tempo2[1] + tempo2[2];
  
  let resultado = [Math.trunc((resultado_interno/60)/60), Math.trunc((resultado_interno/60)%60), Math.trunc(((resultado_interno%60)%60)%60)];
  return `<span>${resultado[0]}:${String(resultado[1]).padStart(2, '0')}:${String(resultado[2]).padStart(2, '0')}</span>`;
}

//evitar loop infinito
const MAX_TAG_PASSES = 100;

function apply_tags(text) {
  let before_str;
  let passes = 0;
  do {
    before_str = text;
    text = text.replace(tag_regex_notext, (match, ...args) => {
      const { tag, params } = args.at(-1);
      if (!Object.hasOwn(style_tags_notext, tag)) return tag;
      const html = style_tags_notext[tag](params ? params.split(":") : []);
      return html ?? match;
    });
  } while (text !== before_str && ++passes < MAX_TAG_PASSES);

  passes = 0;
  do {
    before_str = text;
    text = text.replace(tag_regex, (match, ...args) => {
      const { tag, params, real_text } = args.at(-1);
      if (!Object.hasOwn(style_tags, tag)) return real_text;
      return style_tags[tag](real_text, params ? params.split(":") : []);
    });
  } while (text !== before_str && ++passes < MAX_TAG_PASSES);

  return text;
}

//DOCS
var custom_info_data = [];
var custom_info_built = false;

async function fetch_custom_info() {
  //evita refazer tudo de novo
  if (custom_info_built) return;

  if (custom_info_data == "") {
    try {
      let file_object = await fetch("data/estilos.json");
      if (!file_object.ok) throw new Error("HTTP " + file_object.status);
      custom_info_data = await file_object.json();
    } catch (err) {
      console.error(err);
      util.show_message("Não foi possível carregar a documentação de estilos das anotações.", "error");
      return;
    }
  }

  create_custom_info();
  custom_info_built = true;
}

window.fetch_custom_info = fetch_custom_info;

function create_custom_info() {
  document.querySelector(".custom_info").innerHTML = "";

  document.querySelector(".custom_info").innerHTML += `
    <div>Informações sobre a estilização das anotações</div>
    <details>
      <summary class="cursor-pointer button w-fit">Caracteres e valores especiais</summary>
      <div class="caracteres_container rounded-md shadow-md border border-gray-300 flex flex-col sm:px-2 py-5 gap-5 w-[90vw]"></div>
    </details>
    <details>
      <summary class="cursor-pointer button w-fit">Elementos</summary>
      <div class="elementos_container rounded-md shadow-md border border-gray-300 flex flex-col sm:px-2 py-5 gap-5 w-[90vw]"></div>
    </details>
    <details>
      <summary class="cursor-pointer button w-fit">Tags de estilo</summary>
      <div class="comandos_container rounded-md shadow-md border border-gray-300 flex flex-col sm:px-2 py-5 gap-5 w-[90vw]"></div>
    </details>
    <details>
      <summary class="cursor-pointer button w-fit">Estilos predefinidos</summary>
      <div class="estilos_container rounded-md shadow-md border border-gray-300 flex flex-col sm:px-2 py-5 gap-5 w-[90vw]"></div>
    </details>
  `;

  //CRIAR CARACTERES
  for (var cur_caractere = 0; cur_caractere < custom_info_data.caracteres.length; cur_caractere++) {
    if (cur_caractere > 0) document.querySelector(".caracteres_container").innerHTML += "<hr class='w-full border-gray-300'>";
    document.querySelector(".caracteres_container").innerHTML += `
      <div class="p-1 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto">
        <p>${custom_info_data.caracteres[cur_caractere].funcao}</p>
        <table class="table-auto text-center">
          <thead>
            <tr>
              <th class="border-1 sm:p-2">Código</th>
              <th class="border-1 sm:p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-1 sm:p-2">${custom_info_data.caracteres[cur_caractere].comando}</td>
              <td class="border-1 sm:p-2">${custom_info_data.caracteres[cur_caractere].render}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  //CRIAR ELEMENTOS
  for (var cur_elemento = 0; cur_elemento < custom_info_data.elementos.length; cur_elemento++) {
    let cur_elemento_data = custom_info_data.elementos[cur_elemento];

    let render_modelo = cur_elemento_data.modelo[0].render.replaceAll("$texto",cur_elemento_data.modelo[0].texto);

    if (cur_elemento > 0) document.querySelector(".elementos_container").innerHTML += "<hr class='w-full border-gray-300'>";
    document.querySelector(".elementos_container").innerHTML += `
      <div class="p-1 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto">
        <p>${cur_elemento_data.nome}</p>
        <table class="table-auto text-center">
          <thead>
            <tr>
              <th class="border-1 sm:p-2">Código</th>
              <th class="border-1 sm:p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-1 sm:p-2 elemento-code-${cur_elemento}"></td>
              <td class="border-1 sm:p-2 elemento-render-${cur_elemento}">${render_modelo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    //CRIAR ELEMENTO (MODELO)
    let modelo_code = "";
    let modelo_params = "";
    if (cur_elemento_data.modelo[0].parametros.length > 0) {
      //MODELO COM PARAMETROS
      for (var param = 0; param < cur_elemento_data.modelo[0].parametros.length; param++) {
        modelo_params += `<code class="text-[#013220]">:</code><code class="text-[#07a]">${cur_elemento_data.modelo[0].parametros[param].nome}</code>`;

        modelo_code = `<code class="text-[#013220]">{</code><code class="text-[#905]">${cur_elemento_data.comando}</code>${modelo_params}<code class="text-[#013220]">}</code>`;
      }
    } else {
      //MODELO SEM PARAMETROS
      modelo_code = `<code class="text-[#013220]">{</code><code class="text-[#905]">${cur_elemento_data.comando}</code><code class="text-[#013220]">}</code>`;
    }
    document.querySelector(".elemento-code-"+cur_elemento).innerHTML = modelo_code;

    //CRIAR CADA EXEMPLO (SE TIVER)
    if (cur_elemento_data.hasOwnProperty("exemplo")) {
      for (var cur_exemplo = 0; cur_exemplo < cur_elemento_data.exemplo.length; cur_exemplo++) {
        let cur_exemplo_data = cur_elemento_data.exemplo[cur_exemplo];

        let exemplo_label = "<br><br>Exemplo:<br>";
        if (cur_elemento_data.exemplo.length > 1) exemplo_label = "<br><br>Exemplos:<br>";
        if (cur_exemplo == 0) document.querySelector(".elemento-code-"+cur_elemento).innerHTML += exemplo_label;

        //CRIAR ELEMENTO (EXEMPLOS)
        let exemplo_code = "";
        let exemplo_params = "";
        let break_string = "";
        if (cur_elemento_data.exemplo[cur_exemplo].parametros.length > 0) {
          //EXEMPLO COM PARAMETROS
          for (var param = 0; param < cur_elemento_data.exemplo[cur_exemplo].parametros.length; param++) {
            let param_color = "#07a";
            if (cur_elemento_data.exemplo[cur_exemplo].parametros[param].nome.includes("#")) param_color = cur_elemento_data.exemplo[cur_exemplo].parametros[param].nome;

            exemplo_params += `<code class="text-[#013220]">:</code><code class="text-[${param_color}]">${cur_elemento_data.exemplo[cur_exemplo].parametros[param].nome}</code>`;
            exemplo_code = `<code class="text-[#013220]">{</code><code class="text-[#905]">${cur_elemento_data.comando}</code>${exemplo_params}<code class="text-[#013220]">}</code>`;
            
            if (param > 0) break_string = "<br>";
            if (cur_elemento_data.exemplo[cur_exemplo].break) break_string = "<br><br>";
          }
        } else {
          //EXEMPLO SEM PARAMETROS
          exemplo_code = `<code class="text-[#013220]">{</code><code class="text-[#905]">${cur_elemento_data.comando}</code><code class="text-[#013220]">}</code>`;

          if (param > 0) break_string = "<br>";
          if (cur_elemento_data.exemplo[cur_exemplo].break) break_string = "<br><br>";
        }
        document.querySelector(".elemento-code-"+cur_elemento).innerHTML += exemplo_code+break_string;
        document.querySelector(".elemento-render-"+cur_elemento).innerHTML += cur_exemplo_data.render+break_string;
      }
    }
    //CRIA NOTAS SE TIVER
    if (cur_elemento_data.hasOwnProperty("notas")) {
      document.querySelector(".elemento-code-"+cur_elemento).innerHTML += "<br>"+cur_elemento_data.notas;
    }
  }

  //CRIAR COMANDOS
  for (var cur_comando = 0; cur_comando < custom_info_data.comandos.length; cur_comando++) {
    let cur_comando_data = custom_info_data.comandos[cur_comando];

    let render_modelo = cur_comando_data.modelo[0].render.replaceAll("$texto",cur_comando_data.modelo[0].texto);

    if (cur_comando > 0) document.querySelector(".comandos_container").innerHTML += "<hr class='w-full border-gray-300'>";
    document.querySelector(".comandos_container").innerHTML += `
      <div class="p-1 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto">
        <p>${cur_comando_data.nome}</p>
        <table class="table-auto text-center">
          <thead>
            <tr>
              <th class="border-1 sm:p-2">Código</th>
              <th class="border-1 sm:p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-1 sm:p-2 comando-code-${cur_comando}"></td>
              <td class="border-1 sm:p-2 comando-render-${cur_comando}">${render_modelo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    //CRIAR COMANDO (MODELO)
    let modelo_code = "";
    let modelo_params = "";
    if (cur_comando_data.modelo[0].parametros.length > 0) {
      //MODELO COM PARAMETROS
      for (var param = 0; param < cur_comando_data.modelo[0].parametros.length; param++) {
        let cur_param_color = "#07a";
        if (cur_comando_data.modelo[0].parametros[param].opcional) cur_param_color = "#00aa2b";

        modelo_params += `<code class="text-[#013220]">:</code><code class="text-[${cur_param_color}]">${cur_comando_data.modelo[0].parametros[param].nome}</code>`;

        modelo_code = `<code class="text-[#013220]">[</code><code class="text-[#905]">${cur_comando_data.comando}</code>${modelo_params}<code class="text-[#013220]">]</code><code>${cur_comando_data.modelo[0].texto}</code><code class="text-[#013220]">[/</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code>`;
      }
    } else {
      //MODELO SEM PARAMETROS
      modelo_code = `<code class="text-[#013220]">[</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code><code>${cur_comando_data.modelo[0].texto}</code><code class="text-[#013220]">[/</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code>`;
    }
    document.querySelector(".comando-code-"+cur_comando).innerHTML = modelo_code;

    //CRIAR CADA EXEMPLO (SE TIVER)
    if (cur_comando_data.hasOwnProperty("exemplo")) {
      for (var cur_exemplo = 0; cur_exemplo < cur_comando_data.exemplo.length; cur_exemplo++) {
        let cur_exemplo_data = cur_comando_data.exemplo[cur_exemplo];

        let exemplo_label = "<br><br>Exemplo:<br>";
        if (cur_comando_data.exemplo.length > 1) exemplo_label = "<br><br>Exemplos:<br>";
        if (cur_exemplo == 0) document.querySelector(".comando-code-"+cur_comando).innerHTML += exemplo_label;

        let render_exemplo = cur_exemplo_data.render.replaceAll("$texto",cur_exemplo_data.texto);

        //CRIAR COMANDO (EXEMPLOS)
        let exemplo_code = "";
        let exemplo_params = "";
        let break_string = "";
        if (cur_comando_data.exemplo[cur_exemplo].parametros.length > 0) {
          //EXEMPLO COM PARAMETROS
          for (var param = 0; param < cur_comando_data.exemplo[cur_exemplo].parametros.length; param++) {
            let param_color = "#07a";
            if (cur_comando_data.exemplo[cur_exemplo].parametros[param].nome.includes("#")) param_color = cur_comando_data.exemplo[cur_exemplo].parametros[param].nome;

            exemplo_params += `<code class="text-[#013220]">:</code><code class="text-[${param_color}]">${cur_comando_data.exemplo[cur_exemplo].parametros[param].nome}</code>`;
            exemplo_code = `<code class="text-[#013220]">[</code><code class="text-[#905]">${cur_comando_data.comando}</code>${exemplo_params}<code class="text-[#013220]">]</code><code>${cur_comando_data.exemplo[cur_exemplo].texto}</code><code class="text-[#013220]">[/</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code>`;
            
            if (param > 0) break_string = "<br>";
            if (cur_comando_data.exemplo[cur_exemplo].break) break_string = "<br><br>";
          }
        } else {
          //EXEMPLO SEM PARAMETROS
          exemplo_code = `<code class="text-[#013220]">[</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code><code>${cur_comando_data.exemplo[cur_exemplo].texto}</code><code class="text-[#013220]">[/</code><code class="text-[#905]">${cur_comando_data.comando}</code><code class="text-[#013220]">]</code>`;

          if (cur_exemplo > 0) break_string = "<br>";
          if (cur_comando_data.exemplo[cur_exemplo].break) break_string = "<br><br>";
        }
        //sei lá, só funcionou assim
        if (break_string == "") break_string = "<br>";
        document.querySelector(".comando-code-"+cur_comando).innerHTML += exemplo_code+break_string;
        document.querySelector(".comando-render-"+cur_comando).innerHTML += render_exemplo+break_string;
      }
    }
    //CRIA NOTAS SE TIVER
    if (cur_comando_data.hasOwnProperty("notas")) {
      document.querySelector(".comando-code-"+cur_comando).innerHTML += "<br>"+cur_comando_data.notas;
    }
  }

  //CRIAR ESTILOS
  for (var cur_estilo = 0; cur_estilo < custom_info_data.estilos.length; cur_estilo++) {
    let cur_estilo_data = custom_info_data.estilos[cur_estilo];

    //if (cur_estilo > 0) document.querySelector(".estilos_container").innerHTML += "<hr class='w-full border-gray-300'>";
    document.querySelector(".estilos_container").innerHTML += `
      <div class="p-1 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto">
        <p>${cur_estilo_data.nome}</p>
        <table class="table-auto text-center">
          <thead>
            <tr>
              <th class="border-1 sm:p-2">Código</th>
              <th class="border-1 sm:p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-1 sm:p-2 estilo-code-${cur_estilo}"></td>
              <td class="border-1 sm:p-2 estilo-render-${cur_estilo}"></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    //PEGAR CADA EXEMPLO
    for (var cur_exemplo = 0; cur_exemplo < cur_estilo_data.exemplo.length; cur_exemplo++) {
      let cur_exemplo_data = cur_estilo_data.exemplo[cur_exemplo];
      let render = cur_exemplo_data.render.replaceAll("$texto",cur_exemplo_data.texto);
      let linebreak = "";
      let command_name = "pre";
      if (cur_exemplo > 0) linebreak = "<br><br>";

      document.querySelector(".estilo-code-"+cur_estilo).innerHTML += `
        ${linebreak}
        <code class="text-[#013220]">[</code><code class="text-[#905]">${command_name}</code><code class="text-[#013220]">:</code><code class="text-[#07a]">${cur_exemplo_data.id}</code><code class="text-[#013220]">]</code><code>${cur_exemplo_data.texto}</code><code class="text-[#013220]">[/</code><code class="text-[#905]">${command_name}</code><code class="text-[#013220]">]</code></code>
      `;

      document.querySelector(".estilo-render-"+cur_estilo).innerHTML += linebreak+render;
    }
  }
}
