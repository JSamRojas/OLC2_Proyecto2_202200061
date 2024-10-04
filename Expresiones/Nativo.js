import Expresion from "../Abstracto/Expresion.js";
import Tipo from "../Simbolo/Tipo.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";

class Nativo extends Expresion{
    constructor(Valor, Tipo, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.Valor = Valor;
    }

    Interpretar(arbol, tabla){
        return this.Valor;
    }
}

export default Nativo;