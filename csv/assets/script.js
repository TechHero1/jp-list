function clickinput() {
    document.getElementById("csvfile").click();
}

var list = {
    "itens": [],
    "list_mode": "grid",
    "cores": true,
    "apoio": true
};

function loadfile(file) {
    //csvToJsonRegex(this.files[0])
    //console.log(file.name);
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results, file) {
            //console.log("Parsing complete:", results, file);
            //console.log(Object.keys(results.data[0]));
            //console.log("TÍTULO");
            //console.log(results.data[0].TÍTULO);
            //console.log(results.data[0]);
            //results.data = results.data.map(results.data, obj => _.pick(obj, [ 'FORMATO','TÍTULO','STATUS','EP/CAP','MOJI','HORAS','VOL']));
            for (let i = 0; i < 1000; i++) {
                if (results.data.hasOwnProperty(i) && results.data[i].TÍTULO != "") {
                    //console.log(results.data[i]);
                    let listnew = list.itens.length;

                    let formato_min = results.data[i].FORMATO.toLowerCase();
                    let formato_first;
                    if (formato_min == "dorama/série") {
                        formato_first = formato_min.charAt(0).toUpperCase() + formato_min.slice(1,7) + formato_min.charAt(7).toUpperCase() + formato_min.slice(8);
                    } else {
                        formato_first = formato_min.charAt(0).toUpperCase() + formato_min.slice(1);
                    }

                    if (formato_first == "Audio") {
                        formato_first = "Áudio";
                    }

                    let progresso_name;
                    if (results.data[i].hasOwnProperty("EP/CAP")) {
                        progresso_name = "EP/CAP";
                    }
                    if (results.data[i].hasOwnProperty("EP")) {
                        progresso_name = "EP";
                    }

                    let status = results.data[i].STATUS;
                    if (results.data[i].STATUS == "Assistindo" || results.data[i].STATUS == "Lendo" || results.data[i].STATUS == "Jogando") {
                        status = "Progredindo";
                    }

                    let time_array = results.data[i].HORAS.split(":");
                    if (time_array[1] == null) {
                        time_array[1] = "00";
                    }

                    let volumes_name;
                    if (results.data[i].hasOwnProperty("VOL")) {
                        volumes_name = "VOL";
                    }
                    if (results.data[i].hasOwnProperty("VOLUMES")) {
                        volumes_name = "VOLUMES";
                    }

                    //console.log(results.data[i].MOJI);
                    //console.log(results.data[i].MOJI.replaceAll(/[.]/g,""));
                    let moji_value = results.data[i].MOJI.replaceAll(/[.]/g,"");
                    //console.log(moji_value);
                    if (moji_value == "") {
                        moji_value = "0";
                    }
                    //console.log(moji_value);
                    //console.log(Number(moji_value));
    
                    list.itens[listnew] = {
                    "tipo": formato_first,
                    "dados": {
                        "titulo": results.data[i].TÍTULO,
                        "status": status,
                        "progresso": Number(results.data[i][progresso_name]),
                        "moji": Number(moji_value),
                        "horas": Number(time_array[0]),
                        "minutos": Number(time_array[1]),
                        "volumes": Number(results.data[i][volumes_name]),
                        "img": ""
                    }
                    };
                }
            }
            //console.log(list);
            download_list(file.name);
        }
    });
}

function download_list(file_name) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
  var dlAnchorElem = document.querySelector('.download_link');
  dlAnchorElem.setAttribute("href", dataStr);
  let file_only_name = file_name.split(".");
  dlAnchorElem.setAttribute("download", file_only_name[0]+".json");
  //dlAnchorElem.style.display = "block";
  dlAnchorElem.click();
}