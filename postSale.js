// js/features/postSale.js

import { citas, guardarCitasEnStorage, agentes } from '../dataStore.js';
import { configuracion } from '../constants.js';
import { mostrarMensaje, formatearFechaParaVisualizacion, sanitizeHTML } from '../utils.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza la tabla de seguimiento post-venta.
 */
export function renderPostVenta() {
    if (!DOM.listaPostVenta) return;

    DOM.listaPostVenta.innerHTML = '';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const LIMITE_DIAS_INICIO = 3; // Empezar seguimiento después de 3 días
    const LIMITE_DIAS_FIN = 90; // Dejar de mostrar después de 90 días
    const agenteIdFiltro = DOM.filtroPostVentaAgente.value;

    // Citas que necesitan seguimiento post-venta
    const citasParaPostVenta = citas.filter(cita => {
        if (cita.estado !== 'completada') return false;
        if (agenteIdFiltro && cita.agente !== parseInt(agenteIdFiltro)) return false; // Usar === y parseInt
        if (cita.postVenta.status !== 'pending') return false;

        const fechaCita = new Date(cita.fecha + 'T12:00:00');
        const diffTiempo = hoy.getTime() - fechaCita.getTime();
        const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

        return diffDias >= LIMITE_DIAS_INICIO && diffDias <= LIMITE_DIAS_FIN;
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Mostrar las más antiguas primero

    // Citas ya contactadas en el período
    const citasYaContactadas = citas.filter(cita => {
        if (cita.estado !== 'completada') return false;
        if (agenteIdFiltro && cita.agente !== parseInt(agenteIdFiltro)) return false; // Usar === y parseInt
        if (cita.postVenta.status !== 'contacted') return false;

        // Añadir filtro de fecha para que coincida con el título "Contactados (90 días)"
        const fechaCita = new Date(cita.fecha + 'T12:00:00');
        const diffTiempo = hoy.getTime() - fechaCita.getTime();
        const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

        return diffDias >= 0 && diffDias <= LIMITE_DIAS_FIN;
    }).sort((a, b) => new Date(b.postVenta.lastContact) - new Date(a.postVenta.lastContact));

    // Actualizar contador
    if (DOM.postVentaPorContactar) DOM.postVentaPorContactar.textContent = citasParaPostVenta.length;

    // Renderizar tabla "Por Contactar"
    DOM.listaPostVenta.innerHTML = '';
    citasParaPostVenta.forEach(cita => {
        const tr = document.createElement('tr');
        const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
        tr.innerHTML = `
            <td>${cita.nombreCliente || 'N/A'} <br><small class="text-muted">${cita.telefono || ''}</small></td>
            <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
            <td>${servicio}</td>
            <td>
                <button class="btn btn-info btn-sm" title="Registrar Feedback" onclick="window.abrirModalNotasPostVenta(${cita.id})">
                    <i class="fas fa-comment-dots me-1"></i> Registrar
                </button>
            </td>
        `;
        DOM.listaPostVenta.appendChild(tr);
    });
    if (citasParaPostVenta.length === 0) DOM.listaPostVenta.innerHTML = '<tr><td colspan="4" class="text-center">No hay clientes por contactar.</td></tr>';

    // Renderizar tabla "Contactados"
    if (DOM.listaPostVentaContactados) DOM.listaPostVentaContactados.innerHTML = '';
    citasYaContactadas.forEach(cita => {
        const tr = document.createElement('tr');
        const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
        let satisfaccionIcon = '<span class="text-muted">N/A</span>';
        if (cita.postVenta.satisfaction) {
            switch (cita.postVenta.satisfaction) {
                case 'satisfecho': satisfaccionIcon = '<i class="fas fa-smile-beam text-success fa-lg" title="Satisfecho"></i>'; break;
                case 'neutral': satisfaccionIcon = '<i class="fas fa-meh text-warning fa-lg" title="Neutral"></i>'; break;
                case 'insatisfecho': satisfaccionIcon = '<i class="fas fa-frown text-danger fa-lg" title="Insatisfecho"></i>'; break;
            }
        }
        const notasPreview = cita.postVenta.notes ? (cita.postVenta.notes.substring(0, 40) + '...') : 'Sin notas';

        tr.innerHTML = `
            <td>${cita.nombreCliente || 'N/A'}</td>
            <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
            <td>${servicio}</td>
            <td class="text-center">${satisfaccionIcon}</td>
            <td title="${sanitizeHTML(cita.postVenta.notes)}">${sanitizeHTML(notasPreview)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" title="Ver/Editar Feedback" onclick="window.abrirModalNotasPostVenta(${cita.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        DOM.listaPostVentaContactados.appendChild(tr);
    });
    if (citasYaContactadas.length === 0) DOM.listaPostVentaContactados.innerHTML = '<tr><td colspan="6" class="text-center">No hay clientes contactados recientemente.</td></tr>';

    // Actualizar contador de contactados
    if (DOM.postVentaContactados) DOM.postVentaContactados.textContent = citasYaContactadas.length;
}

/**
 * Carga los agentes en el select de filtro de post-venta.
 */
export function cargarAgentesFiltroPostVenta() {
    if (!DOM.filtroPostVentaAgente) return;
    
    DOM.filtroPostVentaAgente.innerHTML = '<option value="">Todos los Agentes</option>';
    
    const agentesActivos = [...agentes].filter(a => a.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));

    agentesActivos.forEach(agente => {
        const option = document.createElement('option');
        option.value = agente.id;
        option.textContent = agente.nombre;
        DOM.filtroPostVentaAgente.appendChild(option);
    });
}

/**
 * Abre el modal para agregar o editar notas de post-venta.
 */
export function abrirModalNotasPostVenta(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        if (DOM.postVentaCitaId) DOM.postVentaCitaId.value = id;
        if (DOM.postVentaNombreCliente) DOM.postVentaNombreCliente.textContent = cita.nombreCliente;
        if (DOM.postVentaNotasText) DOM.postVentaNotasText.value = cita.postVenta.notes || '';
        // Reset and set satisfaction radio
        document.querySelectorAll('input[name="satisfaccion"]').forEach(radio => radio.checked = false);
        if (cita.postVenta.satisfaction) {
            const radioBtn = document.getElementById(`satisfaccion_${cita.postVenta.satisfaction}`);
            if (radioBtn) radioBtn.checked = true;
        }
        if (DOM.postVentaNotasModal) DOM.postVentaNotasModal.show();
    }
}

/**
 * Guarda las notas de post-venta desde el modal.
 */
export function guardarNotasPostVenta() {
    const id = parseInt(DOM.postVentaCitaId.value);
    const satisfaccion = document.querySelector('input[name="satisfaccion"]:checked')?.value || null;
    const notas = DOM.postVentaNotasText.value;
    const citaIndex = citas.findIndex(c => c.id === id);
    if (citaIndex > -1) {
        citas[citaIndex].postVenta.status = 'contacted';
        citas[citaIndex].postVenta.satisfaction = satisfaccion;
        citas[citaIndex].postVenta.notes = notas;
        citas[citaIndex].postVenta.lastContact = new Date().toISOString().split('T')[0];
        guardarCitasEnStorage();
        renderPostVenta();
        if (DOM.postVentaNotasModal) DOM.postVentaNotasModal.hide();
        mostrarMensaje('Notas de post-venta guardadas.', 'success');
    }
}

// Exponer funciones globalmente para onclick en HTML
window.abrirModalNotasPostVenta = abrirModalNotasPostVenta;

// Event Listeners
if (DOM.filtroPostVentaAgente) DOM.filtroPostVentaAgente.addEventListener('change', renderPostVenta);
if (DOM.btnGuardarNotasPostVenta) DOM.btnGuardarNotasPostVenta.addEventListener('click', guardarNotasPostVenta);