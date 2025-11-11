class Persona {
    constructor(nombre) {
        this.nombre = nombre; // 'this' se refiere a la instancia actual
    }
    
    saludar() {
        console.log(`Hola, soy ${this.nombre}`);
        // 'this.nombre' accede a la propiedad de esta instancia
    }
}

const persona1 = new Persona("Juan");
const persona2 = new Persona("María");

persona1.saludar(); // "Hola, soy Juan"
persona2.saludar(); // "Hola, soy María"

const elemento = document.getElementById('pantalla');
// Escuchar eventos en elementos HTML
elemento.addEventListener('click', (e) => {
    // Este código se ejecuta cuando se hace clic
    console.log("¡Clic detectado!");
});

// PROBLEMA con números decimales en JavaScript
console.log(0.1 + 0.2);  // 0.30000000000000004 

// SOLUCIÓN: Usar strings y convertir solo al calcular
let num1 = "0.1";
let num2 = "0.2";
let resultado = parseFloat(num1) + parseFloat(num2);
console.log(resultado); // 0.3 ✓
