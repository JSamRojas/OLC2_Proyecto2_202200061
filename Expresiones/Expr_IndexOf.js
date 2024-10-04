import Expresion from "../Abstracto/Expresion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";

class Expr_IndexOf extends Expresion {
    constructor(ID, posicion, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
        this.posicion = posicion;
    }

    Interpretar(arbol, tabla){

        let variable = tabla.getVariable(this.ID);

        if(variable === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(variable instanceof Errores) return variable;

        if(variable.getTipo().getTipo() === "VOID"){
            return new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
        }

        if(variable.getTipoEstruct() !== "Array"){
            return new Errores("Semantico", "La variable " + this.ID + " no es un array", this.Linea, this.Columna);
        }

        if(this.posicion === null){
            return new Errores("Semantico", "La posicion no puede ser null", this.Linea, this.Columna);
        }

        let pos = this.posicion.Interpretar(arbol, tabla);

        if(pos instanceof Errores) return pos;

        if(pos === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(this.posicion.Tipo.getTipo() !== "ENTERO"){
            return new Errores("Semantico", "La posicion debe ser de tipo entero", this.Linea, this.Columna);
        }

        let valor = variable.getValor();

        this.Tipo.setTipo(DatoNativo.ENTERO);

        return valor.indexOf(pos);

    }

}

export default Expr_IndexOf;