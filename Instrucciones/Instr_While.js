import Instruccion from "../Abstracto/Instruccion.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";
import Tipo from "../Simbolo/Tipo.js";
import Instr_Break from "./Instr_Break.js";
import Instr_Continue from "./Instr_Continue.js";
import Expr_Return from "../Expresiones/Expr_Return.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Instr_While extends Instruccion {
    constructor(condicion, InstruccionesWhile, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.InstruccionesWhile = InstruccionesWhile;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA SENTENCIA WHILE
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

    // METODO UTILIZADO EN EL PROYECTO 2 PARA TRADUCIR EL WHILE A RISCV
    /**
     * @param {TablaSimbolos} tabla 
     * @param {RiscVGenerator} gen 
    */ 
    Traducir(arbol, tabla, gen){
        gen.addComment("Inicio de la instruccion while");
        let condTraducida = this.condicion.Traducir(arbol, tabla, gen);

        if(condTraducida === null){
            return null;
        }

        if(condTraducida instanceof Errores){
            return condTraducida;
        }

        let typeCondicion = gen.getTopObject().tipo;
        gen.popObject(r.T3);

        if(typeCondicion !== DatoNativo.BOOLEANO){
            return new Errores("Semantico", "La condicion del while debe ser de tipo booleano, no de tipo " + typeCondicion, this.Linea, this.Columna);
        }

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- WHILE");

        gen.addComment("Inicio de nuevo bloque");
        gen.newScope();

        const Startwhile = gen.getLabel();
        const Endwhile = gen.getLabel();

        gen.addLabel(Startwhile);
        gen.addComment("Condicion del while");
        condTraducida = this.condicion.Traducir(arbol, tabla, gen);
        gen.popObject(r.T0);
        gen.addComment("Termina la condicion");
        gen.beq(r.T0, r.ZERO, Endwhile);
        gen.addComment("Inicia el cuerpo del while");
        gen.newScope();

        for(let i of this.InstruccionesWhile){

            // gen.newScope();

            if(i instanceof Instr_DeclaracionVar) i.setEntorno(newTabla.getNombre());

            if(i === null){
                gen.addLabel(Endwhile);
                this.ReduceScope(gen);
                this.ReduceScope(gen);
                return null;
            }

            let resultado = i.Traducir(arbol, newTabla, gen);

            if(resultado instanceof Errores){
                gen.addLabel(Endwhile);
                this.ReduceScope(gen);
                this.ReduceScope(gen);
                return resultado;
            }

        }

        this.ReduceScope(gen);
        gen.jump(Startwhile);
        gen.addLabel(Endwhile);
        this.ReduceScope(gen);
        gen.addComment("Fin de la sentencia de control while");
        return null;

    }

    /**
     * @param {RiscVGenerator} gen 
    */
    ReduceScope(gen){
        gen.addComment("Reduciendo el scope");
        const bytesToRemove = gen.endScope();

        if(bytesToRemove > 0){
            gen.addi(r.SP, r.SP, bytesToRemove);
        }

        return;
    }

}

export default Instr_While;