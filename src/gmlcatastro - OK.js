// Extraer datos GML
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

function extraeTag(lineas){   
    var lineaPuntos=new String ;
    for(var i = 0; i < lineas.length; i++){
        if (lineas[i].indexOf('localId') != -1) {
        //console.log("ID encontrado en linea "+i);
            lineaId=lineas[i];
         //console.log(lineaPuntos);
        }
        if (lineas[i].indexOf('namespace') != -1) {
        //console.log("namespace encontrado en linea "+i);
             lineaNamespace=lineas[i];
        //console.log(lineaPuntos);
        }
        if (lineas[i].indexOf('areaValue') != -1) {
        //console.log("areaValue encontrado en linea "+i);
            lineaAreavalue=lineas[i];
        //console.log(lineaAreavalue);
        }
        if (lineas[i].indexOf('label') != -1) {
        //console.log("label encontrado en linea "+i);
            lineaLabel=lineas[i];
        //console.log(lineaPuntos);
        }
        else if (lineas[i].indexOf('posList') != -1) {
        //console.log("Puntos encontrado en linea "+i);
        lineaPuntos=lineas[i];
        //console.log(lineaPuntos);
        }
    }

    iD=extraerDatos(lineaId);
    nameSpace=extraerDatos(lineaNamespace);
    area=extraerDatos(lineaAreavalue);
    label=extraerDatos(lineaLabel);
    puntacos=extraerDatos(lineaPuntos);
    

    //console.log('extraeTag');
    //console.log(iD);
    //Anadir foto OVC
    document.getElementById('list').innerHTML += '<ul><img src="http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=' + iD + '" width="300" height="200"></img></ul>';
    //console.log(nameSpace);
    //console.log(area);
    //console.log(label);
    listado=extraerPuntos(puntacos);
    //console.log(listado);
    puntosJ=puntosJSON(listado);
   // console.log(puntosJ);
    crearJSON(iD,nameSpace,area,puntosJ);
    document.getElementById('list').innerHTML += '<p>ID: </td><td>'+iD+'</p>'
    document.getElementById('list').innerHTML += '<p>NameSpace: '+nameSpace+'</p>'
    document.getElementById('list').innerHTML += '<p>Area: '+area+' m2</p>'
    document.getElementById('list').innerHTML += '<p>Label: '+label+'</p>'

} //fin extraerTAG

function extraerDatos(li)  //extraemos posiciones de <> <>
    {
    //console.log("Extarer datos");
    //console.log(li); 
    var inicioFinal; 
    var posiciones=[];
    var pos=0;
    for(var i = 0; i < li.length-1; i++){
        if (li[i].indexOf('>') != -1)
            {//console.log(i);
            posiciones[pos]=i;
            pos+=1;}
        if (li[i].indexOf('<') != -1)
            {//console.log(i);
            posiciones[pos]=i;
        pos+=1;}
        }
    //devolvemos cadena entre > <
    return (li.substr(posiciones[1]+1,posiciones[2]-posiciones[1]-1));
    }


function extraerPuntos(p){  //se llama desde extraerTAG
    //console.log("extraerpuntos");
    //console.log(p);  
    p=p.trim();
    //console.log(p);
    puntos=p.split(" ");
    //console.log(puntos);
    totalPuntos=(puntos.length/2);
    //console.log(totalPuntos);
    //console.log(puntos[0],puntos[1]);
     //quitamos si hay puntos vacios por varios blancos despues del splir
    for (x=0;x<puntos.length;x++){
        if (puntos[x]=="")
            puntos.splice(x, 1);
    }
    //console.log(puntos);

    totalPuntos=(puntos.length/2);
    
    //console.log(totalPuntos);
    var nuevosPuntos=[];
    for (x=0;x<totalPuntos;x++){
        //console.log(puntos[x*2]+","+puntos[(x*2)+1]);
        //console.log(convertir(puntos[x*2],puntos[(x*2)+1]));	
        nuevosPuntos+=(convertir(puntos[x*2],puntos[(x*2)+1]))+",";
        //nuevosPuntos.push(convertir(puntos[x*2]));
        //nuevosPuntos.push(convertir(puntos[(x*2)+1]));
        }
    //console.log("nuevosPuntos");
    //console.log(nuevosPuntos);
    return nuevosPuntos;
    }



function puntosJSON(lista){  //se llama desde extraer TAG
    lista=lista.split(",")
    //lista[0]=lista[0].substr(9,lista[0].length) //quitamos el undefined ?¿?¿?
    //console.log(lista);
    var list;
    for (x=0;(x<(lista.length-3)/2);x++){
        //console.log(lista[x*2]+","+lista[(x*2)+1]);	
        list+=("[ "+lista[x*2]+" , "+lista[(x*2)+1]+" ],");
        }
    list+=("["+lista[(lista.length-3)]+","+lista[(lista.length-2)]+"]");
    list=list.substr(9,list.length); //quitamos el undefined ?¿?¿?
    //console.log(list);
    return list;
    }

function crearJSON(iden,nameSp,superficie,puntosWS84){ 
    //console.log(puntosWS84)
    jsonJ  = '{ "type": "Feature", "properties": { "gml_id": "'+iden+'", "areaValue":'+superficie+', "areaValue_uom": "m2", "localId": "'+iden+'", "namespace": "'+nameSp+'","nationalCadastralReference": "'+iden+'" },"geometry": { "type": "MultiPolygon", "coordinates": [[['+puntosWS84+']]] } }';
    //console.log(jsonJ);
    //transformamos el texto a JSON
    var jsonJOK = JSON.parse(jsonJ);
    //sacamos en mapa;
    L.geoJSON(jsonJOK,{style: myStyle}).addTo(map);
    //zoom al json cargado
    map.fitBounds(L.geoJSON(jsonJOK).getBounds());
    

}