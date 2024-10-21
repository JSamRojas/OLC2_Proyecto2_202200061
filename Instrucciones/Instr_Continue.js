import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";
import Tipo from "../Simbolo/Tipo.js";

class Instr_Continue extends Instruccion {
    constructor(Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
    }

    Interpretar(arbol, tabla){
        return null;
    }

    Traducir(arbol, tabla, gen){
        gen.addComment("Continue");
        return 1;
    }
}

export default Instr_Continue;