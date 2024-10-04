import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos } from "../Interfaz/Codigo_GUI.js";

class Instr_DeclaracionArray extends Instruccion {
    constructor(ID, Tipo, valores_Arr, Espacios_Arr, ID_Arr, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.ID = ID;
        this.valores_Arr = valores_Arr;
        this.Espacios_Arr = Espacios_Arr;
        this.ID_Arr = ID_Arr;
        this.Entorno = "";
    }

    Interpretar(arbol, tabla){

        let new_Valores = [];
        let newSimbolo = new Simbolos;

        if(this.valores_Arr === null && this.Espacios_Arr === null){

            let variable = tabla.getVariable(this.ID_Arr);

            if(variable === null){
                return new Errores("Semantico", "La variable " + this.ID_Arr + " no existe", this.Linea, this.Columna);
            }

            if(variable.Tipo.getTipo() === "VOID"){
                return new Errores("Semantico", "La variable " + this.ID_Arr + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            }

            if(variable.Tipo.getTipo() !== this.Tipo.getTipo()){
                return new Errores("Semantico", "El tipo de dato de la variable no coincide con el tipo de dato del array", this.Linea, this.Columna);
            }

            if(variable.getTipoEstruct() === "Variable"){
                new_Valores.push(variable.getValor());
            } else if(variable.getTipoEstruct() === "Array"){
                new_Valores = [...variable.getValor()];
            } else {
                return new Errores("Semantico", "El tipo de dato de la variable no es valido", this.Linea, this.Columna);
            }

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Array", this.Linea, this.Columna);
    
        } else if(this.Espacios_Arr === null && this.ID_Arr === null){

            if(this.esMatriz(this.valores_Arr)){
                return new Errores("Semantico", "No se puede asignar una matriz a un array", this.Linea, this.Columna);
            }

            for(let element of this.valores_Arr){

                if(element.Tipo.getTipo() !== this.Tipo.getTipo()){
                    return new Errores("Semantico", "El tipo de dato del valor no coincide con el tipo de dato del array", this.Linea, this.Columna);
                }

                let valor = element.Interpretar(arbol, tabla);
                if(valor instanceof Errores) return valor;

                new_Valores.push(valor);
            }

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Array", this.Linea, this.Columna);

        } else if(this.valores_Arr === null && this.ID_Arr === null){

            let var_Espacios = this.Espacios_Arr[0].Interpretar(arbol, tabla);
            if(var_Espacios instanceof Errores) return var_Espacios;

            if(this.Espacios_Arr[0].Tipo.getTipo() !== "ENTERO"){
                return new Errores("Semantico", "El tipo de dato de los espacios no es un entero", this.Linea, this.Columna);
            }

            if(var_Espacios < 0){
                return new Errores("Semantico", "No se puede declarar un array con un tamaño negativo", this.Linea, this.Columna);
            }

            switch (this.Tipo.getTipo()) {
                case "ENTERO":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push(0);
                    }
                    break;
                case "DECIMAL":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push(0.0);
                    }
                    break;
                case "BOOLEANO":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push(false);
                    }
                    break;
                case "CADENA":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push("");
                    }
                    break;
                case "CARACTER":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push('\u0000');
                    }
                    break;
                case "STRUCT":
                    for (let i = 0; i < var_Espacios; i++) {
                        new_Valores.push(null);
                    }
                    break;
                default:
                    return new Errores("Semantico", "Tipo de dato no valido", this.Linea, this.Columna);
            }

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Array", this.Linea, this.Columna);

        }

        if(this.Entorno === ""){
            this.setEntorno("GLOBAL");
        }
        newSimbolo.setEntorno(this.Entorno);

        let creacion = tabla.setVariable(newSimbolo);

        if(!creacion){
            return new Errores("Semantico", "La variable " + this.ID + " ya existe", this.Linea, this.Columna);
        }

        ListaSimbolos.push(newSimbolo);

        return null;

    }

    getEntorno(){
        return this.Entorno;
    }

    setEntorno(Entorno){
        this.Entorno = Entorno;
    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }
        return array.some(elemento => Array.isArray(elemento));
    }
}

export default Instr_DeclaracionArray;