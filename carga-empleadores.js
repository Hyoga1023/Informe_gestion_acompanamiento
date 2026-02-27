/**
 * SISTEMA DE CARGA DE BASE DE DATOS DE EMPLEADORES
 * 
 * Este script maneja la carga de un archivo JSON con la información de empleadores
 * y lo almacena en localForage para uso posterior en el autocompletado.
 * 
 * Estructura esperada del JSON (empleadores.json):
 * [
 *   {
 *     "nit": "800123456",
 *     "razon_social": "EMPRESA EJEMPLO S.A.S",
 *     "asesor_comercial": "Juan Pérez",
 *     "alerta_ciclo_cobro": "3. PREJURIDICO 1",
 *     "deuda_presunta": "$ 8.563.712",
 *     "deuda_real": "$ 1.069.458",
 *     "pagos_po": "",
 *     "aportes_po": "",
 *     "pagos_ces": "",
 *     "pagos_pv": "",
 *     "aportes_pv": ""
 *   },
 *   ...
 * ]
 *
 * Valores válidos para "alerta_ciclo_cobro" (parametrizado):
 *   "1. PASO A DEMANDA"
 *   "2. PREJURIDICO EN FIRME"
 *   "3. PREJURIDICO 1"
 *   "4. COBRO NORMAL"
 *   "5. FUERA DE CICLO"
 *   "6. EMPRESA EN CEROS"
 *   "" (vacío si no aplica)
 *
 * NOTA: Este campo es confidencial y NO aparece en el PDF generado.
 */

// Inicializar localForage con configuración específica
localforage.config({
    name: 'ProteccionDB',
    storeName: 'empleadores'
});

// Referencia al botón de carga
const btnCargarBase = document.querySelector('.botonn');

// Crear el input file oculto dinámicamente
const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.accept = '.json';
inputFile.style.display = 'none';
document.body.appendChild(inputFile);

/**
 * Evento del botón "Cargar Base de Datos"
 */
btnCargarBase.addEventListener('click', () => {
    inputFile.click();
});

/**
 * Evento cuando se selecciona un archivo
 */
inputFile.addEventListener('change', async (e) => {
    const archivo = e.target.files[0];
    
    if (!archivo) {
        mostrarMensaje('No se seleccionó ningún archivo', 'error');
        return;
    }

    if (!archivo.name.endsWith('.json')) {
        mostrarMensaje('El archivo debe ser formato JSON (.json)', 'error');
        inputFile.value = '';
        return;
    }

    btnCargarBase.textContent = 'Cargando...';
    btnCargarBase.disabled = true;

    try {
        const contenido = await leerArchivoJSON(archivo);

        const empleadores = Array.isArray(contenido)
            ? contenido
            : contenido.empleadores;

        if (!Array.isArray(empleadores)) {
            throw new Error("El archivo JSON debe ser un Array de empleadores.");
        }

        const erroresValidacion = validarEmpleadores(empleadores);
        if (erroresValidacion.length > 0) {
            throw new Error(`Errores en la estructura de datos:\n${erroresValidacion.join('\n')}`);
        }

        const indiceEmpleadores = {};
        empleadores.forEach(emp => {
            const nit = limpiarNIT(emp.nit);
            indiceEmpleadores[nit] = {
                nit,
                razonSocial:      emp.razon_social.trim(),
                asesorComercial:  (emp.asesor_comercial || '').trim() || 'Sin Consultor Asignado',
                // Campos de gestión — si no existen en el JSON quedan como ""
                valorDeudaPresunta: (emp.deuda_presunta  || '').trim(),
                valorDeudaReal:     (emp.deuda_real      || '').trim(),
                valorPagosPO:       (emp.pagos_po        || '').trim(),
                valorAportesPO:     (emp.aportes_po      || '').trim(),
                valorPagosCES:      (emp.pagos_ces       || '').trim(),
                valorPagosPV:       (emp.pagos_pv        || '').trim(),
                valorAportesPV:     (emp.aportes_pv      || '').trim(),
                alertaCicloCobro:   (emp.alerta_ciclo_cobro || '').trim()
            };
        });

        await localforage.setItem('baseEmpleadores', indiceEmpleadores);
        
        await localforage.setItem('metadatosBase', {
            fechaCarga: new Date().toISOString(),
            nombreArchivo: archivo.name,
            cantidadEmpleadores: Object.keys(indiceEmpleadores).length,
            version: '1.0'
        });

        const cantidad = Object.keys(indiceEmpleadores).length;
        mostrarMensaje(
            `✅ Base de datos cargada exitosamente\n\n` +
            `📊 ${cantidad} empleadores registrados\n` +
            `📅 ${new Date().toLocaleString('es-CO')}\n\n` +
            `Puedes volver al inicio para usar el autocompletado.`,
            'exito'
        );

        console.log(`✅ Base de datos cargada: ${cantidad} empleadores`);
        console.log('Primeros 3 empleadores:', Object.values(indiceEmpleadores).slice(0, 3));

    } catch (error) {
        console.error('❌ Error al cargar la base de datos:', error);
        mostrarMensaje(
            `❌ Error al cargar el archivo:\n\n${error.message}\n\n` +
            `Verifica que el archivo JSON tenga la estructura correcta.`,
            'error'
        );
    } finally {
        btnCargarBase.textContent = 'Cargar Base de Datos';
        btnCargarBase.disabled = false;
        inputFile.value = '';
    }
});

