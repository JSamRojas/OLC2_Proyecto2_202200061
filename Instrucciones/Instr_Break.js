import Instruccion from "../Abstracto/Instruccion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Tipo from "../Simbolo/Tipo.js";

class Instr_Break extends Instruccion {
    constructor(Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
    }

    Interpretar(arbol, tabla){
        return null;
    }

    Traducir(arbol, tabla, gen){
        gen.addComment("Break");
        return 1;
    }

}

export default Instr_Break;