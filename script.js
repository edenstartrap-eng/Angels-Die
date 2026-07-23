/* ============================================================
   CONCEPTOS BÁSICOS ANTES DE EMPEZAR (léelo una vez, no hace falta
   memorizarlo):

   - document.getElementById('algo')  -> busca UN elemento por su id.
   - document.querySelectorAll('.algo') -> busca TODOS los elementos
     que tengan esa class, y te los da como una lista.
   - elemento.addEventListener('click', funcion) -> le dice al elemento
     "cuando alguien te haga clic, ejecuta esta función".
   - elemento.classList.add('abierto') -> le agrega la class "abierto"
     (y eso activa las reglas .modal.abierto que escribimos en el CSS).
   - elemento.classList.remove('abierto') -> se la quita.
   ============================================================ */


/* ============================================================
   1.5 PROTECCIÓN EXTRA: esconder los iframes de video mientras
   hay un modal o lightbox abierto.
   ============================================================
   Algunos navegadores tienen un comportamiento raro donde los
   <iframe> (como los videos de YouTube) IGNORAN el z-index y se
   muestran por encima de todo, sin importar cuánto subamos el
   z-index del modal. La forma más segura de evitarlo del todo es
   ocultar los iframes mientras el modal esté abierto, y mostrarlos
   de nuevo al cerrar.
   ============================================================ */
function ocultarIframes() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(function (iframe) {
    iframe.style.visibility = 'hidden';
  });
}

function mostrarIframes() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(function (iframe) {
    iframe.style.visibility = 'visible';
  });
}


/* ============================================================
   1. FUNCIONES REUTILIZABLES PARA ABRIR/CERRAR CUALQUIER MODAL
   ============================================================
   En vez de escribir la misma lógica dos veces (una para Detalles,
   otra si algún día agregas otro modal), la escribimos una sola vez
   como función y la reutilizamos.
   ============================================================ */
function abrirModal(idDelModal) {
  const modal = document.getElementById(idDelModal);
  modal.classList.add('abierto');
  ocultarIframes();
}

function cerrarModal(idDelModal) {
  const modal = document.getElementById(idDelModal);
  modal.classList.remove('abierto');
  mostrarIframes();
}


/* ============================================================
   2. CONECTAR EL BOTÓN "Detalles" CON SU VENTANA
   ============================================================ */
const botonDetalles  = document.getElementById('boton-galeria-detalles');
const modalDetalles  = document.getElementById('modal-detalles');
const botonCerrarDetalles = document.getElementById('cerrar-modal-detalles');

botonDetalles.addEventListener('click', function () {
  abrirModal('modal-detalles');
});

botonCerrarDetalles.addEventListener('click', function () {
  cerrarModal('modal-detalles');
});

// Bonus: cerrar también si haces clic en el fondo oscuro (fuera de la ventana).
// "evento.target" es el elemento exacto donde se hizo clic; si es el fondo
// (modalDetalles) y no algo de adentro, lo cerramos.
modalDetalles.addEventListener('click', function (evento) {
  if (evento.target === modalDetalles) {
    cerrarModal('modal-detalles');
  }
});


/* ============================================================
   3. LIGHTBOX: ver un dibujo en grande al hacer clic en su miniatura
   ============================================================ */
const miniaturas       = document.querySelectorAll('.miniatura-detalle');
const lightbox         = document.getElementById('lightbox-detalles');
const lightboxImagen   = document.getElementById('lightbox-imagen-detalle');
const lightboxCredito  = document.getElementById('lightbox-credito-detalle');
const botonCerrarLightbox = document.getElementById('cerrar-lightbox-detalles');

// querySelectorAll te da una LISTA, así que usamos forEach para decir
// "a cada una de estas miniaturas, agrégale este mismo comportamiento".
miniaturas.forEach(function (miniatura) {
  miniatura.addEventListener('click', function () {
    // Aquí está la magia: copiamos la imagen en la que hiciste clic
    // hacia el <img> vacío del lightbox, y LUEGO lo mostramos.
    lightboxImagen.src = miniatura.src;
    lightboxImagen.alt = miniatura.alt;

    // "closest" busca hacia arriba en el HTML hasta encontrar el
    // contenedor .detalle-item más cercano (el que envuelve esta
    // miniatura). Desde ahí, buscamos el link de crédito que esté adentro.
    const contenedor = miniatura.closest('.detalle-item');
    const credito = contenedor ? contenedor.querySelector('.credito-dibujo') : null;

    if (credito) {
      lightboxCredito.href = credito.href;
      lightboxCredito.textContent = credito.textContent;
    } else {
      // Si algún detalle no tiene crédito, dejamos el link vacío.
      // El CSS (":empty") lo esconde automáticamente en ese caso.
      lightboxCredito.href = '#';
      lightboxCredito.textContent = '';
    }

    lightbox.classList.add('abierto');
    ocultarIframes();
  });
});

