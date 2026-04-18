# Sistema de Actas de Visitas - Protección S.A.

Aplicación web para el registro y gestión de visitas a grandes empleadores, diseñada para ejecutivos de asistencia empresarial y ejecutivos de empresas PREMIUM de Protección S.A.

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.3-blue)
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
- ✅ Conversión de base de datos Excel a JSON con protocolo estandarizado
- ✅ Control de acceso por contraseña en módulos restringidos

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

## Módulo: Conversor Excel → JSON

### Descripción
Herramienta de uso interno y acceso restringido que convierte la base de datos de empleadores desde un archivo Excel al formato JSON estructurado requerido por la aplicación. Opera completamente en el navegador — ningún dato sale del equipo.

### Control de Acceso
El módulo está protegido por contraseña mediante `seguridad.js`. Al ingresar a la página, la interfaz permanece bloqueada hasta que se ingrese la clave correcta. Los intentos fallidos muestran un mensaje de acceso denegado. La contraseña se valida contra un hash almacenado — nunca se guarda en texto plano en el código.

### Protocolo de Conversión
El conversor aplica un conjunto de reglas estrictas sobre los datos del Excel antes de generar el JSON:

**Campo `nit`**
- Siempre string, nunca número
- Se eliminan puntos, espacios, guión y dígito de verificación
- Ejemplo: `800.123.456-1` → `"800123456"`

**Campo `asesor_comercial`**
- Nunca vacío
- Si la celda está vacía en el Excel, se escribe `"Sin Consultor Asignado"`

**Campo `alerta_ciclo_cobro`**
- Campo obligatorio y parametrizado
- Solo acepta uno de estos 6 valores exactos:
  - `"1. PASO A DEMANDA"`
  - `"2. PREJURIDICO EN FIRME"`
  - `"3. PREJURIDICO 1"`
  - `"4. COBRO NORMAL"`
  - `"5. FUERA DE CICLO"`
  - `"6. EMPRESA EN CEROS"`
- Valores no reconocidos generan una advertencia visible en pantalla para revisión manual
- Este campo es **confidencial** — no aparece en el PDF del empleador

**Campos monetarios** (`deuda_presunta`, `deuda_real`, `pagos_po`, `aportes_po`, `pagos_ces`, `pagos_pv`, `aportes_pv`)
- Formato: `"$ 1.234.567"` (símbolo $, espacio, miles separados con punto, sin decimales)
- Celdas vacías, con `0`, `$ -` o `$ 0` se convierten a `""`
- Nunca se escribe `null`, `0` ni `"$ -"` en el JSON

### Estructura del JSON resultante

```json
{
  "empleadores": [
    {
      "nit": "900100001",
      "razon_social": "NOMBRE DE LA EMPRESA S A S",
      "asesor_comercial": "NOMBRE DEL ASESOR",
      "alerta_ciclo_cobro": "4. COBRO NORMAL",
      "deuda_presunta": "$ 8.563.712",
      "deuda_real": "$ 1.069.458",
      "pagos_po": "",
      "aportes_po": "",
      "pagos_ces": "$ 450.000",
      "pagos_pv": "",
      "aportes_pv": ""
    }
  ]
}
```

### Mapeo de columnas Excel → JSON

| Columna en Excel | Campo en JSON |
|---|---|
| NIT | `nit` |
| Razón Social | `razon_social` |
| Asesor Comercial | `asesor_comercial` |
| Alerta Ciclo Cobro UGPP | `alerta_ciclo_cobro` |
| Deuda Presunta | `deuda_presunta` |
| Deuda Real | `deuda_real` |
| Pagos sin planilla (PO) | `pagos_po` |
| Rezagos sin Acreditar (PO) | `aportes_po` |
| Pagos sin planilla (CES) | `pagos_ces` |
| Pagos sin planilla (PV) | `pagos_pv` |
| Rezagos sin Acreditar (PV) | `aportes_pv` |

### Verificación automática post-conversión
Tras cada conversión el módulo ejecuta un checklist de 7 puntos visible en pantalla:

- [ ] NITs sin puntos, guiones ni dígito de verificación
- [ ] Ningún campo monetario vacío contiene `null`, `0` o `"$ -"`
- [ ] Valores monetarios con formato `"$ 1.234.567"`
- [ ] Cada registro tiene los 11 campos obligatorios
- [ ] El JSON tiene la estructura `{"empleadores": [...]}`
- [ ] Ningún `asesor_comercial` está vacío
- [ ] Todos los `alerta_ciclo_cobro` tienen uno de los 6 valores válidos

---

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
- **JavaScript Vanilla** - Lógica de la aplicación

### Librerías
- **localForage** - Almacenamiento local extendido (IndexedDB wrapper)
- **SheetJS (xlsx.js)** - Generación de archivos Excel y lectura para conversión a JSON
- **jsPDF + html2canvas** - Generación de documentos PDF
- **SweetAlert2** - Alertas, diálogos de confirmación y control de acceso por contraseña
- **Google Fonts (Ubuntu)** - Tipografía corporativa

### Hosting
- **GitHub Pages** - Alojamiento gratuito con HTTPS

---

## Estructura del Proyecto

```
actas-proteccion/
│
├── index.html                 # Página principal (formulario de visita)
├── excel_a_json.html          # Módulo conversor Excel → JSON (acceso restringido)
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
├── excel_a_json.js            # Lógica del conversor Excel → JSON (protocolo Protección)
├── seguridad.js               # Control de acceso por contraseña (módulos restringidos)
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
Confirmaciones, mensajes de éxito, advertencias y control de acceso se muestran mediante diálogos estilizados con SweetAlert2, mejorando la experiencia de usuario frente a los `alert()` nativos del navegador.

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

### JSON (base de datos de empleadores)
- Generado desde el módulo `excel_a_json.html`
- Protocolo estandarizado de transformación y validación
- Listo para ser consumido por el sistema de autocompletado por NIT

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
- ✅ Edge (todas las versiones) — **recomendado para mayor estabilidad del almacenamiento local**
- ✅ Opera 15+ (2013)

### Dispositivos
- ✅ PC (Windows, Mac, Linux)
- ✅ Tablets
- ⚠️ Móviles — bloqueados por diseño (la aplicación está optimizada para escritorio)

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

### Control de Acceso
- El módulo de conversión Excel → JSON está protegido por contraseña mediante `seguridad.js`
- La contraseña se valida contra un hash — nunca se almacena en texto plano
- La interfaz permanece completamente bloqueada hasta autenticación exitosa
- Los intentos fallidos muestran pantalla de acceso denegado

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

### Para el módulo Excel → JSON
1. Acceder a `excel_a_json.html`
2. Ingresar la contraseña de acceso
3. Arrastrar o seleccionar el archivo `.xlsx` con la base de empleadores
4. Hacer clic en **Convertir**
5. Revisar el checklist de verificación y las advertencias si las hay
6. Descargar el `.json` resultante o copiarlo al portapapeles

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

## Historial de Versiones

| Versión | Descripción |
|---|---|
| 1.3 | Módulo conversor Excel → JSON con protocolo estandarizado y control de acceso por contraseña |
| 1.2 | Integración SweetAlert2, bloqueo de dispositivos móviles, campo Caso Salesforce |
| 1.1 | Autoguardado, campo Alerta Ciclo Cobro UGPP, correcciones de bugs en producción |
| 1.0 | Versión inicial — formulario de visita, Excel y PDF |

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

**Última actualización:** Abril 2026  
**Versión:** 1.3  
**Estado:** En Desarrollo Activo