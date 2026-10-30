/**
 * NAVIDAD.JS — Nieve traslúcida + Papá Noel surcando la página
 *
 * Archivo totalmente independiente: no usa ni modifica variables de otros scripts.
 * Se agrega SOLO en index.html, al final, después de todos los demás scripts:
 *   <script src="navidad.js"></script>
 *
 * Seguridad con el PDF:
 *  - Todo cuelga directamente de <body>, nunca dentro de <header> ni <main>.
 *    generarPDF() solo clona header + main, así que nada de esto entra en la captura.
 *  - Además, cada elemento lleva data-html2canvas-ignore="true" (html2canvas lo respeta
 *    de forma nativa) como seguro extra por si algún día cambia la forma de capturar.
 *
 * Consola del navegador (para probar):
 *   navidad.iniciar()  /  navidad.detener()  /  navidad.santa()
 */

(function () {
  'use strict';

  // ======================================
  // CONFIGURACIÓN (todo lo ajustable vive aquí)
  // ======================================

  const CONFIG = {

    // ⚠️ true  = ignora el calendario y funciona siempre (solo para diseñar/probar)
    // ⚠️ false = solo funciona en diciembre. CAMBIAR A false CUANDO TODO ESTÉ LISTO.
    MODO_PRUEBA: false,

    // Mes de la temporada (enero = 0 ... diciembre = 11). Dura el mes completo: 1 al 31.
    MES_TEMPORADA: 11,

    // --- Nieve ---
    COLOR_COPO: '140, 185, 235',   // RGB azul claro (el blanco puro no se ve sobre fondo blanco)
    COPO_RADIO_MIN: 1.5,           // radio en px (diámetro 3 px)
    COPO_RADIO_MAX: 4,             // radio en px (diámetro 8 px)
    OPACIDAD_MIN: 0.35,
    OPACIDAD_MAX: 0.70,
    COPOS_MIN: 40,
    COPOS_MAX: 120,
    PIXELES_POR_COPO: 16000,       // 1 copo por cada X px² de pantalla (se limita entre MIN y MAX)

    // --- Papá Noel ---
    RUTA_IMAGEN: 'img/papa_noel.png',
    ANCHO_SANTA: 240,              // px. La altura se calcula sola para no deformarlo
    OPACIDAD_SANTA: 0.6,
    VELOCIDAD_SANTA: 140,          // px por segundo
    ALTURA_MIN_VH: 1,              // franja vertical donde puede aparecer (en % del alto de pantalla)
    ALTURA_MAX_VH: 10,

    // Tiempos (en milisegundos)
    PRIMER_SANTA_MS:        60 * 1000,        // primera aparición tras cargar la página
    INTERVALO_MIN_MS:       10 * 60 * 1000,   // entre pasadas: de 10 a 20 minutos
    INTERVALO_MAX_MS:       20 * 60 * 1000,
    // Valores usados mientras MODO_PRUEBA = true
    PRUEBA_PRIMER_SANTA_MS: 3 * 1000,
    PRUEBA_INTERVALO_MS:    20 * 1000,

    REVISAR_FECHA_CADA_MS:  60 * 1000          // re-chequeo por si la página queda abierta al cambiar de mes
  };

  // ======================================
  // ESTADO INTERNO
  // ======================================

  let activo = false;
  let canvas = null;
  let ctx = null;
  let copos = [];
  let ancho = 0;
  let alto = 0;
  let rafId = null;
  let ultimoTiempo = 0;
  let timerSanta = null;
  let santaEl = null;
  let santaAnim = null;
  let pausadoPDF = false;

  // ======================================
  // FECHA Y PREFERENCIAS DEL SISTEMA
  // ======================================

  function esTemporada() {
    if (CONFIG.MODO_PRUEBA) return true;
    return new Date().getMonth() === CONFIG.MES_TEMPORADA;
  }

  function prefiereMenosMovimiento() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ======================================
  // NIEVE (canvas)
  // ======================================

  function aleatorio(min, max) {
    return min + Math.random() * (max - min);
  }

  function crearCopo(yInicial) {
    const radio = aleatorio(CONFIG.COPO_RADIO_MIN, CONFIG.COPO_RADIO_MAX);
    return {
      x: Math.random() * ancho,
      y: yInicial !== undefined ? yInicial : -radio * 2,
      r: radio,
      alpha: aleatorio(CONFIG.OPACIDAD_MIN, CONFIG.OPACIDAD_MAX),
      vy: 18 + radio * 14 + Math.random() * 12,  // los copos grandes caen un poco más rápido
      amp: aleatorio(6, 22),                     // amplitud del vaivén lateral
      freq: aleatorio(0.6, 1.6),                 // velocidad del vaivén
      fase: Math.random() * Math.PI * 2
    };
  }

  function cantidadCopos() {
    const n = Math.round((ancho * alto) / CONFIG.PIXELES_POR_COPO);
    return Math.max(CONFIG.COPOS_MIN, Math.min(CONFIG.COPOS_MAX, n));
  }

  function ajustarCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    canvas.style.width = ancho + 'px';
    canvas.style.height = alto + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Reajustamos la cantidad de copos al nuevo tamaño de ventana
    const objetivo = cantidadCopos();
    while (copos.length < objetivo) copos.push(crearCopo(Math.random() * alto));
    if (copos.length > objetivo) copos.length = objetivo;
    copos.forEach(c => { if (c.x > ancho) c.x = Math.random() * ancho; });
  }

  function crearCanvas() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('data-html2canvas-ignore', 'true');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'pointer-events: none',   // fantasma al clic: no estorba a check.js ni a nada
      'z-index: 1000',          // por debajo de SweetAlert2 (1060)
    ].join(';');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    copos = [];
    ajustarCanvas();
  }

  function dibujar(t) {
    if (!activo) return;

    if (!ultimoTiempo) ultimoTiempo = t;
    const dt = Math.min((t - ultimoTiempo) / 1000, 0.1);  // tope para no dar saltos tras una pausa
    ultimoTiempo = t;

    ctx.clearRect(0, 0, ancho, alto);

    for (let i = 0; i < copos.length; i++) {
      const c = copos[i];
      c.y += c.vy * dt;
      c.fase += c.freq * dt;
      const x = c.x + Math.sin(c.fase) * c.amp;

      if (c.y - c.r > alto) {
        copos[i] = crearCopo();
        continue;
      }

      ctx.beginPath();
      ctx.arc(x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CONFIG.COLOR_COPO + ',' + c.alpha + ')';
      ctx.fill();
    }

    rafId = requestAnimationFrame(dibujar);
  }

  function arrancarNieve() {
    cancelAnimationFrame(rafId);
    ultimoTiempo = 0;
    rafId = requestAnimationFrame(dibujar);
  }

  // ======================================
  // PAPÁ NOEL
  // ======================================

  function intervaloSanta() {
    if (CONFIG.MODO_PRUEBA) return CONFIG.PRUEBA_INTERVALO_MS;
    return aleatorio(CONFIG.INTERVALO_MIN_MS, CONFIG.INTERVALO_MAX_MS);
  }

  function programarSanta(ms) {
    clearTimeout(timerSanta);
    timerSanta = setTimeout(lanzarSanta, ms);
  }

  function quitarSanta() {
    if (santaAnim) { santaAnim.cancel(); santaAnim = null; }
    if (santaEl) { santaEl.remove(); santaEl = null; }
  }

  function lanzarSanta() {
    if (!activo) return;

    // Si la pestaña está oculta o ya hay un Papá Noel volando, reintentamos en 5 s
    if (document.hidden || santaEl) {
      programarSanta(5000);
      return;
    }

    const img = document.createElement('img');
    img.src = CONFIG.RUTA_IMAGEN;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('data-html2canvas-ignore', 'true');
    img.setAttribute('aria-hidden', 'true');
    img.style.cssText = [
      'position: fixed',
      'left: 0',
      'top: ' + aleatorio(CONFIG.ALTURA_MIN_VH, CONFIG.ALTURA_MAX_VH) + 'vh',
      'width: ' + CONFIG.ANCHO_SANTA + 'px',
      'height: auto',
      'opacity: ' + CONFIG.OPACIDAD_SANTA,
      'pointer-events: none',
      'user-select: none',
      'z-index: 1000',
      'will-change: transform'
    ].join(';');

    img.onerror = function () {
      console.error('🎅 No se encontró la imagen de Papá Noel en: ' + CONFIG.RUTA_IMAGEN);
      quitarSanta();
      programarSanta(intervaloSanta());
    };

    document.body.appendChild(img);
    santaEl = img;

    // Recorrido: de justo fuera de la pantalla (izquierda) a justo fuera (derecha)
    const recorrido = window.innerWidth + CONFIG.ANCHO_SANTA;
    const duracion = (recorrido / CONFIG.VELOCIDAD_SANTA) * 1000;

    santaAnim = img.animate(
      [
        { transform: 'translateX(' + (-CONFIG.ANCHO_SANTA) + 'px)' },
        { transform: 'translateX(' + window.innerWidth + 'px)' }
      ],
      { duration: duracion, easing: 'linear', fill: 'forwards' }
    );

    santaAnim.onfinish = function () {
      quitarSanta();
      programarSanta(intervaloSanta());
    };
  }

  // ======================================
  // ARRANQUE Y PARADA
  // ======================================

  function alCambiarVisibilidad() {
    if (!activo) return;
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else if (!pausadoPDF) {
      arrancarNieve();
    }
  }

  // ======================================
  // PAUSA DURANTE LA GENERACIÓN DEL PDF
  // ======================================

  // Mientras html2canvas hace su trabajo pesado, la nieve se oculta y deja de
  // dibujar para no competir por el procesador. Al terminar, vuelve sola.

  function pausarPorPDF() {
    pausadoPDF = true;
    cancelAnimationFrame(rafId);
    if (canvas) canvas.style.display = 'none';
  }

  function reanudarPorPDF() {
    pausadoPDF = false;
    if (!activo || !canvas) return;
    canvas.style.display = '';
    if (!document.hidden) arrancarNieve();
  }

  // Envuelve generarPDF() sin modificar botones_finales.js: el botón sigue
  // llamando a generarPDF() y esa llamada pasa primero por aquí.
  function protegerGeneracionPDF() {
    if (typeof window.generarPDF !== 'function' || window.generarPDF.__navidad) return;

    const original = window.generarPDF;

    const envuelta = async function () {
      pausarPorPDF();
      try {
        return await original.apply(this, arguments);
      } finally {
        reanudarPorPDF();
      }
    };

    envuelta.__navidad = true;  // marca para no envolverla dos veces
    window.generarPDF = envuelta;
  }

  function iniciar() {
    if (activo) return;
    if (prefiereMenosMovimiento()) {
      console.info('❄️ Navidad omitida: el sistema tiene activado "reducir movimiento".');
      return;
    }

    activo = true;
    crearCanvas();
    arrancarNieve();

    window.addEventListener('resize', ajustarCanvas);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);

    programarSanta(CONFIG.MODO_PRUEBA ? CONFIG.PRUEBA_PRIMER_SANTA_MS : CONFIG.PRIMER_SANTA_MS);
    console.log('🎄 Navidad activada');
  }

  function detener() {
    if (!activo) return;
    activo = false;

    cancelAnimationFrame(rafId);
    clearTimeout(timerSanta);
    quitarSanta();

    window.removeEventListener('resize', ajustarCanvas);
    document.removeEventListener('visibilitychange', alCambiarVisibilidad);

    if (canvas) { canvas.remove(); canvas = null; ctx = null; }
    copos = [];
    console.log('🎄 Navidad desactivada');
  }

  // Revisa la fecha: enciende o apaga según corresponda
  function revisarTemporada() {
    if (esTemporada()) iniciar();
    else detener();
  }

  // ======================================
  // INICIALIZACIÓN
  // ======================================

  function inicializar() {
    if (CONFIG.MODO_PRUEBA) {
      console.warn(
        '%c⚠️ NAVIDAD EN MODO PRUEBA: la nieve ignora el calendario. ' +
        'Poner MODO_PRUEBA = false en navidad.js antes de publicar.',
        'background:#dc3545;color:#fff;font-size:14px;font-weight:bold;padding:4px 8px;'
      );
    }

    protegerGeneracionPDF();
    revisarTemporada();
    setInterval(revisarTemporada, CONFIG.REVISAR_FECHA_CADA_MS);
  }

  // Exponemos controles para probar desde la consola
  window.navidad = {
    iniciar: iniciar,
    detener: detener,
    santa: function () { if (activo) { quitarSanta(); lanzarSanta(); } }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }

})();