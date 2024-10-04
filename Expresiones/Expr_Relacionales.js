import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { ListaErrores } from "../Interfaz/Codigo_GUI.js";

class Expr_Relacionales extends Expresion{
    constructor(operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.BOOLEANO), Linea, Columna);
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    Interpretar(arbol, tabla) {
        let opIzq = null , opDer = null;
        opIzq = this.operando1.Interpretar(arbol, tabla);
        if(opIzq instanceof Errores) return opIzq;
        opDer = this.operando2.Interpretar(arbol, tabla);
        if(opDer instanceof Errores) return opDer;

        if(opIzq === null || opDer === null){
            let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
            return error;
        }

        switch (this.operacion) {
            case "MENOR_QUE":
                return this.menorque(opIzq, opDer);
            case "MENOR_IGUAL":
                return this.menorigual(opIzq, opDer);
            case "MAYOR_QUE":
                return this.mayorque(opIzq, opDer);
            case "MAYOR_IGUAL":
                return this.mayorigual(opIzq, opDer);
            case "IGUAL":
                return this.igualacion(opIzq, opDer);
            case "NO_IGUAL":
                return this.diferencia(opIzq, opDer);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones relacionales", this.Linea, this.Columna);
        }

    }

    // METODO PARA EL MENOR QUE
    menorque(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) < parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) < parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) < parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) < parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) < op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA EL MENOR IGUAL
    menorigual(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) <= parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) <= parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) <= parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) <= parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) <= op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA EL MAYOR QUE
    mayorque(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) > parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) > parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) > parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) > parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) > op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA EL MAYOR IGUAL
    mayorigual(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) >= parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) >= parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) >= parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) >= parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) >= op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // MEOTOD PARA LA IGUALACION
    igualacion(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) === parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) === parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) === parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) === parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "BOOELANO":
                switch (tipo2){
                    case "BOOLEANO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1 === op2;
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CADENA":
                switch (tipo2){
                    case "CADENA":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.toString() === op2.toString();
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) === op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }
    // METODO PARA LA DIFERENCIA
    diferencia(op1, op2){
        const tipo1 = this.operando1.Tipo.getTipo();
        const tipo2 = this.operando2.Tipo.getTipo();
        switch (tipo1){
            case "ENTERO":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) !== parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseInt(op1, 10) !== parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2){
                    case "ENTERO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) !== parseInt(op2, 10);
                    case "DECIMAL":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return parseFloat(op1) !== parseFloat(op2);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "BOOELANO":
                switch (tipo2){
                    case "BOOLEANO":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1 !== op2;
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CADENA":
                switch (tipo2){
                    case "CADENA":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.toString() !== op2.toString();
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "CARACTER":
                switch (tipo2){
                    case "CARACTER":
                        this.Tipo.setTipo(DatoNativo.BOOLEANO);
                        return op1.charCodeAt(0) !== op2.charCodeAt(0);
                    default:
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }

}

export default Expr_Relacionales;