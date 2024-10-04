import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Instr_DeclaracionVar extends Instruccion {
    constructor(ID, valor, Tipo, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.ID = ID;
        this.valor = valor;
        this.Entorno = "";
    }

    Interpretar(arbol, tabla){
        let newSimbolo = new Simbolos;

        if(this.valor === null){
            let valorNuevo = null;
            newSimbolo = new Simbolos(this.ID, this.Tipo, valorNuevo, "Variable", this.Linea, this.Columna);

        } else {
            
            let valorInterpretado = this.valor.Interpretar(arbol, tabla);
            if(valorInterpretado instanceof Errores){

                ListaErrores.push(valorInterpretado);
                newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);
                newSimbolo.setTipo(new Tipo(DatoNativo.VOID));

            } 

            if(!(valorInterpretado instanceof Errores)){

                if(this.Tipo.getTipo() === "VOID"){
                    this.Tipo.setTipo(this.valor.Tipo.getTipo());
                }
                
                if(this.valor.Tipo.getTipo() !== this.Tipo.getTipo()){
    
                    if(this.Tipo.getTipo() === "DECIMAL" && this.valor.Tipo.getTipo() === "ENTERO"){
                        valorInterpretado = parseFloat(valorInterpretado).toFixed(1);
                        newSimbolo = new Simbolos(this.ID, this.Tipo, valorInterpretado, "Variable", this.Linea, this.Columna);
                    } else {
                        let error = new Errores("Semantico", "La variable es de tipo " + this.Tipo.getTipo().toString() + " y el valor asignado es de tipo " + this.valor.Tipo.getTipo().toString(), this.Linea, this.Columna);
                        ListaErrores.push(error);
                        newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);
                        newSimbolo.setTipo(new Tipo(DatoNativo.VOID));
                    }
    
                } else {
                    newSimbolo = new Simbolos(this.ID, this.Tipo, valorInterpretado, "Variable", this.Linea, this.Columna);
                }
                
            }
            
        }

        if(this.Entorno === ""){
            this.setEntorno("GLOBAL");
        }
        newSimbolo.setEntorno(this.Entorno);

        let creacion = tabla.setVariable(newSimbolo);
        
        if(!creacion){
            return new Errores("Semantico", "La variable " + this.ID + " ya existe", this.Linea, this.Columna);
        }

        ListaSimbolos.push(newSimbolo);

        return null;
        
    }

    getEntorno(){
        return this.Entorno;
    }

    setEntorno(Entorno){
        this.Entorno = Entorno;
    }

    getMutabilidad(){
        return this.Mutabilidad;
    }

    setMutabilidad(Mutabilidad){
        this.Mutabilidad = Mutabilidad;
    }
    
}

export default Instr_DeclaracionVar;