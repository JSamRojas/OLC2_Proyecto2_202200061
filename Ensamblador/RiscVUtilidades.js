export const stringTo32BitArray = (str) => {
    const resultado = [];
    let index = 0;
    let intRepresentacion = 0;
    let shift = 0;

    while(index < str.length){
        intRepresentacion = intRepresentacion | (str.charCodeAt(index) << shift);
        shift += 8;
        if(shift >= 32){
            resultado.push(intRepresentacion);
            intRepresentacion = 0;
            shift = 0;
        }
        index++;
    }

    if(shift > 0){
        resultado.push(intRepresentacion);
    } else {
        resultado.push(0);
    }

    return resultado;

}

export const stringTo1ByteArray = (str) => {
    const resultado = [];
    let index = 0;

    while(index < str.length){
        resultado.push(str.charCodeAt(index));
        index++;
    }
    resultado.push(0);
    return resultado;
}

export const numberToF32 = (num) => {

    const buffer = new ArrayBuffer(4);
    const float32arr = new Float32Array(buffer);
    const uint32arr = new Uint32Array(buffer);
    float32arr[0] = num;

    const integer = uint32arr[0];
    const hexRepresentacion = integer.toString(16);
    return '0x' + hexRepresentacion;
}

