import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Simbolos from "../Simbolo/Simbolos.js";
import { ListaSimbolos, ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_ObjectKeys extends Expresion {
    constructor(IDstruct, Linea, Columna) {
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.IDstruct = IDstruct;
    }

    Interpretar(arbol, tabla) {

        let variable = tabla.getVariable(this.IDstruct);

        if (variable === null) {
            return new Errores("Semantico", "La variable " + this.IDstruct + " no existe", this.Linea, this.Columna);
        }

        if (variable.Tipo.getTipo() === "VOID") {
            let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            ListaErrores.push(error);
            return null;
        }

        if(variable.getTipo().getTipo() !== "STRUCT"){
            return new Errores("Semantico", "La variable " + this.IDstruct + " no es un struct", this.Linea, this.Columna);
        }

        let Valor = Array.from(variable.getValor().keys());

        return Valor;

    }

}

export default Expr_ObjectKeys;