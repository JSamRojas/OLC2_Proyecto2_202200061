//-------------------- Imports ----------------------

{
  const ARITHMETIC_OP = {
    SUMA: "SUMA",
    MENOS: "MENOS",
    MULTIPLICACION: "MULTIPLICACION",
    DIVISION: "DIVISION",
    MODULO: "MODULO",
    NEGACION: "NEGACION",
  };

  const RELATIONAL_OP = {
    MENOR_QUE: "MENOR_QUE",
    MENOR_IGUAL: "MENOR_IGUAL",
    MAYOR_QUE: "MAYOR_QUE",
    MAYOR_IGUAL: "MAYOR_IGUAL",
    IGUAL: "IGUAL",
    NO_IGUAL: "NO_IGUAL",
  };

  const LOGICAL_OP = {
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
  };

  const MOD_OP = {
    AUMENTO: "AUMENTO",
    DECREMENTO: "DECREMENTO",
    AUMENTO_FOR: "AUMENTO_FOR",
    DECREMENTO_FOR: "DECREMENTO_FOR",
  };

  let contador = 0;
  let numeros = [];
  let atributosMap = new Map();

}

//-------------------- Analisis Sintactico ----------------------

S
  = instrucciones

instrucciones 
  = _ inst:instruccion list:instruccionesp { return [inst].concat(list); }

instruccionesp 
  = list:instrucciones { return list; }
  / epsilon { return []; }

instruccion =  inst:print
  / inst:declaracion_funcion
  / inst:llamada_funcion
  / inst:declaracion_struct
  / inst:instancia_struct
  / inst:asignacion_struct
  / inst:declaracion_var
  / inst:asignacion_var
  / inst:declaracion_array
  / inst:asignacion_array
  / inst:if_else_if
  / inst:switch_case
  / inst:while_state
  / inst:for_state
  / inst:foreach_state
  / inst:break_state
  / inst:continue_state
  / inst:return_state
  

// GRAMATICA PARA EL SOUT
print
  = SOUTtoken "(" _ expr:expresion_lista _ ")" _ ";" _ {
  const loc = location()?.start;
  return new Instr_Sout(expr, loc?.line, loc?.column);
  }
// GRAMATICA PARA LA DECLARACION DE FUNCIONES
declaracion_funcion
  = type:tipo _ id:ID _ "(" _ params:lista_params _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_Funcion(id, null, instr, params, "Variable", type, loc?.line, loc?.column);
    }
  / type:tipo _ "[" _ "]" _ id:ID _ "(" _ params:lista_params _ ")" _ "{" _ instr: instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_Funcion(id, null, instr, params, "Array", type, loc?.line, loc?.column);
    }
  / tipofunc:ID _ id:ID _ "(" _ params:lista_params _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_Funcion(id, tipofunc, instr, params, "Variable", new Tipo(DatoNativo.STRUCT), loc?.line, loc?.column);
    }

lista_params
  = head:parametro rest:( _ "," _ parametro)* {
    return [head, ...rest.map(r => r[3])];
  }
  / epsilon { return []; }

parametro 
  = type:(tipo/ID) _ id:ID {
    return {identificador: id, tipoDato: type, tipoEstruct: "Variable"};
  }
  / type:(tipo/ID) _ "[" _ "]" _ id:ID {
    return {identificador: id, tipoDato: type, tipoEstruct: "Array"};
  }
// GRAMATICA PARA LA LLAMADA DE FUNCIONES
llamada_funcion
  = id:ID _ "(" _ params:parametros_funcion _ ")" _ ";" _ {
    const loc = location()?.start;
    return new Instr_LlamadaFunc(id, params, false, loc?.line, loc?.column);
  }

parametros_funcion
  = head:expresion rest:(_ "," _ expresion)* {
    return [head, ...rest.map(r => r[3])];
  }
  / epsilon { return []; }

// GRAMATICA PARA LA DECLARACION DE STRUCTS
declaracion_struct
  = _ Structtoken _ id:ID _ "{" _ atrib:limpiarMapa _ "}" _ ";" _ {
    const loc = location()?.start;
    let MapaGen = new Map(atrib);
    return new Instr_DeclaracionStruct(id, MapaGen, loc?.line, loc?.column);
  }

limpiarMapa 
  = list:lista_atrib {
    let Mapaux = new Map(list);
    atributosMap.clear();
    return Mapaux;
  }

