import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Expr_AccesoVar from "./Expr_AccesoVar.js";

class Expr_TypeOf extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla) {
                
        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        switch (this.expresion.Tipo.getTipo()) {
            case "ENTERO":
                return "int";
            case "DECIMAL":
                return "float";
            case "BOOLEANO":
                return "boolean";
            case "CADENA":
                return "string";
            case "CARACTER":
                return "char";
            case "STRUCT":
                if(this.expresion instanceof Expr_AccesoVar){
                    let simbolo = tabla.getVariable(this.expresion.ID);
                    return simbolo.getTipoEstruct();
                }
            default:
                return new Errores("Semantico", "No se puede obtener el tipo de la expresion", this.Linea, this.Columna);
        }
        
    }

}

export default Expr_TypeOf;