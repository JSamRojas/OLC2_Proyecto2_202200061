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

class Instr_For extends Instruccion {
    constructor(asignacion, condicion, actualizacion, InstruccionesFor, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.asignacion = asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.InstruccionesFor = InstruccionesFor;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA SENTENCIA FOR
    Interpretar(arbol, tabla){

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- FOR");

        let Var_asignacion = this.asignacion.Interpretar(arbol, newTabla);
        if(Var_asignacion instanceof Errores) return Var_asignacion;

        let Var_condicion = this.condicion.Interpretar(arbol, newTabla);

        if(Var_condicion === null) return null;
        if(Var_condicion instanceof Errores) return Var_condicion;

        if(this.condicion.Tipo.getTipo() !== "BOOLEANO"){
            return new Errores("Semantico", "La condicion del for debe ser de tipo booleano, no de tipo " + this.condicion.Tipo.getTipo(), this.Linea, this.Columna);
        }

        while(this.condicion.Interpretar(arbol, newTabla)){

            let newTabla2 = new TablaSimbolos(newTabla);
            newTabla2.setNombre(newTabla.getNombre() + "- FOR");

            for (let element of this.InstruccionesFor) {
                
                if(element instanceof Instr_DeclaracionVar) element.setEntorno(newTabla2.getNombre());
                
                if(element === null) return null;

                if(element instanceof Instr_Break) return null;

                if(element instanceof Instr_Continue) break;

                if(element instanceof Expr_Return) {
                    element.setTablaEntorno(newTabla2);
                    return element;
                }

                let resultado = element.Interpretar(arbol, newTabla2);

                if(resultado instanceof Errores) return resultado;

                if(resultado instanceof Instr_Break) return null;

                if(resultado instanceof Instr_Continue) break;

                if(resultado instanceof Expr_Return) return resultado;

            }

            let Var_actualizacion = this.actualizacion.Interpretar(arbol, newTabla);
            if(Var_actualizacion instanceof Errores) return Var_actualizacion;

        }

        return null;

    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LA SENTENCIA FOR A RISCV
    /**
     * @param {TablaSimbolos} tabla 
     * @param {RiscVGenerator} gen 
     */ 
    Traducir(arbol, tabla, gen){
        gen.addComment("Inicio de la sentencia For");

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- FOR");

        gen.addComment("Inicio de nuevo Bloque");
        gen.newScope();

        let Var_asignacion = this.asignacion.Traducir(arbol, newTabla, gen);
        if(Var_asignacion instanceof Errores){
            this.ReduceScope(gen);
            return Var_asignacion;
        }

        let Var_condicion = this.condicion.Traducir(arbol, newTabla, gen);

        if(Var_condicion === null){
            this.ReduceScope(gen);
            return null;
        }

        if(Var_condicion instanceof Errores){
            this.ReduceScope(gen);
            return Var_condicion
        }

        let TypeCondicion = gen.getTopObject().tipo;
        gen.popObject(r.T3);

        if(TypeCondicion !== DatoNativo.BOOLEANO){
            return new Errores("Semantico", "La condicion del for debe ser de tipo booleano, no de tipo " + TypeCondicion, this.Linea, this.Columna);
        }

        const StartFor = gen.getLabel();
        const EndFor = gen.getLabel();
        const prevBreakLabel = gen.LabelBreak;
        gen.LabelBreak = EndFor;

        const IncrementFor = gen.getLabel();
        const prevContinueLabel = gen.LabelContinue;
        gen.LabelContinue = IncrementFor;

        gen.addLabel(StartFor);
        gen.addComment("Condicion del For");
        Var_condicion = this.condicion.Traducir(arbol, newTabla, gen);
        gen.popObject(r.T0);
        gen.addComment("Fin de la condicion del For");
        gen.beq(r.T0, r.ZERO, EndFor);
        gen.addComment("Inicio de el cuerpo del For");
        gen.newScope();

        for(let i of this.InstruccionesFor){

            // gen.newScope();

            if(i instanceof Instr_DeclaracionVar) i.setEntorno(newTabla.getNombre());

            if(i === null){
                gen.addLabel(EndFor);
                this.ReduceScope(gen);
                this.ReduceScope(gen);
                return null;
            }

            if(i instanceof Instr_Break){
                gen.jump(gen.LabelBreak);
            }

            if(i instanceof Instr_Continue){
                gen.jump(gen.LabelContinue);
            }

            let resultado = i.Traducir(arbol, newTabla, gen);

            if(resultado instanceof Errores){
                gen.addLabel(EndFor);
                this.ReduceScope(gen);
                this.ReduceScope(gen);
                return resultado;
            }

            if(resultado instanceof Instr_Break){
                gen.jump(gen.LabelBreak);
            }

            if(resultado instanceof Instr_Continue){
                gen.jump(gen.LabelContinue);
            }

        }
        
        gen.addLabel(IncrementFor);
        let Var_actualizacion = this.actualizacion.Traducir(arbol, newTabla, gen);
        if(Var_actualizacion instanceof Errores){
            gen.addLabel(EndFor);
            this.ReduceScope(gen);
            this.ReduceScope(gen);
            return Var_actualizacion;
        }
        
        this.ReduceScope(gen);
        gen.jump(StartFor);
        gen.addLabel(EndFor);
        this.ReduceScope(gen);
        gen.addComment("Fin de la sentencia For");

        gen.LabelBreak = prevBreakLabel;
        gen.LabelContinue = prevContinueLabel;

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

export default Instr_For;