// variables
let nombre = "Leonel";
const edad = 44;
let a = 10;
let b = 5;

// Operadores básicos
console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);

// Estructuras de control
// Condicionales

if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}

// Ciclos
for (let i = 0; i < 5; i++){
    console.log("Iteración número: " + i);
}

let contador = 0;
while (contador < 3) {
    console.log("Contador: " + contador);
    contador++;
}

// Metodos o funciones
function saludar() {
    //alert("Hola desde el archivo externo!!!")
    document.body.style.background = "red";
    //document.h1.style.background = "blue";
    setTimeout(() => document.body.style.background="",1000);
}

function sumar(a, b) {
    return a + b;
}

let resultado = sumar(23, 98);
console.log("El resultado de la suma es: " + resultado);    

// Arreglos

let frutas = ["Manzana", "Sandia", "Pera"]
console.log(frutas[0]);

// Objetos

let persona = {
    nombre: "Leonel",
    edad: 44,
    profesion: "Docente"
};

console.log(persona.nombre);

// Interacción con el DOM

// Eventos 