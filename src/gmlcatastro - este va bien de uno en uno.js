// Estilo para el mapa (asumiendo que estás usando Leaflet para mostrar el mapa)
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

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
    console.log("posListText original:", posListText); // Mostrar el texto original en la consola

    // Eliminar etiquetas XML y espacios en blanco al inicio y al final
    const textoLimpio = posListText.replace(/<[^>]*>/g, '').trim();
    console.log("Texto limpio:", textoLimpio); // Mostrar el texto limpio en la consola

    // Reemplazar múltiples espacios en blanco (incluidos tabuladores y saltos de línea) con un solo espacio
    const textoNormalizado = textoLimpio.replace(/\s+/g, ' ');
    console.log("Texto normalizado:", textoNormalizado); // Mostrar el texto normalizado

    // Dividir la cadena en puntos X e Y
    const puntos = textoNormalizado.split(' ');
    console.log("Puntos divididos:", puntos); // Mostrar los puntos divididos

    const puntosX = [];
    const puntosY = [];

    for (let i = 0; i < puntos.length; i += 2) {
        puntosX.push(parseFloat(puntos[i]));
        puntosY.push(parseFloat(puntos[i + 1]));
    }

    return { puntosX, puntosY };
}

function convertir(puntoX, puntoY) {
    // Función para convertir puntos, si es necesario
    return [puntoX, puntoY];
}

function crearJSON(iden, nameSp, superficie, puntosWS84, usoN) {
    var jsonJ = '{ "type": "Feature", "properties": { "gml_id": "' + iden + '", "areaValue":' + superficie + ', "areaValue_uom": "m2", "localId": "' + iden + '", "namespace": "' + nameSp + '","nationalCadastralReference": "' + iden + '" },"geometry": { "type": "MultiPolygon", "coordinates": [[[' + puntosWS84 + ']]] } }';
    
    // Transformamos el texto a JSON
    var jsonJOK = JSON.parse(jsonJ);

    // Sacamos en mapa;
    L.geoJSON(jsonJOK, {style: myStyle}).addTo(map);

    // Zoom al json cargado
    map.fitBounds(L.geoJSON(jsonJOK).getBounds());
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

    // Unir todas las líneas en una sola cadena de texto
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

    // Modificar la expresión regular para manejar etiquetas en la misma línea
    const posListRegex = /<gml:posList[^>]*>([\s\S]*?)<\/gml:posList>/g;
    let match;
	
	//var total = '<center><input name="btnImprimir" id="btnImprimir" type="button" class="button" value="Imprimir" onClick="imprSelec()"></center>';
    //document.getElementById('list').innerHTML += total;
    //document.getElementById('foto').innerHTML = foto;
	
	// Crear una cadena HTML para el botón de imprimir
    var total = '<center><input name="btnImprimir" id="btnImprimir" type="button" class="button" value="Imprimir" onClick="imprSelec()"></center>';

    // Agregar el botón de imprimir a la barra lateral
    var barraLateral = document.getElementById('side-bar');
    if (barraLateral) {
        barraLateral.innerHTML += total;
    } else {
        console.error("No se encontró el elemento 'side-bar'");
    }

    while ((match = posListRegex.exec(textoCompleto)) !== null) {
        const posListText = match[1];
        console.log("Encontrado posListText:", posListText); // Agregar para ver el texto encontrado
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
	document.getElementById('list').innerHTML += total;
	document.getElementById('foto').innerHTML = foto;
}




// CSS
// .hide-for-print { display: none !important; }

