import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";

class Casos_switch extends Instruccion {
    constructor(expresion, InstrCaso, EsCaso, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.expresion = expresion;
        this.InstrCaso = InstrCaso;
        this.EsCaso = EsCaso;
    }

    Interpretar(arbol, tabla){
        let Caso = this.expresion.Interpretar(arbol, tabla);

        if(Caso === null) return null;

        if(Caso instanceof Errores) return Caso;

        this.Tipo.setTipo(this.expresion.Tipo.getTipo());

        return Caso;

    }

}

export default Casos_switch;