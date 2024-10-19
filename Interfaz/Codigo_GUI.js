
import { parse } from "../Analizador/parser.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import Errores from "../Simbolo/Errores.js";
import Arbol from "../Simbolo/Arbol.js";
import Instr_Break from "../Instrucciones/Instr_Break.js";
import Instr_Continue from "../Instrucciones/Instr_Continue.js";
import Instr_DeclaracionStruct from "../Instrucciones/Instr_DeclaracionStruct.js";
import Instr_Funcion from "../Instrucciones/Instr_Funcion.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

let tabCount = 0;
let tabsData = {};
let numeroError = 0;
let numeroSimbolo = 0;
export let ListaSimbolos = [];
export let ListaErrores = [];

export function addTab() {
    tabCount++;
    const tabId = `tab${tabCount}`;

    // Crear el botón de la pestaña
    const tabButton = document.createElement('button');
    tabButton.innerText = `Archivo ${tabCount}`;
    tabButton.className = 'tab-button';
    tabButton.onclick = () => switchTab(tabId);

    // Crear el contenido de la pestaña
    const tabContent = document.createElement('div');
    tabContent.className = 'tab';
    tabContent.id = tabId;
    tabContent.innerHTML = `<textarea placeholder="Contenido de Archivo ${tabCount}"></textarea>`;

    // Agregar el botón y el contenido al DOM
    document.getElementById('tabs-container').appendChild(tabButton);
    document.getElementById('tabs-container').appendChild(tabContent);

    tabsData[tabId] = {
        fileName: `Archivo ${tabCount}`,
        content: ""
    };

    // Activar la nueva pestaña
    switchTab(tabId);
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

export function loadFile(event){
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const fileName = file.name.replace('.oak', '');

            tabCount++;
            const tabId = `tab${tabCount}`;
            
            const tabButton = document.createElement('button');
            tabButton.innerText = fileName;
            tabButton.className = 'tab-button';
            tabButton.onclick = () => switchTab(tabId);

            const tabContent = document.createElement('div');
            tabContent.className = 'tab';
            tabContent.id = tabId;
            tabContent.innerHTML = `<textarea style="width: 100%; height: 400px;">${content}</textarea>`;

            document.getElementById('tabs-container').appendChild(tabButton);
            document.getElementById('tabs-container').appendChild(tabContent);

            tabsData[tabId] = {
                fileName: fileName,
                content: content
            };

            switchTab(tabId);
        };
        reader.readAsText(file);
    }
}

export function Ejecutar(){
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const content = activeTab.querySelector('textarea').value;
        const resultado = parse(content);

        const ast = new Arbol(resultado);
        const tabla = new TablaSimbolos();
        const generador = new RiscVGenerator();
        ListaErrores = [];
        ListaSimbolos = [];
        numeroError = 0;
        tabla.setNombre("GLOBAL");
        ast.setConsola("");
        ast.setTablaGlobal(tabla);

        console.log(resultado);

        /* 
        for (let element of resultado) {

            if(element instanceof Instr_Break){
                let error = new Errores("Semantico", "Break fuera de ciclo", element.Linea, element.Columna);
                ListaErrores.push(error);
                continue;
            }

            if(element instanceof Instr_Continue){
                let error = new Errores("Semantico", "Continue fuera de ciclo", element.Linea, element.Columna);
                ListaErrores.push(error);
                continue;
            }

            if(element instanceof Errores){
                ListaErrores.push(element);
                continue;
            }

            if(element instanceof Instr_DeclaracionStruct){
                element.Interpretar(ast, tabla);
                ast.addStructs(element);
                continue;
            }

            if(element instanceof Instr_Funcion){
                element.Esglobal = true;
                ast.addFuncion(element);
                continue;
            }

            let res = element.Interpretar(ast, tabla);

            if(res instanceof Errores){
                ListaErrores.push(res);
            }
            
        }
        */

        for (let element of resultado){

            if(element instanceof Instr_Break){
                let error = new Errores("Semantico", "Break fuera de ciclo", element.Linea, element.Columna);
                ListaErrores.push(error);
                continue;
            }

            if(element instanceof Instr_Continue){
                let error = new Errores("Semantico", "Continue fuera de ciclo", element.Linea, element.Columna);
                ListaErrores.push(error);
                continue;
            }

            if(element instanceof Errores){
                ListaErrores.push(element);
                continue;
            }

            let res = element.Traducir(ast, tabla, generador);

            if(res instanceof Errores){
                ListaErrores.push(res);
            }

        }

        //console.log(ListaSimbolos);
        console.log(generador.objectStack);
        
        let Consola = generador.toString();
        /* 
        ListaErrores.forEach((element) => {
            Consola += `Error ${++numeroError} - ` + element.toString() + "\n";
        });
        */

        const blobASM = new Blob([Consola], { type: 'text/plain' });

        const linkASM = document.createElement('a');
        linkASM.href = URL.createObjectURL(blobASM);
        linkASM.download = 'TraduccionP2.asm';
        
        document.body.appendChild(linkASM);
        linkASM.click();

        document.body.removeChild(linkASM);

        document.getElementById('output').innerText = Consola;

        
    } else {
        document.getElementById('output').innerText = 'No hay una pestaña activa.';
    }
}

