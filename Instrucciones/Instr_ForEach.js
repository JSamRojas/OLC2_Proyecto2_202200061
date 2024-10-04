import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import Errores from "../Simbolo/Errores.js";
import Instr_DeclaracionVar from "./Instr_DeclaracionVar.js";
import Tipo from "../Simbolo/Tipo.js";
import Instr_Break from "./Instr_Break.js";
import Instr_Continue from "./Instr_Continue.js";
import Expr_Return from "../Expresiones/Expr_Return.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Instr_ForEach extends Instruccion {
    constructor(IDvar, IDarray, typeVar, InstruccionesForEach, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.IDvar = IDvar;
        this.IDarray = IDarray;
        this.typeVar = typeVar;
        this.InstruccionesForEach = InstruccionesForEach;
    }

    Interpretar(arbol, tabla){

        let newTabla = new TablaSimbolos(tabla);
        newTabla.setNombre(tabla.getNombre() + "- FOR EACH");

        let Array_asignacion = newTabla.getVariable(this.IDarray);

        if(Array_asignacion === null){
            return new Errores("Semantico", "No existe la variable " + this.IDarray, this.Linea, this.Columna);
        }
        
        if(Array_asignacion.TipoEstruct !== "Array"){
            return new Errores("Semantico", "La variable " + this.IDarray + " no es un array", this.Linea, this.Columna);
        }

        if(this.typeVar.getTipo() !== Array_asignacion.getTipo().getTipo()){
            return new Errores("Semantico", "El tipo de la variable " + this.IDvar + " no coincide con el tipo del array", this.Linea, this.Columna);
        }

        let newSimbolo = new Simbolos(this.IDvar, this.typeVar, Array_asignacion.getValor()[0], "Variable", this.Linea, this.Columna);

        newSimbolo.setMutabilidad(false);

        newSimbolo.setEntorno(newTabla.getNombre());

        let creacion = tabla.setVariable(newSimbolo);
        
        if(!creacion){
            return new Errores("Semantico", "La variable " + this.ID + " ya existe", this.Linea, this.Columna);
        }

        ListaSimbolos.push(newSimbolo);
        
        for (let index = 0; index < Array_asignacion.getValor().length; index++) {

            let newTabla2 = new TablaSimbolos(newTabla);
            newTabla2.setNombre(newTabla.getNombre() + "- FOR EACH");

            for(let inst of this.InstruccionesForEach){

                if(inst instanceof Instr_DeclaracionVar) inst.setEntorno(newTabla2.getNombre());
    
                if(inst === null) return null;
    
                if(inst instanceof Instr_Break) return null;

                if(inst instanceof Instr_Continue) break;

                if(inst instanceof Expr_Return) {
                    inst.setTablaEntorno(newTabla2);
                    return inst;
                }
    
                let resultado = inst.Interpretar(arbol, newTabla2);
    
                if(resultado instanceof Errores) return resultado;
    
                if(resultado instanceof Instr_Break) return null;

                if(resultado instanceof Instr_Continue) break;

                if(resultado instanceof Expr_Return) return resultado;

            }

            if(index < Array_asignacion.getValor().length - 1){
                let actualizar = newTabla.getVariable(this.IDvar);
                actualizar.setValor(Array_asignacion.getValor()[index + 1]);
            }
            
        }

        return null;

    }

}

export default Instr_ForEach;