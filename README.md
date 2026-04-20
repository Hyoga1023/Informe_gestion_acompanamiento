# Sistema de Informes de Acompañamiento

Aplicación web interna para el registro y documentación de visitas de acompañamiento a empleadores.

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.3-blue)
![Licencia](https://img.shields.io/badge/Licencia-Privado-red)

---

## ¿Qué hace esta aplicación?

Permite a los usuarios registrar de forma estructurada la información de una visita de acompañamiento a través de un formulario web. Una vez completado, el informe puede exportarse como archivo Excel o documento PDF listo para imprimir.

Los datos se guardan automáticamente en el navegador del usuario durante la sesión y persisten entre sesiones gracias al almacenamiento local del equipo. Ningún dato se transmite a servidores externos.

---

## Características

- Formulario estructurado con secciones y campos condicionales
- Autoguardado automático mientras se trabaja
- Exportación a Excel para archivo y consolidación
- Generación de PDF para impresión y firma
- Historial de registros anteriores accesible desde la misma interfaz
- Módulo auxiliar para carga y conversión de base de datos (acceso restringido)
- Alertas y confirmaciones con interfaz amigable
- Bloqueado en dispositivos móviles — optimizado para escritorio

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript Vanilla**
- **localForage** — almacenamiento local (IndexedDB)
- **SheetJS** — generación y lectura de archivos Excel
- **jsPDF + html2canvas** — generación de PDF
- **SweetAlert2** — alertas y diálogos

---

## Estructura del proyecto

```
/
├── index.html              # Formulario principal
├── excel_a_json.html       # Módulo de carga de base de datos (restringido)
├── carga_base.html         # Carga de base de datos
├── styles.css              # Estilos principales
├── reset.css               # Reset de estilos
├── *.js                    # Módulos de lógica
├── img/                    # Recursos gráficos
└── README.md               # Este archivo
```

---

## Compatibilidad

| Entorno | Soporte |
|---|---|
| Chrome / Edge / Firefox / Safari modernos | ✅ |
| Dispositivos móviles | ⛔ Bloqueado |
| Uso offline (tras primera carga) | ✅ |

> **Recomendado:** Microsoft Edge para mayor estabilidad del almacenamiento local.

---

## Instalación

No requiere instalación. Basta con abrir `index.html` en un navegador moderno con JavaScript habilitado.

Para la primera carga se requiere conexión a internet (fuentes y librerías externas). Después funciona sin conexión.

---

## Consideraciones de almacenamiento

Los datos se guardan en el navegador del equipo local. Pueden perderse si se borra el caché o se cambia de equipo. Los archivos Excel y PDF descargados son el respaldo recomendado para conservación a largo plazo.

---

## Historial de versiones

| Versión | Descripción |
|---|---|
| 1.3 | Módulo de carga de base de datos con control de acceso |
| 1.2 | Mejoras de interfaz, validaciones adicionales y bloqueo en móviles |
| 1.1 | Autoguardado y correcciones en producción |
| 1.0 | Versión inicial |

---

## Soporte

Para dudas o reporte de errores, contactar al desarrollador a través de Microsoft Teams.

---

**Última actualización:** Abril 2026 — **Versión:** 1.4