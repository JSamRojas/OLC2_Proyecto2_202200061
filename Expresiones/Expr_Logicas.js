import Expresion from "../Abstracto/Expresion.js";
import Errores from "../Simbolo/Errores.js";
import Tipo from "../Simbolo/Tipo.js";
import DatoNativo from "../Simbolo/DatoNativo.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";

class Expr_Logicas extends Expresion{
    constructor(operandoUnico, operando1, operando2, operacion, Linea, Columna){
        super(new Tipo(DatoNativo.BOOLEANO), Linea, Columna);
        this.operandoUnico = operandoUnico;
        this.operando1 = operando1;
        this.operando2 = operando2;
        this.operacion = operacion;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LAS OPERACIONES LOGICAS
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

    // METODO PARA LA AND EN EL PROYECTO 2 PARA TRADUCIR LAS OPERACIONES LOGICAS
    Traducir(arbol, tabla, gen){
        let opIzq = null , opDer = null , Unico = null;
        gen.addComment(`Inicio de la operacion Logica: ${this.operacion}`);

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
            case "AND":
                return this.andTraducir(gen);
            case "OR":
                return this.orTraducir(gen);
            case "NOT":
                return this.notTraducir(gen);
            default:
                return new Errores("Error Semantico", "El operador " + this.operacion.toString() + " no puede realizar operaciones logicas", this.Linea, this.Columna);
        }

    }

    /**
     * @param {RiscVGenerator} gen
    */
    
    andTraducir(gen){

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
            case "BOOLEANO":
                switch (tipo2) {
                    case "BOOLEANO":
                        gen.and(r.T0, r.T0, r.T1);  // T0 = T0 && T1
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede realizar un AND con el tipo " + tipo1.toString() + " y con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar un AND con el tipo " + tipo1.toString(), this.Linea, this.Columna);
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

    orTraducir(gen){

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
            case "BOOLEANO":
                switch (tipo2) {
                    case "BOOLEANO":
                        gen.or(r.T0, r.T0, r.T1);  // T0 = T0 || T1
                        gen.push(r.T0);  // Se guarda el resultado en el stack
                        gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                        pushStack = true;
                        break;
                    default:
                        gen.addLabel(skip_operacion);
                        gen.addComment("Operacion incorrecta, se retorna null");
                        gen.push(r.NULL);
                        if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                        return new Errores("Error Semantico", "No se puede realizar un OR con el tipo " + tipo1.toString() + " y con el tipo " + tipo2.toString(), this.Linea, this.Columna);
                }
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar un OR con el tipo " + tipo1.toString(), this.Linea, this.Columna);
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

    notTraducir(gen){

        let pushStack = false;

        /* 
            El primer valor que se encuentra en el stack es el operando derecho
            por eso el primer valor al que se le hace pop es el derecho
        */

        const tipo = gen.getTopObject().tipo;  // Tipo del operando
        const op = gen.popObject(tipo === DatoNativo.DECIMAL ? fr.FT0 : r.T0);

        const skip_operacion = gen.getLabel();  // Etiqueta para saltar la operacion si alguno es null
        const continuar = gen.getLabel();  // Etiqueta para continuar con el flujo del programa

        gen.addComment("Verificar si el segundo operando es null");

        if(tipo === DatoNativo.DECIMAL){
            gen.feq(r.T4, fr.FT0, fr.FNULL);  
            gen.bne(r.T4, r.ZERO, skip_operacion); // Si el segundo operando es null, se salta la operacion
        } else {
            gen.beq(r.T0, r.NULL, skip_operacion);  // Si el segundo operando es null, se salta la operacion
        }

        /*
            T0 -> operando | FT0 -> operando
        */

        switch (tipo) {
            case "BOOLEANO":
                gen.callFunction("LogicNegation");
                gen.pushObject({tipo: DatoNativo.BOOLEANO, length: 4});
                pushStack = true;
                break;
            default:
                gen.addLabel(skip_operacion);
                gen.addComment("Operacion incorrecta, se retorna null");
                gen.push(r.NULL);
                if(!pushStack) gen.pushObject({tipo: DatoNativo.VOID, length: 4});
                return new Errores("Error Semantico", "No se puede realizar un NOT con el tipo " + tipo.toString(), this.Linea, this.Columna);
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

export default Expr_Logicas;