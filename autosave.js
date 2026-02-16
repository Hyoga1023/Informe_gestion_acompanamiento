// ======================================
// AUTOSAVE + RECUPERACIÓN (SweetAlert2)
// ======================================

const KEY_VISITA = "visitaActual";
let autoSaveTimer;


// ===========================
// GUARDAR VISITA
// ===========================
async function guardarVisitaAuto() {

  const datos = {};

  // inputs y textareas
  document.querySelectorAll("input, textarea, select").forEach(el => {

    if (!el.id) return;

    if (el.type === "radio") {
      if (el.checked) datos[el.name] = el.value;
      return;
    }

    if (el.type === "checkbox") {
      datos[el.id] = el.checked;
      return;
    }

    datos[el.id] = el.value;
  });

  await localforage.setItem(KEY_VISITA, datos);
}



// ===========================
// AUTOGUARDADO (DEBOUNCE)
// ===========================
function programarAutoGuardado() {

  clearTimeout(autoSaveTimer);

  autoSaveTimer = setTimeout(async () => {
    try {
      await guardarVisitaAuto();
      console.log("✔ Autoguardado");
    } catch (err) {
      console.error("Error autoguardado:", err);
    }
  }, 2000);

}


// ===========================
// ACTIVAR AUTOGUARDADO
// ===========================
function activarAutoguardado() {

  document.addEventListener("input", programarAutoGuardado);
  document.addEventListener("change", programarAutoGuardado);

}


// ===========================
// CARGAR DATOS EN FORMULARIO
// ===========================
function aplicarDatosFormulario(datos) {

  Object.keys(datos).forEach(key => {

    const el = document.getElementById(key);

    if (el) {

      if (el.type === "checkbox") {
        el.checked = datos[key];
        return;
      }

      el.value = datos[key];
    }

    // radios
    const radio = document.querySelector(
      `input[name="${key}"][value="${datos[key]}"]`
    );

    if (radio) radio.checked = true;

  });
}



// ===========================
// RECUPERAR CON SWEETALERT
// ===========================
async function recuperarInformacion() {

  const datos = await localforage.getItem(KEY_VISITA);

  if (!datos) {

    await Swal.fire({
      icon: "info",
      title: "Sin información",
      text: "No hay datos guardados para recuperar."
    });

    return;
  }

  const respuesta = await Swal.fire({
    title: "Recuperar información",
    text: "Se cargarán los datos guardados automáticamente.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Recuperar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6"
  });

  if (!respuesta.isConfirmed) return;

  aplicarDatosFormulario(datos);

  await Swal.fire({
    icon: "success",
    title: "Información recuperada",
    timer: 1500,
    showConfirmButton: false
  });
}


// ===========================
// INICIO AUTOMÁTICO
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  activarAutoguardado();
});
