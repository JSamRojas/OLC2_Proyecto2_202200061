import Expresion from "../Abstracto/Expresion.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import { ListaErrores } from "../Interfaz/Codigo_GUI.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";
import TablaSimbolos from "../Simbolo/TablaSimbolos.js";

class Expr_AccesoVar extends Expresion {
    constructor(ID, Linea, Columna) {
        super(new Tipo(DatoNativo.VOID), Linea, Columna);
        this.ID = ID;
    }

    // METODO USADO EL PROYECTO 1 PARA ACCEDER A LAS VARIABLES
    Interpretar(arbol, tabla){
        let valido = tabla.getVariable(this.ID);
        if(valido === null){
            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        if(valido.Tipo.getTipo() === "VOID"){
            let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            ListaErrores.push(error);
            return null;
        } 
        this.Tipo.setTipo(valido.getTipo().getTipo());
        return valido.getValor();
    }

    /**
     * @param { TablaSimbolos } tabla
     * @param { RiscVGenerator } gen 
     */

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR EL ACCESO A VARIABLES
    Traducir(arbol, tabla, gen){

        gen.addComment("Accesando a la variable " + this.ID);

        let valido = tabla.getVariable(this.ID);

        if(valido === null){

            /*
             
            Si la variable no ha sido declarada, entonces se debe notificar el error

            como se maneja el valor null, hay que crear un objeto con ese valor para que sea retornado

            */

            gen.pushConstant({tipo: DatoNativo.VOID, valor: null});

            return new Errores("Semantico", "La variable " + this.ID + " no existe", this.Linea, this.Columna);
        }

        const [offset, varObject] = gen.getObject(this.ID);
        
        if(varObject.tipo === DatoNativo.VOID){
            let error = new Errores("Semantico", "La variable " + this.ID + " es inaccesible porque tiene valor null", this.Linea, this.Columna);
            ListaErrores.push(error);
            gen.addi(r.T0, r.SP, offset);
            gen.lw(r.T1, r.T0);
            gen.push(r.T1);
            gen.pushObject({...varObject, id: undefined});
            gen.addComment("Fin de acceso a la variable " + this.ID);
            return null;
        }
        this.Tipo.setTipo(varObject.tipo);

        if(varObject.tipo === DatoNativo.DECIMAL){
            gen.addi(r.T0, r.SP, offset);
            gen.flw(fr.FT0, r.T0);
            gen.pushFloat(fr.FT0);
            gen.pushObject({...varObject, id: undefined});
            gen.addComment("Fin de acceso a la variable " + this.ID);
            //gen.addComment(JSON.stringify(gen.objectStack));
            return varObject;
        }

        gen.addi(r.T0, r.SP, offset);
        gen.lw(r.T1, r.T0);
        gen.push(r.T1);
        gen.pushObject({...varObject, id: undefined});
        gen.addComment("Fin de acceso a la variable " + this.ID);
        //gen.addComment(JSON.stringify(gen.objectStack));
        return varObject;

    }

}

export default Expr_AccesoVar;