import Instruccion from "../Abstracto/Instruccion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";


class Instr_DeclaracionVar extends Instruccion {
    constructor(ID, valor, Tipo, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.ID = ID;
        this.valor = valor;
        this.Entorno = "";
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA INSTRUCCION DE DECLARACION DE VARIABLES
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

    /**
     * @param {RiscVGenerator} gen
     */

    // METODO USADO EN EL PROYECTO 2 PARA GENERAR EL CODIGO ASSEMBLY DE LA INSTRUCCION DE DECLARACION DE VARIABLES
    Traducir(arbol, tabla, gen){
        let newSimbolo = new Simbolos;
        //let pushVal = false;

        gen.addComment("Declaracion de variable " + this.ID);

        if(this.valor === null){
            newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);

            // Si no tiene valor la declaracion, se debe pushear el valor de null al stack para asignarlo a la variable
            if(this.Tipo.getTipo() === "DECIMAL") {
                gen.pushFloat(fr.FNULL);
                gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});  // se pushea el valor null al stack
            } else {
                gen.push(r.NULL);
                gen.pushObject({tipo: this.Tipo.getTipo(), length: 4});  // se pushea el valor null al stack
            }

        } else {

            let valorTraducido = this.valor.Traducir(arbol, tabla, gen);
            if(valorTraducido instanceof Errores){
                ListaErrores.push(valorTraducido);
                newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);
            }

            if(!(valorTraducido instanceof Errores)){

                const tipoVal = gen.getTopObject().tipo;    // se obtiene el tipo del valor
                let valorTop = gen.getTopObject().valor;       // se obtiene el valor del stack

                if(this.Tipo.getTipo() === "VOID"){
                    this.Tipo.setTipo(tipoVal);                 // se asigna el tipo del valor al tipo de la variable
                }

                if(tipoVal !== this.Tipo.getTipo()){
                    if(this.Tipo.getTipo() === "DECIMAL" && tipoVal === "ENTERO"){

                        if(valorTop === undefined){

                            gen.addComment("Conversion implicita de entero a decimal");
                            gen.popObject(r.T0);
                            gen.fcvtsw(fr.FT0, r.T0);
                            gen.pushFloat(fr.FT0);
                            gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                            gen.addComment("Fin de conversion");
                            //pushVal = true;

                        }

                    } else {

                        /*

                        Si el tipo de la variable no coincide con el tipo de la variable, entonces se debe asignar el valor de null a la variable.

                        Se hace un pop del valor que hay, porque ya no se utilizara y se pushea el valor null al stack para asignarlo a la variable
                         
                        */

                        let error =  new Errores("Semantico", "La variable es de tipo " + this.Tipo.getTipo().toString() + " y el valor asignado es de tipo " + tipoVal.toString(), this.Linea, this.Columna);
                        ListaErrores.push(error);
                        newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);
                        newSimbolo.setTipo(new Tipo(DatoNativo.VOID));
                        gen.popObject(r.T0);
                        gen.push(r.NULL);
                        gen.pushObject({tipo: DatoNativo.VOID, length: 4, valor: null});
                    }

                } else {

                    newSimbolo = new Simbolos(this.ID, this.Tipo, null, "Variable", this.Linea, this.Columna);

                }

            }

        }

        if(this.Entorno === ""){
            this.setEntorno("GLOBAL");
        }
        newSimbolo.setEntorno(this.Entorno);

        let creacion = tabla.setVariable(newSimbolo);

        if(!creacion){
            /*
             
            Si la variable ya existe en la tabla de simbolos, entonces no se puede agregar a la pila del stack y se tira error

            para evitar inconsistencias en la ejecucion del programa, se hace pop al valor que se iba a asignar a la variable

            */

            gen.addComment("La variable " + this.ID + " ya existe");

            gen.popObject(r.T0);

            return new Errores("Semantico", "La variable " + this.ID + " ya existe", this.Linea, this.Columna);
        }

        ListaSimbolos.push(newSimbolo);

        gen.tagObject(this.ID);

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