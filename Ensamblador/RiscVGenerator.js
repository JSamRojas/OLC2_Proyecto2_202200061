import { registros as r, float_registros as fr } from './RiscVConstantes.js';
import { functions } from './RiscVFunciones.js';
import { numberToF32, stringTo1ByteArray } from './RiscVUtilidades.js';

export class RiscVInstrucciones {
    
    constructor(instruccion, rd, rs1, rs2){
        this.instruccion = instruccion;
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString(){
        const operandos = [];
        if(this.rd !== undefined) operandos.push(this.rd);
        if(this.rs1 !== undefined) operandos.push(this.rs1);
        if(this.rs2 !== undefined) operandos.push(this.rs2);
        return `${this.instruccion} ${operandos.join(", ")}`;
    }
    
}

export class RiscVGenerator {
    constructor(){
        this.objectStack = [];
        this.depth = 0;
        this.Codigo = [];
        this._labelCounter = 0;
        this._usedFuncion = new Set();
        this.LabelBreak = null;
        this.LabelContinue = null;
    }

    getCode(){
        return this.Codigo;
    }

    // comentarios
    addComment(text){
        this.Codigo.push(new RiscVInstrucciones(`# ${text}`));
    }

    sysCall(){
        this.Codigo.push(new RiscVInstrucciones('ecall'));
    }

    // body label
    getLabel(){
        return `L${this._labelCounter++}`;
    }

    addLabel(label){
        label = label || this.getLabel();
        this.Codigo.push(`${label}:\n`);
        return label;
    }

    endProgram(){
        this.li(r.A7, 10);
        this.sysCall();
    }

// -------------------------------------> Operaciones aritmeticas <-------------------------------------

    // add (addition)
    add(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('add', rd, rs1, rs2));
    }

    // sub (substract)
    sub(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('sub', rd, rs1, rs2));
    }

    // mul (multiply)
    mul(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('mul', rd, rs1, rs2));
    }

    // div (divide)
    div(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('div', rd, rs1, rs2));
    }

    // divu (divide unsigned)
    divu(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('divu', rd, rs1, rs2));
    }

    // rem (module)
    rem(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('rem', rd, rs1, rs2));
    }

    // neg (negate)
    neg(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('neg', rd, rs1));
    }

    // addi (add immediate)
    addi(rd, rs1, inmediato){
        this.Codigo.push(new RiscVInstrucciones("addi", rd, rs1, inmediato));
    }

// -------------------------------------> Operaciones logicas <-------------------------------------

    // and (and)
    and(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('and', rd, rs1, rs2));
    }

    // or (or)
    or(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('or', rd, rs1, rs2));
    }

// -------------------------------------> Instrucciones de carga (valor y memoria) <-------------------------------------

    // sw (store word)
    sw(rs1, rs2, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('sw', rs1, `${inmediato}(${rs2})`));
    }

    // sb (store byte)
    sb(rs1, rs2, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('sb', rs1, `${inmediato}(${rs2})`));
    }

    // lw (load word)
    lw(rd, rs1, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('lw', rd, `${inmediato}(${rs1})`));
    }

    // lb (load byte)
    lb(rd, rs1, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('lb', rd, `${inmediato}(${rs1})`));
    }

    // li (load immediate)
    li(registro, valor){
        this.Codigo.push(new RiscVInstrucciones('li', registro, valor));
    }

    // la (load address)
    la(registro, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('la', registro, etiqueta));
    }

    // mv (move)
    mv(op1, op2){
        this.Codigo.push(new RiscVInstrucciones('mv', op1, op2));
    }

