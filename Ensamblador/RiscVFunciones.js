import {registros as r, float_registros as fr} from "./RiscVConstantes.js";
import { RiscVGenerator as gen, RiscVGenerator } from "./RiscVGenerator.js";


/**
 * @param {RiscVGenerator} code
*/
export const concatString = (code) => {
    // A0 -> direccion en heap de la primera cadena
    // A1 -> direccion en heap de la segunda cadena
    // result -> push en el stack la direccion en heap de la nueva cadena concatenada

    code.addComment("Guardando en el stack la direccion en heap de la primera cadena");
    code.push(r.HP);

    code.addComment('Copiando la 1er cadena en el heap');
    const end1 = code.getLabel();
    const loop1 = code.addLabel();

    code.lb(r.T1, r.A0);
    code.beq(r.T1, r.ZERO, end1);
    code.sb(r.T1, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.addi(r.A0, r.A0, 1);
    code.jump(loop1);
    code.addLabel(end1);

    code.addComment("Copiando la segunda cadena en el heap");
    const end2 = code.getLabel();
    const loop2 = code.addLabel();

    code.lb(r.T1, r.A1);
    code.beq(r.T1, r.ZERO, end2);
    code.sb(r.T1, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.addi(r.A1, r.A1, 1);
    code.jump(loop2);
    code.addLabel(end2);

    code.addComment("Agregando el caracter nulo al final de la cadena");
    code.sb(r.ZERO, r.HP);
    code.addi(r.HP, r.HP, 1);

}

/**
 * @param {RiscVGenerator} code
*/
export const CompareStrings = (code) => {
    // A0 -> direccion en heap de la primera cadena
    // A1 -> direccion en heap de la segunda cadena
    // result -> push en t0 de 1 si son iguales, 0 si no lo son

    code.addComment("Comparando cadenas");

    const end1 = code.getLabel();
    const check_end = code.getLabel();
    const loop1 = code.addLabel();

    code.lb(r.T0, r.A0);    // caracter de la primera cadena
    code.lb(r.T1, r.A1);    // caracter de la segunda cadena
    code.beq(r.T0, r.T1, check_end);    // si los caracteres son iguales
    code.li(r.T0, 0);   // push 0
    //code.push(r.T0);
    code.ret();    // termina la ejecucion
    code.addLabel(check_end);
    code.beq(r.T0, r.ZERO, end1);    // si se llega al final de la cadena, son iguales
    code.addi(r.A0, r.A0, 1);
    code.addi(r.A1, r.A1, 1);
    code.jump(loop1);
    code.addLabel(end1);
    code.li(r.T0, 1);   // push 1
    //code.push(r.T0);

    code.addComment("Fin de la comparacion de cadenas");

}

/**
 * @param {RiscVGenerator} code
*/
export const lessOrEqual = (code) => {
    // t1 -> operador izquierdo
    // t0 -> operador derecho

    /*

    if (left <= right) {
        t0 = 1
        push t0
    } else {
        t0 = 0
        push t0
    }

    */

    const truelabel = code.getLabel();
    const endlabel = code.getLabel();

    code.bge(r.T0, r.T1, truelabel);    // derecha >= izquierda (se invierte la condicion)
    code.li(r.T0, 0);
    code.push(r.T0);
    code.jump(endlabel);
    code.addLabel(truelabel);
    code.li(r.T0, 1);
    code.push(r.T0);
    code.addLabel(endlabel);

}

/**
 * @param {RiscVGenerator} code
*/
export const Equal = (code) => {
    // t1 -> operador izquierdo 
    // t0 -> operador derecho

    /*

    if (left == right) {
        t0 = 1
        push t0
    } else {
        t0 = 0
        push t0
    }

    */

    const truelabel = code.getLabel();
    const endlabel = code.getLabel();

    code.beq(r.T1, r.T0, truelabel);    // izquierda == derecha (se mantiene la condicion)
    code.li(r.T0, 0);
    code.push(r.T0);
    code.jump(endlabel);
    code.addLabel(truelabel);
    code.li(r.T0, 1);
    code.push(r.T0);
    code.addLabel(endlabel);

}

/**
 * @param {RiscVGenerator} code
*/
export const LessThan = (code) => {
    // t1 -> operador izquierdo 
    // t0 -> operador derecho

    /*

    if (left < right) {
        t0 = 1
        push t0
    } else {
        t0 = 0
        push t0
    }

    */

    const truelabel = code.getLabel();
    const endlabel = code.getLabel();

    code.blt(r.T1, r.T0, truelabel);    // izquierda < derecha (se mantiene la condicion)
    code.li(r.T0, 0);
    code.push(r.T0);
    code.jump(endlabel);
    code.addLabel(truelabel);
    code.li(r.T0, 1);
    code.push(r.T0);
    code.addLabel(endlabel);

}

/**
 * @param {RiscVGenerator} code
*/
export const NonEqual =(code) => {
    // t1 -> operador izquierdo 
    // t0 -> operador derecho

    /*

    if (left != right) {
        t0 = 1
        push t0
    } else {
        t0 = 0
        push t0
    }

    */

    const truelabel = code.getLabel();
    const endlabel = code.getLabel();

    code.bne(r.T1, r.T0, truelabel);    // izquierda != derecha (se mantiene la condicion)
    code.li(r.T0, 0);
    code.push(r.T0);
    code.jump(endlabel);
    code.addLabel(truelabel);
    code.li(r.T0, 1);
    code.push(r.T0);
    code.addLabel(endlabel);
}

/**
 * @param {RiscVGenerator} code
*/
export const LogicNegation = (code) => {
    // t0 -> valor a negar

    /*
     
    if (value == 0){
        t0 = 1
        push t0
    } else {
        t0 = 0
        push t0
    }

    */

    const truelabel = code.getLabel();
    const endlabel = code.getLabel();

    code.beqz(r.T0, truelabel);
    code.li(r.T0, 0);
    code.push(r.T0);
    code.jump(endlabel);
    code.addLabel(truelabel);
    code.li(r.T0, 1);
    code.push(r.T0);
    code.addLabel(endlabel);

}

/**
 * @param {RiscVGenerator} code
*/
export const Print_BOOLEAN = (code) => {
    // A0 -> valor a imprimir

    const trueLabel = code.getLabel();
    const endLabel = code.getLabel();
    const nulllabel = code.getLabel();

    code.push(r.A0);
    code.beq(r.T0, r.NULL, nulllabel);
    code.beq(r.T0, r.ZERO, trueLabel);
    code.la(r.A0, "true");
    code.li(r.A7, 4);
    code.sysCall();
    code.jump(endLabel);
    code.addLabel(trueLabel);
    code.la(r.A0, "false");
    code.li(r.A7, 4);
    code.sysCall();
    code.jump(endLabel);
    code.addLabel(nulllabel);
    code.mv(r.A0, r.NULL);
    code.li(r.A7, 4);
    code.sysCall();
    code.addLabel(endLabel);
    code.pop(r.A0);
    
}

export const functions = {
    concatString,
    Equal,
    NonEqual,
    LessThan,
    lessOrEqual,
    LogicNegation,
    Print_BOOLEAN,
    CompareStrings,
}