lista_atrib

  = ( _ type:(tipo/ID) _ id:ID _ ";" _ {atributosMap.set(id, {tipo: type, valor: null});})+ {
    return atributosMap;
  }

// GRAMATICA PARA LA INSTANCIA DE STRUCTS
instancia_struct
  = Vartoken _ idvar:ID _ "=" _ idstruct:ID _ "{" _ valores:valores_struct _ "}" _ ";" _ {
      const loc = location()?.start;
      return new Instr_InstanciaStruct(idstruct, idvar, valores, loc?.line, loc?.column);
    }
  / idstruct1:ID _ idvar:ID _ "=" _ idstuct2:ID _ "{" _ valores:valores_struct _ "}" _ ";" _ {
      const loc = location()?.start;
      if(idstruct1 !== idstuct2){
        return new Errores("Error Semantico", "No se puede asignar un struct de tipo " + idstuct2 + " a un struct de tipo " + idstruct1, loc?.line, loc?.column);
      }
      return new Instr_InstanciaStruct(idstuct2, idvar, valores, loc?.line, loc?.column);
    }

valores_struct
  = head:atributo _ rest:( _ "," _ atributo)* {
    return [head, ...rest.map(r => r[3])];
  }

atributo
  = clave:ID _ ":" _ valor:(expr_atrib/expresion) _ {
    return {key: clave, value: valor};
  }
expr_atrib

  = idstruct:ID _ "{" _ valores:valores_struct _ "}" _ {
      return [idstruct, [...valores]];
    }

// GRAMATICA PARA LA ASIGNACION DE STRUCTS
asignacion_struct
  = head:ID rest:( _ "." _ ID)+ _ "=" _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Instr_ModificacionStruct(head, [...rest.map(r => r[3])], expr, loc?.line, loc?.column);
  }
// GRAMATICA PARA EL FOR
for_state
  = Fortoken _ "(" _ decl:declaracion_var _ cond:expresion _ ";" _ mod:act_for _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_For(decl, cond, mod, instr, loc?.line, loc?.column);
    }
  / Fortoken _ "(" _ asig:asignacion_var _ cond:expresion _ ";" _ mod:act_for _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_For(asig, cond, mod, instr, loc?.line, loc?.column);
    }

act_for
  = id:ID"++" {
    const loc = location()?.start;
    return new Instr_ModificacionVar(id, null, MOD_OP.AUMENTO_FOR, loc?.line, loc?.column);
    }

  / id:ID"--" {
    const loc = location()?.start;
    return new Instr_ModificacionVar(id, null, MOD_OP.DECREMENTO_FOR, loc?.line, loc?.column);
    }

  / id:ID _ "=" _ expr:expresion _ {
    const loc = location()?.start;
    return new Instr_ModificacionVar(id, expr, null, loc?.line, loc?.column);
    }

  / id:ID _ operador:("+="/"-=") _ expr:expresion _ {
    const loc = location()?.start;
    if(operador === "+=") return new Instr_ModificacionVar(id, expr, MOD_OP.AUMENTO, loc?.line, loc?.column);
    else if(operador === "-=") return new Instr_ModificacionVar(id, expr, MOD_OP.DECREMENTO, loc?.line, loc?.column);
  }

// GRAMATICA PARA EL FOREACH
foreach_state
  = Fortoken _ "(" _ type:tipo _ id:ID _ ":" _ id2:ID _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_ForEach(id, id2, type, instr, loc?.line, loc?.column);
    }

// GRAMATICA PARA EL WHILE
while_state
  = Whiletoken _ "(" _ cond:expresion _ ")" _ "{" _ instr:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_While(cond, instr, loc?.line, loc?.column);
  }

// GRAMATICA PARA EL SWITCH CASE
switch_case
  = Switchtoken _ "(" _ cond:expresion _ ")" _ "{" _ cases:cases_switch _ "}" _ {
    const loc = location()?.start;
    return new Instr_Switch(cond, cases, loc?.line, loc?.column);
    }

cases_switch
  = _ cases:caso list:casoesp { return [cases].concat(list); }

casoesp
  = list:cases_switch { return list; }
  / epsilon { return []; }

caso
  = Casetoken _ valor:expresion _ ":" _ instr:instrucciones _ {
    const loc = location()?.start;
    return new Casos_switch(valor, instr, true, loc?.line, loc?.column);
    }

  / Casetoken _ valor:expresion ":" _ {
    const loc = location()?.start;
    return new Casos_switch(valor, null, true, loc?.line, loc?.column);
    }

  / Defaulttoken _ ":" _ instr:instrucciones _ {
    const loc = location()?.start;
    return new Casos_switch(null, instr, false, loc?.line, loc?.column);
    }  

