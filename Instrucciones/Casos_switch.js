import Instruccion from "../Abstracto/Instruccion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Casos_switch extends Instruccion {
    constructor(expresion, InstrCaso, EsCaso, Linea, Columna){
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.expresion = expresion;
        this.InstrCaso = InstrCaso;
        this.EsCaso = EsCaso;
    }

    // METODO USADO EN EL PROYECTO 1 PARA INTERPRETAR LOS CASOS DEL SWITCH
    Interpretar(arbol, tabla){
        let Caso = this.expresion.Interpretar(arbol, tabla);

        if(Caso === null) return null;

        if(Caso instanceof Errores) return Caso;

        this.Tipo.setTipo(this.expresion.Tipo.getTipo());

        return Caso;

    }

    // METODO USADO EN EL PROYECTO 2 PARA GENERAR EL CODIGO RISCV DE LOS CASOS DEL SWITCH

    /**
     * @param {RiscVGenerator} gen 
     */
    Traducir(arbol, tabla, gen){

        gen.addComment("Traduccion de un caso del switch");

        let CasoTrad = this.expresion.Traducir(arbol, tabla, gen);

        if(CasoTrad === null) return null;

        if(CasoTrad instanceof Errores){

            /*
             
            si hay un error en uno de los casos, se reporta el error y se retorna
            al mismo tiempo, hay que sacar el valor null de la pila

            */
            
            gen.popObject(r.T0);
            return CasoTrad;
        }

        return 1;
        
    }

}

export default Casos_switch;