/**
 * Lee un archivo JSON y retorna su contenido parseado
 */
function leerArchivoJSON(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const contenido = JSON.parse(e.target.result);
                resolve(contenido);
            } catch (error) {
                reject(new Error('El archivo no es un JSON válido'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };
        
        reader.readAsText(archivo, 'UTF-8');
    });
}

/**
 * Valida que los empleadores tengan la estructura correcta
 */
function validarEmpleadores(empleadores) {
    const errores = [];
    const camposRequeridos = ['nit', 'razon_social', 'asesor_comercial'];
    
    empleadores.forEach((empleador, index) => {
        camposRequeridos.forEach(campo => {
            if (!empleador[campo] || empleador[campo].toString().trim() === '') {
                errores.push(`Empleador ${index + 1}: Falta el campo "${campo}"`);
            }
        });
        
        if (empleador.nit && !/^[\d\-]+$/.test(empleador.nit.toString())) {
            errores.push(`Empleador ${index + 1}: El NIT "${empleador.nit}" tiene caracteres inválidos`);
        }
    });
    
    return errores.slice(0, 10);
}

/**
 * Limpia el NIT quitando espacios, guiones y caracteres especiales
 */
function limpiarNIT(nit) {
    return nit.toString().replace(/[\s\-]/g, '').trim();
}

/**
 * Muestra un mensaje al usuario con estilo
 */
function mostrarMensaje(mensaje, tipo) {
    const iconos = {
        exito: '✅',
        error: '❌',
        info: 'ℹ️',
        advertencia: '⚠️'
    };
    
    const icono = iconos[tipo] || iconos.info;
    
    alert(`${icono} ${mensaje}`);
}

/**
 * Función auxiliar para verificar si hay base de datos cargada
 */
async function verificarBaseDatos() {
    try {
        const metadatos = await localforage.getItem('metadatosBase');
        
        if (metadatos) {
            console.log('Base de datos disponible:', metadatos);
            
            const infoElement = document.createElement('div');
            infoElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: Ubuntu, sans-serif;
                font-size: 14px;
                z-index: 1000;
            `;
            infoElement.innerHTML = `
                ✅ Base de datos cargada<br>
                ${metadatos.cantidadEmpleadores} empleadores<br>
                ${new Date(metadatos.fechaCarga).toLocaleDateString('es-CO')}
            `;
            document.body.appendChild(infoElement);
            
            setTimeout(() => {
                infoElement.style.transition = 'opacity 0.5s';
                infoElement.style.opacity = '0';
                setTimeout(() => infoElement.remove(), 500);
            }, 5000);
        } else {
            console.log('⚠️ No hay base de datos cargada');
        }
    } catch (error) {
        console.error('Error al verificar base de datos:', error);
    }
}

/**
 * Función para limpiar/borrar la base de datos (útil para testing)
 */
async function limpiarBaseDatos() {
    if (confirm('⚠️ ¿Estás seguro de que quieres borrar la base de datos de empleadores?\n\nEsta acción no se puede deshacer.')) {
        try {
            await localforage.removeItem('baseEmpleadores');
            await localforage.removeItem('metadatosBase');
            mostrarMensaje('Base de datos eliminada correctamente', 'exito');
            console.log('Base de datos eliminada');
        } catch (error) {
            mostrarMensaje('Error al eliminar la base de datos', 'error');
            console.error('Error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', verificarBaseDatos);

window.limpiarBaseDatos = limpiarBaseDatos;

console.log('📦 Sistema de carga de empleadores inicializado');