// GRAMATICA PARA EL IF ELSE IF
if_else_if
  = Iftoken _ "(" _ condicion:expresion _ ")" _ "{" _ instIF:instrucciones _ "}" _ Elsetoken _ NextIF:if_else_if _ {
    const loc = location()?.start;
    return new Instr_If(condicion, instIF, null, NextIF, loc?.line, loc?.column);
    }
  
  / Iftoken _ "(" _ condicion:expresion _ ")" _ "{" _ instIF:instrucciones _ "}" _ Elsetoken _ "{" _  instELSE:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_If(condicion, instIF, instELSE, null, loc?.line, loc?.column);
    }
  
  / Iftoken _ "(" _ condicion:expresion _ ")" _ "{" _ instIF:instrucciones _ "}" _ {
    const loc = location()?.start;
    return new Instr_If(condicion, instIF, null, null, loc?.line, loc?.column);
    }

// GRAMATICA PARA DECLARACION Y ASIGNACION DE ARRAYS Y MATRICES
declaracion_array
  = type:tipo _ cont:lista_corchetes _ id:ID _ "=" _ expr:expresion_array _ ";" _ {
      const loc = location()?.start;
      if(cont === 1){
        return new Instr_DeclaracionArray(id, type, expr, null, null, loc?.line, loc?.column);
      } else {
        return new Instr_DeclaracionMatriz(id, type, expr, null, null, loc?.line, loc?.column);
      }
    }

  / type:tipo _ cont:lista_corchetes _ id:ID _ "=" _ Newtoken _ type2:tipo _ cant:corchetes_numeros _ ";" _ {
      const loc = location()?.start;
      if(type.getTipo() === type2.getTipo()){
        if(cont === 1 && cont === cant.length){
          return new Instr_DeclaracionArray(id, type, null, [...cant], null, loc?.line, loc?.column);
        } else if(cont > 1 && cont === cant.length){
          return new Instr_DeclaracionMatriz(id, type, null, [...cant], null, loc?.line, loc?.column);
        } else {
          return new Errores("Error Semantico", "La cantidad de corchetes no coincide con la cantidad de dimensiones", loc?.line, loc?.column);
        }
      } else {
        return new Errores("Error Semantico", "No se puede asignar un array de tipo " + type2.getTipo() + " a un array de tipo " + type.getTipo(), loc?.line, loc?.column);
      }
    }

  / type:tipo _ cont:lista_corchetes _ id:ID _ "=" _ id2:ID _ ";" _ {
      const loc = location()?.start;
      if(cont === 1){
        return new Instr_DeclaracionArray(id, type, null, null, id2, loc?.line, loc?.column);
      } else {
        return new Instr_DeclaracionMatriz(id, type, null, null, id2, loc?.line, loc?.column);
      }
    }

asignacion_array
  = id:ID _ index:corchetes_numeros _ "=" _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Instr_ModificacionArray(id, index, expr, null, loc?.line, loc?.column);
    }

  / id:ID _ index:corchetes_numeros _ "=" _ expr:expresion_array _ ";" _ {
    const loc = location()?.start;
    return new Instr_ModificacionArray(id, index, expr, null, loc?.line, loc?.column);
    }

// GRAMATICA PARA DECLARACION Y ASIGNACION DE VARIABLES
asignacion_var
  = id:ID _ "=" _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Instr_ModificacionVar(id, expr, null, loc?.line, loc?.column);
    }

  / id:ID _ operador:("+=" / "-=") _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    if(operador === "+=") return new Instr_ModificacionVar(id, expr, MOD_OP.AUMENTO, loc?.line, loc?.column);
    else if(operador === "-=") return new Instr_ModificacionVar(id, expr, MOD_OP.DECREMENTO, loc?.line, loc?.column);
    }

declaracion_var
  = "var" _ id:ID _ "=" _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Instr_DeclaracionVar(id, expr, new Tipo(DatoNativo.VOID), loc?.line, loc?.column);
    }
  
  / type:tipo _ id:ID _ "=" _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Instr_DeclaracionVar(id, expr, type, loc?.line, loc?.column);
    }

  / type:tipo _ id:ID _ ";" _ {
    const loc = location()?.start;
    return new Instr_DeclaracionVar(id, null, type, loc?.line, loc?.column);
    }

