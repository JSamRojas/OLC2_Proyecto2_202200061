import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_Join extends Expresion {
    constructor(ID, Linea, Columna) {
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.ID = ID;
    }

    Interpretar(arbol, tabla){

        let variable = tabla.getVariable(this.ID);

        if(variable === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(variable.getTipo().getTipo() === "VOID"){
            return new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
        }

        if(variable.getTipoEstruct() !== "Array"){
            return new Errores("Semantico", "La variable " + this.ID + " no es un array", this.Linea, this.Columna);
        }

        let valor = variable.getValor();

        return valor.toString();

    }

}

export default Expr_Join;