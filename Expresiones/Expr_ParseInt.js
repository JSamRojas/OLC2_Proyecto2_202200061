import Expresion from "../Abstracto/Expresion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_ParseInt extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.ENTERO), Linea, Columna);
        this.expresion = expresion;
    }

    // METODO UTILIZADO EN EL PROYECTO 1 PARA EJECUTAR LA FUNCION PARSEINT
    Interpretar(arbol, tabla) {

        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        if(this.esMatriz(valor) || Array.isArray(valor)){
            return new Errores("Semantico", "La funcion parseInt no aplica en arrays o matrices", this.Linea, this.Columna);
        }

        if(this.expresion.Tipo.getTipo() !== "CADENA"){
            return new Errores("Semantico", "La funcion parseInt solo acepta cadenas", this.Linea, this.Columna);
        }

        if(/^\d+(\.\d+)?$/.test(valor)){
            return parseInt(valor,10);
        } else {
            return new Errores("Semantico", "La cadena no es un numero", this.Linea, this.Columna);
        }

    }

    // METODO UTILIZADO EN EL PROYECTO 2 PARA TRADUCIR LA FUNCION PARSEINT A RISCV
    /**
     * @param {RiscVGenerator} gen 
    */
    Traducir(arbol, tabla, gen){

        gen.addComment("Convirtiendo una cadena a entero");

        let valorTrad = this.expresion.Traducir(arbol, tabla, gen);

        if(valorTrad instanceof Errores){
            gen.popObject(r.T0);
            return valorTrad;
        }

        if(valorTrad === null){
            return null;
        }

        const typeExp = gen.getTopObject().tipo;
        gen.popObject(r.T0);

        if(typeExp !== "CADENA"){
            return new Errores("Semantico", "La funcion parseFloat solo acepta cadenas", this.Linea, this.Columna);
        }

        const normal = gen.getLabel();
        const end = gen.getLabel();

        gen.mv(r.A0, r.T0);
        gen.callFunction("Atof");
        gen.feq(r.T1, fr.FT0, fr.FNULL);
        gen.beq(r.T1, r.ZERO, normal);
        gen.push(r.NULL);
        gen.jump(end);
        gen.addLabel(normal);
        gen.fcvtws(r.T0, fr.FT0);
        gen.push(r.T0);
        gen.addLabel(end);
        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});

        return 1;

    }

    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }

}

export default Expr_ParseInt;