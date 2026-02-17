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

async function generarPDF() {

  const { jsPDF } = window.jspdf;

  try {

    // =============================
    // SWEET ALERT
    // =============================
    Swal.fire({
      title: "Generando PDF...",
      text: "Preparando documento",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const header = document.querySelector("header");
    const main = document.querySelector("main");

    if (!header || !main) {
      throw new Error("No se encontró contenido");
    }

    // =============================
    // CONTENEDOR TEMPORAL
    // =============================
    const captura = document.createElement("div");
    captura.style.background = "#fff";
    captura.style.position = "absolute";
    captura.style.left = "-10000px";
    captura.style.top = "0";
    captura.style.width = main.offsetWidth + "px";
    captura.style.zIndex = "1";

    // =============================
    // HEADER SIN MENU
    // =============================
    const headerClone = header.cloneNode(true);
    const nav = headerClone.querySelector(".header-title0");
    if (nav) nav.remove();

    captura.appendChild(headerClone);

    // =============================
    // MAIN CLON
    // =============================
    const mainClone = main.cloneNode(true);

    const botones = mainClone.querySelector(".botones-container");
    if (botones) botones.remove();

    captura.appendChild(mainClone);

    // =============================
    // PLACEHOLDERS + FIX INPUTS
    // =============================
    captura.querySelectorAll("input, textarea").forEach(el => {

      const ph = el.getAttribute("placeholder");

      // SOLO placeholders $
      if (ph && !ph.includes("$")) {
        el.setAttribute("placeholder", "");
      }

      // INPUTS
      if (el.tagName === "INPUT") {
        el.style.minHeight = el.offsetHeight + "px";
        el.style.boxSizing = "border-box";
      }

      // TEXTAREAS (FIX REAL)
      if (el.tagName === "TEXTAREA") {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
        el.style.whiteSpace = "pre-wrap";
      }

    });

    document.body.appendChild(captura);

    // =============================
    // CAPTURA HTML2CANVAS
    // =============================
    const canvas = await html2canvas(captura, {
      scale: 1.2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    document.body.removeChild(captura);

    if (!canvas.width || !canvas.height) {
      throw new Error("Canvas vacío");
    }

    // =============================
    // CREAR PDF
    // =============================
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pageHeight = 297;

    const imgProps = pdf.getImageProperties(imgData);

    const imgHeight =
      (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // PRIMERA PAGINA
    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      pdfWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    // PAGINAS EXTRA
    while (heightLeft > 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        pdfWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save("Informe_Acompanamiento.pdf");

    Swal.fire({
      icon: "success",
      title: "PDF generado",
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error al generar PDF",
      text: "No fue posible crear el documento."
    });
  }
}
