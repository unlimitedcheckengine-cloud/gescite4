// js/features/agents.js

import { agentes, guardarAgentesEnStorage, citas } from '../dataStore.js';
import { mostrarMensaje, sanitizeHTML } from '../utils.js';
import * as DOM from '../domElements.js';

/**
 * Renderiza la tabla de agentes
 */
export function renderAgentes() {
    if (!DOM.tablaAgentes) return;
    
    DOM.tablaAgentes.innerHTML = '';
    
    const agentesOrdenados = [...agentes].sort((a, b) => a.nombre.localeCompare(b.nombre));

    agentesOrdenados.forEach(agente => {
        const citasDelAgente = citas.filter(c => c.agente == agente.id);
        const citasCompletadas = citasDelAgente.filter(c => c.estado === 'completada').length;

        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => editarAgente(agente.id);

        tr.innerHTML = `
            <td><strong>${sanitizeHTML(agente.nombre)}</strong><br><small class="text-muted">${sanitizeHTML(agente.email || '')}</small></td>
            <td><span class="badge ${agente.activo ? 'bg-success' : 'bg-secondary'}">${agente.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td class="text-center">${citasDelAgente.length}</td>
            <td class="text-center">${citasCompletadas}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); editarAgente(${agente.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        DOM.tablaAgentes.appendChild(tr);
    });
}

/**
 * Carga los agentes en los selects del formulario
 */
export function cargarAgentesEnSelects() {
    if (!DOM.agenteSelect || !DOM.editarAgenteInput) return;
    
    // Limpiar selects
    DOM.agenteSelect.innerHTML = '';
    DOM.editarAgenteInput.innerHTML = '';
    
    // Agregar opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione un agente...';
    DOM.agenteSelect.appendChild(defaultOption.cloneNode(true));
    DOM.editarAgenteInput.appendChild(defaultOption.cloneNode(true));
    
    // Agregar agentes activos
    agentes.filter(a => a.activo).forEach(agente => {
        const option = document.createElement('option');
        option.value = agente.id;
        option.textContent = agente.nombre;
        DOM.agenteSelect.appendChild(option.cloneNode(true));
        DOM.editarAgenteInput.appendChild(option.cloneNode(true));
    });
}

/**
 * Guarda un agente nuevo o editado
 */
export function guardarAgente() {
    const id = DOM.agenteIdInput.value ? parseInt(DOM.agenteIdInput.value) : (agentes.length > 0 ? Math.max(...agentes.map(a => a.id)) + 1 : 1);
    const nombre = DOM.agenteNombreInput.value;
    const email = DOM.agenteEmailInput.value;
    const telefono = DOM.agenteTelefonoInput.value;
    const activo = DOM.agenteActivoInput.checked;
    
    if (!nombre) {
        mostrarMensaje("El nombre del agente es obligatorio.", "warning");
        return;
    }
    
    const esEdicion = !!DOM.agenteIdInput.value;

    if (esEdicion) {
        // Editar agente existente
        const index = agentes.findIndex(a => a.id === id);
        if (index !== -1) {
            agentes[index] = { id, nombre, email, telefono, activo };
        }
    } else {
        // Agregar nuevo agente
        agentes.push({ id, nombre, email, telefono, activo });
    }
    
    guardarAgentesEnStorage();
    renderAgentes(); // Re-renderizar la tabla de agentes
    cargarAgentesEnSelects(); // Re-cargar los selects de agentes
    
    // Limpiar el formulario para permitir agregar otro agente o cerrar.
    DOM.agenteForm.reset();
    if (DOM.agenteFormTitulo) DOM.agenteFormTitulo.textContent = 'Crear Nuevo Agente';
    if (DOM.btnGuardarAgente) DOM.btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
    if (DOM.btnEliminarAgente) DOM.btnEliminarAgente.style.display = 'none';
    DOM.agenteIdInput.value = '';

    mostrarMensaje(`Agente ${esEdicion ? 'actualizado' : 'agregado'} correctamente.`, "success");
}

/**
 * Edita un agente existente
 * @param {number} id - ID del agente a editar
 */
export function editarAgente(id) {
    const agente = agentes.find(a => a.id === id);
    if (agente) {
        if (DOM.agenteFormTitulo) DOM.agenteFormTitulo.textContent = `Editando a: ${agente.nombre}`;
        DOM.agenteIdInput.value = agente.id;
        DOM.agenteNombreInput.value = agente.nombre;
        DOM.agenteEmailInput.value = agente.email || '';
        DOM.agenteTelefonoInput.value = agente.telefono || '';
        DOM.agenteActivoInput.checked = agente.activo;
        
        if (DOM.btnGuardarAgente) DOM.btnGuardarAgente.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Cambios`;
        if (DOM.btnEliminarAgente) DOM.btnEliminarAgente.style.display = 'block';
        
        // Scroll al formulario para mejor UX
        DOM.agenteForm.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Elimina el agente actualmente en edición
 */
export function eliminarAgente() {
    const id = parseInt(DOM.agenteIdInput.value);
    if (isNaN(id)) return;

    const citasAsignadas = citas.filter(cita => cita.agente === id); // Usar === para comparación estricta
    if (citasAsignadas.length > 0) {
        mostrarMensaje(`No se puede eliminar. El agente tiene ${citasAsignadas.length} cita(s) asignada(s).`, 'danger');
        return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar este agente? Esta acción no se puede deshacer.")) {
        const index = agentes.findIndex(a => a.id === id);
        if (index !== -1) {
            agentes.splice(index, 1); // Eliminar el agente del array
            guardarAgentesEnStorage();
            renderAgentes(); // Re-renderizar la tabla de agentes
            cargarAgentesEnSelects(); // Re-cargar los selects de agentes

            // Limpiar el formulario
            DOM.agenteForm.reset();
            if (DOM.agenteFormTitulo) DOM.agenteFormTitulo.textContent = 'Crear Nuevo Agente';
            if (DOM.btnGuardarAgente) DOM.btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
            if (DOM.btnEliminarAgente) DOM.btnEliminarAgente.style.display = 'none';
            DOM.agenteIdInput.value = '';

            mostrarMensaje("Agente eliminado correctamente.", "success");
        }
    }
}

// Event Listeners para el modal de agentes
if (DOM.agenteForm) DOM.agenteForm.addEventListener('submit', (e) => { e.preventDefault(); guardarAgente(); });
if (DOM.btnEliminarAgente) DOM.btnEliminarAgente.addEventListener('click', eliminarAgente);

if (DOM.gestionAgentesModalEl) {
    DOM.gestionAgentesModalEl.addEventListener('hidden.bs.modal', () => {
        DOM.agenteIdInput.value = '';
        DOM.agenteForm.reset();
        if (DOM.agenteFormTitulo) DOM.agenteFormTitulo.textContent = 'Crear Nuevo Agente';
        if (DOM.btnGuardarAgente) DOM.btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
        if (DOM.btnEliminarAgente) DOM.btnEliminarAgente.style.display = 'none';
    });
}