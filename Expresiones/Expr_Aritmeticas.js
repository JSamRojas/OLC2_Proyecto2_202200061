import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_Aritmeticas extends Expresion {
    constructor(operandoUnico, operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.ENTERO), Linea, Columna);
        this.operandoUnico = operandoUnico;
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    Interpretar(arbol, tabla){
        let opIzq = null , opDer = null , Unico = null;
        if(this.operandoUnico !== null){
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
            case "SUMA":
                return this.suma(opIzq, opDer);
            case "NEGACION":
                return this.negacion(Unico);
            case "MENOS":
                return this.resta(opIzq, opDer);
            case "MULTIPLICACION":
                return this.multiplicacion(opIzq, opDer);
            case "DIVISION":
                return this.division(opIzq, opDer);
            case "MODULO":
                return this.modulo(opIzq, opDer);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones aritmeticas", this.Linea, this.Columna);
        }

    }
    // METODO PARA LA SUMA ARITMETICA
    suma(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.ENTERO);
                        return parseInt(op1, 10) + parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return parseFloat(parseInt(op1, 10) + parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return parseFloat(parseFloat(op1) + parseInt(op2, 10)).toFixed(1);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return parseFloat(parseFloat(op1) + parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CADENA":
                switch (tipo2){
                    case "CADENA":
                        this.Tipo.setTipo(DatoNativo.CADENA);
                        return op1.toString() + op2.toString();
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una suma con el tipo " + tipo1.toString(), this.Linea, this.Columna);     
        }
    }
    // MEOTODO PARA LA NEGACION UNARIA
    negacion(Unico){
        const opU = this.operandoUnico.Tipo.getTipo();
        switch (opU) {
            case "ENTERO":
                this.Tipo.setTipo(DatoNativo.ENTERO);
                return parseInt(Unico, 10) * -1;
            case "DECIMAL":
                this.Tipo.setTipo(DatoNativo.DECIMAL);
                return (parseFloat(Unico) * -1).toFixed(1);
            default:
                return new Errores("Error Semantico", "No se puede realizar una negacion con el tipo " + opU.toString(), this.Linea, this.Column);
        }
    }
    // METODO PARA LA RESTA ARITMETICA
    resta(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.ENTERO);
                        return parseInt(op1, 10) - parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseInt(op1, 10) - parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede restar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) - parseInt(op2, 10)).toFixed(1);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) - parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede restar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una resta con el tipo " + tipo1.toString(), this.Linea, this.Columna);     
        }
    }
    // METODO PARA LA MULTIPLICACION
    multiplicacion(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.ENTERO);
                        return parseInt(op1, 10) * parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return parseInt((op1, 10) * parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) * parseInt(op2, 10)).toFixed(1);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) * parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una multiplicacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);     
        }
    }
    // METODO PARA LA DIVISION
    division(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        if(parseInt(op2, 10) === 0){
            let error = new Errores("Error Semantico", "No se puede dividir entre 0", this.Linea, this.Columna);
            return error;
        } 
        
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.ENTERO);
                        return parseInt(op1, 10) / parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseInt(op1, 10) / parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) / parseInt(op2, 10)).toFixed(1);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.DECIMAL);
                        return (parseFloat(op1) / parseFloat(op2)).toFixed(1);
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una division con el tipo " + tipo1.toString(), this.Linea, this.Columna);     
        }
    }
    // METODO PARA EL MODULO
    modulo(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        if(parseInt(op2, 10) === 0){
            let error = new Errores("Error Semantico", "No se puede realizar un modulo entre 0", this.Linea, this.Columna);
            return error;
        } 

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.ENTERO);
                        return parseInt(op1, 10) % parseInt(op2, 10);
                    default:
                        return new Errores("Error Semantico", "No se puede realizar modulo con " + tipo1.toString() + " y " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar un modulo con el tipo " + tipo1.toString(), this.Linea, this.Columna);   
        }
    }

}

export default Expr_Aritmeticas;