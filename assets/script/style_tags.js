import * as dicts from "../yomitan/japanese-kana-romaji-dicts.js";
import * as nota from "./nota.js";
import * as constants from "./constants.js";

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

window.addEventListener('click', function(e){
  if (!document.querySelector(".custom_dropdown_button_gradient").contains(e.target)){
    document.querySelector(".custom_dropdown_gradient").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_gradient").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_gradient").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_shadow").contains(e.target)){
    document.querySelector(".custom_dropdown_shadow").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_shadow").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_shadow").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_mark").contains(e.target)){
    document.querySelector(".custom_dropdown_mark").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_mark").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_mark").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_progress").contains(e.target)){
    document.querySelector(".custom_dropdown_progress").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_progress").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_progress").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_styles").contains(e.target)){
    document.querySelector(".custom_dropdown_styles").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_styles").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_styles").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_values").contains(e.target)){
    document.querySelector(".custom_dropdown_values").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_values").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_values").classList.remove('fa-angle-up');
  }
  if (!document.querySelector(".custom_dropdown_button_kana").contains(e.target)){
    document.querySelector(".custom_dropdown_kana").classList.add('hidden');
    document.querySelector(".custom_dropdown_icon_kana").classList.add('fa-angle-down');
    document.querySelector(".custom_dropdown_icon_kana").classList.remove('fa-angle-up');
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
    let replace_text = constants.TAGS_TO_ADD[tag].replaceAll("$text",element.value.substring(nota_pos_start, nota_pos_end));
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

var item_custom_values = {};
const values_regex = /^(?<nome>.+?)=(?<valor>.+?)$/g;

function update_item_values(text) {
  item_custom_values = {};
  let text_lines = text.split("\n");
  for (var i = 0; i < text_lines.length; i++) {
    for (var itag = 0; itag < (text_lines[i].match(values_regex) || []).length; itag++) {
      let values_regex_match;

      while ((values_regex_match = values_regex.exec(text_lines[i])) !== null) {
        item_custom_values[values_regex_match.groups.nome] = values_regex_match.groups.valor;
        nota.update_preview();
      }
    }
  }
}

window.update_item_values = update_item_values;

export function style_text_with_tags(text,item_data) {
  //SECRET ELEMENTS
  text = text.replaceAll(/\{chap_prog_moji}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$moji:$fim:barra}<br>{mark:$comeco:$moji:$fim:simples} ({mark:$comeco:$moji:$fim:porcentagem})");
  text = text.replaceAll(/\{chap_prog_page}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$pages:$fim:barra}<br>{mark:$comeco:$pages:$fim:simples} ({mark:$comeco:$pages:$fim:porcentagem})");
  text = text.replaceAll(/\{chap_prog_arc}/g,"[b]$atual {icon:solid:arrow-right} $proximo[/b]<br>{mark:$comeco:$atual_real:$fim:barra}<br>{mark:$comeco:$atual_real:$fim:simples} ({mark:$comeco:$atual_real:$fim:porcentagem})<hr>{mark:$comeco_real:$atual_real:$fim:simples}");
  text = text.replaceAll(/\{mashutan}/g,"<img src='assets/img/mashutan.png' class='w-[59px] h-[68px] inline'>");
  text = text.replaceAll(/\{mashutan_med}/g,"<img src='assets/img/mashutan.png' class='w-[131px] h-[151px] inline'>");
  text = text.replaceAll(/\{mashutan_big}/g,"<img src='assets/img/mashutan.png' class='w-[227px] h-[262px] inline'>");
  text = text.replaceAll(/\{mashutanzilla}/g,"<img src='assets/img/mashutan.png' class='max-w-[revert] w-[717px] h-[830px] inline'>");
  text = text.replaceAll(/\{iichan}/g,"<img src='assets/img/iichan.png' class='w-full'>");
  text = text.replaceAll(/\{iichan_face}/g,"<img src='assets/img/iichan_face.png' class='w-[96px] h-[103px] inline'>");
  text = text.replaceAll(/\{eto_bleh}/g,"<img src='https://media.tenor.com/XnGK5CaQTt4AAAAd/ah-eto-bleh-anime.gif' class='w-full'>");

  //VALORES
  text = text.replaceAll(/\$progresso\b/g,item_data.progresso);
  text = text.replaceAll(/\$final\b/g,item_data.final);
  text = text.replaceAll(/\$moji\b/g,item_data.moji);
  text = text.replaceAll(/\$volumes\b/g,item_data.volumes);
  text = text.replaceAll(/\$repeticoes\b/g,item_data.repeticoes);
  text = text.replaceAll(/\$h\b/g,item_data.horas);
  text = text.replaceAll(/\$H\b/g,String(item_data.horas).padStart(2, '0'));
  text = text.replaceAll(/\$m\b/g,item_data.minutos);
  text = text.replaceAll(/\$M\b/g,String(item_data.minutos).padStart(2, '0'));
  text = text.replaceAll(/\$prog_min\b/g,item_data.prog_min);
  text = text.replaceAll(/\$tempo\b/g,String(Math.trunc((item_data.progresso*item_data.prog_min)/60)).padStart(2, '0')+":"+String((item_data.progresso*item_data.prog_min)%60).padStart(2, '0'));
  text = text.replaceAll(/\$tempo_h\b/g,Math.trunc((item_data.progresso*item_data.prog_min)/60));
  text = text.replaceAll(/\$tempo_H\b/g,String(Math.trunc((item_data.progresso*item_data.prog_min)/60)).padStart(2, '0'));
  text = text.replaceAll(/\$tempo_m\b/g,Math.trunc((item_data.progresso*item_data.prog_min)%60));
  text = text.replaceAll(/\$tempo_M\b/g,String(Math.trunc((item_data.progresso*item_data.prog_min)%60)).padStart(2, '0'));

  if(item_data.custom_values != "" && item_data.custom_values != null) update_item_values(item_data.custom_values);

  if (item_custom_values != "") {
    for (var i = 0; i < Object.keys(item_custom_values).length; i++) {
      let regex = new RegExp(String.raw`\$${Object.keys(item_custom_values)[i]}\b`, "g");
      text = text.replaceAll(regex,item_custom_values[Object.keys(item_custom_values)[i]]);
    }
  }

  //NEWLINE TAG
  text = text.replaceAll(/\\n/g,"<br>");

  //LINE TAG
  text = text.replaceAll(/\\l/g,"<hr>");

  text = apply_tags(text);

  return text;
}

const tag_regex = /\[(?<tag>[a-zA-Z_]+)(?::(?<params>[^\]]*))?\](?<real_text>(?:(?!\[\/?[a-zA-Z_]+[:\]])[\s\S])*?)\[\/\k<tag>\]/g;
const tag_regex_notext = /\{(?<tag>[a-zA-Z_]+)(?::(?<params>[^}]*))?\}/g;

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

  rainbow_h:              text => `<b style="background-image: linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)" class="bg-clip-text text-transparent">${text}</b>`,
  rainbow_v:              text => `<b style="background-image: linear-gradient(to bottom, red,orange,yellow,green,blue,indigo,violet)" class="bg-clip-text text-transparent">${text}</b>`,
  rainbow_dg:             text => `<b style="background-image: linear-gradient(to bottom right, red,orange,yellow,green,blue,indigo,violet)" class="bg-clip-text text-transparent">${text}</b>`,

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

  profecia:               text => `<div class="text-center" style="animation: floating 3s ease-in-out alternate infinite;"><span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat" style="animation: scroll-background 30s linear infinite;">${text}</span></div>`,
  profecia_cor:           text => `<div class="text-center" style="animation: floating 3s ease-in-out alternate infinite;"><span class="bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat" style="animation: scroll-background 30s linear infinite;">${text}</span></div>`,
  profecia_simples:       text => `<span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat" style="animation: scroll-background 30s linear infinite;">${text}</span>`,
  profecia_cor_simples:   text => `<span class="bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat" style="animation: scroll-background 30s linear infinite;">${text}</span>`,
  profecia_sangue:        text => `<div class="text-center hue-rotate-165 saturate-300" style="animation: floating 3s ease-in-out alternate infinite;"><span class="font-(family-name:--ProphecyType) text-[1.85rem] bg-clip-text text-transparent bg-[url('assets/img/IMAGE_DEPTH.png')] bg-size-[256px 256px] bg-repeat" style="animation: scroll-background 30s linear infinite;">${text}</span></div>`,

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
  pre: (text, [nome]) => (all_presets[nome] ? all_presets[nome](text) : text),

  cor: (text, [color]) => {
    return `<span class="text-[${color}]">${text}</span>`;
  },

  bg: (text, [color]) => {
    return `<span class="bg-[${color}]">${text}</span>`;
  },

  grd: (text, [direction, color1, color2, position1 = "", position2 = ""]) => {
    const dir_class = direction_classes[direction];
    if (position2 != "") return `<span class="${dir_class} from-[${color1}] from-[${position1}] to-[${color2}] to-[${position2}] bg-clip-text text-transparent">${text}</span>`;
    return `<span class="${dir_class} from-[${color1}] to-[${color2}] bg-clip-text text-transparent">${text}</span>`;
  },

  brd: (text, [color, size = "1"]) => {
    return `<span class="border-${size} border-[${color}]">${text}</span>`;
  },

  sdw: (text, [color, size = "md", opacity]) => {
    return `<span class="text-shadow-${size} text-shadow-[${color}]/${opacity}">${text}</span>`;
  },

  ssdw: (text, [color, x = "1px", y = "1px"]) => {
    return `<span class="drop-shadow-[${x}_${y}_${color}]">${text}</span>`;
  },

  bdg: (text, [text_color, bg_color]) => {
    return `<span class="text-[${text_color}] bg-[${bg_color}] rounded-md shadow-md py-1 px-2 h-min w-fit">${text}</span>`;
  },

  furi: (text, [furigana = ""]) => {
    return `<ruby>${text}<rt>${furigana}</rt></ruby>`;
  },

  fltr: (text, [type, value]) => {
    if (type == "blur") return `<span class="blur-${value}">${text}</span>`;
    if (type == "brightness") return `<span class="brightness-${value}">${text}</span>`;
    if (type == "contrast") return `<span class="contrast-${value}">${text}</span>`;
    if (type == "grayscale") return `<span class="grayscale-${value}">${text}</span>`;
    if (type == "hue-rotate") return `<span class="hue-rotate-${value}">${text}</span>`;
    if (type == "invert") return `<span class="invert-${value}">${text}</span>`;
    if (type == "saturate") return `<span class="saturate-${value}">${text}</span>`;
    if (type == "sepia") return `<span class="sepia-${value}">${text}</span>`;
    return text;
  },

  b: (text, []) => {
    return `<b>${text}</b>`;
  },

  i: (text, []) => {
    return `<i>${text}</i>`;
  },

  hira: (text, []) => {
    let converted_text = convertToHiragana(text);
    return `<span>${converted_text}</span>`;
  },

  kata: (text, []) => {
    let converted_text = convertToKatakana(text);
    return `<span>${converted_text}</span>`;
  },

  hkat: (text, []) => {
    let converted_text = kanaFullToHalf(text);
    return `<span>${converted_text}</span>`;
  },

  fkat: (text, []) => {
    let converted_text = kanaHalfToFull(text);
    return `<span>${converted_text}</span>`;
  },
};

