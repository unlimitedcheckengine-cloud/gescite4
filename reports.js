// js/features/reports.js

import { citas, agentes } from '../dataStore.js';
import { configuracion, serviciosPredefinidos } from '../constants.js';
import { formatearMonto, sanitizeHTML } from '../utils.js';
import { obtenerCitasFiltradas } from './appointments.js'; // Importar para generar texto copiable
import * as DOM from '../domElements.js';

/**
 * Calcula las estadísticas para el panel de resumen de la tabla de citas.
 * @param {Array<object>} citasFiltradas - Citas ya filtradas para el cálculo.
 */
export function calcularEstadisticas(citasFiltradas) {
    const totalCitas = citasFiltradas.length;
    const recibidas = citasFiltradas.filter(c => c.estado === 'recibido' || c.estado === 'completada').length;
    // const facturadas = citasFiltradas.filter(c => c.facturado).length; // Not used in current display
    const montoTotal = citasFiltradas.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
    const efectividad = totalCitas > 0 ? (recibidas / totalCitas) * 100 : 0;

    if (DOM.statsTotal) DOM.statsTotal.textContent = totalCitas;
    if (DOM.statsRecibidas) DOM.statsRecibidas.textContent = recibidas;
    if (DOM.statsMonto) DOM.statsMonto.textContent = formatearMonto(montoTotal);
    if (DOM.statsEfectividad) DOM.statsEfectividad.textContent = `${efectividad.toFixed(0)}%`;
}

/**
 * Carga los años disponibles en el filtro de reportes.
 */
export function cargarFiltroAnios() {
    if (!DOM.filtroAnioSelect) return;
    
    // Obtener años únicos de las citas
    const anios = new Set();
    citas.forEach(cita => {
        if (cita.fecha) {
            // Se añade T12:00 para forzar la interpretación en la zona horaria local
            const anio = new Date(cita.fecha + 'T12:00:00').getFullYear();
            anios.add(anio);
        }
    });
    
    // Ordenar años de forma descendente
    const aniosOrdenados = Array.from(anios).sort((a, b) => b - a);
    
    // Limpiar select
    DOM.filtroAnioSelect.innerHTML = '<option value="">Todos los años</option>';
    
    // Agregar años
    aniosOrdenados.forEach(anio => {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        DOM.filtroAnioSelect.appendChild(option);
    });
}

/**
 * Carga los servicios únicos en el select de filtros de reportes.
 */
export function cargarServiciosEnSelects() {
    if (!DOM.filtroReporteServicioSelect) return;

    // Usar los servicios predefinidos para consistencia
    const serviciosOrdenados = [...serviciosPredefinidos].map(s => s.nombre).sort();

    DOM.filtroReporteServicioSelect.innerHTML = '<option value="">Todos los servicios</option>';
    serviciosOrdenados.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio;
        option.textContent = servicio;
        DOM.filtroReporteServicioSelect.appendChild(option);
    });
}

/**
 * Carga las regiones únicas en el select de filtros de reportes.
 */
export function cargarRegionesEnSelects() {
    if (!DOM.filtroReporteRegionSelect) return;

    const regionesUnicas = new Set(citas.map(c => c.region).filter(Boolean));
    const regionesOrdenadas = Array.from(regionesUnicas).sort();

    DOM.filtroReporteRegionSelect.innerHTML = '<option value="">Todas las regiones</option>';
    regionesOrdenadas.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        DOM.filtroReporteRegionSelect.appendChild(option);
    });
}

/**
 * Carga los combustibles únicos en el select de filtros de reportes.
 */
export function cargarCombustiblesEnSelects() {
    if (!DOM.filtroReporteCombustibleSelect) return;

    const combustiblesUnicos = new Set(citas.map(c => c.combustible).filter(Boolean));
    const combustiblesOrdenados = Array.from(combustiblesUnicos).sort();

    DOM.filtroReporteCombustibleSelect.innerHTML = '<option value="">Todos los combustibles</option>';
    combustiblesOrdenados.forEach(combustible => {
        DOM.filtroReporteCombustibleSelect.innerHTML += `<option value="${combustible}">${combustible}</option>`;
    });
}

/**
 * Obtiene las citas filtradas específicamente para los reportes.
 * @returns {Array<object>} Un array con las citas que cumplen los criterios de filtro de reportes.
 */
