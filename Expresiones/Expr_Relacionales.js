import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_Relacionales extends Expresion{
    constructor(operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.BOOLEANO), Linea, Columna);
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    // METODO USADO EN EL PROYECTO 1 PARA REALIZAR LAS OPERACIONES RELACIONALES
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

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LAS OPERACIONES RELACIONALES
    Traducir(arbol, tabla, gen){
        let opIzq = null , opDer = null;

        gen.addComment(`Inicio de la operacion relacional: ${this.operacion}`);

        opIzq = this.operando1.Traducir(arbol, tabla,gen);
        if(opIzq instanceof Errores) return opIzq;
        opDer = this.operando2.Traducir(arbol, tabla,gen);
        if(opDer instanceof Errores) return opDer;

        if(opIzq === null || opDer === null){
            let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
            return error;
        }

        switch (this.operacion) {
            case "MENOR_QUE":
                return this.menorqueTrad(gen);
            case "MENOR_IGUAL":
                return this.menorigualTrad(gen);
            case "MAYOR_QUE":
                return this.mayorqueTrad(gen);
            case "MAYOR_IGUAL":
                return this.mayorigualTrad(gen);
            case "IGUAL":
                return this.igualacionTrad(gen);
            case "NO_IGUAL":
                return this.diferenciaTrad(gen);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones relacionales", this.Linea, this.Columna);
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */

    menorqueTrad(gen){

        let pushStack = false;
        
        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
       
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.callFunction("LessThan");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.flt(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.flt(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.flt(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.callFunction("LessThan");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

    /**
     * @param {RiscVGenerator} gen
    */

    menorigualTrad(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
       
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.callFunction("lessOrEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.fle(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.fle(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fle(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                } 
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.callFunction("lessOrEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

    /**
     * @param {RiscVGenerator} gen
    */

    mayorqueTrad(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
       
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);
        
        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.mv(r.T2, r.T0);  // se copia el operando derecho a un registro temporal
                        gen.mv(r.T0, r.T1);  // se copia el operando izquierdo a t0
                        gen.mv(r.T1, r.T2);  // se copia el operando derecho a t1
                        gen.callFunction("LessThan");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.flt(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.flt(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.flt(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.mv(r.T2, r.T0);  // se copia el operando derecho a un registro temporal
                        gen.mv(r.T0, r.T1);  // se copia el operando izquierdo a T0
                        gen.mv(r.T1, r.T2);  // se copia el operando derecho a T1
                        gen.callFunction("LessThan");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

    /**
     * @param {RiscVGenerator} gen
    */

    mayorigualTrad(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
    
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.mv(r.T2, r.T0);  // se copia el operando derecho a un registro temporal
                        gen.mv(r.T0, r.T1);  // se copia el operando izquierdo a t0
                        gen.mv(r.T1, r.T2);  // se copia el operando derecho a t1
                        gen.callFunction("lessOrEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.fle(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.fle(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fle(r.T0, fr.FT0, fr.FT1);  // se compara el operando derecho con el izquierdo
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.mv(r.T2, r.T0);  // se copia el operando derecho a un registro temporal
                        gen.mv(r.T0, r.T1);  // se copia el operando izquierdo a t0
                        gen.mv(r.T1, r.T2);  // se copia el operando derecho a t1
                        gen.callFunction("lessOrEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

    /**
     * @param {RiscVGenerator} gen
    */

    igualacionTrad(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
       
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.callFunction("Equal");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.callFunction("Equal");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CADENA":
                switch (tipo2) {
                    case "CADENA":
                        gen.add(r.A0, r.ZERO, r.T1);  // se copia la direccion de la cadena izquierda
                        gen.add(r.A1, r.ZERO, r.T0);  // se copia la direccion de la cadena derecha
                        gen.callFunction("CompareStrings");
                        gen.push(r.T0);
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "BOOLEANO":
                switch(tipo2){
                    case "BOOLEANO":
                        gen.callFunction("Equal");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

    /**
     * @param {RiscVGenerator} gen
    */

    diferenciaTrad(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */
       
        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el primer operando es null");

        if(tipo1 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT1, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el primer operando es null, se salta la operacion
        } else {
            gen.beq(r.T1, r.NULL, skip_operacion);  // Si el primer operando es null, se salta la operacion
        }

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo2 === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando derecho | FT0 -> operando derecho
            T1 -> operando izquierdo | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.callFunction("NonEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1,  r.T1);  // se convierte el operando izquierdo a decimal
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.callFunction("LogicNegation");  // se niega el resultado de la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0,  r.T0);  // se convierte el operando derecho a decimal
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen.callFunction("LogicNegation");  // se niega el resultado de la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    case "DECIMAL":
                        gen.feq(r.T0, fr.FT1, fr.FT0);  // se compara el operando izquierdo con el derecho
                        gen. callFunction("LogicNegation");  // se niega el resultado de la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CARACTER":
                switch (tipo2) {
                    case "CARACTER":
                        gen.callFunction("NonEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "CADENA":
                switch (tipo2) {
                    case "CADENA":
                        gen.add(r.A0, r.ZERO, r.T1);  // se copia la direccion de la cadena izquierda
                        gen.add(r.A1, r.ZERO, r.T0);  // se copia la direccion de la cadena derecha
                        gen.callFunction("CompareStrings");
                        gen.callFunction("LogicNegation");  // se niega el resultado de la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            case "BOOLEANO":
                switch(tipo2){
                    case "BOOLEANO":
                        gen.callFunction("NonEqual");  // se llama a la funcion que realiza la comparacion
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede comparar el tipo " + tipo1.toString() + " con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;    
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar una comparacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
        gen.jump(continuar);
        gen.addLabel(skip_operacion);
        gen.addComment("Si alguno de los operandos es null, se retorna null");
        gen.push(r.NULL);
        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
        gen.addLabel(continuar);
        return 1;

    }

}

export default Expr_Relacionales;