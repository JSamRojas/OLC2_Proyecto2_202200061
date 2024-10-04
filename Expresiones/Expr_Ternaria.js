import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_Ternaria extends Expresion {
    constructor(condicion, expresionT, expresionF, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.expresionT = expresionT;
        this.expresionF = expresionF;
    }

    Interpretar(arbol, tabla){
        let cond = this.condicion.Interpretar(arbol, tabla);
        if(cond === null) return null;
        if(cond instanceof Errores) return cond;

        if(this.condicion.Tipo.getTipo() !== "BOOLEANO"){
            return new Errores("Semantico", "La condicion de la expresion ternaria debe ser de tipo booleano, no de tipo " + this.condicion.Tipo.getTipo(), this.Linea, this.Columna);
        }

        let valorT = this.expresionT.Interpretar(arbol, tabla);
        let valorF = this.expresionF.Interpretar(arbol, tabla);

        if(valorT === null || valorF === null) return null;
        if(valorT instanceof Errores) return valorT;
        if(valorF instanceof Errores) return valorF;

        if(cond){
            this.Tipo.setTipo(this.expresionT.Tipo.getTipo());
            return valorT;
        } else {
            this.Tipo.setTipo(this.expresionF.Tipo.getTipo());
            return valorF;
        }

    }

}

export default Expr_Ternaria;