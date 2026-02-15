// ======================================
// AUTOSAVE + RECUPERACIÓN (SweetAlert2)
// ======================================

const KEY_VISITA = "visitaActual";
let autoSaveTimer;


// ===========================
// GUARDAR VISITA
// ===========================
async function guardarVisitaAuto() {

  const datos = {
    fecha: document.getElementById("fecha").value || "",
    nit: document.getElementById("nit").value || "",
    empresa: document.getElementById("empresa").value || "",
    asesor: document.getElementById("asesor").value || "",
    representante: document.getElementById("representante").value || "",
    ejecutivo: document.getElementById("nombreEjecutivo").value || "",
    email: document.getElementById("emailEjecutivo").value || "",

    obsCasosPendientes:
      document.getElementById("obsCasosPendientes").value || ""
  };

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

  document.getElementById("fecha").value = datos.fecha || "";
  document.getElementById("nit").value = datos.nit || "";
  document.getElementById("empresa").value = datos.empresa || "";
  document.getElementById("asesor").value = datos.asesor || "";
  document.getElementById("representante").value = datos.representante || "";
  document.getElementById("nombreEjecutivo").value = datos.ejecutivo || "";
  document.getElementById("emailEjecutivo").value = datos.email || "";

  document.getElementById("obsCasosPendientes").value =
    datos.obsCasosPendientes || "";
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
