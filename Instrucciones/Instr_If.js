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

class Instr_If extends Instruccion {
    constructor(condicion, InstruccionesIF, InstruccionesELSE, NextIF, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.InstruccionesIF = InstruccionesIF;
        this.InstruccionesELSE = InstruccionesELSE;
        this.NextIF = NextIF;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA SENTENCIA IF-ELSE-ELSEIF
    Interpretar(arbol, tabla){
        var cond = this.condicion.Interpretar(arbol, tabla);
        if(cond === null) return null;
        if(cond instanceof Errores) return cond;

        if(this.condicion.Tipo.getTipo() !== "BOOLEANO"){
            return new Errores("Semantico", "La condicion del if debe ser de tipo booleano, no de tipo " + this.condicion.Tipo.getTipo(), this.Linea, this.Columna);
        }

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- IF");

        if(cond){
            for(let element of this.InstruccionesIF){

                if(element instanceof Instr_DeclaracionVar) element.setEntorno(newTabla.getNombre());
                
                if(element === null) return null;

                if(element instanceof Instr_Break) return element;

                if(element instanceof Instr_Continue) return element;

                if(element instanceof Expr_Return) {
                    element.setTablaEntorno(newTabla);
                    return element;
                }

                let resultado = element.Interpretar(arbol, newTabla);

                if(resultado instanceof Errores) return resultado;

                if(resultado instanceof Instr_Break) return resultado;

                if(resultado instanceof Instr_Continue) return resultado;

                if(resultado instanceof Expr_Return) return resultado;

            }
        } else { 
            if(this.InstruccionesELSE !== null){

                for(let element of this.InstruccionesELSE){

                    if(element instanceof Instr_DeclaracionVar) element.setEntorno(newTabla.getNombre());

                    if(element === null) return null;

                    if(element instanceof Instr_Break) return element;

                    if(element instanceof Instr_Continue) return element;

                    if(element instanceof Expr_Return){
                        element.setTablaEntorno(newTabla);
                        return element;
                    }

                    let resultado = element.Interpretar(arbol, newTabla);

                    if(resultado instanceof Errores) return resultado;

                    if(resultado instanceof Instr_Break) return resultado;

                    if(resultado instanceof Instr_Continue) return resultado;

                    if(resultado instanceof Expr_Return) return resultado;
                }

            } else {
                if(this.NextIF !== null){

                    let resultado = this.NextIF.Interpretar(arbol, newTabla);

                    if(resultado instanceof Errores) return resultado;

                    if(resultado instanceof Instr_Break) return resultado;

                    if(resultado instanceof Instr_Continue) return resultado;

                    if(resultado instanceof Expr_Return) return resultado;

                }
            }
        }

        return null;

    }

    // METODO USADO EN EL PROYECTO 2 PARA GENERAR EL CODIGO RISC-V DE LA SENTENCIA IF-ELSE-ELSEIF

    /**
     * @param {RiscVGenerator} gen 
    */
    Traducir(arbol, tabla, gen){

        gen.addComment("Inicio de la sentencia de control IF");
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
            return new Errores("Semantico", "La condicion del if debe ser de tipo booleano, no de tipo " + typeCondicion, this.Linea, this.Columna);
        }

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- IF");

        gen.addComment("Inicio del bloque de instrucciones");
        gen.newScope();

        const elseLabel = gen.getLabel();
        const endIfLabel = gen.getLabel();

        gen.beq(r.T3, r.ZERO, elseLabel);
        gen.addComment("Condicion verdadera");
        for(let element of this.InstruccionesIF){

            if(element instanceof Instr_DeclaracionVar) element.setEntorno(newTabla.getNombre());

            if(element === null) {
                gen.addLabel(elseLabel);
                gen.addLabel(endIfLabel);
                this.ReduceScope(gen);
                return null;
            }

            if(element instanceof Instr_Break) {
                //this.ReduceScope(gen);
                gen.jump(gen.LabelBreak);
            }

            if(element instanceof Instr_Continue) {
                //this.ReduceScope(gen);
                gen.jump(gen.LabelContinue);
            }

            let resultado = element.Traducir(arbol, newTabla, gen);

            if(resultado instanceof Errores){
                gen.addLabel(elseLabel);
                gen.addLabel(endIfLabel);
                this.ReduceScope(gen);
                return resultado;
            }

            if(resultado instanceof Instr_Break) {
                //this.ReduceScope(gen);
                gen.jump(gen.LabelBreak);
            }

            if(resultado instanceof Instr_Continue) {
                //this.ReduceScope(gen);
                gen.jump(gen.LabelContinue);
            }

        }
        gen.jump(endIfLabel);
        gen.addLabel(elseLabel);
        gen.addComment("Condicion falsa");
        if(this.InstruccionesELSE !== null){

            for(let element of this.InstruccionesELSE){

                if(element instanceof Instr_DeclaracionVar) element.setEntorno(newTabla.getNombre());
    
                if(element === null) {
                    gen.addLabel(endIfLabel);
                    this.ReduceScope(gen);
                    return null;
                }

                if(element instanceof Instr_Break) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelBreak);
                }

                if(element instanceof Instr_Continue) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelContinue);
                }
    
                let resultado = element.Traducir(arbol, newTabla, gen);
    
                if(resultado instanceof Errores){
                    gen.addLabel(endIfLabel);
                    this.ReduceScope(gen);
                    return resultado;
                }

                if(resultado instanceof Instr_Break) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelBreak);
                }

                if(resultado instanceof Instr_Continue) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelContinue);
                }
    
            }

        } else {
            if(this.NextIF !== null){

                let resultado = this.NextIF.Traducir(arbol, newTabla, gen);

                if(resultado instanceof Errores){
                    gen.addLabel(endIfLabel);
                    this.ReduceScope(gen);
                    return resultado;
                }

                if(resultado instanceof Instr_Break) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelBreak);
                }

                if(resultado instanceof Instr_Continue) {
                    //this.ReduceScope(gen);
                    gen.jump(gen.LabelContinue);
                }

            }
        }
        gen.addLabel(endIfLabel);
        this.ReduceScope(gen);
        gen.addComment("Fin de la sentencia de control IF");
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

export default Instr_If;