// -------------------------------------> Saltos condicionales <-------------------------------------

    // Beq (Branch Equal) || ==
    beq(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('beq', op1, op2, etiqueta));
    }

    // Beqz (Branch Equal Zero) || == 0
    beqz(op1, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('beqz', op1, etiqueta));
    }

    // Bne (Branch Not Equal) || !=
    bne(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('bne', op1, op2, etiqueta));
    }

    // bnez (Branch Not Equal Zero) || != 0
    bnez(op1, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('bnez', op1, etiqueta));
    }

    // Blt (Branch Less Than) || <
    blt(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('blt', op1, op2, etiqueta));
    }

    // Blez (Branch Less or Equal Zero) || <= 0
    blez(op1, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('blez', op1, etiqueta));
    }

    // Ble (Branch Less or Equal) || <=
    ble(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('ble', op1, op2, etiqueta));
    }

    // Bge (Branch Greater or Equal) || >=
    bge(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('bge', op1, op2, etiqueta));
    }

    // Bgt (Branch Greater Than) || >
    bgt(op1, op2, etiqueta){
        this.Codigo.push(new RiscVInstrucciones('bgt', op1, op2, etiqueta));
    }

    // Jal (Jump and Link)
    jal(etiqueta){
        this.Codigo.push(new RiscVInstrucciones('jal', etiqueta));
    }

    // J (Jump)
    jump(etiqueta){
        this.Codigo.push(new RiscVInstrucciones('j', etiqueta));
    }

    // ret (return)
    ret(){
        this.Codigo.push(new RiscVInstrucciones('ret'));
    }

// -------------------------------------> Operaciones con la pila <-------------------------------------

    /* 

        PARA AVANZAR EN | HACER MAS GRANDE LA PILA, SE DEBE RESTAR 4 BYTES (32 BITS)
        PARA RETROCEDER EN | HACER MAS PEQUEÑA LA PILA, SE DEBE SUMAR 4 BYTES (32 BITS)
    
    */

    // push
    push(rd = r.T0){
        this.addi(r.SP, r.SP, -4);  // -4 bytes = -32 bits (avanzar en la pila)
        this.sw(rd, r.SP);
    }

    // push float
    pushFloat(rd = fr.FT0){
        this.addi(r.SP, r.SP, -4);  // -4 bytes = -32 bits  (avanzar en la pila)
        this.fsw(rd, r.SP);
    }

    // pop
    pop(rd = r.T0){
        this.lw(rd, r.SP);
        this.addi(r.SP, r.SP, 4);  // 4 bytes = 32 bits (retroceder en la pila)
    }

    // para obtener el ultimo objeto en el stack
    getTopObject(){
        return this.objectStack[this.objectStack.length - 1];
    }

    // push objeto a la pila del compilador
    pushObject(object){
        this.objectStack.push({...object, depth: this.depth});
    }

    // push constante
    pushConstant(objeto){
        let length = 0;

        switch(objeto.tipo){
            case "ENTERO":

                this.li(r.T0, objeto.valor);
                this.push();
                length = 4;
                break;

            case "CADENA":

                const stringArray = stringTo1ByteArray(objeto.valor);
                this.addComment(`Agregando string ${objeto.valor}`);
                this.push(r.HP);

                stringArray.forEach((charCode) => {
                    this.li(r.T0, charCode);
                    this.sb(r.T0, r.HP);
                    this.addi(r.HP, r.HP, 1);
                });

                length = 4;
                break;

            case "DECIMAL":

                const ieee754 = numberToF32(objeto.valor);
                this.li(r.T0, ieee754);
                this.push(r.T0);
                length = 4;
                break;

            case "BOOLEANO":

                this.li(r.T0, objeto.valor ? 1 : 0);
                this.push(r.T0);
                length = 4;
                break;
            
            case "CARACTER":

                this.addComment(`Agregando caracter ${objeto.valor}`);
                this.li(r.T0, objeto.valor.charCodeAt(0));
                this.push(r.T0);
                length = 4;
                break;
            
            case "VOID":

                this.push(r.NULL);
                length = 4;
                break;
            
            default:
                break;
        }

        this.pushObject({tipo: objeto.tipo, length, depth: this.depth});

    }

    // pop Objeto
    popObject(rd = r.T0){
        const object = this.objectStack.pop();

        switch(object.tipo){
            case "ENTERO":

                this.pop(rd);
                break;
            
            case "CADENA":

                this.pop(rd);
                break;
            
            case "VOID":

                this.pop(rd);
                break;
            
            case "CARACTER":

                this.pop(rd);
                break;
            
            case "DECIMAL":
                
                this.popFloat(rd);
                break;
            
            case "BOOLEANO":
                
                this.pop(rd);
                break;
            
            default:
                
                break;
            
        }

        return object;

    }

