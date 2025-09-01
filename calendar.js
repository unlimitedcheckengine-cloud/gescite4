// js/features/calendar.js

import { citas, guardarCitasEnStorage } from '../dataStore.js';
import { agentes } from '../dataStore.js';
import { getEventColor, sanitizeHTML, formatearFechaParaVisualizacion, mostrarMensaje } from '../utils.js';
import { renderCitas, abrirEditarModal } from './appointments.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza el calendario de citas.
 */
export function renderCalendario() {
    if (!DOM.calendarioEl) return;

    // No renderizar el calendario si su contenedor no está visible.
    if (DOM.calendarioEl.offsetParent === null) {
        return;
    }

    // Transformar citas a eventos de FullCalendar
    const eventos = citas.map(cita => {
        const agente = agentes.find(a => a.id === cita.agente) || { nombre: 'N/A' }; // Usar ===
        return {
            id: cita.id,
            title: `${cita.nombreCliente} (${cita.marca} ${cita.modelo})`,
            start: `${cita.fecha}T${cita.hora}`,
            backgroundColor: getEventColor(cita.estado),
            borderColor: getEventColor(cita.estado),
            extendedProps: {
                agente: agente.nombre,
                servicio: cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio,
                cliente: cita.nombreCliente,
                vehiculo: `${cita.marca} ${cita.modelo}`
            }
        };
    });

    // Destruir instancia anterior para evitar duplicados
    if (DOM.calendario) {
        DOM.calendario.destroy();
    }

    DOM.calendario = new FullCalendar.Calendar(DOM.calendarioEl, {
        locale: 'es',
        initialView: 'timeGridWeek', // Vista semanal es más útil para citas
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: eventos,
        editable: true,
        nowIndicator: true, // Muestra la hora actual
        businessHours: { // Resalta el horario laboral
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Lunes - Viernes
            startTime: '08:00',
            endTime: '17:00',
        },
        slotMinTime: '07:00:00', // Empezar el día a las 7am
        slotMaxTime: '18:00:00', // Terminar a las 6pm
        eventContent: function(arg) { // Renderizado personalizado de eventos
            let html = `
                <div class="fc-event-main-custom">
                    <div class="fc-event-time">${sanitizeHTML(arg.timeText)}</div>
                    <div class="fc-event-title-container">
                        <div class="fc-event-title-custom"><i class="fas fa-user me-1"></i>${sanitizeHTML(arg.event.extendedProps.cliente)}</div>
                        <div class="fc-event-desc"><i class="fas fa-car me-1"></i>${sanitizeHTML(arg.event.extendedProps.vehiculo)}</div>
                    </div>
                </div>
            `;
            return { html: html };
        },
        eventClick: function(info) {
            // Abrir el modal de edición al hacer clic en un evento
            const citaId = parseInt(info.event.id);
            abrirEditarModal(citaId);
        },
        eventDrop: function(info) {
            const citaId = parseInt(info.event.id);
            const index = citas.findIndex(c => c.id === citaId);

            if (index !== -1) {
                const nuevaFechaHora = info.event.start;
                
                const nuevaFecha = nuevaFechaHora.getFullYear() + '-' + 
                                   ('0' + (nuevaFechaHora.getMonth() + 1)).slice(-2) + '-' + 
                                   ('0' + nuevaFechaHora.getDate()).slice(-2);

                const nuevaHora = ('0' + nuevaFechaHora.getHours()).slice(-2) + ':' + 
                                  ('0' + nuevaFechaHora.getMinutes()).slice(-2);

                citas[index].fecha = nuevaFecha;
                if (nuevaHora !== '00:00') { // Only update time if it's not midnight (from all-day drag)
                    citas[index].hora = nuevaHora;
                }

                guardarCitasEnStorage();
                renderCitas(); // Re-renderiza todo para mantener la consistencia
                
                mostrarMensaje(`La cita de ${citas[index].nombreCliente} ha sido reagendada.`, 'info');
            } else {
                info.revert();
                mostrarMensaje('Hubo un error al actualizar la cita.', 'danger');
            }
        }
    });

    DOM.calendario.render();
}

/**
 * Sincroniza la vista del calendario con los filtros de fecha activos.
 */
export function sincronizarCalendarioConFiltros() {
    if (!DOM.calendario) return;

    const fechaFiltro = DOM.filtroFechaInput.value;
    const mesFiltro = DOM.filtroMesSelect.value;
    const anioFiltro = DOM.filtroAnioSelect.value;

    // Solo actuar si hay un filtro de fecha
    if (fechaFiltro) {
        DOM.calendario.gotoDate(fechaFiltro + 'T12:00:00');
        DOM.calendario.changeView('timeGridDay');
    } else if (mesFiltro && anioFiltro) {
        DOM.calendario.gotoDate(`${anioFiltro}-${mesFiltro}-01`);
        DOM.calendario.changeView('dayGridMonth');
    } else if (anioFiltro) {
        DOM.calendario.gotoDate(`${anioFiltro}-01-01`);
        DOM.calendario.changeView('dayGridMonth');
    }
}