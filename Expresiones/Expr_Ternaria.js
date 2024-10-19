import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Tipo from "../Simbolo/Tipo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_Ternaria extends Expresion {
    constructor(condicion, expresionT, expresionF, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.condicion = condicion;
        this.expresionT = expresionT;
        this.expresionF = expresionF;
    }

    // METODO USADO EN EL PROYECTO 1 PARA INTERPRETAR EL OPERADOR TERNARIO
    Interpretar(arbol, tabla){
        let cond = this.condicion.Interpretar(arbol, tabla);
        if(cond === null) return null;
        if(cond instanceof Errores) return cond;

        if(this.condicion.Tipo.getTipo() !== "BOOLEANO"){
            return new Errores("Semantico", "La condicion de la expresion ternaria debe ser de tipo booleano, no de tipo " + this.condicion.Tipo.getTipo(), this.Linea, this.Columna);
        }

        let valorT = this.expresionT.Interpretar(arbol, tabla);
        let valorF = this.expresionF.Interpretar(arbol, tabla);

        if(valorT === null || valorF === null) return null;
        if(valorT instanceof Errores) return valorT;
        if(valorF instanceof Errores) return valorF;

        if(cond){
            this.Tipo.setTipo(this.expresionT.Tipo.getTipo());
            return valorT;
        } else {
            this.Tipo.setTipo(this.expresionF.Tipo.getTipo());
            return valorF;
        }

    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR EL OPERADOR TERNARIO
    /**
     * @param {RiscVGenerator} gen 
     */
    Traducir(arbol, tabla, gen){

        gen.addComment("Inicio de expresion ternaria");
        gen.addComment("Condicion");
        let cond = this.condicion.Traducir(arbol, tabla, gen);

        // Si la condicion es null, entonces se retorna null
        if(cond === null){

            /*

                Si el valor que devuelve la condicion es null, entonces se retorna null igualmente
                y se pushea el valor de null al stack
                
            
            */

            return null;

        }

        // Si la condicion es un error, entonces se retorna el error
        if(cond instanceof Errores){
            return cond;
        }

        let typeCondicion = gen.getTopObject().tipo;
        gen.popObject(r.T3);

        if(typeCondicion !== DatoNativo.BOOLEANO){

            /*

                Si la condicion no es de tipo booleano, entonces se retorna el error y se debe dejar el valor de null en el stack, ya que es una expresion y devuelve un valor
                
            */

            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");

            return new Errores("Semantico", "La condicion de la expresion ternaria debe ser de tipo booleano, no de tipo " + typeCondicion, this.Linea, this.Columna);
        }

        let valorT = this.expresionT.Traducir(arbol, tabla, gen);
        let valorF = this.expresionF.Traducir(arbol, tabla, gen);

        const tipo2 = gen.getTopObject().tipo;
        const opF = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);
        const tipo1 = gen.getTopObject().tipo;
        const opT = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT2 : r.T2);

        if(valorT === null || valorF === null){
            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");
            return null;
        }

        if(valorT instanceof Errores){
            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");
            return valorT;
        }

        if(valorF instanceof Errores){
            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");
            return valorF;
        }

        if(tipo2 !== tipo1){
            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");
            return new Errores("Semantico", "Los tipos de los valores de la expresion ternaria no coinciden", this.Linea, this.Columna);
        }

        if(tipo1 === "VOID" || tipo2 === "VOID"){
            gen.push(r.NULL);
            gen.pushObject({tipo: DatoNativo.VOID, length: 4});
            gen.addComment("Fin de expresion ternaria");
            return new Errores("Semantico", "Uno de los valores de la expresion ternaria es null", this.Linea, this.Columna);
        }

        /*
         
            T0 = condicion
            T1 = valor falso
            T2 = valor verdadero

        */

        const end1 = gen.getLabel();
        const falseLabel = gen.getLabel();

        gen.beq(r.T3, r.ZERO, falseLabel);
        if(tipo1 === DatoNativo.DECIMAL) gen.pushFloat(fr.FT2);
        else gen.push(r.T2);
        gen.jump(end1);
        gen.addLabel(falseLabel);
        if(tipo2 === DatoNativo.DECIMAL) gen.pushFloat(fr.FT1);
        else gen.push(r.T1);
        gen.addLabel(end1);
        gen.pushObject({tipo: tipo1, length: 4});

        gen.addComment("Fin de expresion ternaria");
        return 1;

    }

}

export default Expr_Ternaria;