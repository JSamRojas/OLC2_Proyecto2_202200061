import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_ToLowerCase extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla) {
                
        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        if(this.esMatriz(valor) || Array.isArray(valor)){
            return new Errores("Semantico", "La funcion toLowerCase no aplica en arrays o matrices", this.Linea, this.Columna);
        }

        if(this.expresion.Tipo.getTipo() !== "CADENA"){
            return new Errores("Semantico", "La funcion toLowerCase solo acepta cadenas", this.Linea, this.Columna);
        }

        return valor.toLowerCase();
    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }

}

export default Expr_ToLowerCase;