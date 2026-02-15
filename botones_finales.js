async function descargarExcel() {

  // ==========================
  // OBTENER NOMBRE EJECUTIVO
  // ==========================
  const selectEjecutivo = document.getElementById("nombreEjecutivo");

  const nombreEjecutivo =
    selectEjecutivo.value
      ? selectEjecutivo.options[selectEjecutivo.selectedIndex].text
      : "";

  // ==========================
  // PLANTILLA FIJA DE COLUMNAS
  // ==========================
  const fila = {
    "Fecha de Acompañamiento": document.getElementById("fecha").value || "",
    "NIT": document.getElementById("nit").value || "",
    "Razón Social": document.getElementById("empresa").value || "",
    "Asesor Comercial": document.getElementById("asesor").value || "",
    "Contactos Empresa": document.getElementById("representante").value || "",
    "Ejecutivo Asistencia Empresarial": nombreEjecutivo,
    "E-mail Ejecutivo": document.getElementById("emailEjecutivo").value || "",

    "Deuda Presunta (PO)": document.getElementById("valorDeudaPresunta").value || "",
    "Observación DP (PO)": document.getElementById("obsDeudaPresunta").value || "",

    "Deuda Real (PO)": document.getElementById("valorDeudaReal").value || "",
    "Observación DR (PO)": document.getElementById("obsDeudaReal").value || "",

    "Pagos sin planilla (PO)": document.getElementById("valorPagosPO").value || "",
    "Observación PSP (PO)": document.getElementById("obsPagosPO").value || "",

    "Rezagos sin Acreditar (PO)": document.getElementById("valorAportesPO").value || "",
    "Observación RSA (PO)": document.getElementById("obsAportesPO").value || "",

    "Pagos sin planilla (CES)": document.getElementById("valorPagosCES").value || "",
    "Observación PSP (CES)": document.getElementById("obsPagosCES").value || "",

    "Pagos sin planilla (PV)": document.getElementById("valorPagosPV").value || "",
    "Observación PSP (PV)": document.getElementById("obsPagosPV").value || "",

    "Rezagos sin Acreditar (PV)": document.getElementById("valorAportesPV").value || "",
    "Observación RSA (PV)": document.getElementById("obsAportesPV").value || "",

    "Clave Empresarial Portal WEB":
      document.querySelector('input[name="claveEmpresarial"]:checked')?.value || "",

    "Observación Clave Empresarial":
      document.getElementById("obsClaveEmpresarial").value || "",

    "Observación Asesoría General Portal WEB":
      document.getElementById("obsAsesoriaGeneral").value || "",

    "Actualización de Datos":
      document.querySelector('input[name="actualizacionDatos"]:checked')?.value || "",

    "CASOS PENDIENTES DE GESTIÓN (PQR)":
      document.getElementById("obsCasosPendientes").value || "",

    "Compromisos Empleador":
      document.getElementById("obsCompromisosEmpleador").value || "",

    "Compromisos Protección":
      document.getElementById("obsCompromisosProteccion").value || "",

    "Nuevo Agendamiento":
      document.querySelector('input[name="proximoEncuentro"]:checked')?.value || "",

    "Encuesta de Satisfacción":
      document.querySelector('input[name="encuestaSatisfaccion"]:checked')?.value || ""
  };

  // =====================
  // HISTÓRICO LOCALFORAGE
  // =====================
  let historial = await localforage.getItem("historicoVisitas") || [];
  historial.push(fila);

  await localforage.setItem("historicoVisitas", historial);

  // =====================
  // CREAR EXCEL
  // =====================
  const ws = XLSX.utils.json_to_sheet(historial);

  // Ajustar ancho columnas
  ws["!cols"] = Object.keys(fila).map(() => ({ wch: 35 }));

  // Wrap text (saltos de línea)
  Object.keys(ws).forEach(cell => {
    if (cell[0] === "!") return;
    ws[cell].s = {
      alignment: {
        wrapText: true,
        vertical: "top"
      }
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Informe");

  XLSX.writeFile(wb, "Informe_Acompanamiento.xlsx");
}

// _____________________Fin Función Excel_____________________ //
