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

class Instr_For extends Instruccion {
    constructor(asignacion, condicion, actualizacion, InstruccionesFor, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.asignacion = asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.InstruccionesFor = InstruccionesFor;
    }

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

}

export default Instr_For;