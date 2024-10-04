import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";
import Tipo from "../Simbolo/Tipo.js";
import Instr_Break from "./Instr_Break.js";
import Instr_Continue from "./Instr_Continue.js";
import Expr_Return from "../Expresiones/Expr_Return.js";

class Instr_While extends Instruccion {
    constructor(condicion, InstruccionesWhile, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.InstruccionesWhile = InstruccionesWhile;
    }

    Interpretar(arbol, tabla){

        var cond = this.condicion.Interpretar(arbol, tabla);

        if(cond === null) return null;
        if(cond instanceof Errores) return cond;

        if(this.condicion.Tipo.getTipo() !== "BOOLEANO"){
            return new Errores("Semantico", "La condicion del while debe ser de tipo booleano, no de tipo " + this.condicion.Tipo.getTipo(), this.Linea, this.Columna);
        }

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- WHILE");

        while(this.condicion.Interpretar(arbol, tabla)){

            let newTabla2 = new TablaSimbolos(newTabla);
            newTabla2.setNombre(newTabla.getNombre() + "- WHILE");

            for(let i of this.InstruccionesWhile){

                if(i instanceof Instr_DeclaracionVar) i.setEntorno(newTabla2.getNombre());

                if(i === null) return null;

                if(i instanceof Instr_Break) return null;

                if(i instanceof Instr_Continue) break;

                if(i instanceof Expr_Return) {
                    i.setTablaEntorno(newTabla2);
                    return i;
                }

                let resultado = i.Interpretar(arbol, newTabla2);

                if(resultado instanceof Errores) return resultado;

                if(resultado instanceof Instr_Break) return null;

                if(resultado instanceof Instr_Continue) break;

                if(resultado instanceof Expr_Return) return resultado;

            }

        }

        return null;

    }

}

export default Instr_While;