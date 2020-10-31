var http = new XMLHttpRequest();
var httpPost = new XMLHttpRequest();
var idG = 11;
var array = ["1967","1995","1996","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011",
"2012","2013","2014","2015","2016","2017","2018","2019","2020"];
window.addEventListener("load",cargar);
function cargar(){ 
    pedirAutosGet();
}  
window.addEventListener("load",function(){
    var btn = document.getElementById("btnAbrir");
    btn.addEventListener("click",function(){
        abrirFormulario()
    })
})
window.addEventListener("load",function(){
    var btn = document.getElementById("btnCerrarMod");
    btn.addEventListener("click",function(){
        cerrarGrilla();
        
    })
})
window.addEventListener("load",function(){
    var btn = document.getElementById("btnCerrar");
    btn.addEventListener("click",function(){
        cerrarGrilla();
        
    })
})
window.addEventListener("load",function(){
    var btn = document.getElementById("btnModificar");
    btn.addEventListener("click",function(){
        darDeAlta()
        
    })
})
function realizarPeticionGet(url, metodo, funcion) {
    http.onreadystatechange = funcion;
    http.open(metodo, url, true);
    http.send();
}

function pedirAutosGet() {
    realizarPeticionGet("http://localhost:3000/autos", "GET", callback);
}

function traerAutos(jsonObj) {

    for (var auto of jsonObj) {
        agregarFilaAuto(auto.id, auto.make, auto.model, auto.year);
    }
}

function callback() {
    if (http.readyState === 4 && http.status === 200) {
        listaJson = JSON.parse(http.responseText);
        traerAutos(listaJson);
        //spinner.hidden = true;
    }
}

function editarAnio(id, anio) {
    httpPost.onreadystatechange = callbackPost;
    httpPost.open("POST", "http://localhost:3000/editarYear", true);
    httpPost.setRequestHeader("Content-Type", "application/json");
    document.getElementById("container-spinner").style.display = "flex";

    var datos = {
        id: id,
        year: anio
    };
    httpPost.send(JSON.stringify(datos));
}

function nuevoAuto(marca, modelo, anio) {
    httpPost.onreadystatechange = callbackPost;
    httpPost.open("POST", "http://localhost:3000/nuevoAuto", true);
    httpPost.setRequestHeader("Content-Type", "application/json");
    document.getElementById("container-spinner").style.display = "flex";

    var datos = {
        make: marca,
        modal: modelo,
        year: anio
    };
    httpPost.send(JSON.stringify(datos));
}

function callbackPost() {
    document.getElementById("container-spinner").style.display = "none";
    if (httpPost.readyState == 4) {
        if (httpPost.status == 200) {
        }
    }
}

function agregarFilaAuto(id, make, model, year) {
    tCuerpo = document.getElementById("tCuerpo");

    var tr = document.createElement("tr");
    tr.setAttribute("id", id);

    var tdID = document.createElement("td");
    var nodoTexto = document.createTextNode(id);
    tdID.appendChild(nodoTexto);
    tr.appendChild(tdID);

    var tdMake = document.createElement("td");
    var nodoTexto = document.createTextNode(make);
    tdMake.appendChild(nodoTexto);
    tr.appendChild(tdMake);

    var tdModel = document.createElement("td");
    var nodoTexto = document.createTextNode(model);
    tdModel.appendChild(nodoTexto);
    tr.appendChild(tdModel);

    var tdYear = document.createElement("td");

    var selectList = document.createElement("select");
    selectList.id = "anios";
    tdYear.appendChild(selectList);
    var nodoTexto = String(year);
    
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
        
        if (nodoTexto.localeCompare(array[i])==0) {
            option.setAttribute('selected', 'selected');
        }
    }

    tr.appendChild(tdYear);

    selectList.addEventListener("change",cambiarAnio);
    tCuerpo.appendChild(tr);
}

function cambiarAnio(evento) {
    var trClick = evento.target.parentNode.parentNode;
    var id = trClick.getAttribute("id");
    var anio = evento.target.value;

    editarAnio(id, anio);
    trClick.childNodes[2].childNodes[0].innerHTML = anio;
    
    console.log("Año "+anio+ " id: "+id);
}

function abrirFormulario() {
    var backdrop = document.getElementById("backdrop");
    backdrop.style.display = "flex";
}

function darDeAlta() {
    var backdrop = document.getElementById("backdrop");
    var modal = document.getElementById("container-modificar");
    backdrop.addEventListener("click", cerrarGrilla);
    modal.addEventListener("click", modalClick);

    limpiarError();

    var nuevaMarca = document.getElementById("marcaMod").value;
        nuevaMarca = nuevaMarca.charAt(0).toUpperCase() + nuevaMarca.slice(1);

        var nuevoModelo = document.getElementById("modeloMod").value;
        nuevoModelo = nuevoModelo.charAt(0).toUpperCase() + nuevoModelo.slice(1);

        var e = document.getElementById("anioMod");
        var anio = e.options[e.selectedIndex].value;

        if (nuevaMarca.length > 2) {
            if (nuevoModelo.length > 2) {
                if (anio > 1999 && anio < 2021) {
                    nuevoAuto(nuevaMarca, nuevoModelo, anio);
                    idN = idG + 1;
                    agregarFilaAuto(idN, nuevaMarca, nuevoModelo, anio);
                    cerrarGrilla();
                    } 
                else {
                    document.getElementById("anioMod").classList.add("error");
                }
                
            } 
            else {
                document.getElementById("modeloMod").classList.add("error");
            }   
        }
        else{
            document.getElementById("marcaMod").classList.add("error");
        }
}

function limpiarError () {
    document.getElementById("marcaMod").classList.remove("error");
    document.getElementById("modeloMod").classList.remove("error");
}

function modalClick(evento) {
    evento.stopPropagation();
}

function cerrarGrilla() {
    var backdrop = document.getElementById("backdrop");
    backdrop.style.display = "none";

}
