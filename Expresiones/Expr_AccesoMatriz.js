import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_AccesoMatriz extends Expresion {
    constructor(ID, expresiones, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
        this.expresiones = expresiones;
    }

    Interpretar(arbol, tabla) {

        let simbolo = tabla.getVariable(this.ID);

        if(simbolo === null) return new Errores("Semantico", "No existe la variable " + this.ID, this.Linea, this.Columna);

        if(simbolo.Tipo.getTipo() === "VOID") return new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);

        let posiciones = [];

        for (let element of this.expresiones) {
            
            if(element.Tipo.getTipo() !== "ENTERO"){
                return new Errores("Semantico", "La posicion debe ser de tipo entero", this.Linea, this.Columna);
            }

            let pos = element.Interpretar(arbol, tabla);

            if(pos instanceof Errores) return pos;

            if(pos < 0){
                return new Errores("Semantico", "La posicion " + pos + " no puede ser negativa", this.Linea, this.Columna);
            }

            posiciones.push(pos);

        }

        if(simbolo.getTipoEstruct() !== "Matriz"){
            return new Errores("Semantico", "La variable " + this.ID + " no es una matriz", this.Linea, this.Columna);
        }

        let encontrado = this.verificarPosiciones(simbolo.getValor(), posiciones);

        if(encontrado instanceof Errores) return encontrado;

        let valor_buscado = this.obtenerValor(simbolo.getValor(), posiciones);

        this.Tipo.setTipo(simbolo.getTipo().getTipo());
        return valor_buscado;
        

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

    obtenerValor(matriz, posiciones){
        let aux = matriz;

        for(let i = 0; i < posiciones.length; i++){
            aux = aux[posiciones[i]];
        }

        return aux;
    }

}

export default Expr_AccesoMatriz;