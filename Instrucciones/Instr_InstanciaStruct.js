import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Instr_InstanciaStruct extends Instruccion {
    constructor(IDStruct, IDvar, Attribs, Linea, Columna) {
        super(new Tipo(DatoNativo.STRUCT), Linea, Columna);
        this.IDStruct = IDStruct;
        this.IDvar = IDvar;
        this.Attribs = Attribs;
        this.Entorno = "";
    }

    Interpretar(arbol, tabla){

        let newSimbolo = new Simbolos;

        let Valor = this.InnerStruct(arbol, tabla, this.IDStruct, this.Attribs);

        if(Valor instanceof Errores){
            return Valor;
        }

        newSimbolo = new Simbolos(this.IDvar, this.Tipo, Valor, this.IDStruct, this.Linea, this.Columna);

        if(this.Entorno === ""){
            this.setEntorno("GLOBAL");
        }

        newSimbolo.setEntorno(this.Entorno);

        let creacion = tabla.setVariable(newSimbolo);

        if(!creacion){
            return new Errores("Semantico", "La variable: " + this.IDvar + " ya existe en el entorno", this.Linea, this.Columna);
        }

        ListaSimbolos.push(newSimbolo);

        return null;

    }

    InnerStruct(arbol, tabla, IDstruct, Atribs){
        let busqueda = arbol.getStructs(IDstruct);

        if(busqueda === null){
            return new Errores("Semantico", "No se encontro el struct: " + this.IDStruct, this.Linea, this.Columna);
        }

        let new_Attribs = new Map(JSON.parse(JSON.stringify([...busqueda.Atributos])));

        for(let clave of new_Attribs.keys()){
            let newVal = Atribs.find(obj => obj.key === clave);

            if(newVal === undefined){
                return new Errores("Semantico", "No se encontro el atributo: " + clave, this.Linea, this.Columna);
            }

            let type = new_Attribs.get(clave).tipo.tipo;

            if(Array.isArray(newVal.value)){

                let typeArray = new_Attribs.get(clave).tipo;

                if(newVal.value[0] !== typeArray){
                    return new Errores("Semantico", "No coinciden los tipos de dato de los structs", this.Linea, this.Columna);
                }

                let newVal2 = this.InnerStruct(arbol, tabla, newVal.value[0], newVal.value[1]);

                if(newVal2 instanceof Errores) return newVal2;

                let old_attr = new_Attribs.get(clave);
                old_attr.valor = newVal2;
                new_Attribs.set(clave, old_attr);
                continue;
            }

            let nuevoValor = newVal.value.Interpretar(arbol, tabla);
            if(nuevoValor instanceof Errores) return nuevoValor;

            let newvalType = newVal.value.Tipo.getTipo();

            if(newvalType === "STRUCT"){
                let typeStruct = new_Attribs.get(clave).tipo;
                let typeVal = tabla.getVariable(newVal.value.ID).getTipoEstruct();
                if(typeStruct !== typeVal){
                    return new Errores("Semantico", "Se esperaba un struct de tipo " + typeStruct + " y se envio un struct de tipo " + typeVal, this.Linea, this.Columna);
                }
            } else {
                if(type !== newvalType){
                    return new Errores("Semantico", "No coinciden los tipos de dato primitivos de los structs", this.Linea, this.Columna);
                }
            }

            let old_attr = new_Attribs.get(clave);
            old_attr.valor = nuevoValor;
            new_Attribs.set(clave, old_attr);

        }

        return new_Attribs;

    }

    getEntorno(){
        return this.Entorno;
    }

    setEntorno(Entorno){
        this.Entorno = Entorno;
    }

}

export default Instr_InstanciaStruct;