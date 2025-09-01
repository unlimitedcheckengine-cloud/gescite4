// js/app.js

import { configuracion, setConfiguracion } from './constants.js';
import { cargarCitasDesdeStorage, cargarAgentesDesdeStorage, cargarClientesDesdeStorage, cargarServiciosPredefinidosDesdeStorage, migrarDatosAntiguos, actualizarCitasPasadas, sincronizarClientesDesdeCitas, citas, agentes, clientes } from './dataStore.js';
import { aplicarConfiguracion, guardarConfiguracion } from './features/config.js';
import { renderCitas, obtenerCitasFiltradas, agregarCita, limpiarFormularioNuevaCita, autocompletarCliente, seleccionarVehiculoExistente, guardarEdicion } from './features/appointments.js';
import { renderDashboard, actualizarResumen } from './features/dashboard.js';
import { cargarFiltroAnios, cargarRegionesEnSelects, cargarCombustiblesEnSelects, cargarServiciosEnSelects, generarReportes } from './features/reports.js';
import { renderSeguimiento, cargarAgentesFiltroSeguimiento } from './features/followUp.js';
import { renderPostVenta, cargarAgentesFiltroPostVenta } from './features/postSale.js';
import { renderClientes } from './features/clients.js';
import { renderCalendario, sincronizarCalendarioConFiltros } from './features/calendar.js';
import { procesarArchivoExcel, confirmarImportacion, importarDatos } from './features/importExport.js';
import { cargarAgentesEnSelects } from './features/agents.js';
import { cargarServiciosEnFormularios } from './features/services.js';
import * as DOM from './domElements.js';

// --- Funciones de Inicialización ---
function inicializarAplicacion() {
    // Asegurar que el filtro "Todas" esté activo por defecto ANTES de cargar los datos.
    DOM.grupoFiltros.querySelector('[data-estado="todas"]').classList.add('active');

    cargarCitasDesdeStorage();
    cargarAgentesDesdeStorage();
    cargarClientesDesdeStorage();
    cargarServiciosPredefinidosDesdeStorage();

    // Cargar configuración y aplicarla
    const configGuardada = localStorage.getItem('configuracion');
    if (configGuardada) {
        setConfiguracion(JSON.parse(configGuardada));
    }
    aplicarConfiguracion();
    
    // Migrar datos antiguos si es necesario
    if ((configuracion.dataVersion || '1.0') < '1.7') {
        migrarDatosAntiguos();
    }
    
    // Actualizar citas pendientes pasadas a "No Asistió"
    actualizarCitasPasadas();

    // Sincronizar clientes con citas
    sincronizarClientesDesdeCitas();

    // Cargar todos los filtros y selects
    cargarFiltroAnios();
    cargarAgentesEnSelects();
    cargarServiciosEnFormularios();
    cargarServiciosEnSelects();
    cargarRegionesEnSelects();
    cargarCombustiblesEnSelects();
    cargarAgentesFiltroSeguimiento();
    cargarAgentesFiltroPostVenta();

    // Renderizar la UI inicial
    renderCitas(); // Esto renderiza la tabla principal y llama a actualizarResumen, renderSeguimiento, etc.
    renderDashboard(); // Esto renderiza los widgets de la pestaña de inicio.

    // Establecer la fecha mínima para el campo de nueva cita para evitar fechas pasadas.
    if (DOM.fecha) DOM.fecha.min = new Date().toISOString().split('T')[0];
    
    // Pre-rellenar los filtros de fecha en la pestaña de reportes con el mes actual.
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];
    if (DOM.filtroReporteFechaInicioInput) DOM.filtroReporteFechaInicioInput.value = primerDiaMes;
    if (DOM.filtroReporteFechaFinInput) DOM.filtroReporteFechaFinInput.value = ultimoDiaMes;
}

// --- Event Listeners Globales ---
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Manejar la visualización de la pestaña de citas para renderizar la lista
if (DOM.pillsCitasTab) DOM.pillsCitasTab.addEventListener('shown.bs.tab', renderCitas);

// Manejar la visualización de la pestaña de inicio para recargar el dashboard
if (DOM.pillsInicioTab) DOM.pillsInicioTab.addEventListener('shown.bs.tab', renderDashboard);

// Manejar la visualización de la pestaña de reportes para generar los gráficos
if (DOM.pillsReportesTab) DOM.pillsReportesTab.addEventListener('shown.bs.tab', generarReportes);

