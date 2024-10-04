import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Expr_Return from "../Expresiones/Expr_Return.js";

class Instr_Funcion extends Instruccion {
    constructor(ID, IDstruct, InstruccionesFuncion, parametros, EstructFuncion, Tipo, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.ID = ID;
        this.InstruccionesFuncion = InstruccionesFuncion;
        this.parametros = parametros;
        this.IDstruct = IDstruct;
        this.EstructFuncion = EstructFuncion;
        this.Esglobal = null;
    }

    Interpretar(arbol, tabla){
        for (let element of this.InstruccionesFuncion) {

            if(element instanceof Expr_Return){
                element.setTablaEntorno(tabla);
                return element;
            }

            if(element instanceof Instr_Funcion){
                element.Esglobal = false;
                arbol.addFuncion(element);
                continue;
            }
            
            let resultado = element.Interpretar(arbol, tabla);

            if(resultado instanceof Errores) return resultado;

            if(resultado instanceof Expr_Return) return resultado;

        }

        return null;

    }

}

export default Instr_Funcion;