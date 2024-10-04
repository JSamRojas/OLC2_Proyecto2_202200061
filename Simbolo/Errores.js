class Errores {
    constructor(tipo, descripcion, linea, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;

    }

    getTipo(){
        return this.tipo;
    }

    getDescripcion(){
        return this.descripcion;
    }

    getLinea(){
        return this.linea;
    }

    getColumna(){
        return this.columna;
    }

    toString(){
        return `tipo: ${this.tipo} - descripcion: ${this.descripcion} - Linea: ${this.linea} - Columna: ${this.columna}`;
    }

}

export default Errores;