// js/features/services.js

import { serviciosPredefinidos, setServiciosPredefinidos } from '../constants.js';
import { mostrarMensaje, formatearMonto, sanitizeHTML } from '../utils.js';
import { cargarServiciosEnSelects as cargarServiciosEnReportesSelect } from './reports.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza la tabla de servicios en el modal de gestión
 */
export function renderServiciosPredefinidos() {
    if (!DOM.tablaServicios) return;
    DOM.tablaServicios.innerHTML = '';
    const serviciosOrdenados = [...serviciosPredefinidos].sort((a, b) => a.nombre.localeCompare(b.nombre));

    serviciosOrdenados.forEach(servicio => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => editarServicio(servicio.id);
        tr.innerHTML = `
            <td>${sanitizeHTML(servicio.nombre)}</td>
            <td>${        tr.onclick = () => editarServicio(servicio.id);
        tr.innerHTML = `
            <td>${sanitizeHTML(servicio.nombre)}</td>
            <td>${formatearMonto(servicio.precio)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); editarServicio(${servicio.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        DOM.tablaServicios.appendChild(tr);
    });
}

/**
 * Carga los servicios predefinidos en los selects de los formularios de citas.
 */
export function cargarServiciosEnFormularios() {
    const selects = [DOM.servicioSelect, DOM.editarServicioSelect];
    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = ''; // Limpiar opciones existentes

        serviciosPredefinidos.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio.nombre;
            option.textContent = `${servicio.nombre} - ${formatearMonto(servicio.precio)}`;
            select.appendChild(option);
        });

        // Añadir la opción "Otro" al final
        const otroOption = document.createElement('option');
        otroOption.value = 'Otro';
        otroOption.textContent = 'Otro...';
        select.appendChild(otroOption);
    });
}

/**
 * Guarda un servicio nuevo o editado.
 */
function guardarServicio() {
    const id = DOM.servicioId.value ? parseInt(DOM.servicioId.value) : null;
    const nombre = DOM.servicioNombre.value.trim();
    const precio = parsearMonto(DOM.servicioPrecio.value);

    if (!nombre) {
        mostrarMensaje("El nombre del servicio es obligatorio.", "warning");
        return;
    }

    if (id) {
        // Editar
        const index = serviciosPredefinidos.findIndex(s => s.id === id);
        if (index !== -1) {
            serviciosPredefinidos[index] = { id, nombre, precio };
        }
    } else {
        // Crear
        const nuevoId = serviciosPredefinidos.length > 0 ? Math.max(...serviciosPredefinidos.map(s => s.id)) + 1 : 1;
        serviciosPredefinidos.push({ id: nuevoId, nombre, precio });
    }

    localStorage.setItem('serviciosPredefinidos', JSON.stringify(serviciosPredefinidos));
    renderServiciosPredefinidos();
    cargarServiciosEnFormularios();
    cargarServiciosEnReportesSelect(); // Actualizar filtro de reportes
    DOM.servicioForm.reset();
    DOM.servicioId.value = '';
    DOM.btnGuardarServicio.textContent = 'Crear Servicio';
    if (DOM.btnEliminarServicio) DOM.btnEliminarServicio.style.display = 'none';
    mostrarMensaje(`Servicio ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
}

/**
 * Prepara el formulario para editar un servicio.
 * @param {number} id - El ID del servicio a editar.
 */
function editarServicio(id) {
    const servicio = serviciosPredefinidos.find(s => s.id === id);
    if (servicio) {
        DOM.servicioId.value = servicio.id;
        DOM.servicioNombre.value = servicio.nombre;
        DOM.servicioPrecio.value = servicio.precio;
        DOM.btnGuardarServicio.textContent = 'Guardar Cambios';
        if (DOM.btnEliminarServicio) DOM.btnEliminarServicio.style.display = 'inline-block';
        DOM.servicioForm.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Elimina el servicio actualmente en edición.
 */
function eliminarServicio() {
    const id = parseInt(DOM.servicioId.value);
    if (isNaN(id)) return;

    const servicio = serviciosPredefinidos.find(s => s.id === id);
    if (!servicio) return;

    const citasConServicio = citas.filter(c => c.servicio === servicio.nombre);
    if (citasConServicio.length > 0) {
        mostrarMensaje(`No se puede eliminar. El servicio está asignado a ${citasConServicio.length} cita(s).`, 'danger');
        return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.")) {
        const index = serviciosPredefinidos.findIndex(s => s.id === id);
        if (index !== -1) {
            serviciosPredefinidos.splice(index, 1);
            localStorage.setItem('serviciosPredefinidos', JSON.stringify(serviciosPredefinidos));
            renderServiciosPredefinidos();
            cargarServiciosEnFormularios();
            cargarServiciosEnReportesSelect();
            DOM.servicioForm.reset();
            DOM.servicioId.value = '';
            DOM.btnGuardarServicio.textContent = 'Crear Servicio';
            if (DOM.btnEliminarServicio) DOM.btnEliminarServicio.style.display = 'none';
            mostrarMensaje("Servicio eliminado correctamente.", "success");
        }
    }
}

// Event Listeners para el modal de gestión de servicios
if (DOM.servicioForm) {
    DOM.servicioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarServicio();
    });
}

if (DOM.btnEliminarServicio) {
    DOM.btnEliminarServicio.addEventListener('click', eliminarServicio);
}

if (DOM.gestionServiciosModalEl) {
    DOM.gestionServiciosModalEl.addEventListener('shown.bs.modal', renderServiciosPredefinidos);
    DOM.gestionServiciosModalEl.addEventListener('hidden.bs.modal', () => {
        DOM.servicioForm.reset();
        DOM.servicioId.value = '';
        DOM.btnGuardarServicio.textContent = 'Crear Servicio';
        if (DOM.btnEliminarServicio) DOM.btnEliminarServicio.style.display = 'none';
    });
}