export function obtenerCitasFiltradasParaReportes() {
    const fechaInicio = DOM.filtroReporteFechaInicioInput.value;
    const fechaFin = DOM.filtroReporteFechaFinInput.value;
    const agenteId = DOM.filtroReporteAgenteSelect.value;
    const servicioFiltro = DOM.filtroReporteServicioSelect.value;
    const regionFiltro = DOM.filtroReporteRegionSelect.value;
    const combustibleFiltro = DOM.filtroReporteCombustibleSelect.value;
    const estadosActivos = [...DOM.grupoFiltrosReportes.querySelectorAll('button.active')].map(btn => btn.dataset.estado);
    const todasActivo = estadosActivos.includes('todas');
    const facturadoFiltro = DOM.filtroReporteFacturadoInput.checked;

    return citas.filter(cita => {
        const citaFecha = new Date(cita.fecha + 'T12:00:00');

        // Filtro por rango de fechas
        if (fechaInicio && citaFecha < new Date(fechaInicio + 'T12:00:00')) return false;
        if (fechaFin && citaFecha > new Date(fechaFin + 'T12:00:00')) return false;

        // Filtro por agente
        if (agenteId && cita.agente !== parseInt(agenteId)) return false; // Usar === y parseInt

        // Filtro por servicio
        if (servicioFiltro) {
            const servicioCita = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
            if (servicioCita !== servicioFiltro) return false;
        }

        // Filtro por región
        if (regionFiltro && cita.region !== regionFiltro) return false;

        // Filtro por combustible
        if (combustibleFiltro && cita.combustible !== combustibleFiltro) return false;

        // Filtro por estado
        if (!todasActivo && !estadosActivos.includes(cita.estado)) return false;

        // Filtro por facturado
        if (facturadoFiltro && !cita.facturado) return false;

        return true;
    });
}

/**
 * Genera el gráfico de distribución por estado
 */