// GRAMATICA PARA EL BREAK
break_state
  = Breaktoken _ ";" _ {
    const loc = location()?.start;
    return new Instr_Break(loc?.line, loc?.column);
  }

// GRAMATICA PARA EL CONTINUE
continue_state
  = Continuetoken _ ";" _ {
    const loc = location()?.start;
    return new Instr_Continue(loc?.line, loc?.column);
  }


// GRAMATICA PARA EL RETURN
return_state
  = Returntoken _ expr:expresion _ ";" _ {
    const loc = location()?.start;
    return new Expr_Return(expr, loc?.line, loc?.column);
    }
  / Returntoken _ ";" _ {
    const loc = location()?.start;
    return new Expr_Return(null, loc?.line, loc?.column);
    }
// GRAMATICA PARA RECONOCER TODAS LAS EXPRESIONES
expresion =
  expresion_ternaria

expresion_ternaria
  = condicion:expresion_or _ "?" _ verdadero:expresion_or _ ":" _ falso:expresion_ternaria _ {
    const loc = location()?.start;
    return new Expr_Ternaria(condicion, verdadero, falso, loc?.line, loc?.column);
  }
  / expresion_or

expresion_or
  = izq:expresion_and _ "||" _ der:expresion_and _ {
    const loc = location()?.start;
    return new Expr_Logicas(null, izq, der, LOGICAL_OP.OR, loc?.line, loc?.column);
  }
  / expresion_and

expresion_and
  = izq:expresion_igualdad _ "&&" _ der:expresion_igualdad _ {
    const loc = location()?.start;
    return new Expr_Logicas(null, izq, der, LOGICAL_OP.AND, loc?.line, loc?.column);
  }
  / expresion_igualdad

expresion_igualdad
  = izq:expresion_relacional _ operador:("==" / "!=") _ der:expresion_relacional _ {
    const loc = location()?.start;
    if(operador === "==") return new Expr_Relacionales(izq, der, RELATIONAL_OP.IGUAL, loc?.line, loc?.column);
    else if (operador === "!=") return new Expr_Relacionales(izq, der, RELATIONAL_OP.NO_IGUAL, loc?.line, loc?.column);
  }
  / expresion_relacional

expresion_relacional
  = izq:expresion_aditiva _ operador:("<=" / "<" / ">=" / ">") _ der:expresion_aditiva _ {
    const loc = location()?.start;
    if(operador === "<") return new Expr_Relacionales(izq, der, RELATIONAL_OP.MENOR_QUE, loc?.line, loc?.column);
    else if(operador === "<=") return new Expr_Relacionales(izq, der, RELATIONAL_OP.MENOR_IGUAL, loc?.line, loc?.column);
    else if(operador === ">") return new Expr_Relacionales(izq, der, RELATIONAL_OP.MAYOR_QUE, loc?.line, loc?.column);
    else if(operador === ">=") return new Expr_Relacionales(izq, der, RELATIONAL_OP.MAYOR_IGUAL, loc?.line, loc?.column);
  }
  / expresion_aditiva

expresion_aditiva
  = izq:expresion_multi tail:( _ ( "+" / "-" ) _ expresion_multi)* {
    return tail.reduce(function(result, element){
      const loc = location()?.start;
      if(element[1] === "+") { return new Expr_Aritmeticas(null, result, element[3], ARITHMETIC_OP.SUMA, loc?.line, loc?.column); }
      else if(element[1] === "-") { return new Expr_Aritmeticas(null, result, element[3], ARITHMETIC_OP.MENOS, loc?.line, loc?.column); }
    }, izq);
  }

expresion_multi
  = izq:expresion_unaria tail:( _ ("*"/"/"/"%") _ expresion_unaria)* {
    return tail.reduce(function(result, element){
      const loc = location()?.start;
      if(element[1] === "*") { return new Expr_Aritmeticas(null, result, element[3], ARITHMETIC_OP.MULTIPLICACION, loc?.line, loc?.column); }
      else if(element[1] === "/") { return new Expr_Aritmeticas(null, result, element[3], ARITHMETIC_OP.DIVISION, loc?.line, loc?.column); }
      else if(element[1] === "%") { return new Expr_Aritmeticas(null, result, element[3], ARITHMETIC_OP.MODULO, loc?.line, loc?.column); }
    }, izq);
  }

