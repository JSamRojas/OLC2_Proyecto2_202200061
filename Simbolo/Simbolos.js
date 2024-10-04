class Simbolos{
    constructor(Nombre, Tipo, Valor, TipoEstruct, linea, Columna){
        this.Nombre = Nombre;
        this.Tipo = Tipo;
        this.Valor = Valor;
        this.TipoEstruct = TipoEstruct;
        this.Entorno = "";
        this.Mutabilidad = true;
        this.linea = linea;
        this.Columna = Columna;
    }

    getNombre(){
        return this.Nombre;
    }

    setNombre(Nombre){
        this.Nombre = Nombre;
    }

    getTipo(){
        return this.Tipo;
    }

    setTipo(Tipo){
        this.Tipo = Tipo;
    }

    getValor(){
        return this.Valor;
    }

    setValor(Valor){
        this.Valor = Valor;
    }
    
    getTipoEstruct(){
        return this.TipoEstruct;
    }

    setTipoEstruct(TipoEstruct){
        this.TipoEstruct = TipoEstruct;
    }

    getLinea(){
        return this.linea;
    }

    setLinea(linea){
        this.linea = linea;
    }

    getColumna(){
        return this.Columna;
    }

    setColumna(Columna){
        this.Columna = Columna;
    }

    setEntorno(Entorno){
        this.Entorno = Entorno;
    }

    setMutabilidad(Mutabilidad){
        this.Mutabilidad = Mutabilidad;
    }

    getMutabilidad(){
        return this.Mutabilidad;
    }

    getEntorno(){
        return this.Entorno;
    }

    setEntorno(Entorno){
        this.Entorno = Entorno;
    }

}

export default Simbolos;