// -------------------------------------> Instrucciones variadas <-------------------------------------

    // call Function
    callFunction(functionName){
        if(!functions[functionName]){
            throw new Error(`La función ${functionName} no existe`);
        }
        this._usedFuncion.add(functionName);
        this.jal(functionName);
    }

    // print INTEGER
    print_INT(rd = r.A0){
        if(rd !== r.A0){
            this.push(r.A0);
            this.add(r.A0, rd, r.ZERO);
        }

        this.addComment("Comparando si no es null");

        const esnull = this.getLabel();
        const end = this.getLabel();

        this.beq(r.A0, r.NULL, esnull);
        this.li(r.A7, 1);
        this.sysCall();
        this.jump(end);
        this.addLabel(esnull);
        this.li(r.A7, 4);
        this.sysCall();
        this.addLabel(end);

        if(rd !== r.A0){
            this.pop(r.A0);
        }

        this.addComment("Fin de la impresion de un entero");

    }

    // print STRING
    print_STRING(rd = r.A0){

        if(rd !== r.A0){
            this.push(r.A0);
            this.add(r.A0, rd, r.ZERO);
        }

        this.addComment("Comparando si no es null");

        const esnull = this.getLabel();
        const end = this.getLabel();
        
        this.beq(r.A0, r.NULL, esnull);
        this.li(r.A7, 4);
        this.sysCall();
        this.jump(end);
        this.addLabel(esnull);
        this.li(r.A7, 4);
        this.sysCall();
        this.addLabel(end);

        if(rd !== r.A0){
            this.pop(r.A0);
        }

        this.addComment("Fin de la impresion de una cadena");

    }

    // print CARACTER
    print_CHAR(rd = r.A0){

        if(rd !== r.A0){
            this.push(r.A0);
            this.add(r.A0, rd, r.ZERO);
        }

        this.addComment("Comparando si no es null");

        const esnull = this.getLabel();
        const end = this.getLabel();
        
        this.beq(r.A0, r.NULL, esnull);
        this.li(r.A7, 11);
        this.sysCall();
        this.jump(end);
        this.addLabel(esnull);
        this.li(r.A7, 4);
        this.sysCall();
        this.addLabel(end);

        if(rd !== r.A0){
            this.pop(r.A0);
        }
    }

    // convertir el codigo a cadena para poder ejecutarlo
    toString(){
        this.addComment("Fin del programa");
        this.endProgram();
        this.addComment("Funciones del programa");

        Array.from(this._usedFuncion).forEach(funcionName => {
            this.addLabel(funcionName);
            functions[funcionName](this);
            this.ret();
        })

        return `
.data
        salto:   .string "\\n"
        errordiv:  .string "Error: division por cero"
        errorcadena: .string "Error: La cadena no puede ser convertida a entero/float"
        null:    .string "null"
        entero:  .string "int"
        decimal: .string "float"
        cadena:  .string "string"
        caracter: .string "char"
        boolean: .string "boolean"
        true:    .string "true"
        false:   .string "false"
        heap:
    
.text

# inicializando el heap pointer
    la ${r.HP}, heap
    la ${r.NULL}, null    # servira para comparar si algun valor es null
    fcvt.s.w ft5, t5    # convertir el valor de t5 a float (para saber si algun float es null)
    fmv.s.x ft11, zero  # valor 0 en float (servira como el zero para los floats)
    
main:
        
    ${this.Codigo.map(instruccion => `${instruccion}`).join('\n')}

    `
    }


