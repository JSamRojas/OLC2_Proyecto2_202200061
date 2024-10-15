import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_Aritmeticas extends Expresion {
    constructor(operandoUnico, operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.ENTERO), Linea, Columna);
        this.operandoUnico = operandoUnico;
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LAS OPERACIONES ARITMETICAS
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

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LAS OPERACIONES ARITMETICAS
    Traducir(arbol, tabla, gen){
        let opIzq = null , opDer = null , Unico = null;
        gen.addComment(`Inicio de la operacion aritmetica: ${this.operacion}`);

        if(this.operandoUnico !== null){
            Unico = this.operandoUnico.Traducir(arbol, tabla, gen);
            if(Unico instanceof Errores) return Unico;
            if(Unico === null){
                let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
                return error;
            }
        } else {
            opIzq = this.operando1.Traducir(arbol, tabla, gen); // Operando izquierdo (stack -> izq)
            if(opIzq instanceof Errores) return opIzq;
            opDer = this.operando2.Traducir(arbol, tabla, gen); // Operando derecho (stack -> izq | der)
            if(opDer instanceof Errores) return opDer;
            if(opIzq === null || opDer === null){
                let error = new Errores("Error Semantico", "No se puede realizar una operacion con un valor null", this.Linea, this.Columna);
                return error;
            }
        }

        switch (this.operacion) {
            case "SUMA":
                return this.sumaTraducida(gen);
            case "NEGACION":
                return this.negacionTraducida(gen);
            case "MENOS":
                return this.restaTraducida(gen);
            case "MULTIPLICACION":
                return this.multiplicacionTraducida(gen);
            case "DIVISION":
                return this.divisionTraducida(gen);
            case "MODULO":
                return this.moduloTraducido(gen);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones aritmeticas", this.Linea, this.Columna);
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */

    sumaTraducida(gen){

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        /*
            T0 -> operando derecho
            T1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.add(r.T0, r.T1, r.T0);  // T0 = T1 + T0
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1, r.T1);  // FT1 = T1 (Convertir entero a decimal)
                        gen.fadd(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 + FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0, r.T0);  // FT0 = T0 (Convertir entero a decimal)
                        gen.fadd(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT + FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fadd(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 + FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            
            case "CADENA":
                switch (tipo2) {
                    case "CADENA":
                        gen.add(r.A0, r.ZERO, r.T1)
                        gen.add(r.A1, r.ZERO, r.T0)
                        gen.callFunction('concatString');
                        gen.pushObject({tipo: DatoNativo.CADENA, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede sumar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);  
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una suma con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }
    }

    /**
     * @param {RiscVGenerator} gen
    */

    restaTraducida(gen){

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        /*
            T0 | FT0 -> operando derecho
            T1 | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.sub(r.T0, r.T1, r.T0);  // T0 = T1 - T0
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1, r.T1);  // FT1 = T1 (Convertir entero a decimal)
                        gen.fsub(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 - FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede restar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0, r.T0);  // FT0 = T0 (Convertir entero a decimal)
                        gen.fsub(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT - FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fsub(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 - FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede restar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una resta con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }

    }
    
    /**
     * @param {RiscVGenerator} gen
    */

    multiplicacionTraducida(gen){

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        /*
            T0 | FT0 -> operando derecho
            T1 | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.mul(r.T0, r.T1, r.T0);  // T0 = T1 * T0
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1, r.T1);  // FT1 = T1 (Convertir entero a decimal)
                        gen.fmul(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0, r.T0);  // FT0 = T0 (Convertir entero a decimal)
                        gen.fmul(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fmul(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede multiplicar " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una multiplicacion con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */

    divisionTraducida(gen){

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        /*
            T0 | FT0 -> operando derecho
            T1 | FT1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.div(r.T0, r.T1, r.T0);  // T0 = T1 * T0
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fcvtsw(fr.FT1, r.T1);  // FT1 = T1 (Convertir entero a decimal)
                        gen.fdiv(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede dividir " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            case "DECIMAL":
                switch (tipo2) {
                    case "ENTERO":
                        gen.fcvtsw(fr.FT0, r.T0);  // FT0 = T0 (Convertir entero a decimal)
                        gen.fdiv(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    case "DECIMAL":
                        gen.fdiv(fr.FT0, fr.FT1, fr.FT0);  // FT0 = FT1 * FT0
                        gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede dividir " + tipo1.toString() + " con " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar una division con el tipo " + tipo1.toString(), this.Linea, this.Columna);
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */

    moduloTraducido(gen){

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo2 = gen.getTopObject().tipo;  // Tipo del operando derecho
        const opDer = gen.popObject(tipo2 === DatoNativo.DECIMAL ? fr.FT0 : r.T0);
        const tipo1 = gen.getTopObject().tipo;  // Tipo del operando izquierdo
        const opIzq = gen.popObject(tipo1 === DatoNativo.DECIMAL ? fr.FT1 : r.T1);

        /*
            T0 -> operando derecho
            T1 -> operando izquierdo
        */

        switch (tipo1) {
            case "ENTERO":
                switch (tipo2) {
                    case "ENTERO":
                        gen.rem(r.T0, r.T1, r.T0);  // T0 = T1 % T0
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                        return 1;
                    default:
                        return new Errores("Error Semantico", "No se puede realizar modulo con " + tipo1.toString() + " y " + tipo2.toString(), this.Linea, this.Columna);
                }
            default:
                return new Errores("Error Semantico", "No se puede realizar un modulo con el tipo " + tipo1.toString(), this.Linea, this.Columna);   
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */

    negacionTraducida(gen){

        const tipo = gen.getTopObject().tipo;  // Tipo del operando
        const op = gen.popObject(tipo === DatoNativo.DECIMAL ? fr.FT0 : r.T0);

        switch (tipo) {
            case "ENTERO":
                gen.neg(r.T0, r.T0);  // T0 = -T0
                gen.push(r.T0);  // Se guarda el resultado en el stack
                gen.pushObject({tipo: DatoNativo.ENTERO, length: 4});
                return 1;
            case "DECIMAL":
                gen.fneg(fr.FT0, fr.FT0);  // FT0 = -FT0
                gen.pushFloat(fr.FT0);  // Se guarda el resultado en el stack
                gen.pushObject({tipo: DatoNativo.DECIMAL, length: 4});
                return 1;
            default:
                return new Errores("Error Semantico", "No se puede realizar una negacion con el tipo " + tipo.toString(), this.Linea, this.Column);
        }

    }

}

export default Expr_Aritmeticas;