import * as constants from "./constants.js";
import * as manage from "./manage.js";

var i;
const nf = new Intl.NumberFormat('fr-FR');

function gerar_stats() {
  let base_types = constants.MEDIAS.types;
  let base_types_colors = [];
  for (i = 0; i < constants.MEDIAS.types.length; i++) {
    if (constants.MEDIAS.types[i] == "Personalizado") base_types_colors.push(constants.SITE_COLORS.default);
    else base_types_colors.push(constants.SITE_COLORS.types[constants.MEDIAS.types[i]]);
  }
  let graph_types = [];
  let graph_types_values = [];
  let graph_types_colors = [];
  let graph_types_lines = '#000000';
  let last_items = 0;
  let cur_valid_id = 0;

  let list = manage.list;

  for (let tipo_id = 0; tipo_id < base_types.length; tipo_id++) {

    if (last_items > 0) cur_valid_id++;
    last_items = 0;

    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].tipo == base_types[tipo_id]) {
        if (!graph_types.includes(base_types[tipo_id])) {
          //primeira aparição = cria
          last_items++;
          graph_types.push(base_types[tipo_id]);
          graph_types_colors.push(base_types_colors[tipo_id]);
          graph_types_values.push(1);
        } else {
          //próximas aparições = adiciona
          graph_types_values[graph_types.indexOf(graph_types[cur_valid_id])]++;
        }
      }
    }
  }

  //tipo pie

  let tipo_pie_data = [{
    values: graph_types_values,
    labels: graph_types,
    textinfo: "label+percent",
    hoverinfo: "label+value+percent",
    marker: {
      colors: graph_types_colors,
      line: {
        color: graph_types_lines,
        width: 1.5
      }
    },
    type: 'pie',
    automargin: true
  }];

  let tipo_pie_layout = {
    title: {
      text: 'Formatos (pizza)'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let tipo_pie_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'tipo_pie_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".tipo_pie"), tipo_pie_data, tipo_pie_layout, tipo_pie_config);

  //tipo bar

  let tipo_bar_data = [{
    x: graph_types_values.toReversed(),
    y: graph_types.toReversed(),
    marker: {
      color: graph_types_colors.toReversed(),
      line: {
        color: graph_types_lines,
        width: 1.5
      }
    },
    type: 'bar',
    orientation: 'h',
    text: graph_types_values.toReversed().map(String),
    textposition: 'auto',
    hoverinfo: 'y+x'
  }];

  let tipo_bar_layout = {
    title: {
      text: 'Formatos (barras)'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let tipo_bar_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'tipo_bar_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".tipo_bar"), tipo_bar_data, tipo_bar_layout, tipo_bar_config);

  let base_status = constants.MEDIAS.status;
  let base_status_colors = [];
  for (i = 0; i < constants.MEDIAS.status.length; i++) base_status_colors.push(constants.SITE_COLORS.status[constants.MEDIAS.status[i]]);
  let graph_status = [];
  let graph_status_values = [];
  let graph_status_colors = [];
  let graph_status_lines = '#000000';
  let last_status_items = 0;
  let cur_valid_status_id = 0;

  //aqui a mudança
  for (let status_id = 0; status_id < base_status.length; status_id++) {

    if (last_status_items > 0) cur_valid_status_id++;
    last_status_items = 0;

    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].dados.status == base_status[status_id]) {
        if (!graph_status.includes(base_status[status_id])) {
          //primeira aparição = cria
          last_status_items++;
          graph_status.push(base_status[status_id]);
          graph_status_colors.push(base_status_colors[status_id]);
          graph_status_values.push(1);
        } else {
          //próximas aparições = adiciona
          graph_status_values[graph_status.indexOf(graph_status[cur_valid_status_id])]++;
        }
      }
    }
  }

  //status pie

  let status_pie_data = [{
    values: graph_status_values,
    labels: graph_status,
    textinfo: "label+percent",
    hoverinfo: "label+value+percent",
    marker: {
      colors: graph_status_colors,
      line: {
        color: graph_status_lines,
        width: 1.5
      }
    },
    type: 'pie',
    automargin: true
  }];

  let status_pie_layout = {
    title: {
      text: 'Status (pizza)'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let status_pie_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'status_pie_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".status_pie"), status_pie_data, status_pie_layout, status_pie_config);

  //status bar

  let status_bar_data = [{
    x: graph_status_values.toReversed(),
    y: graph_status.toReversed(),
    marker: {
      color: graph_status_colors.toReversed(),
      line: {
        color: graph_status_lines,
        width: 1.5
      }
    },
    type: 'bar',
    orientation: 'h',
    text: graph_status_values.toReversed().map(String),
    textposition: 'auto',
    hoverinfo: 'y+x'
  }];

  let status_bar_layout = {
    title: {
      text: 'Status (barras)'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let status_bar_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'status_bar_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".status_bar"), status_bar_data, status_bar_layout, status_bar_config);

  //progresso por formato - calculo

  let graph_prog_types_values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let graph_total_ep = 0;
  let graph_total_cap = 0;

  for (let tipo_id = 0; tipo_id < graph_types.length; tipo_id++) {
    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].tipo == graph_types[tipo_id]) {
        graph_prog_types_values[tipo_id] += Number(list.itens[item_id].dados.progresso);

        if (list.itens[item_id].tipo == 'Anime' || list.itens[item_id].tipo == 'Filme' || list.itens[item_id].tipo == 'Áudio' || list.itens[item_id].tipo == 'Dorama/Série' || list.itens[item_id].tipo == 'Stage') {
          graph_total_ep += Number(list.itens[item_id].dados.progresso);
        }
        if (list.itens[item_id].tipo == 'Novel' || list.itens[item_id].tipo == 'Mangá' || list.itens[item_id].tipo == 'Jogo' || list.itens[item_id].tipo == 'Fanfic' || list.itens[item_id].tipo == 'Short Story' || list.itens[item_id].tipo == 'Ensaio') {
          graph_total_cap += Number(list.itens[item_id].dados.progresso);
        }
      }
    }
  }

  //progresso por formato - grafico

  let prog_tipo_bar_data = [{
    x: graph_prog_types_values,
    y: graph_types,
    marker: {
      color: graph_types_colors,
      line: {
        color: graph_types_lines,
        width: 1.5
      }
    },
    type: 'bar',
    orientation: 'h',
    text: graph_prog_types_values.map(String),
    textposition: 'auto',
    hoverinfo: 'y+x'
  }];

  let prog_tipo_bar_layout = {
    title: {
      text: 'Progresso por formato'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let prog_tipo_bar_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'prog_tipo_bar_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".prog_tipo_bar"), prog_tipo_bar_data, prog_tipo_bar_layout, prog_tipo_bar_config);

  //moji por formato - calculo

  let graph_moji_types_values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let tipo_id = 0; tipo_id < graph_types.length; tipo_id++) {
    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].tipo == graph_types[tipo_id]) {
        graph_moji_types_values[tipo_id] += Number(list.itens[item_id].dados.moji);
      }
    }
  }

  //moji por formato - grafico

  let moji_tipo_bar_data = [{
    x: graph_moji_types_values,
    y: graph_types,
    marker: {
      color: graph_types_colors,
      line: {
        color: graph_types_lines,
        width: 1.5
      }
    },
    type: 'bar',
    orientation: 'h',
    text: graph_moji_types_values.map(String),
    textposition: 'auto',
    hoverinfo: 'y+x'
  }];

  let moji_tipo_bar_layout = {
    title: {
      text: 'Caracteres por formato'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let moji_tipo_bar_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'moji_tipo_bar_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".moji_tipo_bar"), moji_tipo_bar_data, moji_tipo_bar_layout, moji_tipo_bar_config);

  //horas por formato - calculo

  let graph_horas_types_values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let tipo_id = 0; tipo_id < graph_types.length; tipo_id++) {
    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].tipo == graph_types[tipo_id]) {
        if (!list.itens[item_id].dados.autotime) {
          graph_horas_types_values[tipo_id] += Number(list.itens[item_id].dados.horas);
        } else {
          graph_horas_types_values[tipo_id] += Math.trunc((list.itens[item_id].dados.progresso*list.itens[item_id].dados.prog_min)/60);
        }
      }
    }
  }

  let graph_minutos_types_values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let tipo_id = 0; tipo_id < graph_types.length; tipo_id++) {
    for (let item_id = 0; item_id < list.itens.length; item_id++) {
      if (list.itens[item_id].tipo == graph_types[tipo_id]) {
        if (!list.itens[item_id].dados.autotime) {
          graph_minutos_types_values[tipo_id] += Number(list.itens[item_id].dados.minutos);
        } else {
          graph_minutos_types_values[tipo_id] += Number((list.itens[item_id].dados.progresso*list.itens[item_id].dados.prog_min)%60);
        }
      }
    }
  }

  let graph_total_horas = 0;
  let graph_total_minutos = 0;

  for (let tipo_id = 0; tipo_id < graph_minutos_types_values.length; tipo_id++) {
    graph_horas_types_values[tipo_id] += Math.trunc(Number(graph_minutos_types_values[tipo_id])/60);
    graph_total_horas += graph_horas_types_values[tipo_id];

    graph_total_minutos += Math.trunc(Number(graph_minutos_types_values[tipo_id])%60);
  }

  graph_total_horas += Math.trunc(graph_total_minutos/60);
  graph_total_minutos = Math.trunc(graph_total_minutos%60);

  //horas por formato - grafico

  let horas_tipo_bar_data = [{
    x: graph_horas_types_values,
    y: graph_types,
    marker: {
      color: graph_types_colors,
      line: {
        color: graph_types_lines,
        width: 1.5
      }
    },
    type: 'bar',
    orientation: 'h',
    text: graph_horas_types_values.map(String),
    textposition: 'auto',
    hoverinfo: 'y+x'
  }];

  let horas_tipo_bar_layout = {
    title: {
      text: 'Horas por formato'
    },
    font:{
      family: 'Arial, sans-serif'
    },
    yaxis: {
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    }
  };

  let horas_tipo_bar_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'horas_tipo_bar_chart',
      scale: 1
    },
    displayModeBar: true,
    modeBarButtonsToRemove: ['select', 'lasso'],
    displaylogo: false
  };

  Plotly.newPlot(document.querySelector(".horas_tipo_bar"), horas_tipo_bar_data, horas_tipo_bar_layout, horas_tipo_bar_config);

  let graph_total_moji = 0;
  let graph_total_vol = 0;

  for (let item_id = 0; item_id < list.itens.length; item_id++) {
    graph_total_moji += Number(list.itens[item_id].dados.moji);
    graph_total_vol += Number(list.itens[item_id].dados.volumes);
  }

  document.querySelector(".time_counter").innerHTML = `${String(graph_total_horas).padStart(2, '0')}:${String(graph_total_minutos).padStart(2, '0')}`;
  document.querySelector(".ep_counter").innerHTML = nf.format(graph_total_ep);
  document.querySelector(".cap_counter").innerHTML = nf.format(graph_total_cap);
  document.querySelector(".moji_counter").innerHTML = nf.format(graph_total_moji);
  document.querySelector(".vol_counter").innerHTML = nf.format(graph_total_vol);
}

window.gerar_stats = gerar_stats;
