import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_Return extends Expresion {
    constructor(expresion, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.expresion = expresion;
        this.tablaEntorno = null;
    }

    Interpretar(arbol, tabla) {
        if(this.expresion === null){
            return null;
        }

        if(this.tablaEntorno === null){
            this.setTablaEntorno(tabla);
        }

        let valor = this.expresion.Interpretar(arbol, this.tablaEntorno);

        if(valor === null) return null;

        if(valor instanceof Errores) return valor;

        this.Tipo.setTipo(this.expresion.Tipo.getTipo());
        return valor;

    }

    getTablaEntorno() {
        return this.tablaEntorno;
    }

    setTablaEntorno(tabla) {
        this.tablaEntorno = tabla;
    }

}

export default Expr_Return;