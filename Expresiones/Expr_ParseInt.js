import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_ParseInt extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.ENTERO), Linea, Columna);
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla) {

        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        if(this.esMatriz(valor) || Array.isArray(valor)){
            return new Errores("Semantico", "La funcion parseInt no aplica en arrays o matrices", this.Linea, this.Columna);
        }

        if(this.expresion.Tipo.getTipo() !== "CADENA"){
            return new Errores("Semantico", "La funcion parseInt solo acepta cadenas", this.Linea, this.Columna);
        }

        if(/^\d+(\.\d+)?$/.test(valor)){
            return parseInt(valor,10);
        } else {
            return new Errores("Semantico", "La cadena no es un numero", this.Linea, this.Columna);
        }

    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }

}

export default Expr_ParseInt;