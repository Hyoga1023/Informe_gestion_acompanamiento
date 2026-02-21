# Sistema de Actas de Visitas - Protección S.A.

Aplicación web para el registro y gestión de visitas a grandes empleadores, diseñada para ejecutivos de asistencia empresarial y ejecutivos de empresas PREMIUM de Protección S.A.

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.2-blue)
![Licencia](https://img.shields.io/badge/Licencia-Privado-red)

---

## Descripción del Proyecto

Sistema web que permite a los ejecutivos de asistencia empresarial y ejecutivos de empresas PREMIUM de Protección S.A. documentar de manera eficiente las visitas realizadas a grandes empleadores, facilitando:

- ✅ Registro estructurado de información de visitas
- ✅ Checklist dinámico con campos condicionales
- ✅ Almacenamiento local en el navegador
- ✅ Autoguardado automático del formulario
- ✅ Generación de archivos Excel para archivo
- ✅ Generación de documentos PDF para impresión y firma
- ✅ Historial de visitas accesible
- ✅ Alertas y confirmaciones con SweetAlert2

---

## Características Principales

### Información Básica
- Fecha de acompañamiento
- NIT y razón social del empleador
- Datos del asesor comercial y ejecutivo de asistencia empresarial
- Información de contactos de la empresa

### Lista de Verificación
**Gestión de Deudas (PO):**
- Deuda Presunta
- Deuda Real

**Gestión de Inconsistencias (PO, PV y CES):**
- Pagos sin planilla (PO)
- Rezagos sin Acreditar (PO)
- Pagos sin planilla (CES)
- Pagos sin planilla (PV)
- Rezagos sin Acreditar (PV)

**Canales Digitales:**
- Clave Empresarial Portal WEB (SI/NO + observaciones)
- Asesoría General Portal WEB (observaciones)

**Actualización de Datos:**
- Validación de información actualizada del empleador (SI / NO / No Aplica)

**Casos Pendientes:**
- Seguimiento a PQR

### Conclusiones
- Compromisos del empleador
- Compromisos de Protección
- Agendamiento de próximo encuentro
- Registro de encuesta de satisfacción

---

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
- **JavaScript Vanilla** - Lógica de la aplicación

### Librerías
- **localForage** - Almacenamiento local extendido (IndexedDB wrapper)
- **SheetJS (xlsx.js)** - Generación de archivos Excel
- **jsPDF + html2canvas** - Generación de documentos PDF
- **SweetAlert2** - Alertas y diálogos de confirmación estilizados
- **Google Fonts (Ubuntu)** - Tipografía corporativa

### Hosting
- **GitHub Pages** - Alojamiento gratuito con HTTPS

---

## Estructura del Proyecto

```
actas-proteccion/
│
├── index.html                 # Página principal (formulario de visita)
├── visitas.html               # Gestión de visitas guardadas
├── carga_base.html            # Carga de base de datos
│
├── reset.css                  # Reset de estilos
├── styles.css                 # Estilos principales
│
├── check.js                   # Lógica de checklist dinámico
├── observaciones.js           # Manejo de observaciones condicionales
├── botones_finales.js         # Funciones de guardado/descarga (Excel, PDF)
├── orden_documentos.js        # Orden y estructura de documentos generados
├── hamburguesa.js             # Menú de navegación lateral
├── ejecutivos.js              # Gestión y selección de ejecutivos AE
├── autocompletar.js           # Autocompletado de datos por NIT
├── btnTop.js                  # Botón flotante volver arriba
├── fecha.js                   # Manejo y formato de fechas
├── autosave.js                # Autoguardado automático del formulario
├── limpiar.js                 # Limpieza y reseteo del formulario
├── sweetAlert2.js             # Configuración de alertas y confirmaciones
│
├── img/
│   ├── icono.png              # Favicon
│   └── logo_*.png             # Logos corporativos
│
└── README.md                  # Este archivo
```

---

## Funcionalidades de Interfaz

### Checklist Dinámico
Los campos de observaciones aparecen automáticamente cuando se marca un checkbox específico, permitiendo un flujo de trabajo más limpio y enfocado.

### Validación de Datos
- Campos obligatorios claramente identificados
- Formato automático de valores monetarios (COP)
- Límites de caracteres en campos de texto extenso (1200 caracteres)

### Campos de Valor Monetario
- Formato automático con separadores de miles
- Símbolo de peso colombiano ($)
- Siempre habilitados para captura rápida

### Autoguardado
Los datos del formulario se guardan automáticamente mientras el asesor trabaja, evitando pérdida de información por cierres accidentales del navegador o interrupciones inesperadas.

### Alertas con SweetAlert2
Confirmaciones, mensajes de éxito y advertencias se muestran mediante diálogos estilizados con SweetAlert2, mejorando la experiencia de usuario frente a los `alert()` nativos del navegador.

### Almacenamiento Local
Los datos se guardan automáticamente en el navegador del usuario mediante localForage, permitiendo:
- Trabajo offline después de la carga inicial
- Persistencia de datos entre sesiones
- Privacidad total (datos no se envían a servidor)

---

## Generación de Documentos

### Excel
- **Estructura fija:** Todas las actas tienen las mismas columnas para facilitar archivo y análisis
- **Formato profesional:** Incluye datos generales, checklist completo y observaciones
- **Nombre descriptivo:** `Acta_{Empresa}_{Fecha}.xlsx`

### PDF
- **Documento imprimible:** Listo para firma física
- **Incluye:**
  - Header con logo de Protección S.A.
  - Toda la información capturada
  - Sección de firmas
  - Pie de página con fecha de generación

---

## Almacenamiento de Datos

### Estructura de Datos
Cada visita se almacena con la siguiente información:

```javascript
{
  // Datos generales
  empresa: "Nombre de la empresa",
  nit: "800123456",
  fecha: "2024-02-03",
  asesor: "Nombre del Asesor",
  ejecutivo: "Nombre del Ejecutivo",
  
  // Checklist con valores y observaciones
  checklist: {
    deudaPresunta: { valor: "$1.234.567", observacion: "..." },
    deudaReal: { valor: "$890.123", observacion: "..." },
    // ... más items
  },
  
  // Conclusiones
  compromisos: { ... },
  agendamiento: { ... },
  
  // Metadatos
  timestamp: 1707000000000,
  descargada: false
}
```

### Clave de Almacenamiento
Formato: `visita-{timestamp}`

---

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 23+ (2012)
- ✅ Firefox 10+ (2012)
- ✅ Safari 7+ (2013)
- ✅ Edge (todas las versiones)
- ✅ Opera 15+ (2013)

### Dispositivos
- ✅ PC (Windows, Mac, Linux)
- ✅ Tablets
- ✅ Móviles (optimizado para desktop)

### Requisitos
- Navegador moderno
- JavaScript habilitado
- Conexión a internet (solo primera carga)
- Funciona offline después de cargar

---

## Seguridad y Privacidad

### Datos Locales
- Los datos se guardan exclusivamente en el navegador del usuario
- No se transmiten a ningún servidor externo
- Cada ejecutivo ve únicamente sus propias visitas
- Privacidad total garantizada

### Consideraciones
⚠️ **Importante:** Los datos pueden perderse si:
- Se borra el caché del navegador
- Se formatea el equipo
- Se cambia de computador

**Solución:** Los archivos Excel/PDF descargados son el respaldo oficial de largo plazo.

---

## Instalación y Uso

### Para Usuarios
1. Ejecutivo accede a la URL proporcionada por el administrador
2. Completar el formulario de visita
3. Los datos se guardan automáticamente en el navegador
4. Generar Excel/PDF según necesidad
5. Opcional: Revisar visitas anteriores en "Mis Visitas"

### Para Desarrollo
```bash
# Clonar el repositorio
git clone https://github.com/[usuario]/actas-proteccion.git

# Abrir index.html en un navegador
# O usar un servidor local:
python -m http.server 8000
# Luego abrir: http://localhost:8000
```

---

## Flujo de Trabajo Típico

1. Ejecutivo AE o PREMIUM abre la aplicación
2. Completa datos básicos (fecha, NIT, empresa)
3. El sistema autocompleta razón social y asesor por NIT
4. Marca items relevantes del checklist
5. Agrega observaciones en los campos condicionales
6. Completa sección de conclusiones
7. El autosave protege el progreso en todo momento
8. Genera Excel para archivo
9. Genera PDF para firma si es necesario

---

## Actualizaciones

Para actualizar la aplicación:
1. Realizar cambios en el código local
2. Commit y push a GitHub
3. GitHub Pages se actualiza automáticamente (1-2 minutos)
4. Los usuarios refrescan la página (F5) para ver cambios
5. **Los datos guardados NO se pierden** (están en el navegador)

---

## Roadmap (Posibles Funcionalidades Futuras)

- [ ] Dashboard con estadísticas de visitas
- [ ] Exportación masiva (consolidar múltiples actas)
- [ ] Búsqueda avanzada por empresa
- [ ] Adjuntar fotos de la visita
- [ ] Firma digital en el PDF
- [ ] Sincronización opcional en la nube
- [ ] Modo oscuro
- [ ] Reportes automatizados

---

## Desarrollador

**Cesar Martinez**  
Asesor Integral In House  
Protección S.A.  
Yumbo, Valle del Cauca, Colombia

### Formación
- Desarrollo de Software y Aplicaciones Móviles - Politécnico Internacional
- Especialización en Front End - Alura LATAM
- Diseño Gráfico (6 semestres)

---

## Soporte

Para dudas, sugerencias o reporte de errores:
- Abrir un Issue en este repositorio
- Contactar a través de Microsoft Teams

---

## Licencia

Este proyecto es de uso interno exclusivo de Protección S.A.  
Todos los derechos reservados © 2026

---

## Agradecimientos

- Equipo de Asistencia Empresarial de Protección S.A.
- Comunidad de desarrolladores de las librerías utilizadas
- Usuarios beta testers del sistema:
  Vanessa Orozco,
  Arianne Reyes,
  Julian Ruiz,
  Romulo Sandoval,
  Carol Lasso

---

**Última actualización:** Febrero 2026  
**Versión:** 1.2  
**Estado:** En Desarrollo Activo