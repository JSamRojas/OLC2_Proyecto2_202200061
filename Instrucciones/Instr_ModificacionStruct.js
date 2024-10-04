import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Instr_ModificacionStruct extends Instruccion {
    constructor(IDvar, IDatribs, expresion, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.IDvar = IDvar;
        this.IDatribs = IDatribs;
        this.expresion = expresion;
    }

    Interpretar(arbol, tabla){

        let variable = tabla.getVariable(this.IDvar);

        if(variable === null){
            return new Errores("Semantico", "La variable " + this.IDvar + " no existe", this.Linea, this.Columna);
        }

        if(variable.Tipo.getTipo() === "VOID"){
            let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            ListaErrores.push(error);
            return null;
        }

        let Valor = variable.getValor();

        if(!(Valor instanceof Map)){
            return new Errores("Semantico", "La variable " + this.IDvar + " no es un struct", this.Linea, this.Columna);
        }

        let mapAux = this.IDatribs;
        let atribAux = null;

        for (let i = 0; i < this.IDatribs.length; i++) {

            atribAux = Valor.get(mapAux[i]);

            if(atribAux === null){
                return new Errores("Semantico", "El atributo " + mapAux[i] + " no existe en el struct", this.Linea, this.Columna);
            }

            if(!(atribAux.valor instanceof Map) && i !== this.IDatribs.length - 1){
                return new Errores("Semantico", "El atributo " + mapAux[i] + " no es un struct", this.Linea, this.Columna);
            }

            Valor = atribAux.valor;

        }

        let newval = this.expresion.Interpretar(arbol, tabla);

        if(newval instanceof Errores){
            atribAux.valor = null;
            return newval;
        }

        if(atribAux instanceof Map){
            if(variable.getTipoEstruct() !== atribAux.tipo){
                atribAux.valor = null;
                return new Errores("Semantico", "El tipo de struct no coincide con el struct definido", this.Linea, this.Columna);
            }
            atribAux.valor = newval;
        } else {
            if(this.expresion.Tipo.getTipo() !== atribAux.tipo.tipo){
                atribAux.valor = null;
                return new Errores("Semantico", "El tipo de dato no coincide con el tipo del atributo", this.Linea, this.Columna);
            }
            atribAux.valor = newval;
        }

    }

}

export default Instr_ModificacionStruct;