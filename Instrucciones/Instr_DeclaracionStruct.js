import Instruccion from "../Abstracto/Instruccion.js";
import Arbol from "../Simbolo/Arbol.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Tipo from "../Simbolo/Tipo.js";

class Instr_DeclaracionStruct extends Instruccion {
    constructor(ID, Atributos, Linea, Columna) {
        super(new Tipo(DatoNativo.STRUCT), Linea, Columna);
        this.ID = ID;
        this.Atributos = Atributos;
    }

    Interpretar(arbol, tabla) {

        let new_Attribs = this.Inter_Struct(arbol, this.Atributos);
        this.Atributos = new_Attribs;
        return null;

    }

    Inter_Struct(arbol, Attribs){

        for (let clave of Attribs.keys()) {
            let tipo_atr = Attribs.get(clave).tipo;
            let valor_atr = Attribs.get(clave);
            let busqueda = arbol.getStructs(tipo_atr);
            if(busqueda !== null){
                let newVal = this.Inter_Struct(arbol, busqueda.Atributos);
                valor_atr.valor = newVal;
            }
        }

        return Attribs;

    }

}

export default Instr_DeclaracionStruct;