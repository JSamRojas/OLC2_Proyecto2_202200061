import Expresion from "../Abstracto/Expresion.js";
import { registros as r, float_registros as fr } from "../Ensamblador/RiscVConstantes.js";
import { RiscVGenerator } from "../Ensamblador/RiscVGenerator.js";


class Nativo extends Expresion{
    constructor(Valor, Tipo, Linea, Columna){
        super(Tipo, Linea, Columna);
        this.Valor = Valor;
    }

    // METODO USADO EN EL PROYECTO 1 PARA EJECUTAR LOS NATIVOS
    Interpretar(arbol, tabla){
        return this.Valor;
    }

    // METODO USADO EN EL PROYECTO 2 PARA TRADUCIR LOS NATIVOS
    Traducir(arbol, tabla, gen){
        gen.addComment('Inicio de la funcion nativa');
        gen.pushConstant({tipo: this.Tipo.getTipo(), valor: this.Valor});
        gen.addComment('Fin de la funcion nativa');
        return this.Valor;
    }

}

export default Nativo;