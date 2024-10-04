import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Expr_Return from "../Expresiones/Expr_Return.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";

class Instr_LlamadaFunc extends Instruccion {
    constructor(ID, params, esExpresion, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
        this.params = params;
        this.esExpresion = esExpresion;
    }

    Interpretar(arbol, tabla){
        let funcion = arbol.getFuncion(this.ID);
        if(funcion === null){
            return new Errores("Semantico", "No existe una funcion con el ID: " + this.ID, this.Linea, this.Columna);
        }

        let newTabla = null;

        if(funcion.Esglobal){
            newTabla = new TablaSimbolos(arbol.getTablaGlobal());
            newTabla.setNombre("GLOBAL - FUNCION " + this.ID);
        } else {
            newTabla = new TablaSimbolos(tabla);
            newTabla.setNombre("LOCAL - FUNCION " + this.ID);
        }

        if(funcion.parametros.length !== this.params.length){
            return new Errores("Semantico", "La cantidad de parametros no coincide con la funcion: " + this.ID, this.Linea, this.Columna);
        }

        for(let i = 0; i < this.params.length; i++){
            let identificador = funcion.parametros[i].identificador;
            let valor = this.params[i];
            let tipo2 = funcion.parametros[i].tipoDato;

            let DeclararParams = new Instr_DeclaracionVar(identificador, null, tipo2, this.Linea, this.Columna);
            DeclararParams.setEntorno(newTabla.getNombre());

            let resultado = DeclararParams.Interpretar(arbol, newTabla);

            if(resultado instanceof Errores) return resultado;

            let valorInterpretado = valor.Interpretar(arbol, tabla);

            if(valorInterpretado instanceof Errores) return valorInterpretado;

            let variable = newTabla.getVariable(identificador);

            if(variable === null){
                return new Errores("Semantico", "Error al obtener la variable: " + identificador, this.Linea, this.Columna);
            }

            if(variable.getTipo().getTipo() !== valor.Tipo.getTipo()){
                return new Errores("Semantico", "Error de tipos en la asignacion", this.Linea, this.Columna);
            }

            if(funcion.parametros[i].tipoEstruct === "Variable"){
                if(Array.isArray(valorInterpretado)){
                    return new Errores("Semantico", "Se intento asignar un Array a una variable normal", this.Linea, this.Columna);
                }
            } else if(funcion.parametros[i].tipoEstruct === "Array"){
                variable.setTipoEstruct("Array");
                if(!Array.isArray(valorInterpretado)){
                    return new Errores("Semantico", "Se intento asignar un valor normal a un Array", this.Linea, this.Columna);
                } else if(this.esMatriz(valorInterpretado)){
                    return new Errores("Semantico", "Se intento asignar una Matriz a un Array", this.Linea, this.Columna);
                }
            }

            variable.setValor(valorInterpretado);

        }

        let resultado = funcion.Interpretar(arbol, newTabla);

        if(resultado instanceof Errores) return resultado;

        if(!(resultado instanceof Expr_Return) && this.esExpresion){
            return new Errores("Semantico", "Se realizo una llamada a una funcion como expresion y la funcion no tiene return", this.Linea, this.Columna);
        }

        if(resultado instanceof Expr_Return){

            if(funcion.Tipo.getTipo() === "VOID"){
                return new Errores("Semantico", "La funcion es de tipo VOID y se intento retornar un valor", this.Linea, this.Columna);
            }

            if(resultado.expresion !== null){
                var retorno = resultado.Interpretar(arbol, resultado.tablaEntorno);
                if(retorno instanceof Errores) return retorno;

                if(resultado.Tipo.getTipo() !== funcion.Tipo.getTipo()){
                    return new Errores("Semantico", "La funcion es de tipo " + funcion.Tipo.getTipo() + " y el return es de tipo " + resultado.Tipo.getTipo(), this.Linea, this.Columna);
                }
    
                if(funcion.EstructFuncion === "Variable"){
                    if(Array.isArray(retorno)){
                        return new Errores("Semantico", "Se intento retornar un tipo no primitivo y la funcion es de tipo primitivo", this.Linea, this.Columna);
                    }
    
                    if(retorno instanceof Map){
                        let estructura = resultado.tablaEntorno.getVariable(resultado.expresion.ID);
                        if(estructura.getTipoEstruct() !== funcion.IDstruct){
                            return new Errores("Semantico", "El tipo del struct que se retorno, no es igual al tipo de struct de la funcion", this.Linea, this.Columna);
                        }
                    }
    
                } else if(funcion.EstructFuncion === "Array"){
                    if(this.esMatriz(retorno)){
                        return new Errores("Semantico", "Se intento retornar una Matriz y la funcion es de tipo Array", this.Linea, this.Columna);
                    }
                }

                this.Tipo.setTipo(resultado.Tipo.getTipo());
                return retorno;

            } else {
                return null;
            }

        }

        return null;

    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }
}

export default Instr_LlamadaFunc;