//ELEMENTS (TAGS NO TEXT)
const style_tags_notext = {
  icon: ([id, style]) => {
    return `<i class="fa-${style} fa-${id}"></i>`;
  },

  bar: ([value, max]) => {
    return `<progress class="rounded-md shadow-md border border-gray-400" value="${value}" max="${max}"></progress>`;
  },

  mark: ([start, value, end, type = "simples"]) => {

    if (isNaN(start)) start = 0;
    if (isNaN(value)) value = 0;
    if (isNaN(end)) end = 0;

    let real_value = Number(value) - Number(start);
    let max = Number(end) - Number(start);
    let result = (100 * real_value) / max;
    let result_show = Math.trunc(result);

    if (isNaN(real_value)) real_value = 0;
    if (isNaN(max)) max = 0;
    if (isNaN(result_show)) result_show = 0;

    if (type == "porcentagem") return `<span>${result_show}%</span>`;
    if (type == "barra") return `<progress class="rounded-md shadow-md border border-gray-400" value="${real_value}" max="${max}"></progress>`;
    return `<span>${real_value}/${max}</span>`;
  },
};

function apply_tags(text) {
  let before_str;
  do {
    before_str = text;
    text = text.replace(tag_regex_notext, (match, ...args) => {
      const { tag, params } = args.at(-1);
      const render = style_tags_notext[tag];
      if (!render) return text;
      return render(params ? params.split(":") : []);
    });
  } while (text !== before_str);

  do {
    before_str = text;
    text = text.replace(tag_regex, (match, ...args) => {
      const { tag, params, real_text } = args.at(-1);
      const render = style_tags[tag];
      if (!render) return real_text;
      return render(real_text, params ? params.split(":") : []);
    });
  } while (text !== before_str);

  return text;
}

//DOCS
var custom_info_data = [];

async function fetch_custom_info() {
  if (custom_info_data == "") {
    let file_object = await fetch("data/estilos.json");
    let json_data = await file_object.json();

    custom_info_data = json_data;
  }

  create_custom_info();
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
