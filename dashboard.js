// js/features/dashboard.js

import { citas } from '../dataStore.js';
import { formatearMonto, formatearFechaParaVisualizacion } from '../utils.js';
import { abrirEditarModal } from './appointments.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza el dashboard (pestaña de inicio).
 */
export function renderDashboard() {
    renderProximasCitas();
    renderActividadReciente();
}

/**
 * Renderiza la lista de próximas citas en el dashboard.
 */
export function renderProximasCitas() {
    if (!DOM.proximasCitasContainer) return;

    const hoy = new Date().toISOString().split('T')[0];
    const proximas = citas
        .filter(c => c.fecha >= hoy && c.estado === 'pendiente')
        .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
        .slice(0, 5);

    DOM.proximasCitasContainer.innerHTML = '';
    if (proximas.length === 0) {
        DOM.proximasCitasContainer.innerHTML = '<li class="list-group-item text-center text-muted">No hay citas pendientes próximas.</li>';
        return;
    }

    proximas.forEach(cita => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${cita.nombreCliente}</strong> - ${cita.marca} ${cita.modelo}<br>
                <small class="text-muted">${formatearFechaParaVisualizacion(cita.fecha)} a las ${cita.hora}</small>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="window.abrirEditarModal(${cita.id})"><i class="fas fa-eye"></i></button>
        `;
        DOM.proximasCitasContainer.appendChild(li);
    });
}

/**
 * Renderiza la lista de actividad reciente en el dashboard.
 */
export function renderActividadReciente() {
    if (!DOM.actividadRecienteContainer) return;

    const recientes = [...citas].sort((a, b) => b.id - a.id).slice(0, 5);
    DOM.actividadRecienteContainer.innerHTML = '';

    recientes.forEach(cita => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>${cita.nombreCliente}</strong> - Cita ${cita.estado === 'pendiente' ? 'creada' : 'actualizada a ' + cita.estado} para el ${formatearFechaParaVisualizacion(cita.fecha)}.`;
        DOM.actividadRecienteContainer.appendChild(li);
    });
}

/**
 * Actualiza el panel de resumen
 */
export function actualizarResumen() {
    const hoy = new Date().toISOString().split('T')[0];
    
    const totalCitas = citas.length;
    const citasHoy = citas.filter(c => c.fecha === hoy).length;
    const citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
    const montoTotal = citas.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
    
    if (DOM.resumenTotal) {
        DOM.resumenTotal.textContent = totalCitas;
        DOM.resumenHoy.textContent = citasHoy;
        DOM.resumenPendientes.textContent = citasPendientes;
        DOM.resumenFacturado.textContent = formatearMonto(montoTotal);
    }
}