export function generarGraficoEstados(citasParaReportes) {
    const ctx = document.getElementById('estadoChart');
    if (!ctx) return;
    
    const estados = ['pendiente', 'recibido', 'completada', 'reagendada', 'no_asistio', 'cancelada'];
    const conteoEstados = {};
    
    estados.forEach(estado => {
        conteoEstados[estado] = citasParaReportes.filter(c => c.estado === estado).length;
    });
    
    // Destruir gráfico anterior si existe
    if (DOM.estadoChart) {
        DOM.estadoChart.destroy();
    }
    
    DOM.estadoChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pendientes', 'Recibidos', 'Completadas', 'Reagendadas', 'No Asistieron', 'Canceladas'],
            datasets: [{
                data: Object.values(conteoEstados),
                backgroundColor: [
                    '#6c757d', // pendiente - gris
                    '#17a2b8', // recibido - azul claro
                    '#28a745', // completada - verde
                    '#ffc107', // reagendada - amarillo
                    '#dc3545', // no_asistio - rojo
                    '#343a40'  // cancelada - negro
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Genera reportes y gráficos
 */
export function generarReportes() {
    const citasParaReportes = obtenerCitasFiltradasParaReportes();
    // Generar gráfico de estados
    generarGraficoEstados(citasParaReportes);
    // Generar gráfico de facturación mensual
    generarGraficoFacturacion(citasParaReportes);
    // Generar tabla de reportes por agente
    generarTablaReportes(citasParaReportes);
    // Generar nuevos reportes avanzados
    generarGraficoServiciosPopulares(citasParaReportes);
    generarGraficoOrigenVehiculos(citasParaReportes);
    generarTablaReporteServicios(citasParaReportes);
}

/**
 * Genera el gráfico de facturación mensual
 */
export function generarGraficoFacturacion(citasParaReportes) {
    const ctx = document.getElementById('facturacionChart');
    if (!ctx) return;
    
    // Agrupar facturación por mes
    const facturacionMensual = {};
    
    citasParaReportes.filter(c => c.facturado).forEach(cita => {
        // Se añade T12:00 para forzar la interpretación en la zona horaria local
        const fecha = new Date(cita.fecha + 'T12:00:00');
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        const clave = `${año}-${mes.toString().padStart(2, '0')}`;
        
        if (!facturacionMensual[clave]) {
            facturacionMensual[clave] = 0;
        }
        
        facturacionMensual[clave] += cita.monto || 0;
    });
    
    // Ordenar por fecha
    const mesesOrdenados = Object.keys(facturacionMensual).sort();
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const etiquetas = mesesOrdenados.map(clave => {
        const partes = clave.split('-');
        return `${nombresMeses[parseInt(partes[1]) - 1]} ${partes[0]}`;
    });
    
    const valores = mesesOrdenados.map(clave => facturacionMensual[clave]);
    
    // Destruir gráfico anterior si existe
    if (DOM.facturacionChart) {
        DOM.facturacionChart.destroy();
    }
    
    DOM.facturacionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Facturación Mensual',
                data: valores,
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Facturación Mensual'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatearMonto(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Genera la tabla de reportes por agente
 */
export function generarTablaReportes(citasParaReportes) {
    const tablaReportes = document.getElementById('tablaReportes');
    if (!tablaReportes) return;
    
    tablaReportes.innerHTML = '';
    
    // Agrupar citas por agente
    const reportesAgentes = {};
    
    agentes.forEach(agente => {
        reportesAgentes[agente.id] = {
            nombre: agente.nombre,
            total: 0,
            completadas: 0,
            recibidos: 0,
            no_asistio: 0,
            canceladas: 0,
            facturado: 0,
            vehiculos: {}
        };
    });
    
    citasParaReportes.forEach(cita => {
        if (cita.agente && reportesAgentes[cita.agente]) {
            reportesAgentes[cita.agente].total++;
            
            switch (cita.estado) {
                case 'completada':
                    reportesAgentes[cita.agente].completadas++;
                    break;
                case 'recibido':
                    reportesAgentes[cita.agente].recibidos++;
                    break;
                case 'no_asistio':
                    reportesAgentes[cita.agente].no_asistio++;
                    break;
                case 'cancelada':
                    reportesAgentes[cita.agente].canceladas++;
                    break;
            }
            
            if (cita.facturado) {
                reportesAgentes[cita.agente].facturado += cita.monto || 0;
            }

            // Contar vehículos
            if (cita.marca && cita.modelo) {
                const vehiculoKey = `${cita.marca} ${cita.modelo}`;
                const vehiculosAgente = reportesAgentes[cita.agente].vehiculos;
                vehiculosAgente[vehiculoKey] = (vehiculosAgente[vehiculoKey] || 0) + 1;
            }
        }
    });
    
    // Generar filas de la tabla
    for (const [agenteId, datos] of Object.entries(reportesAgentes)) {
        const efectividad = datos.total > 0 ? (datos.completadas / datos.total) * 100 : 0;
        const montoPromedio = datos.completadas > 0 ? datos.facturado / datos.completadas : 0;
        let vehiculoTop = 'N/A';
        if (Object.keys(datos.vehiculos).length > 0) {
            vehiculoTop = Object.entries(datos.vehiculos).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${datos.nombre}</td>
            <td>${datos.total}</td>
            <td>${datos.completadas}</td>
            <td>${datos.recibidos}</td>
            <td>${datos.no_asistio}</td>
            <td>${datos.canceladas}</td>
            <td>${formatearMonto(datos.facturado)}</td>
            <td>${formatearMonto(montoPromedio)}</td>
            <td>${efectividad.toFixed(1)}%</td>
            <td>${sanitizeHTML(vehiculoTop)}</td>
        `;
        tablaReportes.appendChild(tr);
    }
}

/**
 * Genera el gráfico de los servicios más populares.
 */
export function generarGraficoServiciosPopulares(citasParaReportes) {
    const ctx = document.getElementById('serviciosPopularesChart');
    if (!ctx) return;

    const conteoServicios = {};
    citasParaReportes.forEach(cita => {
        const servicio = (cita.servicio === 'Otro' && cita.otroServicio) ? cita.otroServicio : cita.servicio;
        if (servicio) {
            conteoServicios[servicio] = (conteoServicios[servicio] || 0) + 1;
        }
    });

    const serviciosOrdenados = Object.entries(conteoServicios).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const etiquetas = serviciosOrdenados.map(item => item[0]);
    const valores = serviciosOrdenados.map(item => item[1]);

    if (DOM.serviciosPopularesChart) DOM.serviciosPopularesChart.destroy();

    DOM.serviciosPopularesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Cantidad de Citas',
                data: valores,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(41, 128, 185, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });
}

/**
 * Genera el gráfico de distribución por origen de vehículo.
 */
export function generarGraficoOrigenVehiculos(citasParaReportes) {
    const ctx = document.getElementById('origenVehiculoChart');
    if (!ctx) return;

    const conteoOrigen = {};
    citasParaReportes.forEach(cita => {
        const origen = cita.region || 'No especificado';
        conteoOrigen[origen] = (conteoOrigen[origen] || 0) + 1;
    });

    const etiquetas = Object.keys(conteoOrigen);
    const valores = Object.values(conteoOrigen);

    if (DOM.origenVehiculoChart) DOM.origenVehiculoChart.destroy();

    DOM.origenVehiculoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: etiquetas,
            datasets: [{
                data: valores,
                backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#1abc9c']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

/**
 * Genera la tabla de reporte por servicio.
 */
export function generarTablaReporteServicios(citasParaReportes) {
    const tablaBody = document.getElementById('tablaReportesServicios');
    if (!tablaBody) return;

    const reporteServicios = {};

    citasParaReportes.forEach(cita => {
        const servicio = (cita.servicio === 'Otro' && cita.otroServicio) ? cita.otroServicio : cita.servicio;
        if (!servicio) return;

        if (!reporteServicios[servicio]) {
            reporteServicios[servicio] = { cantidad: 0, totalFacturado: 0 };
        }
        reporteServicios[servicio].cantidad++;
        if (cita.facturado) {
            reporteServicios[servicio].totalFacturado += cita.monto || 0;
        }
    });

    const serviciosOrdenados = Object.entries(reporteServicios).sort((a, b) => b[1].cantidad - a[1].cantidad);

    tablaBody.innerHTML = '';
    if (serviciosOrdenados.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="4" class="text-center">No hay datos de servicios para mostrar.</td></tr>';
        return;
    }

    serviciosOrdenados.forEach(([nombre, datos]) => {
        const montoPromedio = datos.cantidad > 0 ? datos.totalFacturado / datos.cantidad : 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sanitizeHTML(nombre)}</td>
            <td>${datos.cantidad}</td>
            <td>${formatearMonto(datos.totalFacturado)}</td>
            <td>${formatearMonto(montoPromedio)}</td>
        `;
        tablaBody.appendChild(tr);
    });
}

/**
 * Genera un texto copiable con las citas del día agrupadas por agente
 */
export function generarTextoParaCopiar() {
    // Obtener la fecha seleccionada en el filtro o usar la de hoy
    const fechaFiltro = DOM.filtroFechaInput.value;
    let fechaParaMostrar = 'mañana';
    
    if (fechaFiltro) {
        // Se añade T12:00 para forzar la interpretación en la zona horaria local
        const fecha = new Date(fechaFiltro + 'T12:00:00');
        fechaParaMostrar = fecha.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Obtener citas filtradas
    const citasFiltradas = obtenerCitasFiltradas(); // Re-usar la función de filtrado de citas principal
    
    // Agrupar por agente
    const citasPorAgente = {};
    citasFiltradas.forEach(cita => {
        const agenteId = cita.agente || 'sin-asignar';
        const agente = agentes.find(a => a.id === agenteId) || { nombre: 'Sin asignar' }; // Usar ===
        
        if (!citasPorAgente[agente.nombre]) {
            citasPorAgente[agente.nombre] = [];
        }
        citasPorAgente[agente.nombre].push(cita);
    });
    
    // Generar texto
    let texto = `Proyección para ${fechaParaMostrar}\n\n`;
    
    for (const [agente, citasAgente] of Object.entries(citasPorAgente)) {
        texto += `*${configuracion.nombreEmpresa} / ${agente}*\n`;
        
        citasAgente.forEach(cita => {
            texto += `- ${cita.marca} ${cita.modelo} ${cita.anio}\n`;
        });
        
        texto += '\n';
    }
    
    return texto;
}

/**
 * Copia el texto al portapapeles
 * @param {string} texto - Texto a copiar
 */
export function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarMensaje("Lista copiada al portapapeles", "success");
    }).catch(err => {
        console.error('Error al copiar: ', err);
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            mostrarMensaje("Lista copiada al portapapeles", "success");
        } catch (e) {
            mostrarMensaje("Error al copiar al portapapeles", "danger");
        }
        document.body.removeChild(textArea);
    });
}

// Event Listeners para reportes
if (DOM.filtroReporteFechaInicioInput) DOM.filtroReporteFechaInicioInput.addEventListener('change', generarReportes);
if (DOM.filtroReporteFechaFinInput) DOM.filtroReporteFechaFinInput.addEventListener('change', generarReportes);
if (DOM.filtroReporteAgenteSelect) DOM.filtroReporteAgenteSelect.addEventListener('change', generarReportes);
if (DOM.filtroReporteServicioSelect) DOM.filtroReporteServicioSelect.addEventListener('change', generarReportes);
if (DOM.filtroReporteRegionSelect) DOM.filtroReporteRegionSelect.addEventListener('change', generarReportes);
if (DOM.filtroReporteCombustibleSelect) DOM.filtroReporteCombustibleSelect.addEventListener('change', generarReportes);
if (DOM.filtroReporteFacturadoInput) DOM.filtroReporteFacturadoInput.addEventListener('change', generarReportes);

if (DOM.grupoFiltrosReportes) DOM.grupoFiltrosReportes.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON') {
        const estado = target.dataset.estado;
        const todasBtn = DOM.grupoFiltrosReportes.querySelector('[data-estado="todas"]');

        if (estado === 'todas') {
            if (!target.classList.contains('active')) {
                DOM.grupoFiltrosReportes.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
            }
        } else {
            target.classList.toggle('active');
            todasBtn.classList.remove('active');
        }

        const algunActivo = DOM.grupoFiltrosReportes.querySelector('button.active:not([data-estado="todas"])');
        if (!algunActivo) {
            todasBtn.classList.add('active');
        }
        generarReportes();
    }
});

if (DOM.btnCopiarLista) DOM.btnCopiarLista.addEventListener('click', () => {
    const texto = generarTextoParaCopiar();
    copiarAlPortapapeles(texto);
});