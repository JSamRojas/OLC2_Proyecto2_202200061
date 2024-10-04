import Simbolos from "./Simbolos.js";

class TablaSimbolos{

    constructor(TablaAnterior = null, Nombre = ""){
        this.TablaAnterior = TablaAnterior;
        this.TablaActual = new Map();
        this.Nombre = Nombre;
    }
    
    getTablaAnterior(){
        return this.TablaAnterior;
    }

    setTablaAnterior(TablaAnterior){
        this.TablaAnterior = TablaAnterior;
    }

    getTablaActual(){
        return this.TablaActual;
    }

    setTablaActual(TablaActual){
        this.TablaActual = TablaActual;
    }

    getNombre(){
        return this.Nombre;
    }

    setNombre(Nombre){
        this.Nombre = Nombre;
    }

    setVariable(simbolo){
        let busqueda = this.TablaActual.has(simbolo.getNombre());
        if(!busqueda){
            this.TablaActual.set(simbolo.getNombre(), simbolo);
            return true;
        }
        return false;
    }

    getVariable(id){
        for (let i = this; i !== null ; i = i.getTablaAnterior()) {
            let buscar = i.TablaActual.has(id);
            if(buscar){
                return i.TablaActual.get(id);
            }
        }
        return null;
    }

}

export default TablaSimbolos;