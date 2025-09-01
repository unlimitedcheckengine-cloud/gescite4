// js/features/followUp.js

import { citas, guardarCitasEnStorage, agentes } from '../dataStore.js';
import { configuracion } from '../constants.js';
import { mostrarMensaje, formatearFechaParaVisualizacion, sanitizeHTML, capitalizar, getBadgeClass } from '../utils.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza la tabla de seguimiento de clientes.
 */
export function renderSeguimiento() {
    if (!DOM.listaSeguimiento) return;
 
    DOM.listaSeguimiento.innerHTML = '';
    if (DOM.listaSeguimientoContactados) DOM.listaSeguimientoContactados.innerHTML = '';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparaciones de día
    const LIMITE_DIAS_SEGUIMIENTO = 90;
    const DIAS_LIMITE_RECIBIDO = configuracion.seguimientoDiasRecibido || 3;
    const agenteIdFiltro = DOM.filtroSeguimientoAgente.value;
 
    const citasEnSeguimiento = citas.filter(cita => {
        // Filtro por agente
        if (agenteIdFiltro && cita.agente !== parseInt(agenteIdFiltro)) return false; // Usar === y parseInt
 
        const fechaCita = new Date(cita.fecha + 'T12:00:00');
        const diffTiempo = hoy.getTime() - fechaCita.getTime();
        const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
 
        // Condición 1: Cancelada o No Asistió en los últimos 90 días
        const esCanceladoNoAsistio = (cita.estado === 'cancelada' || cita.estado === 'no_asistio') && diffDias >= 0 && diffDias <= LIMITE_DIAS_SEGUIMIENTO;
 
        // Condición 2: Recibida pero estancada (sin facturar) por más de 3 días
        const esRecibidoEstancado = cita.estado === 'recibido' && !cita.facturado && diffDias > DIAS_LIMITE_RECIBIDO;

        if (esCanceladoNoAsistio) cita.motivoSeguimiento = capitalizar(cita.estado.replace('_', ' '));
        if (esRecibidoEstancado) cita.motivoSeguimiento = 'Recibido (sin completar)';

        return esCanceladoNoAsistio || esRecibidoEstancado;
    });

    const porContactar = citasEnSeguimiento.filter(c => c.seguimiento.status === 'pending').sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const contactados = citasEnSeguimiento.filter(c => c.seguimiento.status !== 'pending').sort((a, b) => new Date(b.seguimiento.lastContact) - new Date(a.seguimiento.lastContact));
 
    // Actualizar los contadores
    if (DOM.seguimientoPorContactar) DOM.seguimientoPorContactar.textContent = porContactar.length;
    if (DOM.seguimientoContactados) DOM.seguimientoContactados.textContent = contactados.length;
 
    // Renderizar tabla "Por Contactar"
    porContactar.forEach(cita => {
        const tr = document.createElement('tr');
        const badgeClass = cita.motivoSeguimiento === 'Recibido (sin completar)' ? getBadgeClass('recibido') : getBadgeClass(cita.estado);
        tr.innerHTML = `
            <td>${cita.nombreCliente || 'N/A'} <br><small class="text-muted">${cita.telefono || ''}</small></td>
            <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
            <td><span class="${badgeClass}">${cita.motivoSeguimiento}</span></td>
            <td>
                <button class="btn btn-info btn-sm" title="Registrar Contacto" onclick="window.abrirModalNotasSeguimiento(${cita.id})">
                    <i class="fas fa-phone-alt me-1"></i> Registrar
                </button>
            </td>
        `;
        DOM.listaSeguimiento.appendChild(tr);
    });
    if (porContactar.length === 0) DOM.listaSeguimiento.innerHTML = '<tr><td colspan="4" class="text-center">No hay clientes por contactar.</td></tr>';
 
    // Renderizar tabla "Contactados Recientemente"
    if (DOM.listaSeguimientoContactados) {
        contactados.forEach(cita => {
            const tr = document.createElement('tr');
            let estadoSeguimientoBadge = '';
            switch(cita.seguimiento.status) {
                case 'contacted': estadoSeguimientoBadge = '<span class="badge bg-info">Contactado</span>'; break;
                case 'rebooked': estadoSeguimientoBadge = '<span class="badge bg-success">Reagendado</span>'; break;
                case 'closed_not_interested': estadoSeguimientoBadge = '<span class="badge bg-danger">Cerrado (No interesado)</span>'; break;
                case 'closed_other': estadoSeguimientoBadge = '<span class="badge bg-secondary">Cerrado (Otro)</span>'; break;
            }
            const notasPreview = cita.seguimiento.notes ? (cita.seguimiento.notes.substring(0, 40) + '...') : 'Sin notas';

            tr.innerHTML = `
                <td>${cita.nombreCliente || 'N/A'}</td>
                <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                <td>${estadoSeguimientoBadge}</td>
                <td>${cita.seguimiento.lastContact ? formatearFechaParaVisualizacion(cita.seguimiento.lastContact) : 'N/A'}</td>
                <td title="${sanitizeHTML(cita.seguimiento.notes)}">${sanitizeHTML(notasPreview)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" title="Ver/Editar Notas" onclick="window.abrirModalNotasSeguimiento(${cita.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            DOM.listaSeguimientoContactados.appendChild(tr);
        });
        if (contactados.length === 0) DOM.listaSeguimientoContactados.innerHTML = '<tr><td colspan="6" class="text-center">No hay seguimientos activos o cerrados.</td></tr>';
    }
}

/**
 * Carga los agentes en el select de filtro de seguimiento.
 */
export function cargarAgentesFiltroSeguimiento() {
    if (!DOM.filtroSeguimientoAgente) return;
    
    DOM.filtroSeguimientoAgente.innerHTML = '<option value="">Todos los Agentes</option>';
    
    const agentesActivos = [...agentes].filter(a => a.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));

    agentesActivos.forEach(agente => {
        const option = document.createElement('option');
        option.value = agente.id;
        option.textContent = agente.nombre;
        DOM.filtroSeguimientoAgente.appendChild(option);
    });
}

/**
 * Abre el modal para agregar o editar notas de seguimiento.
 * @param {number} id - El ID de la cita.
 */
export function abrirModalNotasSeguimiento(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        if (DOM.seguimientoCitaId) DOM.seguimientoCitaId.value = id;
        if (DOM.seguimientoNombreCliente) DOM.seguimientoNombreCliente.textContent = cita.nombreCliente;
        if (DOM.seguimientoNotasText) DOM.seguimientoNotasText.value = cita.seguimiento.notes || '';
        if (DOM.seguimientoResultadoSelect) DOM.seguimientoResultadoSelect.value = cita.seguimiento.status === 'pending' ? 'contacted' : cita.seguimiento.status;
        if (DOM.seguimientoNotasModal) DOM.seguimientoNotasModal.show();
    }
}

/**
 * Guarda las notas de seguimiento desde el modal.
 */
export function guardarNotasSeguimiento() {
    const id = parseInt(DOM.seguimientoCitaId.value);
    const nuevoEstado = DOM.seguimientoResultadoSelect.value;
    const notas = DOM.seguimientoNotasText.value;
    const citaIndex = citas.findIndex(c => c.id === id);

    if (nuevoEstado.startsWith('closed') && !notas) {
        mostrarMensaje('Las notas son obligatorias para cerrar un seguimiento.', 'warning');
        return;
    }

    if (citaIndex > -1) {
        citas[citaIndex].seguimiento.status = nuevoEstado;
        citas[citaIndex].seguimiento.notes = notas;
        citas[citaIndex].seguimiento.lastContact = new Date().toISOString().split('T')[0];
        guardarCitasEnStorage();
        renderSeguimiento();
        if (DOM.seguimientoNotasModal) DOM.seguimientoNotasModal.hide();
        mostrarMensaje('Interacción de seguimiento registrada.', 'success');
    }
}

// Exponer funciones globalmente para onclick en HTML
window.abrirModalNotasSeguimiento = abrirModalNotasSeguimiento;

// Event Listeners
if (DOM.filtroSeguimientoAgente) DOM.filtroSeguimientoAgente.addEventListener('change', renderSeguimiento);
if (DOM.btnGuardarNotasSeguimiento) DOM.btnGuardarNotasSeguimiento.addEventListener('click', guardarNotasSeguimiento);