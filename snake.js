
const cuadrados = document.querySelectorAll('.jsv-grid div'); // Seleccionamos todos los divs del grid
const puntuacion = document.querySelector('span'); // Seleccionamos el span que contiene la puntuación para luego poder modificarla cada vez que se recoge una manzana
const start = document.querySelector('.jsv-start'); // Seleccionamos el botón de start
const gameOver = document.querySelector('.jsv-hidden'); // Seleccionamos el div que contiene el mensaje de game over
const reiniciarJuego = document.querySelector('.jsv-restart'); // Seleccionamos el botón de reiniciar


const ancho = 10; // Como en este caso, la cuadrícula es de 10x10, el ancho será el número total de divs en horizontal, es decir, 10
let indiceActual = 0; // primer div en nuestro grid
let indiceManzana = 0; // primer div en nuestro grid
let posicionSnake = [2, 1, 0]; // En este array, 2 sería la cabeza, 1 el cuerpo y 0 la cola

let direccion = 1;
let puntuacionActual = 0;
let velocidad = 0.9; // Cada vez que se coma una manzana, la velocidad aumentará un 10% (por eso es 0.9. Si fuese 0.8 aumentaría un 20%, 0.7 un 30%, etc...). Si se pusiese 1, la velocidad no aumentaría
let intervaloTiempo = 0;
let intervalo = 0;

// Desde aquí se empieza y se puede reiniciar el juego
let startGame = function(){
    start.classList.add('jsv-hidden'); // Añadimos la clase hidden al botón de start
    posicionSnake.forEach(indice => cuadrados[indice].classList.remove('jsv-snake')); // Eliminamos la clase snake de todos los divs
    cuadrados[indiceManzana].classList.remove('jsv-manzana'); // Eliminamos la manzana
    clearInterval(intervalo); // Limpiamos el intervalo de tiempo
    puntuacionActual = 0; // Reiniciamos la puntuación
    direccion = 1; // Reiniciamos la dirección
    puntuacion.textContent = puntuacionActual; // Mostramos la puntuación
    intervaloTiempo = 1000; // El intervalo de movimiento será de 1 segundo
    posicionSnake = [2, 1, 0]; // Reiniciamos la posición de la serpiente
    indiceActual = 0; // Reiniciamos el índice actual
    posicionSnake.forEach(indice => cuadrados[indice].classList.add('jsv-snake'))
    intervalo = setInterval(movimiento, intervaloTiempo); // Movemos la serpiente cada segundo
}

// Se tiene que crear la función para mover la serpiente en varias direcciones
let movimiento = function(){

    // Se tiene que crear la funcion para generar la reacción al colisionar con un borde o con una parte de la serpiente
    if (
        (posicionSnake[0] + ancho >= (ancho * ancho) && direccion === ancho) // Si la serpiente choca con la parte inferior
        || (posicionSnake[0] % ancho === ancho - 1 && direccion === 1) // Si la serpiente choca con la parte derecha
        || (posicionSnake[0] % ancho === 0 && direccion === -1) // Si la serpiente choca con la parte izquierda
        || (posicionSnake[0] - ancho < 0 && direccion === -ancho) // Si la serpiente choca con la parte superior
        || cuadrados[posicionSnake[0] + direccion].classList.contains('snake') // Si la serpiente choca con su cuerpo
    ) {
        return defeated(); // Si se cumple alguna de las condiciones anteriores, se ejecuta la función 'defeated'
    }

    let cola = posicionSnake.pop(); // Eliminamos la cola
    cuadrados[cola].classList.remove('jsv-snake'); // Eliminamos la clase snake de la cola
    posicionSnake.unshift(posicionSnake[0] + direccion); // Le da la dirección a la posición de la cabeza


    // Se tiene que crear la función para generar la reacción al comer una manzana

    if (cuadrados[posicionSnake[0]].classList.contains('jsv-apple')) {
        cuadrados[posicionSnake[0]].classList.remove('jsv-apple'); // Eliminamos la manzana
        cuadrados[cola].classList.add('jsv-snake'); // Añadimos la clase snake a la cola
        posicionSnake.push(cola); // Añadimos una nueva cola a la serpiente
        generarManzana(); // Generamos una nueva manzana -- Esta funcion se está definiendo justo debajo de este 'if', fuera de la función 'movimiento'
        puntuacionActual += 1; // Aumentamos la puntuación
        puntuacion.textContent = puntuacionActual; // Mostramos la puntuación
        clearInterval(intervalo); // Quitamos el intervalo de tiempo
        intervaloTiempo = intervaloTiempo * velocidad; // Se aumenta la velocidad del intervalo para que cada vez la serpiente sea más rápida
        intervalo = setInterval(movimiento, intervaloTiempo); // Movemos la serpiente cada vez más rápido
    }
    cuadrados[posicionSnake[0]].classList.add('jsv-snake'); // Añadimos la clase snake a la cabeza
}

