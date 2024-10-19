import Instruccion from "../Abstracto/Instruccion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Instr_Sout extends Instruccion {
    constructor(expresion, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla){
        let consola = "";

        for(let element of this.expresion){
            let resultado = element.Interpretar(arbol, tabla);
            if (resultado instanceof Errores) return resultado;
            if(typeof resultado === 'string'){
                resultado = resultado.replace(/\\n/g, "\n");
            }
            consola += resultado + " ";
        }
        arbol.Print(consola);
        return null;
    }

    /**
     * @param { RiscVGenerator } gen 
     */

    Traducir(arbol, tabla, gen){
        gen.addComment("Inicio del print");
        for(let element of this.expresion){
            let resultado = element.Traducir(arbol, tabla, gen);
            if (resultado instanceof Errores) {
                gen.popObject(r.T0);
                return resultado;
            }
            
            const isFloat = gen.getTopObject().tipo === DatoNativo.DECIMAL;
            const object = gen.popObject(isFloat ? fr.FA0 : r.A0);

            const TypePrint = {
                "ENTERO": () => gen.print_INT(),
                "DECIMAL": () => gen.printFloat(),
                "CADENA": () => gen.print_STRING(),
                "CARACTER": () => gen.print_CHAR(),
                "BOOLEANO": () => gen.callFunction("Print_BOOLEAN"),
                "VOID": () => gen.print_STRING(),
            }

            TypePrint[object.tipo]();

        }

        gen.addComment("Salto de linea");
        gen.la(r.A0, "salto");
        gen.li(r.A7, 4);
        gen.sysCall();
        gen.addComment("Fin salto de linea");
        gen.addComment("Fin del print");

    }

}

export default Instr_Sout;