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
import Simbolos from "../Simbolo/Simbolos.js";

class Instr_If extends Instruccion {
    constructor(condicion, InstruccionesIF, InstruccionesELSE, NextIF, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.InstruccionesIF = InstruccionesIF;
        this.InstruccionesELSE = InstruccionesELSE;
        this.NextIF = NextIF;
    }

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
}

export default Instr_If;