// Ahora hay que crear la función para generar una manzana de forma aleatoria una vez que se haya comido la anterior
let generarManzana = function(){
    do{
        indiceManzana = Math.floor(Math.random() * cuadrados.length); // Generamos un número aleatorio entre 0 y 99
    } while(cuadrados[indiceManzana].classList.contains('jsv-snake')) // Si el div contiene la clase snake, se vuelve a generar un número aleatorio repetidamente hasta que el número generado no contenga la clase snake
    cuadrados[indiceManzana].classList.add('jsv-apple'); // Añadimos la clase apple al div
}

let defeated = function(){
    puntuacion.textContent = puntuacionActual;
    gameOver.classList.add('jsv-GameOver'); // Añadimos la clase game-over al div
    console.log('Game Over'); // Mostramos el mensaje de game over
    clearInterval(intervalo); // Limpiamos el intervalo de tiempo
}



// Se tiene que crear la función para controlar la serpiente con las flechas del teclado
function control(e){
    cuadrados[indiceActual].classList.remove('snake'); // Eliminamos la clase snake


    // A partir de aquí, los keyCode son los números que se le asignan a cada tecla del teclado. En este caso, la flecha derecha es el 39, la flecha arriba es el 38, la flecha izquierda es el 37 y la flecha abajo es el 40. Si por el contrario, se quiere modificar a WASD, la W es el 87, la A es el 65, la S es el 83 y la D es el 68
    if(e.keyCode === 39){
        if (direccion === -1) {
            // Si la serpiente va a la izquierda, no puede ir a la derecha
        } else {
        direccion = 1; // Si se pulsa la flecha derecha, la serpiente irá a la derecha. En el teclado, la tecla número 39 es la flecha derecha
        }
    } else if(e.keyCode === 38){
        if (direccion === +ancho) {
            // Si la serpiente va hacia abajo, no puede ir hacia arriba
        } else{
        direccion = -ancho; // Si se pulsa la flecha arriba, la serpiente irá hacia arriba. En el teclado, la tecla número 38 es la flecha arriba
        }
    } else if(e.keyCode === 37){
        if (direccion === 1) {
            // Si la serpiente va a la derecha, no puede ir a la izquierda
        } else{
        direccion = -1; // Si se pulsa la flecha izquierda, la serpiente irá a la izquierda. En el teclado, la tecla número 37 es la flecha izquierda
        }
    } else if(e.keyCode === 40){
        if (direccion === -ancho) {
            // Si la serpiente va hacia arriba, no puede ir hacia abajo
        } else {
        direccion = +ancho; // Si se pulsa la flecha abajo, la serpiente irá hacia abajo. En el teclado, la tecla número 40 es la flecha abajo
        }
    }
}

// Se tiene que crear la función para reiniciar el juego cuando se pulse el botón después de haber perdido
let reiniciar = function(){
    location.reload();
}

document.addEventListener('keyup', control);

start.addEventListener('click', startGame);

reiniciarJuego.addEventListener('click', reiniciar);