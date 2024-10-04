import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";

class Instr_ModificacionArray extends Instruccion {
    constructor(ID, posicion, expresion, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
        this.posicion = posicion;
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla) {

        let new_Posiciones = [];

        let simbolo = tabla.getVariable(this.ID);

        if(simbolo === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(this.expresion === null){
            simbolo.setValor(null);
            return new Errores("Semantico", "La expresion que se asignara no debe ser de tipo null", this.Linea, this.Columna);
        }

        if(simbolo.getTipoEstruct() === "Variable"){
            simbolo.setValor(null);
            return new Errores("Semantico", "La variable " + this.ID + " no es un array o matriz", this.Linea, this.Columna);
        }

        for(let element of this.posicion){

            let pos = element.Interpretar(arbol, tabla);

            if(pos instanceof Errores) return pos;

            if(element.Tipo.getTipo() !== "ENTERO"){
                simbolo.setValor(null);
                return new Errores("Semantico", "La posicion de acceso debe ser de tipo entero", this.Linea, this.Columna);
            }

            if(pos < 0){
                simbolo.setValor(null);
                return new Errores("Semantico", "La posicion de acceso no puede ser negativa", this.Linea, this.Columna);
            }

            new_Posiciones.push(pos);
        }

        let newValor = this.expresion.Interpretar(arbol, tabla);

        if(newValor instanceof Errores){
            simbolo.setValor(null);
            return newValor;
        }

        if(simbolo.getTipo().getTipo() !== this.expresion.Tipo.getTipo()){
            simbolo.setValor(null);
            return new Errores("Semantico", "El tipo de dato no coincide con el tipo del arreglo", this.Linea, this.Columna);
        }

        if(new_Posiciones.length === 1){

            if(new_Posiciones[0] >= simbolo.getValor().length){
                simbolo.setValor(null);
                return new Errores("Semantico", "La posicion " + new_Posiciones[0] + " se sale de los limites del arreglo", this.Linea, this.Columna);
            }

            if(simbolo.getTipoEstruct() === "Array"){

                if(Array.isArray(newValor)){
                    simbolo.setValor(null);
                    return new Errores("Semantico", "No se le puede asignar un array a una posicion de otro array", this.Linea, this.Columna);
                }

                if(this.esMatriz(newValor)){
                    simbolo.setValor(null);
                    return new Errores("Semantico", "No se le puede asignar una matriz a un array", this.Linea, this.Columna);
                }

                simbolo.getValor()[new_Posiciones[0]] = newValor;

            } else if(simbolo.getTipoEstruct() === "Matriz"){

                let valor_Reemplazar = simbolo.getValor()[new_Posiciones[0]];
                let tam_reemplazar = this.obtenerDimensiones(valor_Reemplazar);
                let tam_nuevo = this.obtenerDimensiones(newValor);

                if(tam_reemplazar.toString() === tam_nuevo.toString()){
                    simbolo.getValor()[new_Posiciones[0]] = [...newValor];
                } else {
                    simbolo.setValor(null);
                    return new Errores("Semantico", "El tamaño de la matriz no coincide con el tamaño de la matriz a reemplazar", this.Linea, this.Columna);
                }

            }

        } else {

            if(simbolo.getTipoEstruct() === "Array"){
                simbolo.setValor(null);
                return new Errores("Semantico", "No se puede acceder a una posicion de un array con mas de una dimension", this.Linea, this.Columna);
            }

            let creacion = this.verificarPosiciones(simbolo.getValor(), new_Posiciones);

            if(creacion instanceof Errores) return creacion;

            let val_Reemplazar = this.obtenerValor(simbolo.getValor(), new_Posiciones);

            let tam_reemplazar = this.obtenerDimensiones(val_Reemplazar);

            let tam_nuevo = this.obtenerDimensiones(newValor);

            if(tam_reemplazar.toString() === tam_nuevo.toString()){
                this.reemplazarEnMatriz(simbolo.getValor(), new_Posiciones, newValor);
            }

        }

        return null;

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

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }

    obtenerValor(matriz, posiciones){
        let aux = matriz;

        for(let i = 0; i < posiciones.length; i++){
            aux = aux[posiciones[i]];
        }

        return aux;
    }

    reemplazarEnMatriz(matriz, posiciones, nuevoValor) {
        let actual = matriz;
   
        for (let i = 0; i < posiciones.length - 1; i++) {
          actual = actual[posiciones[i]];
        }

        if(Array.isArray(nuevoValor)){
            actual[posiciones[posiciones.length - 1]] = [...nuevoValor];
        } else {
            actual[posiciones[posiciones.length - 1]] = nuevoValor;
        }
        
    }

    verificarPosiciones(matriz, posiciones){

        const dimensiones = this.obtenerDimensiones(matriz);

        if(dimensiones.length !== posiciones.length){
            return new Errores("Semantico", "La cantidad de dimensiones no coincide con la cantidad de posiciones", this.Linea, this.Columna);
        }

        for(let i = 0; i < posiciones.length; i++){
            if(posiciones[i] >= dimensiones[i]){
                return new Errores("Semantico", "La posicion " + posiciones[i] + " excede el tamaño de la dimension " + i, this.Linea, this.Columna);
            }
        }

        return true;
    }

}

export default Instr_ModificacionArray;