botonCerrarLightbox.addEventListener('click', function () {
  lightbox.classList.remove('abierto');
  mostrarIframes();
});

lightbox.addEventListener('click', function (evento) {
  if (evento.target === lightbox) {
    lightbox.classList.remove('abierto');
    mostrarIframes();
  }
});


/* ============================================================
   4. EXTRA: cerrar cualquier ventana abierta con la tecla ESC
   ============================================================
   Un detalle pequeño que se siente muy "profesional" y cuesta
   3 líneas de código.
   ============================================================ */
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    cerrarModal('modal-detalles');
    lightbox.classList.remove('abierto');
    mostrarIframes();
  }
});


/* ============================================================
   5. REPRODUCTOR DE MÚSICA DE FONDO (vía YouTube, sin descargar nada)
   ============================================================
   Usamos la API oficial de YouTube para controlar un reproductor
   OCULTO (0x0 píxeles). La música se transmite en vivo desde YouTube,
   nunca se descarga ni se guarda dentro del sitio.
   ============================================================ */

// ✏️ EDITA AQUÍ: tu lista de canciones favoritas, como IDs de video de YouTube.
// El ID es la parte de la URL que va después de "v=" y antes del "&".
// Ejemplo: en https://www.youtube.com/watch?v=KTJQiGRQS8Q&list=... el ID es "KTJQiGRQS8Q"
const listaCancionesYouTube = [
  'KTJQiGRQS8Q', // Delicate
  'vTfd54EO_YY', // Vibes Don't Lie
  'muPO1c6pxXg', // Snooze
  'HXY2Q9liGHk', // Habitual
  '',            // ✏️ pon aquí el ID de tu canción 5
  '',            // ✏️ canción 6
  '',            // ✏️ canción 7
  '',            // ✏️ canción 8
  '',            // ✏️ canción 9
  '',            // ✏️ canción 10
  '',            // ✏️ canción 11
  '',            // ✏️ canción 12
  '',            // ✏️ canción 13
  '',            // ✏️ canción 14
  '',            // ✏️ canción 15
];
// ⚠️ Mientras haya IDs vacíos ('') en la lista, si el azar elige justo
// una de esas posiciones, el botón no va a sonar. Ve completando los
// que faltan cuando tengas los links, o simplemente bórralos de la
// lista si por ahora prefieres tener solo 4 (no tienen que ser 15
// exactos, esa era solo tu idea inicial de cuántas poner).

let reproductorYouTube = null;
let estaSonando = false;

const botonMusica = document.getElementById('boton-musica-fondo');

// ⚠️ IMPORTANTE: esta función NO la llamamos nosotros. La API de YouTube
// la busca por su nombre exacto y la ejecuta sola, automáticamente,
// apenas termina de cargar. Por eso el nombre no se puede cambiar.
function onYouTubeIframeAPIReady() {
  // .filter() se queda solo con los elementos que SÍ tienen algo escrito,
  // descartando las casillas vacías ('') que todavía no has completado.
  const cancionesDisponibles = listaCancionesYouTube.filter(function (id) {
    return id !== '';
  });

  const indiceAleatorio = Math.floor(Math.random() * cancionesDisponibles.length);
  const cancionElegida = cancionesDisponibles[indiceAleatorio];

  reproductorYouTube = new YT.Player('reproductor-youtube-fondo', {
    height: '0',
    width: '0',
    videoId: cancionElegida,
    playerVars: {
      controls: 0
      // controls: 0 = no mostrar los controles nativos de YouTube
      // (de todas formas el reproductor mide 0x0, así que no se verían).
    },
    events: {
      onStateChange: function (evento) {
        // El estado "0" de YouTube significa "el video terminó".
        if (evento.data === 0) {
          botonMusica.textContent = '▶';
          botonMusica.classList.remove('sonando');
          estaSonando = false;
        }
      }
    }
  });
}

botonMusica.addEventListener('click', function () {
  if (!reproductorYouTube) return;
  // Por si haces clic MUY rápido, antes de que la API termine de cargar.

  if (estaSonando) {
    reproductorYouTube.pauseVideo();
    botonMusica.textContent = '▶';
    botonMusica.classList.remove('sonando');
  } else {
    reproductorYouTube.playVideo();
    botonMusica.textContent = '⏸';
    botonMusica.classList.add('sonando');
  }
  estaSonando = !estaSonando;
});


/* ============================================================
   ✏️ CUANDO AGREGUES UNA NUEVA SECCIÓN CON SU PROPIO MODAL:
   Copia el bloque "2. CONECTAR EL BOTÓN..." y cambia los ids
   por los de la nueva sección. Como las funciones abrirModal()
   y cerrarModal() ya existen, no necesitas reescribir la lógica,
   solo conectar los ids nuevos.
   ============================================================ */