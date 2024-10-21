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
export const UpperCase = (code) => {
    // A0 -> direccion en heap de la cadena
    // result -> push en el stack la direccion en heap de la nueva cadena en mayusculas

    code.addComment("Convirtiendo cadena a mayusculas");
    code.push(r.HP);

    const increment = code.getLabel();
    const putspace = code.getLabel();
    const endloop = code.getLabel();

    const loop = code.addLabel();
    code.lb(r.T0, r.A0);    // caracter de la cadena -> T0
    code.beq(r.T0, r.ZERO, endloop);    // si llega al final de la cadena
    code.li(r.T1, 97);    // 'a'
    code.li(r.T2, 122);    // 'z'
    code.li(r.T3, 32);    // ' '
    code.beq(r.T0, r.T3, putspace);    // si es un espacio
    code.blt(r.T0, r.T1, increment);    // si es menor que 'a'
    code.bgt(r.T0, r.T2, increment);    // si es mayor que 'z'
    code.sub(r.T0, r.T0, r.T3);    // resta 32 para convertir a mayusculas
    code.sb(r.T0, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.jump(increment);
    code.addLabel(putspace);
    code.sb(r.T0, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.addLabel(increment);
    code.addi(r.A0, r.A0, 1);
    code.jump(loop);
    code.addLabel(endloop);
    code.addComment("Agregando el caracter nulo al final de la cadena");
    code.sb(r.ZERO, r.HP);
    code.addi(r.HP, r.HP, 1);


}

/**
 * @param {RiscVGenerator} code
*/
export const LowerCase = (code) => {
    // A0 -> direccion en heap de la cadena
    // result -> push en el stack la direccion en heap de la nueva cadena en minusculas

    code.addComment("Convirtiendo cadena a minusculas");
    code.push(r.HP);

    const increment = code.getLabel();
    const putspace = code.getLabel();
    const endloop = code.getLabel();

    const loop = code.addLabel();
    code.lb(r.T0, r.A0);    // caracter de la cadena -> T0
    code.beq(r.T0, r.ZERO, endloop);    // si llega al final de la cadena
    code.li(r.T1, 65);    // 'A'
    code.li(r.T2, 90);    // 'Z'
    code.li(r.T3, 32);    // ' '
    code.beq(r.T0, r.T3, putspace);    // si es un espacio
    code.blt(r.T0, r.T1, increment);    // si es menor que 'A'
    code.bgt(r.T0, r.T2, increment);    // si es mayor que 'Z'
    code.add(r.T0, r.T0, r.T3);    // suma 32 para convertir a minusculas
    code.sb(r.T0, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.jump(increment);
    code.addLabel(putspace);
    code.sb(r.T0, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.addLabel(increment);
    code.addi(r.A0, r.A0, 1);
    code.jump(loop);
    code.addLabel(endloop);
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
export const Atoi = (code) => {
    // A0 -> direccion en heap de la cadena a convertir
    // A1 -> Acumulador del numero
    // T1 -> CARACTER '0'
    // T2 -> CARACTER '9'

    code.addComment("Convirtiendo cadena a entero");
    code.li(r.A1, 0);
    code.li(r.T1, 48);  // '0'
    code.li(r.T2, 57);  // '9'
    code.li(r.T3, 10);

    const end = code.getLabel();
    const error = code.getLabel();

    const loop = code.addLabel();
    code.lb(r.T0, r.A0);    // caracter de la cadena
    code.beq(r.T0, r.ZERO, end);    // si llega al final de la cadena
    code.blt(r.T0, r.T1, error);    // si es menor que '0'
    code.bgt(r.T0, r.T2, error);    // si es mayor que '9'
    code.sub(r.T0, r.T0, r.T1);    // resta '0' para obtener el valor numerico
    code.mul(r.A1, r.A1, r.T3);    // A1 = A1 * 10
    code.add(r.A1, r.A1, r.T0);    // A1 = A1 + T0
    code.addi(r.A0, r.A0, 1);
    code.jump(loop);
    code.addLabel(end);
    code.mv(r.T0, r.A1);
    code.ret();
    code.addLabel(error);
    code.la(r.A0, "errorcadena");
    code.li(r.A7, 4);
    code.sysCall();
    code.la(r.A0, "salto");
    code.li(r.A7, 4);
    code.sysCall();
    code.li(r.T0, r.NULL);

}

/**
 * @param {RiscVGenerator} code
*/
export const Itoa = (code) => {
    // A0 -> valor a convertir a cadena
    // a1 -> Contadora de caracteres convertidos
    // T4 -> CARACTER '0'
    // T2 -> base 10

    code.addComment("Iniciando conversion de entero/float a cadena");

    const i_zero = code.getLabel();
    const defineBase = code.getLabel();
    const i_convertirAscii = code.getLabel();
    const i_reduceBase = code.getLabel();
    const i_endConversion = code.getLabel();
    const i_addZero = code.getLabel();

    code.li(r.A1, 0);
    code.li(r.T4, 48);  // '0'
    code.li(r.A5, 1);
    code.push(r.HP);

    code.beqz(r.A0, i_zero);

    code.li(r.T2, 1);

    code.addLabel(defineBase);
    code.li(r.T3, 0);
    code.bgt(r.T2, r.A0, i_convertirAscii);
    code.li(r.T3, 10);
    code.mul(r.T2, r.T2, r.T3);
    code.jump(defineBase);
    code.addLabel(i_zero);
    code.add(r.A1, r.A1, r.A5);
    code.li(r.T3, 48);
    code.sb(r.T3, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.jump(i_endConversion);
    code.addLabel(i_convertirAscii);
    code.beq(r.T2, r.ZERO, i_endConversion);
    code.divu(r.A3, r.A0, r.T2);
    code.beq(r.A3, r.ZERO, i_reduceBase);
    code.mv(r.A4, r.A3);
    code.add(r.A4, r.A4, r.T4);
    code.sb(r.A4, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.add(r.A1, r.A1, r.A5);
    code.mul(r.A3, r.A3, r.T2);
    code.sub(r.A0, r.A0, r.A3);
    code.ble(r.T2, r.A5, i_endConversion);
    code.addLabel(i_reduceBase);
    code.li(r.A6, 10);
    code.divu(r.T2, r.T2, r.A6);
    code.bnez(r.A1, i_addZero);
    code.jump(i_convertirAscii);
    code.addLabel(i_addZero);
    code.bnez(r.A3, i_convertirAscii);
    code.add(r.A1, r.A1, r.A5);
    code.li(r.A4, 48);
    code.sb(r.A4, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.jump(i_convertirAscii);
    code.addLabel(i_endConversion);
    code.sb(r.ZERO, r.HP);
    code.addi(r.HP, r.HP, 1);

    code.addComment("Fin de la conversion de entero/float a cadena");
}

/**
 * @param {RiscVGenerator} code
*/
export const Atof = (code) => {
    // A0 -> direccion en heap de la cadena a convertir
    // A1 -> Acumulador de la parte entera del numero
    // A2 -> Acumulador de la parte decimal del numero
    // A3 -> Bandera para saber si se esta leyendo la parte entera o decimal
    // T1 -> Division de la parte decimal
    // T2 -> CARACTER '0'
    // T3 -> CARACTER '9'
    // T4 -> CARACTER '.'

    const end = code.getLabel();
    const proc_decimal = code.getLabel();
    const error = code.getLabel();
    const proc_entero = code.getLabel();
    const next_char = code.getLabel();
    const enviar_numero = code.getLabel();

    code.addComment("Convirtiendo cadena a decimal");
    code.li(r.A1, 0);
    code.li(r.A2, 0);
    code.li(r.A3, 0);
    code.li(r.T1, 1);
    code.li(r.T4, 46);  // '.'
    code.li(r.T2, 0);
    code.fcvtsw(fr.FA2, r.T2);    // convierte a float

    const loop = code.addLabel();
    code.lb(r.T0, r.A0);    // caracter de la cadena
    code.beq(r.T0, r.ZERO, end);    // si llega al final de la cadena
    code.beq(r.T0, r.T4, proc_decimal);    // si es un punto
    code.li(r.T2, 48);  // '0'
    code.li(r.T3, 57);  // '9'
    code.blt(r.T0, r.T2, error);    // si es menor que '0'
    code.bgt(r.T0, r.T3, error);    // si es mayor que '9'
    code.sub(r.T0, r.T0, r.T2);    // resta '0' para obtener el valor numerico
    code.beq(r.A3, r.ZERO, proc_entero);    // si se esta leyendo la parte entera
    code.addComment("Procesando la parte decimal");
    code.li(r.T2, 10);
    code.mul(r.T1, r.T1, r.T2);    // T1 = T1 * 10
    code.fcvtsw(fr.FT1, r.T1);    // convierte a float
    code.mul(r.A2, r.A2, r.T2);    // A2 = A2 * 10
    code.add(r.A2, r.A2, r.T0);    // A2 = A2 + T0
    code.jump(next_char);
    code.addLabel(proc_entero);
    code.addComment("Procesando la parte entera");
    code.li(r.T2, 10);
    code.mul(r.A1, r.A1, r.T2);    // A1 = A1 * 10
    code.add(r.A1, r.A1, r.T0);    // A1 = A1 + T0
    code.jump(next_char);
    code.addLabel(proc_decimal);
    code.li(r.A3, 1);
    code.jump(next_char);
    code.addLabel(next_char);
    code.addi(r.A0, r.A0, 1);
    code.jump(loop);
    code.addLabel(end);
    code.addComment("Combinar la parte entera y parte float");
    code.fcvtsw(fr.FA1, r.A1);    // convierte a float
    code.fadd(fr.FT0, fr.FA1, fr.FA2);    // FT0 = FA1 + FA2
    code.beq(r.A3, r.ZERO, enviar_numero);    // si no se encontro un punto
    code.fcvtsw(fr.FA2, r.A2);    // convierte a float
    code.fdiv(fr.FA2, fr.FA2, fr.FT1);    // FA2 = FA2 / FT1
    code.fadd(fr.FT0, fr.FA1, fr.FA2);    // FT0 = FA1 + FA2
    code.ret();
    code.addLabel(enviar_numero);
    code.ret();
    code.addLabel(error);
    code.la(r.A0, "errorcadena");
    code.li(r.A7, 4);
    code.sysCall();
    code.la(r.A0, "salto");
    code.li(r.A7, 4);
    code.sysCall();
    code.fmv(fr.FT0, fr.FNULL);

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
    UpperCase,
    LowerCase,
    Atof,
    Atoi,
    Itoa,
}