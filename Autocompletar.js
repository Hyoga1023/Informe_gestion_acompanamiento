// ═══════════════════════════════════════════════════════════
// SISTEMA DE AUTOCOMPLETADO DE EMPLEADORES POR NIT
// ═══════════════════════════════════════════════════════════

let empleadoresDB = null;

// ────────────────────────────────────────────────
// 1. CARGAR BASE DE DATOS AL INICIAR
// ────────────────────────────────────────────────
async function cargarEmpleadores() {
  try {
    const response = await fetch('empleadores.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar la base de datos');
    }
    const data = await response.json();
    empleadoresDB = data.empleadores;
    console.log('✅ Base de datos cargada:', empleadoresDB.length, 'empleadores');
  } catch (error) {
    console.error('❌ Error cargando empleadores:', error);
    alert('No se pudo cargar la base de datos de empleadores. Podrás llenar los campos manualmente.');
  }
}

// ────────────────────────────────────────────────
// 2. BUSCAR EMPLEADOR POR NIT
// ────────────────────────────────────────────────
function buscarPorNIT(nit) {
  if (!empleadoresDB) {
    console.warn('⚠️ Base de datos no cargada');
    return null;
  }

  // Limpiar el NIT ingresado (quitar espacios, guiones, etc)
  const nitLimpio = nit.replace(/[^0-9]/g, '');
  
  // Buscar coincidencia
  return empleadoresDB.find(emp => {
    const nitDBLimpio = emp.nit.replace(/[^0-9]/g, '');
    return nitDBLimpio === nitLimpio;
  });
}

// ────────────────────────────────────────────────
// 3. AUTOCOMPLETAR SOLO RAZÓN SOCIAL
// ────────────────────────────────────────────────
function autocompletarEmpleador(empleador) {
  if (!empleador) {
    console.log('ℹ️ No se encontró empleador');
    return;
  }

  // Solo llenar el campo de razón social
  const campoEmpresa = document.getElementById('empresa');
  
  if (campoEmpresa) {
    campoEmpresa.value = empleador.razonSocial;
    
    // Efecto visual de "llenado automático"
    campoEmpresa.style.backgroundColor = '#e8f5e9';
    campoEmpresa.style.transition = 'background-color 0.3s ease';
    
    setTimeout(() => {
      campoEmpresa.style.backgroundColor = '';
    }, 1500);
  }

  console.log('✅ Razón social autocompletada:', empleador.razonSocial);
  
  // Mostrar mensaje de éxito
  mostrarMensajeAutocompletado(empleador.razonSocial);
}

// ────────────────────────────────────────────────
// 4. MENSAJE VISUAL DE ÉXITO
// ────────────────────────────────────────────────
function mostrarMensajeAutocompletado(razonSocial) {
  // Crear mensaje temporal
  const mensaje = document.createElement('div');
  mensaje.textContent = `✅ Datos cargados: ${razonSocial}`;
  mensaje.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(mensaje);

  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    mensaje.style.opacity = '0';
    mensaje.style.transition = 'opacity 0.5s';
    setTimeout(() => mensaje.remove(), 500);
  }, 3000);
}

// ────────────────────────────────────────────────
// 5. LISTENER DEL CAMPO NIT
// ────────────────────────────────────────────────
function configurarBusquedaNIT() {
  const campoNIT = document.getElementById('nit');
  
  if (!campoNIT) {
    console.warn('⚠️ No se encontró el campo NIT en el formulario');
    return;
  }

  // Búsqueda cuando pierde el foco (blur)
  campoNIT.addEventListener('blur', function() {
    const nit = this.value.trim();
    
    if (nit.length < 8) {
      console.log('ℹ️ NIT muy corto para buscar');
      return;
    }

    const empleador = buscarPorNIT(nit);
    
    if (empleador) {
      autocompletarEmpleador(empleador);
    } else {
      console.log('ℹ️ NIT no encontrado en la base de datos');
      // Opcional: mostrar mensaje
      const mensaje = document.createElement('div');
      mensaje.textContent = 'ℹ️ NIT no encontrado';
      mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #FF9800;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
      `;
      document.body.appendChild(mensaje);
      setTimeout(() => {
        mensaje.style.opacity = '0';
        mensaje.style.transition = 'opacity 0.5s';
        setTimeout(() => mensaje.remove(), 500);
      }, 3000);
    }
  });

  // También buscar al presionar Enter
  campoNIT.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.blur(); // Trigger el evento blur
    }
  });

  console.log('✅ Sistema de búsqueda por NIT configurado');
}

// ────────────────────────────────────────────────
// 6. BOTÓN DE BÚSQUEDA MANUAL (OPCIONAL)
// ────────────────────────────────────────────────
function crearBotonBusqueda() {
  const campoNIT = document.getElementById('nit');
  if (!campoNIT) return;

  // Crear botón
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = '🔍 Buscar';
  boton.style.cssText = `
    margin-left: 10px;
    padding: 10px 20px;
    background-color: var(--color-1);
    color: var(--color-2);
    border: 2px solid var(--color-2);
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  `;

  boton.addEventListener('click', function() {
    const nit = campoNIT.value.trim();
    if (!nit) {
      alert('Por favor ingresa un NIT');
      return;
    }
    const empleador = buscarPorNIT(nit);
    if (empleador) {
      autocompletarEmpleador(empleador);
    } else {
      alert('NIT no encontrado en la base de datos');
    }
  });

  // Insertar botón después del campo NIT
  campoNIT.parentNode.appendChild(boton);
}

// ────────────────────────────────────────────────
// 7. INICIALIZACIÓN
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Inicializando sistema de autocompletado...');
  
  // Cargar base de datos
  await cargarEmpleadores();
  
  // Configurar listeners
  configurarBusquedaNIT();
  
  // Crear botón de búsqueda (opcional)
  // crearBotonBusqueda(); // Descomenta si quieres el botón
  
  console.log('✅ Sistema de autocompletado listo');
});

// ────────────────────────────────────────────────
// 8. FUNCIONES AUXILIARES PARA DEBUGGING
// ────────────────────────────────────────────────
// Para probar en la consola:
window.testBusqueda = function(nit) {
  const empleador = buscarPorNIT(nit);
  if (empleador) {
    console.table(empleador);
    autocompletarEmpleador(empleador);
  } else {
    console.log('❌ No encontrado');
  }
};

// Listar todos los NITs disponibles
window.listarNITs = function() {
  if (!empleadoresDB) {
    console.log('Base de datos no cargada');
    return;
  }
  console.log('📋 NITs disponibles:');
  empleadoresDB.forEach(emp => {
    console.log(`${emp.nit} → ${emp.razonSocial}`);
  });
};