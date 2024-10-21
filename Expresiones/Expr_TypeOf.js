import Expresion from "../Abstracto/Expresion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import Expr_AccesoVar from "./Expr_AccesoVar.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_TypeOf extends Expresion {
    constructor(expresion, Linea, Columna){
        super(new Tipo(DatoNativo.CADENA), Linea, Columna);
        this.expresion = expresion;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LA FUNCION TYPEOF
    Interpretar(arbol, tabla) {
                
        let valor = this.expresion.Interpretar(arbol, tabla);

        if(valor instanceof Errores) return valor;

        if(valor === null) return null;

        switch (this.expresion.Tipo.getTipo()) {
            case "ENTERO":
                return "int";
            case "DECIMAL":
                return "float";
            case "BOOLEANO":
                return "boolean";
            case "CADENA":
                return "string";
            case "CARACTER":
                return "char";
            case "STRUCT":
                if(this.expresion instanceof Expr_AccesoVar){
                    let simbolo = tabla.getVariable(this.expresion.ID);
                    return simbolo.getTipoEstruct();
                }
            default:
                return new Errores("Semantico", "No se puede obtener el tipo de la expresion", this.Linea, this.Columna);
        }
        
    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LA FUNCION TYPEOF A RISCV
    /**
     * @param {RiscVGenerator} gen 
    */
   Traducir(arbol, tabla, gen){

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

    switch(typeExp){
        case "ENTERO":
            gen.la(r.T0, "entero");
            gen.push(r.T0);
            gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
            break;
        case "DECIMAL":
            gen.la(r.T0, "decimal");
            gen.push(r.T0);
            gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
            break;
        case "BOOLEANO":
            gen.la(r.T0, "boolean");
            gen.push(r.T0);
            gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
            break;
        case "CADENA":
            gen.la(r.T0, "cadena");
            gen.push(r.T0);
            gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
            break;
        case "CARACTER":
            gen.la(r.T0, "caracter");
            gen.push(r.T0);
            gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
            break;
        default:
            return new Errores("Semantico", "No se puede obtener el tipo de la expresion", this.Linea, this.Columna);
    }

    return 1;

   }

}

export default Expr_TypeOf;