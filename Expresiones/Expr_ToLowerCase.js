import Expresion from "../Abstracto/Expresion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_ToLowerCase extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA FUNCION TOLOWERCASE
    Interpretar(arbol, tabla) {
                
        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        if(this.esMatriz(valor) || Array.isArray(valor)){
            return new Errores("Semantico", "La funcion toLowerCase no aplica en arrays o matrices", this.Linea, this.Columna);
        }

        if(this.expresion.Tipo.getTipo() !== "CADENA"){
            return new Errores("Semantico", "La funcion toLowerCase solo acepta cadenas", this.Linea, this.Columna);
        }

        return valor.toLowerCase();
    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LA FUNCION TOLOWERCASE A RISCV
    /**
     * @param {RiscVGenerator} gen 
    */
    Traducir(arbol, tabla, gen){

        gen.addComment("Convirtiendo una cadena a minusculas");
        let valorTrad = this.expresion.Traducir(arbol, tabla, gen);

        if(valorTrad instanceof Errores){
            gen.popObject(r.T0);
            return valorTrad;
        }

        if(valorTrad === null){
            //gen.popObject(r.T0);
            return null;
        }

        const typeExp = gen.getTopObject().tipo;
        gen.popObject(r.T0);

        if(typeExp !== "CADENA"){
            return new Errores("Semantico", "La funcion toLowerCase solo acepta cadenas", this.Linea, this.Columna);
        }

        gen.add(r.A0, r.ZERO, r.T0);
        gen.callFunction("LowerCase");
        gen.pushObject({tipo: DatoNativo.CADENA, length: 4});

        return 1;

    }


    esMatriz(array){
        if(!Array.isArray(array)){
            return false;
        }

        return array.some(elemento => Array.isArray(elemento));
    }

}

export default Expr_ToLowerCase;