import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_Logicas extends Expresion{
    constructor(operandoUnico, operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.BOOLEANO), Linea, Columna);
        this.operandoUnico = operandoUnico;
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    Interpretar(arbol, tabla) {
        let opIzq = null , opDer = null , Unico = null;
        if(this.operandoUnico != null){
            Unico = this.operandoUnico.Interpretar(arbol, tabla);
            if(Unico instanceof Errores) return Unico;
            if(Unico === null){
                let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
                return error;
            }
        } else {
            opIzq = this.operando1.Interpretar(arbol, tabla);
            if(opIzq instanceof Errores) return opIzq;
            opDer = this.operando2.Interpretar(arbol, tabla);
            if(opDer instanceof Errores) return opDer;
            if(opIzq === null || opDer === null){
                let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
                return error;
            }
        }

        switch (this.operacion) {
            case "AND":
                return this.and(opIzq, opDer);
            case "OR":
                return this.or(opIzq, opDer);
            case "NOT":
                return this.not(Unico);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones logicas", this.Linea, this.Columna);
        }

    }
    // METODO PARA LA AND
    and(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1) {
            case "BOOLEANO":
                switch (tipo2) {
                    case "BOOLEANO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        if(op1 && op2){
                            return true;
                        } else {
                            return false;
                        }
                    default:
                        return new Errores("Error Semantico", "No se puede realizar un AND con el tipo " + tipo1.toString() + " y con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar un AND con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA EL OR
    or(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1) {
            case "BOOLEANO":
                switch (tipo2) {
                    case "BOOLEANO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        if(op1 || op2){
                            return true;
                        } else {
                            return false;
                        }
                    default:
                        return new Errores("Error Semantico", "No se puede realizar un OR con el tipo " + tipo1.toString() + " y con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar un OR con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA EL NOT
    not(Unico){
        const opU = this.operandoUnico.Tipo.getTipo();
        switch (opU) {
            case "BOOLEANO":
                this.Tipo.setTipo(DatoNativo.BOOLEANO);
                return !Unico;
            default:
                return new Errores("Error Semantico", "No se puede realizar un NOT con el tipo " + opU.toString(), this.Linea, this.Column);
        }
    }
}

export default Expr_Logicas;