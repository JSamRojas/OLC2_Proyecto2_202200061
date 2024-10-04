import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import Instr_LlamadaFunc from "../Instrucciones/Instr_LlamadaFunc.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_AccesoStruct extends Expresion {
    constructor(IDvar, IDatribs, Linea, Columna) {
        super(new Tipo(DatoNativo.STRUCT), Linea, Columna);
        this.IDvar = IDvar;
        this.IDatribs = IDatribs;
    }

    Interpretar(arbol, tabla){

        let Valor = null;

        if(this.IDvar instanceof Instr_LlamadaFunc){

            Valor = this.IDvar.Interpretar(arbol, tabla);

            if(Valor instanceof Errores) return Valor;

        } else {

            let variable = tabla.getVariable(this.IDvar);

            if(variable === null){
                return new Errores("Semantico", "La variable " + this.IDvar + " no existe", this.Linea, this.Columna);
            }
    
            if(variable.Tipo.getTipo() === "VOID"){
                let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
                ListaErrores.push(error);
                return null;
            }
    
            Valor = variable.getValor();
            
        }

        if(!(Valor instanceof Map)){
            return new Errores("Semantico", "La variable " + this.IDvar + " no es un struct", this.Linea, this.Columna);
        }

        let mapAux = this.IDatribs;
        let atribAux = null;

        for (let i = 0; i < this.IDatribs.length; i++) {

            atribAux = Valor.get(mapAux[i]);

            if(atribAux === null || atribAux === undefined){
                return new Errores("Semantico", "El atributo " + mapAux[i] + " no existe en el struct", this.Linea, this.Columna);
            }

            if(!(atribAux.valor instanceof Map) && i !== this.IDatribs.length - 1){
                return new Errores("Semantico", "El atributo " + mapAux[i] + " no es un struct", this.Linea, this.Columna);
            }

            Valor = atribAux.valor;

        }

        if(atribAux instanceof Map){
            return atribAux.valor;
        } else {
            this.Tipo.setTipo(atribAux.tipo.tipo);
            return atribAux.valor;
        }

    }

}

export default Expr_AccesoStruct;