export function ReporteErrores(){
    numeroError = 0;
    let HTML = "<html>\n";
    HTML += "<head>\n";
    HTML += "<title>Reporte de Errores</title>\n";
    HTML += "<style>\n";
    HTML += "body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }\n";
    HTML += "h1 { color: #333; }\n";
    HTML += "table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n";
    HTML += "th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }\n";
    HTML += "th { background-color: #f2f2f2; color: #333; }\n";
    HTML += "tr:nth-child(even) { background-color: #f9f9f9; }\n";
    HTML += "tr:hover { background-color: #e0e0e0; }\n";
    HTML += "</style>\n";
    HTML += "</head>\n";
    HTML += "<body>\n";
    HTML += "<h1>Tabla de Errores</h1>\n";
    HTML += "<table border=\"1\">\n";
    HTML += "<tr>\n";
    HTML += "<th>Numero</th>\n";
    HTML += "<th>Tipo</th>\n";
    HTML += "<th>Descripcion</th>\n";
    HTML += "<th>Linea</th>\n";
    HTML += "<th>Columna</th>\n";
    HTML += "</tr>\n";

    for (let element of ListaErrores) {
        HTML += "<tr>\n";
        HTML += `<td>${++numeroError}</td>\n`;
        HTML += `<td>${element.getTipo()}</td>\n`;
        HTML += `<td>${element.getDescripcion()}</td>\n`;
        HTML += `<td>${element.getLinea()}</td>\n`;
        HTML += `<td>${element.getColumna()}</td>\n`;
        HTML += "</tr>\n";
    }

    HTML += "</table>\n";
    HTML += "</body>\n";
    HTML += "</html>\n";

    const blob = new Blob([HTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ReporteErrores.html';
    link.click();
}

export function ReporteSimbolos(){
    numeroSimbolo = 0;
    let HTML = "<html>\n";
    HTML += "<head>\n";
    HTML += "<title>Reporte de Simbolos</title>\n";
    HTML += "<style>\n";
    HTML += "body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }\n";
    HTML += "h1 { color: #333; }\n";
    HTML += "table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n";
    HTML += "th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }\n";
    HTML += "th { background-color: #f2f2f2; color: #333; }\n";
    HTML += "tr:nth-child(even) { background-color: #f9f9f9; }\n";
    HTML += "tr:hover { background-color: #e0e0e0; }\n";
    HTML += "</style>\n";
    HTML += "</head>\n";
    HTML += "<body>\n";
    HTML += "<h1>Tabla de Simbolos</h1>\n";
    HTML += "<table border=\"1\">\n";
    HTML += "<tr>\n";
    HTML += "<th>Numero</th>\n";
    HTML += "<th>ID</th>\n";
    HTML += "<th>Tipo (Estructura)</th>\n";
    HTML += "<th>Tipo (Dato)</th>\n";
    HTML += "<th>Entorno</th>\n";
    HTML += "<th>Valor</th>\n";
    HTML += "<th>Linea</th>\n";
    HTML += "<th>Columna</th>\n";
    HTML += "</tr>\n";

    for (let element of ListaSimbolos) {
        HTML += "<tr>\n";
        HTML += `<td>${++numeroSimbolo}</td>\n`;
        HTML += `<td>${element.getNombre()}</td>\n`;
        HTML += `<td>${element.getTipoEstruct()}</td>\n`;
        HTML += `<td>${element.getTipo().getTipo()}</td>\n`;
        HTML += `<td>${element.getEntorno()}</td>\n`;
        HTML += `<td>${element.getValor()}</td>\n`;
        HTML += `<td>${element.getLinea()}</td>\n`;
        HTML += `<td>${element.getColumna()}</td>\n`;
        HTML += "</tr>\n";
    }

    HTML += "</table>\n";
    HTML += "</body>\n";
    HTML += "</html>\n";

    const blob = new Blob([HTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ReporteSimbolos.html';
    link.click();

}

export function GuardarArchivo(){
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabId = activeTab.id;
        const fileData = tabsData[tabId];
        if (fileData && fileData.fileName) {
            const content = activeTab.querySelector('textarea').value;

            // Crear un blob con el contenido actualizado
            const blob = new Blob([content], { type: 'text/plain' });
            
            // Crear un enlace de descarga
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileData.fileName + ".oak"; // Guardar con el nombre original del archivo
            
            // Desencadenar la descarga
            a.click();
            
            // Liberar el objeto URL
            URL.revokeObjectURL(a.href);
        } else {
            alert('No se ha cargado un archivo en esta pestaña.');
        }
    } else {
        alert('No hay una pestaña activa.');
    }
}


