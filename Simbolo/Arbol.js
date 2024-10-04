import Instr_DeclaracionStructs from "../Instrucciones/Instr_DeclaracionStruct.js"
import Instr_Funcion from "../Instrucciones/Instr_Funcion.js";
import Errores from "./Errores.js";

class Arbol{
    constructor(Instrucciones){
        this.Instrucciones = Instrucciones;
        this.consola = "";
        this.TablaGlobal = new Map();
        this.Errores = [];
        this.Funciones = [];
        this.Structs = [];
    }

    getInstrucciones(){
        return this.Instrucciones;
    }

    setInstrucciones(){
        this.Instrucciones = Instrucciones;
    }

    getConsola(){
        return this.consola;
    }

    setConsola(consola){
        this.consola = consola;
    }

    getTablaGlobal(){
        return this.TablaGlobal;
    }

    setTablaGlobal(TablaGlobal){
        this.TablaGlobal = TablaGlobal;
    }

    getErrores(){
        return this.Errores;
    }

    setErrores(Errores){
        this.Errores = Errores;
    }

    Print(Valor){
        this.consola += Valor + "\n";
    }

    addFuncion(funcion){
        if(funcion instanceof Instr_Funcion){
            var encontro = this.getFuncion(funcion.ID);
            if(encontro !== null){
                this.Errores.push(new Errores("Semantico", "Ya existe una funcion con el ID: " + funcion.ID, funcion.Linea, funcion.Columna));
            } else {
                this.Funciones.push(funcion);
            }
        }
    }

    getFuncion(ID){
        for (let element of this.Funciones){
            if(element instanceof Instr_Funcion){
                if(element.ID === ID){
                    return element;
                }
            }
        }
        return null;
    }

    getStructs(ID){
        for (let element of this.Structs) {
            if(element instanceof Instr_DeclaracionStructs){
                if(element.ID === ID){
                    return element;
                }
            }
        }
        return null;
    }

    addStructs(struct){
        if(struct instanceof Instr_DeclaracionStructs){
            let encontro = this.getStructs(struct.ID);
            if(encontro !== null){
                this.Errores.push(new Errores("Semantico", "Ya existe un struct con el ID: " + struct.ID, struct.Linea, struct.Columna));
            } else {
                this.Structs.push(struct);
            }
        }
    }

}

export default Arbol;