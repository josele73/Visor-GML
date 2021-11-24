// Extraer datos GML
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};


function extraeUso(lineas){
    for(var i = 0; i < lineas.length; i++)
        if (lineas[i].indexOf('25831') != -1)
            return true;

    }


function extraeTag(lineas){   
    var lineaPuntos=new String ;
    var lineaId;
    var lineaNamespace;
    var lineaAreavalue;
    var lineaLabel;
    var cuerpos=0;
    var cuerposF=0;
    var listadoCuerpos=[];
    var listadoFinCuerpos=[];
    var ArrayListadoPuntos=[];
    var ArrayId=[];
    var contId=0;
    var ArrayNamespace=[];
    var contNamespace=0;
    var ArrayArea=[];
    var contArea=0;
    var lineaMuchosPuntos;
    var usoN=0;
    var esConstruccion=0;
    var tributa=0;

     //Buscamos donde empieza-acaba el listado de puntos   
    /** for(var i=0;i<lineas.length;i++)
        {
        if (lineas[i].indexOf('<gml:posList') != -1)
            { 
                listadoCuerpos[cuerpos]=i;
                cuerpos=cuerpos+1;
            }
            if (lineas[i].indexOf('</gml:posList') != -1)
            { 
                listadoFinCuerpos[cuerposF]=i;
                cuerposF=cuerposF+1;
            }

        }

    console.log(cuerpos);
    **/
    
    for(var i = 0; i < lineas.length; i++)
        {
        if (lineas[i].indexOf('localId') != -1) {
            ArrayId[contId]=lineas[i];
            ArrayId[contId]=extraerDatos(ArrayId[contId]);
            contId=contId+1;
            } //localID
        
        if (lineas[i].indexOf('namespace') != -1) {
            ArrayNamespace[contNamespace]=lineas[i];
            ArrayNamespace[contNamespace]=extraerDatos(ArrayNamespace[contNamespace]);
            contNamespace=contNamespace+1;
            } //namespace
        
        if (lineas[i].indexOf('areaValue') != -1) {
            ArrayArea[contArea]=lineas[i];
            ArrayArea[contArea]=extraerDatos(ArrayArea[contArea]);
            contArea=contArea+1;
            } //namespace

        if (lineas[i].indexOf('<gml:posList') != -1)
            { 
                listadoCuerpos[cuerpos]=i;
                cuerpos=cuerpos+1;
            } //postlist
            
        if (lineas[i].indexOf('</gml:posList') != -1)
            { 
                listadoFinCuerpos[cuerposF]=i;
                cuerposF=cuerposF+1;
            } // /postlist

        if (lineas[i].indexOf('25831') != -1)
            { 
               usoN=1;
               console.log("31N")
            } //uso 31

        if (lineas[i].indexOf('ES.SDGC.BU') != -1)
            { 
               esConstruccion=1;
               console.log("Es construccion")
            } //es construccion
    
            if (lineas[i].indexOf('ES.SDGC.CP') != -1)
            { 
               tributa=1;
               console.log("Esta tributando")
            } //es construccion

        }//for var i
    
        //console.log(ArrayId);
        //console.log(ArrayNamespace);
        //console.log(ArrayArea);
        //console.log(listadoCuerpos);
        //console.log(listadoFinCuerpos);
        //console.log(cuerpos);

        if (cuerpos==1)  //vamos a preparar las lineas de los puntos en una sola
            {
             if (listadoCuerpos[0]==listadoFinCuerpos[0])
                console.log("Puntos en misma linea");
             else
                console.log("PUNTOS EN VARIAS LINEAS")   
            }
        else
            {
            console.log("VARIOS CUERPOS");
            }//else
        


        for(var z = 0; z < listadoCuerpos.length; z++)  //Cargamos lass lineas con los puntos
            {
            lineaMuchosPuntos="";
            if (listadoCuerpos[z]<listadoFinCuerpos[z])
                {
                //console.log(listadoCuerpos[z],listadoFinCuerpos[z]);
                for(var l = listadoCuerpos[z]; l <= listadoFinCuerpos[z]; l++)
                    {
                    //console.log(lineas[l]);
                    lineaMuchosPuntos+=lineas[l]+" ";
                    }
                }
            if (listadoCuerpos[z]=listadoFinCuerpos[z]) // si esta todo en la misma linea
                lineaMuchosPuntos+=lineas[listadoCuerpos[z]];
                
            ArrayListadoPuntos[z]=lineaMuchosPuntos;
            }

        //console.log(ArrayListadoPuntos);

        for (var z = 0; z < ArrayListadoPuntos.length; z++){ //Array de varios cuerpos
            prueba=extraerDatos(ArrayListadoPuntos[z]);
            listado=extraerPuntos(prueba);
            //console.log(ArrayListadoPuntos[1]);
            //console.log("listado");
            //console.log(listado);
            puntosJ=puntosJSON(listado);
            //console.log(puntosJ)
            crearJSON("-1","-1","-1",puntosJ,usoN);
            } //for
            
            //construccion tabla contenido
            //cargar foto
            console.log(ArrayId)
            var total=""
            var foto=" "
            if (tributa==1)
                {
               
                foto = '<ul><img src="http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=' + ArrayId[0] + '" width="300" height="200"></img></ul>';
                total  += '<table width="300"><caption><b><center>Datos Fichero GML</center></b></caption><tr><td>TIPO: </td><td> Parcela Catastral</td></tr>'
                total += '<tr><td>ID: </td><td>'+ArrayId[0]+'</td></tr>'
                total  += '<tr><td>NameSpace: </td><td>'+ArrayNamespace[0]+'</td></tr>'
                if (usoN==true)
                    total  += '<tr><td>UTM: </td><td>UTM 31N ETRS89</td></tr>'
                else
                    total  += '<tr><td>UTM: </td><td>UTM 30N ETRS89</td></tr>'
                total += '<tr><td>Superficie: </td><td>'+ArrayArea[0]+' m2</td></tr></table>'
                 }
            else{
                foto=" ";
                total  += '<table width="300"><caption><b><center>Datos Fichero GML</center></b></caption><tr><td>TIPO: </td><td> Edificio - Construcción</td></tr>'
                total += '<tr><td>ID: </td><td>'+ArrayId[0]+'</td></tr>'
                total  += '<tr><td>NameSpace: </td><td>'+ArrayNamespace[0]+'</td></tr>'
                if (usoN==true)
                    total  += '<tr><td>UTM: </td><td>UTM 31N ETRS89</td></tr>'
                else
                    total  += '<tr><td>UTM: </td><td>UTM 30N ETRS89</td></tr>'
                total += '<tr><td>Total cuerpos: </td><td>'+cuerposF+'</td></tr></table>'
                
                }
                total+='<center><input name="btnImprimir" id="btnImprimir" type="button" class="button" value="Imprimir" onClick="imprSelec()"></center>'
                document.getElementById('list').innerHTML +=total
                document.getElementById('foto').innerHTML =foto
            //console.log(total);
            //console.log(document.getElementById('list'));
            //console.log(tributa);    


    /*** 
    if (cuerpos==1)
         
        {        
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
        } //for
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
    }// cuerpos=1 
    
    else{
        //Listado con varios cuerpos
        //console.log(listadoCuerpos);
        //console.log(listadoFinCuerpos);
        //console.log(lineas[26]);
        lineaMuchosPuntos="";
        for(var z = 0; z < listadoCuerpos.length; z++)  //Cargamos lass lineas con los puntos
            {
                lineaMuchosPuntos="";
                if (listadoCuerpos[z]<listadoFinCuerpos[z])
                    {console.log("1");
                    console.log(listadoCuerpos[z],listadoFinCuerpos[z]);
                    for(var l = listadoCuerpos[z]; l <= listadoFinCuerpos[z]; l++)
                        {
                        console.log(lineas[l]);
                        //console.log("2");
                        lineaMuchosPuntos+=lineas[l]+" ";
                        }
                    }
               
                ArrayListadoPuntos[z]=lineaMuchosPuntos;
            console.log(ArrayListadoPuntos[z]);
            }

        
        //console.log('HOLA');
        //console.log(lineaMuchosPuntos);
        
        for (var z = 0; z < ArrayListadoPuntos.length; z++){
            prueba=extraerDatos(ArrayListadoPuntos[z]);
            listado=extraerPuntos2(prueba);
            //console.log(ArrayListadoPuntos[1]);
            //console.log("listado");
            //console.log(listado);
            puntosJ=puntosJSON(listado);
            //console.log(puntosJ)
            crearJSON("-1","-1","-1",puntosJ);
            }
        }// del else **/
        
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
/*** 
    function extraerPuntos2(p){  //se llama desde extraerTAG
        console.log("extraerpuntos");
        console.log(p);  
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
        console.log(puntos);
    
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
    

**/

function puntosJSON(lista){  //se llama desde extraer TAG
    //console.log(lista);
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




function imprSelec() {
    
    var div1 = document.getElementById('side-bar');
    div1.style.display = 'none'
    window.print();
    div1.style.display = 'block'
    

}

  