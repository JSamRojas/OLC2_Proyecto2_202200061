import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";

class Instr_ModificacionVar extends Instruccion{
    constructor(ID, expresion, modificador, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
        this.expresion = expresion;
        this.modificador = modificador;

    }

    Interpretar(arbol, tabla){
        let variable = tabla.getVariable(this.ID);
        if(variable === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(variable.Mutabilidad === false){
            return new Errores("Semantico", "La variable " + this.ID + " es parte del foreach, por ende, no se puede modificar", this.Linea, this.Columna);
        }

        if(this.modificador === null){

            let nuevoValor = this.expresion.Interpretar(arbol, tabla);
            if(nuevoValor instanceof Errores) return nuevoValor;

            if(nuevoValor === null){
                variable.setValor(null);
                return null;
            }

            if(variable.getTipo().getTipo() === "VOID"){
                return new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            }

            if(variable.getTipoEstruct() === "Variable"){

                if(variable.getTipo().getTipo() !== this.expresion.Tipo.getTipo()){
                    if(variable.getTipo().getTipo() === "DECIMAL" && this.expresion.Tipo.getTipo() === "ENTERO"){
                        nuevoValor = parseFloat(nuevoValor).toFixed(1);
                    } else {
                        variable.setValor(null);
                        variable.setTipo(new Tipo(DatoNativo.VOID));
                        return new Errores("Semantico", "La variable es de tipo " + variable.getTipo().getTipo() + " y el valor asignado es de tipo " + this.expresion.Tipo.getTipo(), this.Linea, this.Columna);
                    }
                }
    
                variable.setValor(nuevoValor);

            } else if(variable.getTipoEstruct() === "Array"){

                if(variable.getTipo().getTipo() !== this.expresion.Tipo.getTipo()){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable es de tipo " + variable.getTipo().getTipo() + " y el valor asignado es de tipo " + this.expresion.Tipo.getTipo(), this.Linea, this.Columna);
                }

                if(this.esMatriz(nuevoValor)){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable " + this.ID + " es un arreglo y no se puede asignar una matriz", this.Linea, this.Columna);
                }

                if(!Array.isArray(nuevoValor)){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable " + this.ID + " es un arreglo y no se puede asignar un valor", this.Linea, this.Columna);
                }

                if(nuevoValor.length !== variable.length){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable " + this.ID + " es un arreglo y no se puede asignar un arreglo de diferente longitud", this.Linea, this.Columna);
                }

                variable.setValor([...nuevoValor]);

            } else if(variable.getTipoEstruct() === "Matriz"){

                if(variable.getTipo().getTipo() !== this.expresion.Tipo.getTipo()){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable es de tipo " + variable.getTipo().getTipo() + " y el valor asignado es de tipo " + this.expresion.Tipo.getTipo(), this.Linea, this.Columna);
                }

                if(!this.esMatriz(nuevoValor)){
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable " + this.ID + " es una matriz y no se le puede asignar un array o un primitivo", this.Linea, this.Columna);
                }

                let dimen_Original = this.obtenerDimensiones(variable.getValor());

                let dimen_Nuevas = this.obtenerDimensiones(nuevoValor);

                if(dimen_Original.toString() === dimen_Nuevas.toString()){
                    variable.setValor([...nuevoValor]);
                } else {
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "La variable " + this.ID + " es una matriz y no se le puede asignar una matriz de diferente dimension", this.Linea, this.Column);
                }

            }

        } else if(this.modificador === "AUMENTO" || this.modificador === "DECREMENTO"){

            if(variable.getTipoEstruct() === "Array" || variable.getTipoEstruct() === "Matriz"){
                variable.setValor(null);
                variable.setTipo(new Tipo(DatoNativo.VOID));
                return new Errores("Semantico", "La variable " + this.ID + " es un arreglo o matriz y no se puede aumentar o decrementar", this.Linea, this.Columna);
            }

            let nuevoValor = this.expresion.Interpretar(arbol, tabla);
            if(nuevoValor instanceof Errores) return nuevoValor;
            if(nuevoValor === null) return null;

            let valorActual = variable.getValor();
            let tipo1 = variable.getTipo().getTipo();
            let tipo2 = this.expresion.Tipo.getTipo();

            switch (this.modificador) {
                case "AUMENTO":
                    switch (tipo1) {
                        case "ENTERO":
                            if(tipo2 === "ENTERO"){
                                variable.setValor(parseInt(valorActual,10) + parseInt(nuevoValor,10));
                                break;
                            } else {
                                variable.setValor(null);
                                variable.setTipo(new Tipo(DatoNativo.VOID));
                                return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y el valor asignado es de tipo " + tipo2, this.Linea, this.Columna);
                            }
                        case "DECIMAL":
                            if(tipo2 === "ENTERO"){
                                variable.setValor(parseFloat(valorActual).toFixed(1) + parseInt(nuevoValor,10));
                                break;
                            } else if(tipo2 === "DECIMAL"){
                                variable.setValor(parseFloat(valorActual).toFixed(1) + parseFloat(nuevoValor));
                                break;
                            } else {
                                variable.setValor(null);
                                variable.setTipo(new Tipo(DatoNativo.VOID));
                                return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y el valor asignado es de tipo " + tipo2, this.Linea, this.Columna);
                            }
                        case "CADENA":
                            if(tipo2 === "CADENA"){
                                variable.setValor(valorActual + nuevoValor);
                                break;
                            } else {
                                variable.setValor(null);
                                variable.setTipo(new Tipo(DatoNativo.VOID));
                                return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y el valor asignado es de tipo " + tipo2, this.Linea, this.Columna);
                            }
                        default:
                            variable.setValor(null);
                            variable.setTipo(new Tipo(DatoNativo.VOID));
                            return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y no se puede aumentar", this.Linea, this.Columna);
                    }
                break;
                case "DECREMENTO":
                    switch (tipo1) {
                        case "ENTERO":
                            if(tipo2 === "ENTERO"){
                                variable.setValor(parseInt(valorActual,10) - parseInt(nuevoValor,10));
                                break;
                            } else {
                                variable.setValor(null);
                                variable.setTipo(new Tipo(DatoNativo.VOID));
                                return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y el valor asignado es de tipo " + tipo2, this.Linea, this.Columna);
                            }
                        case "DECIMAL":
                            if(tipo2 === "ENTERO"){
                                variable.setValor(parseFloat(valorActual).toFixed(1) - parseInt(nuevoValor,10));
                                break;
                            } else if(tipo2 === "DECIMAL"){
                                variable.setValor(parseFloat(valorActual).toFixed(1) - parseFloat(nuevoValor));
                                break;
                            } else {
                                variable.setValor(null);
                                variable.setTipo(new Tipo(DatoNativo.VOID));
                                return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y el valor asignado es de tipo " + tipo2, this.Linea, this.Columna);
                            }
                        default:
                            variable.setValor(null);
                            variable.setTipo(new Tipo(DatoNativo.VOID));
                            return new Errores("Semantico", "La variable es de tipo " + tipo1 + " y no se puede aumentar", this.Linea, this.Columna);
                    }
                break;
                default:
                    variable.setValor(null);
                    variable.setTipo(new Tipo(DatoNativo.VOID));
                    return new Errores("Semantico", "El modificador " + this.modificador + " no es valido", this.Linea, this.Columna);
            }

        } else if (this.modificador === "AUMENTO_FOR" || this.modificador === "DECREMENTO_FOR"){

            let valorActual = variable.getValor();
            if(variable.getTipo().getTipo() === "ENTERO"){
                switch (this.modificador) {
                    case "AUMENTO_FOR":
                        variable.setValor(parseInt(valorActual,10) + 1);
                        break;
                    case "DECREMENTO_FOR":
                        variable.setValor(parseInt(valorActual,10) - 1);
                        break;
                    default:
                        variable.setValor(null);
                        variable.setTipo(new Tipo(DatoNativo.VOID));
                        return new Errores("Semantico", "El modificador " + this.modificador + " no es valido", this.Linea, this.Columna);
                }
            } else if(variable.getTipo().getTipo() === "DECIMAL"){
                switch (this.modificador) {
                    case "AUMENTO_FOR":
                        variable.setValor((parseFloat(valorActual) + 1.0).toFixed(1));
                        break;
                    case "DECREMENTO_FOR":
                        variable.setValor((parseFloat(valorActual) - 1.0).toFixed(1));
                        break;
                    default:
                        variable.setValor(null);
                        variable.setTipo(new Tipo(DatoNativo.VOID));
                        return new Errores("Semantico", "El modificador " + this.modificador + " no es valido", this.Linea, this.Columna);
                }
            } else {
                variable.setValor(null);
                variable.setTipo(new Tipo(DatoNativo.VOID));
                return new Errores("Semantico", "La variable es de tipo " + variable.getTipo().getTipo() + " y no se puede aumentar o decrementar", this.Linea, this.Columna);
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

    obtenerDimensiones(array){
        let dimensiones = [];
        let aux = array;

        while(Array.isArray(aux)){
            dimensiones.push(aux.length);
            aux = aux[0];
        }

        return dimensiones;
    }

}


export default Instr_ModificacionVar;