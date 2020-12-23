/*
    Programado por Luis Cabrera Benito 

  ____          _____               _ _           _       
 |  _ \        |  __ \             (_) |         | |      
 | |_) |_   _  | |__) |_ _ _ __ _____| |__  _   _| |_ ___ 
 |  _ <| | | | |  ___/ _` | '__|_  / | '_ \| | | | __/ _ \
 | |_) | |_| | | |  | (_| | |   / /| | |_) | |_| | ||  __/
 |____/ \__, | |_|   \__,_|_|  /___|_|_.__/ \__, |\__\___|
         __/ |                               __/ |        
        |___/                               |___/         
    
    
    Blog:       https://parzibyte.me/blog
    Ayuda:      https://parzibyte.me/blog/contrataciones-ayuda/
    Contacto:   https://parzibyte.me/blog/contacto/
*/
const MAXIMOS_INTENTOS = 40, // Intentos máximos que tiene el jugador
    COLUMNAS = 4, // Columnas del memorama
    SEGUNDOS_ESPERA_VOLTEAR_IMAGEN = 1, // Por cuántos segundos mostrar ambas imágenes
    NOMBRE_IMAGEN_OCULTA = "./img/question.png"; // La imagen que se muestra cuando la real está oculta
new Vue({
    el: "#app",
    data: () => ({
        // La ruta de las imágenes. Puede ser relativa o absoluta
        imagenes: [
            "./img/C1.1.PNG",
            "./img/C1.2.PNG",
            "./img/C2.1.PNG",
            "./img/C2.2.PNG",
            "./img/C3.1.PNG",
            "./img/C3.1.PNG",
            "./img/C4.1.PNG",
            "./img/C4.2.PNG",
            "./img/C5.1.PNG",
            "./img/C5.2.PNG",
            "./img/C6.1.PNG",
            "./img/C6.2.PNG",
            "./img/C7.1.PNG",
            "./img/C7.2.PNG",
            "./img/C8.1.PNG",
            "./img/C8.2.PNG",
            "./img/C9.1.PNG",
            "./img/C9.2.PNG",
            "./img/C10.1.PNG",
            "./img/C10.2.PNG",
            "./img/C11.1.PNG",
            "./img/C11.2.PNG",
            "./img/C12.1.PNG",
            "./img/C12.2.PNG",
            "./img/C13.1.PNG",
            "./img/C13.2.PNG",
            "./img/C14.1.PNG",
            "./img/C14.2.PNG",
            "./img/C15.1.PNG",
            "./img/C15.2.PNG",
            "./img/C16.1.PNG",
            "./img/C16.2.PNG",
            "./img/C17.1.PNG",
            "./img/C17.2.PNG",
            "./img/C18.1.PNG",
            "./img/C18.2.PNG",
            "./img/C19.1.PNG",
            "./img/C19.2.PNG",
            "./img/C20.1.PNG",
            "./img/C20.2.PNG",
        ],cartas:[
            "./img/corazonazul.jpg",
            "./img/corazonverde.jpg",
            "./img/cubos.jpg",
            "./img/rayas.jpg",
            "./img/marco.jpg",
        ],
        memorama: [],
        // Útiles para saber cuál fue la carta anteriormente seleccionada
        ultimasCoordenadas: {
            indiceFila: null,
            indiceImagen: null,
        },
        NOMBRE_IMAGEN_OCULTA: NOMBRE_IMAGEN_OCULTA,
        MAXIMOS_INTENTOS: MAXIMOS_INTENTOS,
        intentos: 0,
        aciertos: 0,
        esperandoTimeout: false,
    }),
    methods: {
        mostrarCreditos() {
            Swal.fire({
                title: "INSTRUCCIONES",
                html: `
                
                <div>
                The player chooses two cards, if these are cards they are complementary, that is, they belong to the same sentence, they get a point and the cards remain face up; If the two cards he chose are different, he places them face down again and loses an attempt, the game ends when he finds all the pairs or runs out of attempts
                </div>
                `,
                confirmButtonText: "Cerrar",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        },
        // Método que muestra la alerta indicando que el jugador ha perdido; después
        // de mostrarla, se reinicia el juego
        indicarFracaso() {
            Swal.fire({
                    title: "Perdiste",
                    html: `
                <img class="img-fluid" src="./img/perdiste.png" alt="Perdiste">
                <p class="h4">Agotaste tus intentos</p>`,
                    confirmButtonText: "Jugar de nuevo",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                .then(this.reiniciarJuego)
        },
        // Mostrar alerta de victoria y reiniciar juego
        indicarVictoria() {
            Swal.fire({
                    title: "¡Ganaste!",
                    html: `
                <img class="img-fluid" src="./img/ganaste.png" alt="Ganaste">
                <p class="h4">Muy bien hecho</p>`,
                    confirmButtonText: "Jugar de nuevo",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                .then(this.reiniciarJuego)
        },
        // Método que indica si el jugador ha ganado
        haGanado() {
            return this.memorama.every(arreglo => arreglo.every(imagen => imagen.acertada));
        },
        // Ayudante para mezclar un arreglo
        mezclarArreglo(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        // Aumenta un intento y verifica si el jugador ha perdido
        aumentarIntento() {
            this.intentos++;
            if (this.intentos >= MAXIMOS_INTENTOS) {
                this.indicarFracaso();
            }
        },
        // Se desencadena cuando se hace click en la imagen


        mostrar(){

    

        },

        voltear(indiceFila, indiceImagen) {
            // Si se está regresando una imagen a su estado original, detener flujo
            if (this.esperandoTimeout) {
                return;
            }
            // Si es una imagen acertada, no nos importa que la intenten voltear
            if (this.memorama[indiceFila][indiceImagen].acertada) {
                return;
            }
            // Si es la primera vez que la selecciona
            if (this.ultimasCoordenadas.indiceFila === null && this.ultimasCoordenadas.indiceImagen === null) {
                this.memorama[indiceFila][indiceImagen].mostrar = true;
                this.ultimasCoordenadas.indiceFila = indiceFila;
                this.ultimasCoordenadas.indiceImagen = indiceImagen;
                return;
            }
            // Si es el que estaba mostrada, lo ocultamos de nuevo
            let imagenSeleccionada = this.memorama[indiceFila][indiceImagen];
            let ultimaImagenSeleccionada = this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen];
            if (indiceFila === this.ultimasCoordenadas.indiceFila &&
                indiceImagen === this.ultimasCoordenadas.indiceImagen) {
                this.memorama[indiceFila][indiceImagen].mostrar = false;
                this.ultimasCoordenadas.indiceFila = null;
                this.ultimasCoordenadas.indiceImagen = null;
                this.aumentarIntento();
                return;
            }

            // En caso de que la haya encontrado, ¡acierta!
            // Se basta en ultimaImagenSeleccionada
            this.memorama[indiceFila][indiceImagen].mostrar = true;
            if (imagenSeleccionada.num === ultimaImagenSeleccionada.num) {
                this.aciertos++;
                this.memorama[indiceFila][indiceImagen].acertada = true;
                this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].acertada = true;
                this.ultimasCoordenadas.indiceFila = null;
                this.ultimasCoordenadas.indiceImagen = null;
                // Cada que acierta comprobamos si ha ganado
                if (this.haGanado()) {
                    this.indicarVictoria();
                }
            } else {
                // Si no acierta, entonces giramos ambas imágenes
                this.esperandoTimeout = true;
                setTimeout(() => {
                    this.memorama[indiceFila][indiceImagen].mostrar = false;
                    this.memorama[indiceFila][indiceImagen].animacion = false;
                    this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].mostrar = false;
                    this.ultimasCoordenadas.indiceFila = null;
                    this.ultimasCoordenadas.indiceImagen = null;
                    this.esperandoTimeout = false;
                }, SEGUNDOS_ESPERA_VOLTEAR_IMAGEN * 1000);
                this.aumentarIntento();
            }
        },
        reiniciarJuego() {
            
           let wenas= ["./img/corazonazul.jpg"];
            let arreglo= [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21];
            let memorama = [];
            this.imagenes.forEach((imagen, indice) => {
                
                let imagenDeMemorama = {
                    ruta: imagen,
                    num : arreglo[0],
                   
                    mostrar: false, // No se muestra la original
                    acertada: false, // No es acertada al inicio
                };
                let ultimo = arreglo.shift()
                // Poner dos veces la misma imagen
                memorama.push(imagenDeMemorama);
          
            });

            // Sacudir o mover arreglo; es decir, hacerlo aleatorio
            this.mezclarArreglo(memorama);

            // Dividirlo en subarreglos o columnas
            let memoramaDividido = [];
            for (let i = 0; i < memorama.length; i += COLUMNAS) {
                memoramaDividido.push(memorama.slice(i, i + COLUMNAS));
            }
            // Reiniciar intentos
            this.intentos = 0;
            this.aciertos = 0;
            // Asignar a instancia de Vue para que lo dibuje
            this.memorama = memoramaDividido;
        },
        // Método que precarga las imágenes para que las mismas ya estén cargadas
        // cuando el usuario gire la tarjeta
        precargarImagenes() {
            // Mostrar la alerta
            Swal.fire({
                    title: "Cargando",
                    html: `Cargando imágenes...`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                .then(this.reiniciarJuego)
                // Ponerla en modo carga
            Swal.showLoading();


            let total = this.imagenes.length,
                contador = 0;
            let imagenesPrecarga = Array.from(this.imagenes);
            // También vamos a precargar la "espalda" de la tarjeta
            imagenesPrecarga.push("./img/corazonazul.jpg");
            imagenesPrecarga.push("./img/corazonverde.jpg");
            imagenesPrecarga.push("./img/cubos.jpg");
            imagenesPrecarga.push("./img/marco.jpg");
            imagenesPrecarga.push("./img/rayas.jpg");
            // Cargamos cada imagen y en el evento load aumentamos el contador
            imagenesPrecarga.forEach(ruta => {
                const imagen = document.createElement("img");
                imagen.src = ruta;
                imagen.addEventListener("load", () => {
                    contador++;
                    if (contador >= total) {
                        // Si el contador >= total entonces se ha terminado la carga de todas
                        this.reiniciarJuego();
                        Swal.close();
                    }
                });
                // Agregamos la imagen y la removemos instantáneamente, así no se muestra
                // pero sí se carga
                document.body.appendChild(imagen);
                document.body.removeChild(imagen);
            });
        },
    },
    mounted() {
        this.precargarImagenes();
    },
});