// Manejar la visualización de la pestaña de post-venta
if (DOM.pillsPostVentaTab) DOM.pillsPostVentaTab.addEventListener('shown.bs.tab', renderPostVenta);

// Manejar el formulario de nueva cita
if (DOM.citaForm) DOM.citaForm.addEventListener('submit', agregarCita);

// Limpiar formulario al hacer clic en la pestaña "Nueva Cita"
if (DOM.pillsNuevaTab) DOM.pillsNuevaTab.addEventListener('click', () => {
    limpiarFormularioNuevaCita();
    if (DOM.telefonoInput) DOM.telefonoInput.value = ''; // Limpiar también el teléfono para un nuevo inicio
});

// Manejar el cambio en el select de servicio para mostrar/ocultar el campo "Otro"
if (DOM.servicioSelect) DOM.servicioSelect.addEventListener('change', () => {
    if (DOM.servicioSelect.value === 'Otro') {
        DOM.otroServicioContainer.style.display = '';
    } else {
        DOM.otroServicioContainer.style.display = 'none';
    }
});

// Manejar el checkbox de promoción en el formulario de nueva cita
if (DOM.esPromocionCheck) DOM.esPromocionCheck.addEventListener('change', () => {
    DOM.promoContainer.style.display = DOM.esPromocionCheck.checked ? '' : 'none';
});

// Manejar el checkbox de promoción en el formulario de edición
if (DOM.editarEsPromocionCheck) DOM.editarEsPromocionCheck.addEventListener('change', () => {
    DOM.editarPromoContainer.style.display = DOM.editarEsPromocionCheck.checked ? '' : 'none';
});

// Listener para autocompletar cliente al salir del campo de teléfono
if (DOM.telefonoInput) DOM.telefonoInput.addEventListener('blur', autocompletarCliente);

// Listener para rellenar datos del vehículo al seleccionarlo
if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.addEventListener('change', seleccionarVehiculoExistente);

// Manejar los clics en los botones de filtro de citas
if (DOM.grupoFiltros) DOM.grupoFiltros.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON') {
        const estado = target.dataset.estado;
        const todasBtn = DOM.grupoFiltros.querySelector('[data-estado="todas"]');

        if (estado === 'todas') {
            if (!target.classList.contains('active')) {
                DOM.grupoFiltros.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
            }
        } else {
            target.classList.toggle('active');
            todasBtn.classList.remove('active');
        }

        const algunActivo = DOM.grupoFiltros.querySelector('button.active:not([data-estado="todas"])');
        if (!algunActivo) {
            todasBtn.classList.add('active');
        }
        renderCitas();
    }
});

// Manejar el cambio en el input de fecha para las estadísticas
if (DOM.filtroFechaInput) DOM.filtroFechaInput.addEventListener('change', () => {
    renderCitas();
    sincronizarCalendarioConFiltros();
});

// Manejar el cambio en el select de mes
if (DOM.filtroMesSelect) DOM.filtroMesSelect.addEventListener('change', () => {
    renderCitas();
    sincronizarCalendarioConFiltros();
});

// Manejar el cambio en el select de año
if (DOM.filtroAnioSelect) DOM.filtroAnioSelect.addEventListener('change', () => {
    renderCitas();
    sincronizarCalendarioConFiltros();
});

// Manejar el cambio en el switch de facturado
if (DOM.filtroFacturadoInput) DOM.filtroFacturadoInput.addEventListener('change', renderCitas);

// Manejar el filtro de búsqueda por texto
if (DOM.filtroBusquedaInput) DOM.filtroBusquedaInput.addEventListener('input', renderCitas);

// Manejar la visualización de la pestaña del calendario para renderizarlo correctamente
if (DOM.calendarioTab) DOM.calendarioTab.addEventListener('shown.bs.tab', function () {
    setTimeout(() => {
        renderCalendario();
    }, 10);
});

// Refrescar la lista de citas si el usuario vuelve a esta pestaña del navegador
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        actualizarCitasPasadas(); 
        renderCitas();
    }
});

// Registrar el Service Worker para la funcionalidad PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker registrado con éxito:', registration.scope);
        }).catch(error => {
            console.log('Fallo en el registro de ServiceWorker:', error);
        });
    });
}