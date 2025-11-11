// ============================================
// CALCULADORA JAVASCRIPT
// ============================================
// Esta clase encapsula toda la funcionalidad de una calculadora web
// que soporta operaciones básicas y funciones especiales

class Calculadora {
    // ----------------------------------------
    // CONSTRUCTOR
    // ----------------------------------------
    // Se ejecuta automáticamente al crear una nueva instancia
    // Inicializa todas las propiedades y configura los eventos
    constructor() {
        // Referencia al elemento HTML donde se muestran los números
        this.pantalla = document.getElementById('pantalla');
        
        // Valor numérico que se muestra actualmente (almacenado como String)
        // Se usa String para evitar problemas con decimales y mantener formato
        this.valorActual = '0';
        
        // Valor que se guardó antes de seleccionar una operación
        // Ejemplo: en "5 + 3", cuando presionas +, el 5 se guarda aquí
        this.valorAnterior = '';
        
        // Operación matemática seleccionada ('sumar', 'restar', etc.)
        // null cuando no hay operación pendiente
        this.operacion = null;
        
        // Bandera que indica si el siguiente número debe reemplazar el actual
        // true: el próximo dígito inicia un nuevo número
        // false: el próximo dígito se concatena al número actual
        this.nuevoNumero = true;
        
        // Configurar todos los event listeners (eventos de clic y teclado)
        this.inicializarEventos();
    }

