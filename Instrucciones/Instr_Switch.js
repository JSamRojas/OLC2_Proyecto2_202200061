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

class Instr_Switch extends Instruccion {
    constructor(condicion, Casos, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.Casos = Casos;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA SENTENCIA SWITCH
    Interpretar(arbol, tabla) {

        let valorCond = this.condicion.Interpretar(arbol, tabla);
        let Condicion_cumplida = false;

        if(valorCond === null) return null;

        if(valorCond instanceof Errores) return valorCond;

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- SWITCH");

        for(let element of this.Casos){

            if(element.EsCaso){

                let caso = element.Interpretar(arbol, tabla);

                if(caso instanceof Errores) return caso;

                if(caso === null) return null;

                if(this.condicion.Tipo.getTipo() === element.Tipo.getTipo()){

                    if((caso === valorCond) || (Condicion_cumplida)){
                        
                        if(element.InstrCaso === null) {
                            Condicion_cumplida = true;
                            continue;
                        }

                        for(let inst of element.InstrCaso){

                            if(inst instanceof Errores) return inst;

                            if(inst instanceof Instr_Break) return inst;

                            if(inst instanceof Instr_Continue) return inst;

                            if(inst instanceof Expr_Return) {
                                inst.setTablaEntorno(newTabla);
                                return inst;
                            }

                            if(inst instanceof Instr_DeclaracionVar) inst.setEntorno(newTabla.getNombre());

                            if(inst === null) return null;

                            let resultado = inst.Interpretar(arbol, newTabla);

                            if(resultado instanceof Errores) return resultado;

                            if(resultado instanceof Instr_Break) return resultado;

                            if(resultado instanceof Instr_Continue) return resultado;

                            if(resultado instanceof Expr_Return) return resultado;

                        }

                        Condicion_cumplida = true;

                    }
    
                } else {
                    return new Errores("Semantico", "El tipo de la condicion del caso no coincide con el tipo de la expresion del switch", this.Linea, this.Columna);
                }

            } else {

                if(element.InstrCaso === null) continue;

                for(let inst of element.InstrCaso){

                    if(inst instanceof Errores) return inst;

                    if(inst instanceof Instr_DeclaracionVar) inst.setEntorno(newTabla.getNombre());

                    if(inst instanceof Instr_Break) return inst;

                    if(inst instanceof Instr_Continue) return inst;

                    if(inst instanceof Expr_Return) {
                        inst.setTablaEntorno(newTabla);
                        return inst;
                    }

                    if(inst === null) return null;

                    let resultado = inst.Interpretar(arbol, newTabla);

                    if(resultado instanceof Errores) return resultado;

                    if(resultado instanceof Instr_Break) return resultado;

                    if(resultado instanceof Instr_Continue) return resultado;

                    if(resultado instanceof Expr_Return) return resultado;

                }

            }

        }

        return null;

    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR EL SWITCH A RISCV

    /**
     * @param {TablaSimbolos} tabla 
     * @param {RiscVGenerator} gen 
     */
    Traducir(arbol, tabla, gen){

        gen.addComment("Inicio de la sentencia de control SWITCH");
        let condTraducida = this.condicion.Traducir(arbol, tabla, gen);
        let Condicion_cumplida = false;

        if(condTraducida === null){
            return null;
        }

        if(condTraducida instanceof Errores){
            return condTraducida;
        }

        let TypeCondicion = gen.getTopObject().tipo;
        gen.popObject(TypeCondicion === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- SWITCH");

        gen.newScope();

        const FinalSwitch = gen.getLabel();
        const DefaultSwitch = gen.getLabel();

        gen.li(r.S2, 0);    // S2 -> Bandera de control del switch

        for(let casoswitch of this.Casos){

            // T1 -> Condicion del switch | FT1 -> Condicion del switch
            // T0 -> Caso del switch | FT0 -> Caso del switch
            /*
            
             S2 -> Bandera de control del switch, ayudara para el tema de que los casos no tengan un break
                0 -> No se ha cumplido ninguna de las condiciones, por lo que se sigue evaluando
                1 -> Se cumplio una de las condiciones, por lo que no se sigue evaluando y ejecuta todos los bloques de abajo hasta encontrar un break

            */

            if(casoswitch.EsCaso){

                const SiguienteCaso = gen.getLabel();
                const ThisCase = gen.getLabel();

                let casoTraducido = casoswitch.Traducir(arbol, tabla, gen);

                if(casoTraducido instanceof Errores) return caso;

                if(casoTraducido === null) return null;

                let typeCase = gen.getTopObject().tipo;
                gen.popObject(typeCase === DatoNativo.DECIMAL ? fr.FT0 : r.T0);

                if(TypeCondicion === typeCase){

                    if(TypeCondicion === DatoNativo.DECIMAL){
                        gen.addComment("Comparacion de la condicion del switch con el caso");
                        gen.bne(r.S2, r.ZERO, ThisCase);
                        gen.feq(r.T2, fr.FT1, fr.FT0);
                        gen.beq(r.T2, r.ZERO, SiguienteCaso);
                        gen.addComment("Fin de las comparaciones");
                        gen.addLabel(ThisCase);
                        
                    } else {

                        gen.addComment("Comparacion de la condicion del switch con el caso");
                        gen.bne(r.S2, r.ZERO, ThisCase);
                        gen.bne(r.T1, r.T0, SiguienteCaso);
                        gen.addComment("Fin de las comparaciones");
                        gen.addLabel(ThisCase);

                    }

                    if(casoswitch.InstrCaso === null) {
                        gen.li(r.S2, 1);    // Se cumplio una de las condiciones
                        gen.addLabel(SiguienteCaso);
                        continue;
                    }

                    for(let inst of casoswitch.InstrCaso){

                        if(inst instanceof Errores){
                            gen.addLabel(SiguienteCaso);
                            gen.addLabel(DefaultSwitch);
                            gen.addLabel(FinalSwitch);
                            this.ReduceScope(gen);
                            return inst;
                        }

                        if(inst instanceof Instr_Break){
                            gen.li(r.S2, 1);    // Se cumplio una de las condiciones
                            gen.jump(FinalSwitch);
                        }

                        if(inst instanceof Instr_DeclaracionVar) inst.setEntorno(newTabla.getNombre());

                        if(inst === null){
                            gen.addLabel(SiguienteCaso);
                            gen.addLabel(DefaultSwitch);
                            gen.addLabel(FinalSwitch);
                            this.ReduceScope(gen);
                            return null;
                        }

                        let resultado = inst.Traducir(arbol, newTabla, gen);

                        if(resultado instanceof Errores){
                            gen.addLabel(SiguienteCaso);
                            gen.addLabel(DefaultSwitch);
                            gen.addLabel(FinalSwitch);
                            this.ReduceScope(gen);
                            return resultado;
                        }

                        if(resultado instanceof Instr_Break){
                            gen.li(r.S2, 1);    // Se cumplio una de las condiciones
                            gen.jump(FinalSwitch);
                        }

                    }

                    gen.li(r.S2, 1);    // Se cumplio una de las condiciones
                    gen.addComment("Fin del caso");
                    gen.addLabel(SiguienteCaso);

                } else {
                    gen.addLabel(ThisCase);
                    gen.addLabel(SiguienteCaso);
                    gen.addLabel(DefaultSwitch);
                    gen.addLabel(FinalSwitch);
                    return new Errores("Semantico", "El tipo de la condicion del caso no coincide con el tipo de la expresion del switch", this.Linea, this.Columna);
                }

            } else {

                gen.addComment("Bloque de instrucciones del caso default");
                gen.addLabel(DefaultSwitch);
                if(casoswitch.InstrCaso === null) continue;

                for(let inst of casoswitch.InstrCaso){

                    if(inst instanceof Errores){
                        gen.addLabel(FinalSwitch);
                        this.ReduceScope(gen);
                        return inst;
                    }

                    if(inst instanceof Instr_DeclaracionVar) inst.setEntorno(newTabla.getNombre());

                    if(inst === null){
                        gen.addLabel(FinalSwitch);
                        this.ReduceScope(gen);
                        return null;
                    }

                    if(inst instanceof Instr_Break){
                        gen.jump(FinalSwitch);
                    }

                    let resultado = inst.Traducir(arbol, newTabla, gen);

                    if(resultado instanceof Errores){
                        gen.addLabel(FinalSwitch);
                        this.ReduceScope(gen);
                        return resultado;
                    }

                    if(resultado instanceof Instr_Break){
                        gen.jump(FinalSwitch);
                    }

                }

            }

        }

        gen.addLabel(FinalSwitch);
        this.ReduceScope(gen);
        gen.addComment("Fin de la sentencia de control SWITCH");
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

export default Instr_Switch;