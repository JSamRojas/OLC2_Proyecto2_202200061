import Expresion from "../Abstracto/Expresion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import {registros as r, float_registros as fr} from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_ToString extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    // METODO UTILIZADO EN EL PROYECTO 1 PARA EJECUTAR LA FUNCION TOSTRING
    Interpretar(arbol, tabla) {
            
            let valor = this.expresion.Interpretar(arbol, tabla);
    
            if(valor instanceof Errores) return valor;
    
            if(valor === null) return null;
    
            if(this.esMatriz(valor) || Array.isArray(valor)){
                return new Errores("Semantico", "La funcion toString no aplica en arrays o matrices", this.Linea, this.Columna);
            }

            switch (this.expresion.Tipo.getTipo()) {
                case "ENTERO":
                    return valor.toString();
                case "DECIMAL":
                    return valor.toString();
                case "BOOLEANO":
                    return valor.toString();
                default:
                    return new Errores("Semantico", "La funcion toString solo acepta valores numericos o booleanos", this.Linea, this.Columna);
            }
    
    }

    // METODO UTILIZADO EN EL PROYECTO 2 PARA TRADUCIR LA FUNCION TOSTRING A RISCV
    /**
     * @param {RiscVGenerator} gen 
    */
    Traducir(arbol, tabla, gen){

        let pushStack = false;

        gen.addComment("Convirtiendo un valor a cadena");

        let valorTrad = this.expresion.Traducir(arbol, tabla, gen);

        if(valorTrad instanceof Errores){
            gen.popObject(r.T0);
            return valorTrad;
        }

        if(valorTrad === null){
            return null;
        }

        const typeExp = gen.getTopObject().tipo;
        gen.popObject(typeExp === DatoNativo.DECIMAL ? fr.FT0 : r.T0);

        switch (typeExp) {
            case DatoNativo.ENTERO:
                gen.mv(r.A0, r.T0);
                gen.callFunction("Itoa");
                gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
                break;
            case DatoNativo.DECIMAL:
                gen.fcvtws(r.A0, fr.FT0);
                gen.callFunction("Itoa");
                gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
                break;
            case DatoNativo.BOOLEANO:

                const falseLabel = gen.getLabel();
                const end = gen.getLabel();

                gen.beq(r.T0, r.ZERO, falseLabel);
                gen.la(r.T0, "true");
                gen.push(r.T0);
                gen.jump(end);
                gen.addLabel(falseLabel);
                gen.la(r.T0, "false");
                gen.push(r.T0);
                gen.addLabel(end);

                gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
                pushStack = true;
                
                break;
            default:
                gen.addComment("El valor no es numerico o booleano");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Semantico", "La funcion toString solo acepta valores numericos o booleanos", this.Linea, this.Columna);
        }

        return 1;

    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }
    
}

export default Expr_ToString;