    // ----------------------------------------
    // INICIALIZAR EVENTOS
    // ----------------------------------------
    // Configura todos los listeners para botones y teclado
    inicializarEventos() {
        // Seleccionar todos los botones de la interfaz con clase 'btn'
        const botones = document.querySelectorAll('.btn');
        
        // Iterar sobre cada botón para agregar funcionalidad
        botones.forEach(boton => {
            // Agregar evento de clic a cada botón
            
            boton.addEventListener('click', (e) => {
                // Prevenir el comportamiento predeterminado del botón
                // Esto evita que el formulario se envíe o la página se recargue
                e.preventDefault();
                
                // CASO 1: Botones numéricos (0-9)
                // Verificar si el botón tiene el atributo data-numero
                if (boton.dataset.numero !== undefined) {
                    // Llamar al método para agregar el número presionado
                    this.agregarNumero(boton.dataset.numero);
                }
                
                // CASO 2: Botones de acción especial (+, -, ×, ÷, C, =, etc.)
                // Verificar si el botón tiene el atributo data-action
                if (boton.dataset.action) {
                    // Delegar el manejo de la acción al método correspondiente
                    this.manejarAccion(boton.dataset.action);
                }
            });
        });

        // ----------------------------------------
        // SOPORTE PARA TECLADO
        // ----------------------------------------
        // Permitir usar la calculadora con el teclado físico
        document.addEventListener('keydown', (e) => {
            // NÚMEROS: Detectar teclas del 0 al 9
            if (e.key >= '0' && e.key <= '9') {
                this.agregarNumero(e.key);
            } 
            // PUNTO DECIMAL: Tecla punto (.)
            else if (e.key === '.') {
                this.manejarAccion('decimal');
            } 
            // SUMA: Tecla más (+)
            else if (e.key === '+') {
                this.manejarAccion('sumar');
            } 
            // RESTA: Tecla menos (-)
            else if (e.key === '-') {
                this.manejarAccion('restar');
            } 
            // MULTIPLICACIÓN: Tecla asterisco (*)
            else if (e.key === '*') {
                this.manejarAccion('multiplicar');
            } 
            // DIVISIÓN: Tecla diagonal (/)
            else if (e.key === '/') {
                this.manejarAccion('dividir');
            } 
            // CALCULAR: Tecla Enter o igual (=)
            else if (e.key === 'Enter' || e.key === '=') {
                // Prevenir que Enter envíe formularios
                e.preventDefault();
                this.manejarAccion('igual');
            } 
            // LIMPIAR: Tecla Escape o letra C (mayúscula o minúscula)
            else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                this.manejarAccion('clear');
            } 
            // BORRAR ÚLTIMO DÍGITO: Tecla Backspace
            else if (e.key === 'Backspace') {
                this.manejarAccion('delete');
            } 
            // PORCENTAJE: Tecla porcentaje (%)
            else if (e.key === '%') {
                this.manejarAccion('porcentaje');
            }
        });
    }

    // ----------------------------------------
    // AGREGAR NÚMERO
    // ----------------------------------------
    // Agrega un dígito al valor actual mostrado en pantalla
    // Parámetro: numero (String) - El dígito a agregar (0-9)
    agregarNumero(numero) {
        // CASO 1: Si debemos iniciar un nuevo número
        // Esto ocurre después de presionar =, una operación, o al iniciar
        if (this.nuevoNumero) {
            // Reemplazar completamente el valor actual con el nuevo número
            this.valorActual = numero;
            
            // Cambiar la bandera para permitir concatenación en el siguiente dígito
            this.nuevoNumero = false;
        } 
        // CASO 2: Si estamos construyendo un número existente
        else {
            // Validación: Limitar la longitud máxima a 12 caracteres
            // Esto previene desbordamiento en la pantalla
            if (this.valorActual.length < 12) {
                // Si el valor actual es '0', reemplazarlo con el nuevo número
                // Si no, concatenar el nuevo dígito al final
                // Ejemplo: '0' + '5' = '5', pero '12' + '3' = '123'
                this.valorActual = this.valorActual === '0' ? numero : this.valorActual + numero;
            }
            // Si ya hay 12 caracteres, ignorar el nuevo dígito
        }
        
        // Actualizar la visualización en pantalla
        this.actualizarPantalla();
    }

    // ----------------------------------------
    // MANEJAR ACCIÓN
    // ----------------------------------------
    // Router central que distribuye las acciones a sus métodos correspondientes
    // Parámetro: accion (String) - Nombre de la acción a ejecutar
    manejarAccion(accion) {
        // Switch para determinar qué método llamar según la acción
        switch(accion) {
            case 'clear':
                // Limpiar toda la calculadora (resetear a estado inicial)
                this.limpiar();
                break;
            case 'delete':
                // Borrar el último dígito ingresado (como Backspace)
                this.borrar();
                break;
            case 'decimal':
                // Agregar punto decimal al número actual
                this.agregarDecimal();
                break;
            case 'cambiar-signo':
                // Cambiar entre positivo y negativo (+/-)
                this.cambiarSigno();
                break;
            case 'porcentaje':
                // Dividir el número actual entre 100
                this.calcularPorcentaje();
                break;
            case 'sumar':
            case 'restar':
            case 'multiplicar':
            case 'dividir':
                // Establecer la operación matemática a realizar
                this.establecerOperacion(accion);
                break;
            case 'igual':
                // Ejecutar el cálculo y mostrar resultado
                this.calcular();
                break;
            // Si la acción no coincide con ningún caso, no hacer nada
        }
    }

    // ----------------------------------------
    // LIMPIAR
    // ----------------------------------------
    // Resetea la calculadora a su estado inicial (como presionar C o AC)
    limpiar() {
        // Restaurar el valor actual a cero
        this.valorActual = '0';
        // Limpiar el valor anterior
        this.valorAnterior = '';
        // Eliminar cualquier operación pendiente
        this.operacion = null;
        // Marcar que el siguiente número será nuevo
        this.nuevoNumero = true;
        // Actualizar la pantalla para mostrar '0'
        this.actualizarPantalla();
    }

    // ----------------------------------------
    // BORRAR
    // ----------------------------------------
    // Elimina el último carácter del número actual (función Backspace)
    borrar() {
        // Verificar si hay más de un carácter
        if (this.valorActual.length > 1) {
            // Eliminar el último carácter usando slice
            // slice(0, -1) toma desde el inicio hasta el penúltimo carácter
            // Ejemplo: "123".slice(0, -1) = "12"
            this.valorActual = this.valorActual.slice(0, -1);
        } 
        // Si solo hay un carácter
        else {
            // Establecer el valor en '0' en lugar de dejarlo vacío
            this.valorActual = '0';
        }
        // Actualizar la visualización
        this.actualizarPantalla();
    }

    // ----------------------------------------
    // AGREGAR DECIMAL
    // ----------------------------------------
    // Agrega un punto decimal al número actual
    // Solo permite un punto decimal por número
    agregarDecimal() {
        // Validación: Verificar que no exista ya un punto decimal
        // includes() busca el carácter '.' en el string
        if (!this.valorActual.includes('.')) {
            // CASO 1: Si es un nuevo número
            if (this.nuevoNumero) {
                // Iniciar con "0." (como en calculadoras reales)
                this.valorActual = '0.';
                // Marcar que ya no es un número nuevo
                this.nuevoNumero = false;
            } 
            // CASO 2: Si es un número en construcción
            else {
                // Agregar el punto al final del número actual
                // Ejemplo: "5" se convierte en "5."
                this.valorActual += '.';
            }
            // Actualizar la pantalla
            this.actualizarPantalla();
        }
        // Si ya existe un punto decimal, ignorar la acción
    }

    // ----------------------------------------
    // CAMBIAR SIGNO
    // ----------------------------------------
    // Alterna entre número positivo y negativo (botón +/-)
    cambiarSigno() {
        // Validación: No cambiar el signo del cero (no tiene sentido -0)
        if (this.valorActual !== '0') {
            // Verificar si el primer carácter es un signo negativo
            if (this.valorActual.charAt(0) === '-') {
                // CASO 1: El número es negativo, hacerlo positivo
                // Eliminar el primer carácter (el signo -)
                // Ejemplo: "-5" se convierte en "5"
                this.valorActual = this.valorActual.slice(1);
            } 
            else {
                // CASO 2: El número es positivo, hacerlo negativo
                // Agregar el signo - al inicio
                // Ejemplo: "5" se convierte en "-5"
                this.valorActual = '-' + this.valorActual;
            }
            // Actualizar la pantalla
            this.actualizarPantalla();
        }
    }

    // ----------------------------------------
    // CALCULAR PORCENTAJE
    // ----------------------------------------
    // Divide el número actual entre 100 (botón %)
    // Ejemplo: 50% se convierte en 0.5
    calcularPorcentaje() {
        // Convertir el string a número decimal
        const valor = parseFloat(this.valorActual);
        // Dividir entre 100 y convertir de vuelta a string
        this.valorActual = (valor / 100).toString();
        // Actualizar la visualización
        this.actualizarPantalla();
    }

    // ----------------------------------------
    // ESTABLECER OPERACIÓN
    // ----------------------------------------
    // Configura la operación matemática a realizar
    // Parámetro: operacion (String) - Tipo de operación ('sumar', 'restar', etc.)
    establecerOperacion(operacion) {
        // Característica especial: Operaciones encadenadas
        // Si ya hay una operación pendiente Y se ingresó un nuevo número
        // Calcular primero antes de establecer la nueva operación
        // Esto permite: 2 + 3 + 4 = 9 (calcula 2+3 antes de sumar 4)
        if (this.operacion !== null && !this.nuevoNumero) {
            this.calcular();
        }
        
        // Guardar el valor actual como valor anterior
        // Este será el primer operando de la operación
        this.valorAnterior = this.valorActual;
        
        // Establecer la operación seleccionada
        this.operacion = operacion;
        
        // Marcar que el siguiente número será nuevo
        // Esto permite que el usuario ingrese el segundo operando
        this.nuevoNumero = true;
    }

    // ----------------------------------------
    // CALCULAR
    // ----------------------------------------
    // Ejecuta la operación matemática y muestra el resultado
    calcular() {
        // VALIDACIÓN 1: Verificar que exista una operación
        // Si es null, no hay nada que calcular
        if (this.operacion === null || this.nuevoNumero) {
            return; // Salir del método sin hacer nada
        }

        // Convertir los strings a números decimales para poder operar
        const anterior = parseFloat(this.valorAnterior); // Primer operando
        const actual = parseFloat(this.valorActual);     // Segundo operando
        let resultado; // Variable para almacenar el resultado

        // Switch para ejecutar la operación correspondiente
        switch(this.operacion) {
            case 'sumar':
                // Operación de suma
                resultado = anterior + actual;
                console.log("Anterior:", anterior);
                console.log("Actual:", actual);
                console.log("Resultado:", resultado);
                break;
            case 'restar':
                // Operación de resta
                resultado = anterior - actual;
                break;
            case 'multiplicar':
                // Operación de multiplicación
                resultado = anterior * actual;
                break;
            case 'dividir':
                // VALIDACIÓN 2: División por cero
                if (actual === 0) {
                    // Mostrar error y salir
                    this.mostrarError();
                    return;
                }
                // Operación de división
                resultado = anterior / actual;
                break;
            default:
                // Si la operación no es reconocida, salir
                return;
        }

        // CORRECCIÓN DE PRECISIÓN: Redondear a 10 decimales
        // Esto soluciona el problema de punto flotante de JavaScript
        // Ejemplo: 0.1 + 0.2 = 0.30000000000000004 se convierte en 0.3
        // Técnica: multiplicar por 10^10, redondear, dividir por 10^10
        resultado = Math.round(resultado * 10000000000) / 10000000000;
        
        // MANEJO DE NÚMEROS GRANDES: Limitar longitud del resultado
        if (resultado.toString().length > 12) {
            // Si el número es extremadamente grande (≥ 1 billón)
            if (Math.abs(resultado) >= 1e12) {
                // Usar notación científica con 6 decimales
                // Ejemplo: 1000000000000 se convierte en "1.000000e+12"
                resultado = resultado.toExponential(6);
            } 
            else {
                // Para números grandes pero no extremos
                // Usar 10 dígitos significativos
                // Ejemplo: 12345678901 se convierte en "1.234567890e+10"
                resultado = parseFloat(resultado.toPrecision(10));
            }
        }

        // Actualizar el valor actual con el resultado
        this.valorActual = resultado.toString();
        
        // Limpiar la operación (ya se ejecutó)
        this.operacion = null;
        
        // Marcar que el siguiente número será nuevo
        // Esto permite empezar un nuevo cálculo o continuar con el resultado
        this.nuevoNumero = true;
        
        // Mostrar el resultado en pantalla
        this.actualizarPantalla();
    }

    // ----------------------------------------
    // MOSTRAR ERROR
    // ----------------------------------------
    // Muestra un mensaje de error temporal en la pantalla
    // Se usa principalmente para división por cero
    mostrarError() {
        // Mostrar el texto "Error" en la pantalla
        this.pantalla.value = 'Error';
        
        // Programar limpieza automática después de 1.5 segundos
        // setTimeout ejecuta una función después del tiempo especificado
        setTimeout(() => {
            // Limpiar la calculadora automáticamente
            this.limpiar();
        }, 1500); // 1500 milisegundos = 1.5 segundos
    }

    // ----------------------------------------
    // ACTUALIZAR PANTALLA
    // ----------------------------------------
    // Actualiza el display con el valor actual y ajusta el formato
    actualizarPantalla() {
        // Obtener el valor a mostrar
        let valorMostrar = this.valorActual;
        
        // AJUSTE DINÁMICO DE FUENTE
        // Si el número es muy largo, reducir el tamaño de fuente
        // para que quepa en la pantalla
        if (valorMostrar.length > 9) {
            // Números largos: fuente más pequeña
            this.pantalla.style.fontSize = '1.8em';
        } 
        else {
            // Números normales: fuente estándar
            this.pantalla.style.fontSize = '2.5em';
        }
        
        // Actualizar el valor del input que actúa como pantalla
        this.pantalla.value = valorMostrar;
    }
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================
// Event listener que espera a que el DOM esté completamente cargado
// Esto asegura que todos los elementos HTML existan antes de acceder a ellos
document.addEventListener('DOMContentLoaded', () => {
    // Crear una nueva instancia de la calculadora
    // El constructor se ejecutará automáticamente e inicializará todo
    new Calculadora();
});