expresion_unaria
  = _ "!" _ expr:expresion_unaria _ {
    const loc = location()?.start;
    return new Expr_Logicas(expr, null, null, LOGICAL_OP.NOT, loc?.line, loc?.column);
    }
  / "-" _ expr:expresion_primaria _ { 
    const loc = location()?.start;
    return new Expr_Aritmeticas(expr, null, null, ARITHMETIC_OP.NEGACION, loc?.line, loc?.column); 
    }
  / expresion_primaria

expresion_primaria
  = "(" _ expr:expresion _ ")" _ { return expr; }
  / "[" _ expr:expresion _ "]" _ { return expr; }
  / terminal

expresion_array
  = "{" _ head:valor_array tail:(_ "," _ valor_array)* _ "}" _ {
    return [head].concat(tail.map(function(element) {return element[3];}));
  }

expresion_lista
  = head:expresion rest:( _ "," _ expresion)* {
    return [head, ...rest.map(r => r[3])];
  } 
  / epsilon { return []; }

lista_corchetes 
  = result:lista_corchetesEsp {
    contador = 0;
    return result;
    }

lista_corchetesEsp
  = ( _ "[" _ "]" _  {contador += 1;})+ {
    return contador;
    }

corchetes_numeros
  = result:corchetes_numerosEsp {
    numeros = [];
    return result;
    }

corchetes_numerosEsp
  = ( _ "[" _ expr:expresion _ "]" _ {numeros.push(expr);})+ {
    return numeros;
  }

call_func_expr
  = id:ID _ "(" _ params:parametros_funcion _ ")" _ {
    const loc = location()?.start;
    return new Instr_LlamadaFunc(id, params, true, loc?.line, loc?.column);
  }

valor_array
  = expresion_array
    / expresion

terminal
  = valor:DECIMAL {
    const loc = location()?.start;
    return new Nativo(valor, new Tipo(DatoNativo.DECIMAL), loc?.line, loc?.column);
  } 
  / valor:INTEGER {
    const loc = location()?.start;
    return new Nativo(valor, new Tipo(DatoNativo.ENTERO), loc?.line, loc?.column);
  }
  / valor:BOOLEAN {
    const loc = location()?.start;
    return new Nativo(valor, new Tipo(DatoNativo.BOOLEANO), loc?.line, loc?.column);
  }
  / valor:CADENA {
    const loc = location()?.start;
    return new Nativo(valor, new Tipo(DatoNativo.CADENA), loc?.line, loc?.column);
  }
  / valor:CARACTER {
    const loc = location()?.start;
    return new Nativo(valor, new Tipo(DatoNativo.CARACTER), loc?.line, loc?.column);
  }
  / _ Objectkeystoken _ "(" _ id:ID _ ")" _ {
    const loc = location()?.start;
    return new Expr_ObjectKeys(id, loc?.line, loc?.column);
  }
  / _ Parsefloattoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_ParseFloat(expr, loc?.line, loc?.column);
  }
  / _ Parseinttoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_ParseInt(expr, loc?.line, loc?.column);
  }
  / _ Tostringtoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_ToString(expr, loc?.line, loc?.column);
  }
  / _ Tolowercasetoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_ToLowerCase(expr, loc?.line, loc?.column);
  }
  / _ Touppercasetoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_ToUpperCase(expr, loc?.line, loc?.column);
  }
  / _ Typeoftoken _ expr:expresion _ {
    const loc = location()?.start;
    return new Expr_TypeOf(expr, loc?.line, loc?.column);
  }
  / valor:ID _ "." _ Lengthtoken _ {
    const loc = location()?.start;
    return new Expr_Length(valor, loc?.line, loc?.column);
  }
  / valor:ID _ "." _ Jointoken _ "(" _ ")" _ {
    const loc = location()?.start;
    return new Expr_Join(valor, loc?.line, loc?.column);
  }
  / valor:ID _ "." _ IndexOftoken _ "(" _ expr:expresion _ ")" _ {
    const loc = location()?.start;
    return new Expr_IndexOf(valor, expr, loc?.line, loc?.column);
  }
  / valor:ID _ pos:corchetes_numeros _ {
    const loc = location()?.start;
    if(pos.length === 1){
      return new Expr_AccesoArray(valor, [...pos], loc?.line, loc?.column);
    } else {
      return new Expr_AccesoMatriz(valor, [...pos], loc?.line, loc?.column);
    }
  }
  / _ id:(call_func_expr/ID) rest:( _ "." _ (call_func_expr/ID))+ _ {
    const loc = location()?.start;
    return new Expr_AccesoStruct(id, [...rest.map(r => r[3])], loc?.line, loc?.column);
  }
  / list:call_func_expr { return list; }
  / valor:ID {
    const loc = location()?.start;
    return new Expr_AccesoVar(valor, loc?.line, loc?.column);
  }

