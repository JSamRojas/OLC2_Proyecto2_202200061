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
    const loop1 = code.getLabel();

    code.lb(r.T1, r.A0);
    code.beq(r.T1, r.ZERO, end1);
    code.sb(r.T1, r.HP);
    code.addi(r.HP, r.HP, 1);
    code.addi(r.A0, r.A0, 1);
    code.jump(loop1);
    code.addLabel(end1);

    code.addComment("Copiando la segunda cadena en el heap");
    const end2 = code.getLabel();
    const loop2 = code.getLabel();

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

export const functions = {
    concatString,
    Equal,
    lessOrEqual,
}