// -------------------------------------> Instrucciones para entornos <-------------------------------------

    // se inicia un nuevo entorno (se aumenta la profundidad)
    newScope(){
        this.depth++;
    }

    // se termina un entorno (se disminuye la profundidad)
    endScope(){
        let contador = 0;

        for(let i = this.objectStack.length - 1; i >= 0; i--){
            if(this.objectStack[i].depth === this.depth){
                contador += this.objectStack[i].length;
                this.objectStack.pop();
            } else {
                break;
            }
        }
        this.depth--;

        return contador;
    }

    // se agrega el nombre de la variable a la pila del compilador
    tagObject(id){
        this.objectStack[this.objectStack.length - 1].id = id;
    }

    // se obtiene el simbolo de la tabla de simbolos
    getObject(id){
        let contador = 0;
        for(let i = this.objectStack.length - 1; i >= 0; i--){
            if(this.objectStack[i].id === id){
                return [contador, this.objectStack[i]];
            }
            contador += this.objectStack[i].length;
        }

        throw new Error(`La variable ${id} no existe`);

    }

    // se quiere agregar una variable a la pila del compilador (si existe se retorna false y no se agrega)
    addObject(id, idDepth){
        for(let i = this.objectStack.length - 1; i >= 0; i--){
            if(this.objectStack[i].depth === idDepth){
                if(this.objectStack[i].id === id){
                    return false;
                }
            } else {
                break;
            }
        }
        return true;
    }

    // se obtiene la profundidad actual
    getDepth(){
        return this.depth;
    }


// -------------------------------------> Instrucciones de flotantes <-------------------------------------

    // fadd.s (floating point add)
    fadd(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('fadd.s', rd, rs1, rs2));
    }

    // fsub.s (floating point substract)
    fsub(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('fsub.s', rd, rs1, rs2));
    }

    // fmul.s (floating point multiply)
    fmul(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('fmul.s', rd, rs1, rs2));
    }

    // fdiv.s (floating point divide)
    fdiv(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('fdiv.s', rd, rs1, rs2));
    }

    // fneg.s (floating point negate)
    fneg(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('fneg.s', rd, rs1));
    }

    // flit.s (floating point load immediate)
    fli(rd, valor){
        this.Codigo.push(new RiscVInstrucciones('fli.s', rd, valor));
    }

    // fmv.s (floating point move)
    fmv(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('fmv.s', rd, rs1));
    }

    // fmv.s.x (floating point move from integer)
    fmvx(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('fmv.s.x', rd, rs1));
    }

    // flw (floating point load word)
    flw(rd, rs1, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('flw', rd, `${inmediato}(${rs1})`));
    }

    // fsw (floating point store word)
    fsw(rs1, rs2, inmediato = 0){
        this.Codigo.push(new RiscVInstrucciones('fsw', rs1, `${inmediato}(${rs2})`));
    }

    // fcvt.s.w (floating point convert single to word)
    fcvtsw(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('fcvt.s.w', rd, rs1));
    }

    // fcvt.w.s (floating point convert word to single)
    fcvtws(rd, rs1){
        this.Codigo.push(new RiscVInstrucciones('fcvt.w.s', rd, rs1));
    }

    //flt (floating point less than)
    flt(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('flt.s', rd, rs1, rs2));
    }

    // fle (floating point less or equal)
    fle(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('fle.s', rd, rs1, rs2));
    }

    // feq (floating point equal)
    feq(rd, rs1, rs2){
        this.Codigo.push(new RiscVInstrucciones('feq.s', rd, rs1, rs2));
    }

    // pop float
    popFloat(rd = fr.FT0){
        this.flw(rd, r.SP);
        this.addi(r.SP, r.SP, 4);  // 4 bytes = 32 bits (retroceder en la pila)
    }

    printFloat(){

        const Nonull = this.getLabel();
        const end = this.getLabel();

        this.addComment("Comparando si no es null");

        this.push(r.A0);
        this.mv(r.A0, r.NULL);

        this.feq(r.T4, fr.FA0, fr.FNULL);
        this.beq(r.T4, r.ZERO, Nonull);

        this.li(r.A7, 4);
        this.sysCall();
        this.jump(end);
        this.addLabel(Nonull);
        this.li(r.A7, 2);
        this.sysCall();
        this.addLabel(end);
        this.pop(r.A0);

        this.addComment("Fin de la impresion de un decimal");

    }

}

export default RiscVInstrucciones;