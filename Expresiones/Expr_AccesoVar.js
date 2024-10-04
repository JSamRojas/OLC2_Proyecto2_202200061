import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_AccesoVar extends Expresion {
    constructor(ID, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
    }

    Interpretar(arbol, tabla){
        let valido = tabla.getVariable(this.ID);
        if(valido === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(valido.Tipo.getTipo() === "VOID"){
            let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            ListaErrores.push(error);
            return null;
        } 
        this.Tipo.setTipo(valido.getTipo().getTipo());
        return valido.getValor();
    }

}

export default Expr_AccesoVar;