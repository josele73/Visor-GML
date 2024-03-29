//funciona con visor 3.0
//carga varios gml al arrastraslos a la vez
//carga varios gml de forma secuencial
//añadida ortofoto icv 2023

// Estilo para el mapa usando Leaflet para mostrar el mapa

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// Registro de capas GML añadidas al mapa

var capasGML = [];

function extraeUso(lineas) {
    for (var i = 0; i < lineas.length; i++) {
        if (lineas[i].indexOf('25831') != -1) {
            return true;
        }
    }
    return false;
}

// Funciones Auxiliares

function extraerContenidoDeTag(tag) {
    const regex = />(.*?)</;
    const match = regex.exec(tag);
    return match ? match[1].trim() : null;
}

function extraerPuntosDePosList(posListText) {
    //console.log("posListText original:", posListText); // Mostrar el texto original en la consola
    const textoLimpio = posListText.replace(/<[^>]*>/g, '').trim();
    //console.log("Texto limpio:", textoLimpio); // Mostrar el texto limpio en la consola
    const textoNormalizado = textoLimpio.replace(/\s+/g, ' ');
    //console.log("Texto normalizado:", textoNormalizado); // Mostrar el texto normalizado
    const puntos = textoNormalizado.split(' ');
    //console.log("Puntos divididos:", puntos); // Mostrar los puntos divididos
    const puntosX = [];
    const puntosY = [];
    for (let i = 0; i < puntos.length; i += 2) {
        puntosX.push(parseFloat(puntos[i]));
        puntosY.push(parseFloat(puntos[i + 1]));
    }
    return { puntosX, puntosY }; // Asegurarse de devolver un objeto
}

function convertir(puntoX, puntoY) {
    return [puntoX, puntoY]; // Función para convertir puntos, si es necesario
}

function crearJSON(iden, nameSp, superficie, puntosWS84){ //, usoN) {
    var jsonJ = '{ "type": "Feature", "properties": { "gml_id": "' + iden + '", "areaValue":' + superficie + ', "areaValue_uom": "m2", "localId": "' + iden + '", "namespace": "' + nameSp + '","nationalCadastralReference": "' + iden + '" },"geometry": { "type": "MultiPolygon", "coordinates": [[[' + puntosWS84 + ']]] } }';
    var jsonJOK = JSON.parse(jsonJ);
    var nuevaCapa = L.geoJSON(jsonJOK, {style: myStyle});
    nuevaCapa.addTo(map);
    capasGML.push(nuevaCapa); // Añadir la nueva capa al registro
    map.fitBounds(nuevaCapa.getBounds());
}

function puntosJSON(lista) {
    var list = lista.map((coord) => "[" + coord.join(", ") + "]").join(", ");
    return list;
}

// Función Principal para Extraer Datos de las Etiquetas

function extraeTag(lineas) {
    const ArrayId = [];
    const ArrayNamespace = [];
    const ArrayArea = [];
    let esConstruccion = false;
    let tributa = false;
    let usoN = false;
    const textoCompleto = lineas.join('\n');
    lineas.forEach(linea => {
        if (linea.includes('localId')) {
            ArrayId.push(extraerContenidoDeTag(linea));
        } else if (linea.includes('namespace')) {
            ArrayNamespace.push(extraerContenidoDeTag(linea));
        } else if (linea.includes('areaValue')) {
            ArrayArea.push(extraerContenidoDeTag(linea));
        } else if (linea.includes('25831')) {
            usoN = true;
        } else if (linea.includes('ES.SDGC.BU')) {
            esConstruccion = true;
        } else if (linea.includes('ES.SDGC.CP')) {
            tributa = true;
        }
    });
    const posListRegex = /<gml:posList[^>]*>([\s\S]*?)<\/gml:posList>/g;
    let match;
    while ((match = posListRegex.exec(textoCompleto)) !== null) {
        const posListText = match[1];
        const { puntosX, puntosY } = extraerPuntosDePosList(posListText);
        const puntosConvertidos = puntosX.map((x, i) => convertir(x, puntosY[i]));
        const puntosEnJSON = puntosJSON(puntosConvertidos);
        crearJSON("-1", "-1", "-1", puntosEnJSON, usoN);
    }
}

// Función para imprimir la selección
function imprSelec() {
    var div1 = document.getElementById('side-bar');
    div1.style.display = 'none';
    window.print();
    div1.style.display = 'block';
}
