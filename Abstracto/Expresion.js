class Expresion{
    constructor(Tipo, Linea, Columna){
        this.Tipo = Tipo;
        this.Linea = Linea;
        this.Columna = Columna;
    }

    Interpretar(arbol, tabla){
        throw new Error("Este metodo debe ser implementado");
    }
}

export default Expresion;