import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos } from "../Interfaz/Codigo_GUI.js";

class Instr_DeclaracionMatriz extends Instruccion {
    constructor(ID, Tipo, valores_Mat, Dimensiones_Mat, ID_Mat, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.ID = ID;
        this.valores_Mat = valores_Mat;
        this.Dimensiones_Mat = Dimensiones_Mat;
        this.ID_Mat = ID_Mat;
        this.Entorno = "";
    }

    Interpretar(arbol, tabla){

        let new_Valores = [];
        let Dimensiones = [];
        let newSimbolo = new Simbolos;

        if(this.valores_Mat === null && this.Dimensiones_Mat === null){

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

            if(variable.getTipoEstruct() === "Matriz"){
                new_Valores = [...variable.getValor()];
            } else {
                return new Errores("Semantico", "El tipo de dato de la variable no es valido", this.Linea, this.Columna);
            }

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Matriz", this.Linea, this.Columna);

        } else if(this.Dimensiones_Mat === null && this.ID_Mat === null){

            if(!this.esMatriz(this.valores_Mat)){
                return new Errores("Semantico", "No se puede asignar un array a una matriz", this.Linea, this.Columna);
            }

            new_Valores = this.copiarMatriz(this.valores_Mat, arbol, tabla);

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Matriz", this.Linea, this.Columna);

        } else if(this.valores_Mat === null && this.ID_Mat === null){

            for(let element of this.Dimensiones_Mat){

                if(element.Tipo.getTipo() !== "ENTERO"){
                    return new Errores("Semantico", "Las dimensiones de la matriz deben ser de tipo entero", this.Linea, this.Columna);
                }

                let var_Espacios = element.Interpretar(arbol, tabla);

                if(var_Espacios instanceof Errores) return var_Espacios;

                if(var_Espacios < 0){
                    return new Errores("Semantico", "Las dimensiones de la matriz no pueden ser negativas", this.Linea, this.Columna);
                }

                Dimensiones.push(var_Espacios);

            }

            switch(this.Tipo.getTipo()){
                case "ENTERO":
                    new_Valores = this.crearMatriz(Dimensiones, 0);
                    break;
                case "DECIMAL":
                    new_Valores = this.crearMatriz(Dimensiones, 0.0);
                    break;
                case "BOOLEAN":
                    new_Valores = this.crearMatriz(Dimensiones, false);
                    break;
                case "CARACTER":
                    new_Valores = this.crearMatriz(Dimensiones, '\u0000');
                    break;
                case "CADENA":
                    new_Valores = this.crearMatriz(Dimensiones, "");
                    break;
                case "STRUCT":
                    new_Valores = this.crearMatriz(Dimensiones, null);
                    break;
                default:
                    return new Errores("Semantico", "Tipo de dato no valido", this.Linea, this.Columna);
            }

            newSimbolo = new Simbolos(this.ID, this.Tipo, new_Valores, "Matriz", this.Linea, this.Columna);

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

    copiarMatriz(matriz, arbol, tabla){
        if(Array.isArray(matriz)){
            return matriz.map((element) => this.copiarMatriz(element, arbol, tabla));
        } else {
            let valor = matriz.Interpretar(arbol, tabla);
            if(valor instanceof Errores) return valor;
            return valor;
        }
    }

    crearMatriz(Dimensiones, valor){
        if(Dimensiones.length === 0){
            return valor;
        }

        const dimensionActual = Dimensiones[0];
        const subDivision = Dimensiones.slice(1);

        return Array.from({ length: dimensionActual}, () => this.crearMatriz(subDivision, valor));
    }

}

export default Instr_DeclaracionMatriz;