tipo 
  = type:(_("int"/"float"/"string"/"boolean"/"char"/"void")_){
    if(type[1] === "int") return (new Tipo(DatoNativo.ENTERO));
    else if(type[1] === "float") return (new Tipo(DatoNativo.DECIMAL));
    else if(type[1] === "string") return (new Tipo(DatoNativo.CADENA));
    else if(type[1] === "boolean") return (new Tipo(DatoNativo.BOOLEANO));
    else if(type[1] === "char") return (new Tipo(DatoNativo.CARACTER));
    else if(type[1] === "void") return (new Tipo(DatoNativo.VOID));
  }

//-------------------- Analisis Lexico ----------------------

FindeLinea = [\n\r\u2028\u2029]

epsilon = ''

Comentario "comentario" =
  ComentMultilinea
  / ComentLinea

ComentMultilinea = "/*" (!"*/" .)* "*/"

ComentLinea = "//" (!FindeLinea .)*

_ "Espacio"
  =  (Comentario / [ \t\n\r]+)* { return null; }

INTEGER "integer"
  = _ [0-9]+ { return parseInt(text(), 10);}

DECIMAL "decimal"
  = _ [0-9]+ "." [0-9]+ { return parseFloat(text()).toFixed(1);}

BOOLEAN "boolean"
  = _ Truetoken { return true; }
  / _ Falsetoken { return false; }

CADENA "cadena"
  = _ "\"" (ContenidoCadena / SecuenciaEscape)* "\""
  { var cad = text(); return cad.slice(1,-1); }

CARACTER "caracter"
  = [\'][^\n\'][\'] { var c = text(); return c[1]; }

SecuenciaEscape
  = "\\\""  { return "\""; }
  / "\\\\"  { return "\\"; }
  / "\\n"   { return "\n"; }
  / "\\t"   { return "\t"; }
  / "\\r"   { return "\r"; }
  / "\\f"   { return "\f"; }
  / "\\'"   { return "'"; }

ContenidoCadena = [^\\"\n\r]+ { return text(); }

ID = !reservadas [a-zA-Z]([a-zA-Z]/[0-9]/"_")* { return text(); }

IDparte = [a-zA-Z0-9_]

reservadas = 
  SOUTtoken
  Truetoken
  Falsetoken
  Nulltoken
  Inttoken
  Floattoken
  Stringtoken
  Booleantoken
  Chartoken
  Vartoken
  Iftoken
  Elsetoken
  Switchtoken
  Casetoken
  Defaulttoken
  Breaktoken
  Whiletoken
  Fortoken
  Newtoken
  Continuetoken
  IndexOftoken
  Jointoken
  Lengthtoken
  Parseinttoken
  Parsefloattoken
  Tostringtoken
  Tolowercasetoken
  Touppercasetoken
  Typeoftoken
  Structtoken
  Objectkeystoken
  Voidtoken
  Returntoken

// Tokens/Palabras Reservadas

SOUTtoken = "System.out.println"  !ID
Truetoken = "true"  !ID
Falsetoken = "false"  !ID
Nulltoken = "null"  !ID
Inttoken = "int"  !ID
Floattoken = "float"  !ID
Stringtoken = "string" !ID
Booleantoken = "boolean" !ID
Chartoken = "char" !ID
Voidtoken = "void" !ID
Vartoken = "var" !ID
Iftoken = "if" !ID
Elsetoken = "else" !ID
Switchtoken = "switch" !ID
Casetoken = "case" !ID
Defaulttoken = "default" !ID
Breaktoken = "break" !ID
Continuetoken = "continue" !ID
Returntoken = "return" !ID
Whiletoken = "while" !ID
Fortoken = "for" !ID
Newtoken = "new" !ID
IndexOftoken = "indexOf" !ID
Jointoken = "join" !ID
Lengthtoken = "length" !ID
Parseinttoken = "parseInt" !ID
Parsefloattoken = "parsefloat" !ID
Tostringtoken = "toString" !ID
Tolowercasetoken = "toLowerCase" !ID
Touppercasetoken = "toUpperCase" !ID
Typeoftoken = "typeof" !ID
Structtoken = "struct" !ID
Objectkeystoken = "Object.keys" !ID