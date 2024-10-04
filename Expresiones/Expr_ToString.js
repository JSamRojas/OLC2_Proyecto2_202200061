import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_ToString extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla) {
            
            let valor = this.expresion.Interpretar(arbol, tabla);
    
            if(valor instanceof Errores) return valor;
    
            if(valor === null) return null;
    
            if(this.esMatriz(valor) || Array.isArray(valor)){
                return new Errores("Semantico", "La funcion toString no aplica en arrays o matrices", this.Linea, this.Columna);
            }

            switch (this.expresion.Tipo.getTipo()) {
                case "ENTERO":
                    return valor.toString();
                case "DECIMAL":
                    return valor.toString();
                case "BOOLEANO":
                    return valor.toString();
                default:
                    return new Errores("Semantico", "La funcion toString solo acepta valores numericos o booleanos", this.Linea, this.Columna);
            }
    
    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }
    
}

export default Expr_ToString;