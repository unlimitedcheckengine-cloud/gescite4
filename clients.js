// js/features/clients.js

import { clientes, guardarClientesEnStorage, citas } from '../dataStore.js';
import { mostrarMensaje, sanitizeHTML, formatearMonto, formatearFechaParaVisualizacion, getBadgeClass, capitalizar } from '../utils.js';
import { abrirEditarModal } from './appointments.js';
import * as DOM from '../domElements.js';

let clienteIdActualParaVehiculo = null;

/**
 * Renderiza la lista de clientes
 */
export function renderClientes() {
    if (!DOM.listaClientes) return;
    DOM.listaClientes.innerHTML = '';
    const filtro = (DOM.filtroClientes.value || '').toLowerCase();
    
    const clientesFiltrados = clientes.filter(c => 
        c.nombre.toLowerCase().includes(filtro) || 
        (c.telefono && c.telefono.includes(filtro))
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (clientesFiltrados.length === 0 && !filtro) {
        DOM.listaClientes.innerHTML = '<div class="list-group-item text-center text-muted">No se encontraron clientes.</div>';
        return;
    }

    clientesFiltrados.forEach(cliente => {
        const citasCliente = citas.filter(c => c.telefono === cliente.telefono);
        const ultimaCita = citasCliente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action';
        item.dataset.clienteId = cliente.id;
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${sanitizeHTML(cliente.nombre)}</h6>
                <small class="text-muted">${citasCliente.length} cita(s)</small>
            </div>
            <p class="mb-1 text-muted small">${sanitizeHTML(cliente.telefono)}</p>
            <small class="text-muted">Última visita: ${ultimaCita ? formatearFechaParaVisualizacion(ultimaCita.fecha) : 'N/A'}</small>
        `;
        item.onclick = (e) => {
            e.preventDefault();
            mostrarHistorialCliente(cliente.id);
            document.querySelectorAll('#listaClientes .list-group-item-action').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        };
        DOM.listaClientes.appendChild(item);
    });
}

/**
 * Muestra el historial de un cliente seleccionado
 * @param {number} clienteId - El ID del cliente
 */
export function mostrarHistorialCliente(clienteId) {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (DOM.placeholderCliente) DOM.placeholderCliente.style.display = 'none';
    if (DOM.historialClienteContainer) DOM.historialClienteContainer.style.display = 'block';

    // --- Poblar Cabecera y Resumen ---
    if (DOM.nombreClienteHistorial) DOM.nombreClienteHistorial.textContent = sanitizeHTML(cliente.nombre);
    if (DOM.telefonoClienteHistorial) DOM.telefonoClienteHistorial.textContent = sanitizeHTML(cliente.telefono);
    if (DOM.emailClienteHistorial) DOM.emailClienteHistorial.textContent = sanitizeHTML(cliente.email) || 'No registrado';

    const citasCliente = citas.filter(c => c.telefono === cliente.telefono).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const totalFacturado = citasCliente.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
    const ultimaVisita = citasCliente.length > 0 ? formatearFechaParaVisualizacion(citasCliente[0].fecha) : 'N/A';

    if (DOM.clienteTotalCitas) DOM.clienteTotalCitas.textContent = citasCliente.length;
    if (DOM.clienteTotalFacturado) DOM.clienteTotalFacturado.textContent = formatearMonto(totalFacturado);
    if (DOM.clienteUltimaVisita) DOM.clienteUltimaVisita.textContent = ultimaVisita;

    // --- Renderizar Pestañas ---
    renderHistorialCitasCliente(citasCliente);
    renderVehiculosCliente(cliente);
    
    // --- Poblar Notas ---
    if (DOM.notasClienteText) DOM.notasClienteText.value = cliente.notes || '';

    // --- Asignar Event Listeners ---
    if (DOM.btnEditarCliente) DOM.btnEditarCliente.onclick = () => abrirModalCliente(cliente.id);
    if (DOM.btnGuardarNotasCliente) DOM.btnGuardarNotasCliente.onclick = () => guardarNotasCliente(cliente.id);
    if (DOM.btnNuevoVehiculo) DOM.btnNuevoVehiculo.onclick = () => abrirModalVehiculo(cliente.id);
}

export function renderVehiculosCliente(cliente) {
    if (!DOM.listaVehiculosCliente) return;
    DOM.listaVehiculosCliente.innerHTML = '';
    if (!cliente.vehicles || cliente.vehicles.length === 0) {
        DOM.listaVehiculosCliente.innerHTML = '<p class="text-muted text-center mt-3">No hay vehículos registrados para este cliente.</p>';
        return;
    }

    cliente.vehicles.forEach(vehiculo => {
        const card = document.createElement('div');
        card.className = 'card mb-2';
        card.innerHTML = `
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title mb-1">${sanitizeHTML(vehiculo.marca)} ${sanitizeHTML(vehiculo.modelo)} (${vehiculo.anio})</h6>
                        <p class="card-text small text-muted mb-1">
                            ${vehiculo.trim ? `Versión: ${sanitizeHTML(vehiculo.trim)} | ` : ''}
                            ${vehiculo.placa ? `Placa: ${sanitizeHTML(vehiculo.placa)} | ` : ''}
                            ${vehiculo.vin ? `VIN: ${sanitizeHTML(vehiculo.vin)}` : ''}
                        </p>
                    </div>
                    <div>
                        <button class="btn btn-xs btn-outline-secondary" onclick="window.abrirModalVehiculo(${cliente.id}, ${vehiculo.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-xs btn-outline-danger" onclick="window.eliminarVehiculo(${cliente.id}, ${vehiculo.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
        DOM.listaVehiculosCliente.appendChild(card);
    });
}

export function guardarNotasCliente(clienteId) {
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex > -1) {
        clientes[clienteIndex].notes = DOM.notasClienteText.value;
        guardarClientesEnStorage();
        mostrarMensaje('Notas del cliente guardadas.', 'success');
    }
}

export function abrirModalVehiculo(clienteId, vehiculoId = null) {
    clienteIdActualParaVehiculo = clienteId;
    if (DOM.vehiculoForm) DOM.vehiculoForm.reset();
    if (DOM.vehiculoClienteId) DOM.vehiculoClienteId.value = clienteId;

    if (vehiculoId) {
        // Editar vehículo existente
        const cliente = clientes.find(c => c.id === clienteId);
        const vehiculo = cliente ? cliente.vehicles.find(v => v.id === vehiculoId) : null;
        if (vehiculo) {
            if (DOM.vehiculoModalTitulo) DOM.vehiculoModalTitulo.textContent = 'Editar Vehículo';
            if (DOM.vehiculoId) DOM.vehiculoId.value = vehiculo.id;
            if (DOM.vehiculoMarca) DOM.vehiculoMarca.value = vehiculo.marca;
            if (DOM.vehiculoModelo) DOM.vehiculoModelo.value = vehiculo.modelo;
            if (DOM.vehiculoAnio) DOM.vehiculoAnio.value = vehiculo.anio;
            if (DOM.vehiculoTrim) DOM.vehiculoTrim.value = vehiculo.trim || '';
            if (DOM.vehiculoRegion) DOM.vehiculoRegion.value = vehiculo.region || '';
            if (DOM.vehiculoCombustible) DOM.vehiculoCombustible.value = vehiculo.combustible || '';
            if (DOM.vehiculoPlaca) DOM.vehiculoPlaca.value = vehiculo.placa || '';
            if (DOM.vehiculoVin) DOM.vehiculoVin.value = vehiculo.vin || '';
        }
    } else {
        // Añadir nuevo vehículo
        if (DOM.vehiculoModalTitulo) DOM.vehiculoModalTitulo.textContent = 'Añadir Vehículo';
        if (DOM.vehiculoId) DOM.vehiculoId.value = '';
    }
    if (DOM.vehiculoModal) DOM.vehiculoModal.show();
}

export function renderHistorialCitasCliente(citasCliente) {
    if (!DOM.tablaHistorialCliente) return;
    let historialHtml = '<table class="table table-sm table-hover"><thead><tr><th>Fecha</th><th>Servicio</th><th>Vehículo</th><th>Estado</th><th>Monto</th><th>Acciones</th></tr></thead><tbody>';
    if (citasCliente.length === 0) {
        historialHtml += '<tr><td colspan="5" class="text-center">Este cliente no tiene citas registradas.</td></tr>';
    } else {
        citasCliente.forEach(cita => {
            historialHtml += `<tr>
                <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                <td>${sanitizeHTML(cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio)}</td>
                <td>${sanitizeHTML(cita.marca)} ${sanitizeHTML(cita.modelo)} (${cita.anio})</td>
                <td><span class="${getBadgeClass(cita.estado)}">${capitalizar(cita.estado.replace('_', ' '))}</span></td>
                <td>${cita.facturado ? formatearMonto(cita.monto) : 'N/A'}</td>
                <td><button class="btn btn-xs btn-outline-primary" onclick="window.abrirEditarModal(${cita.id})"><i class="fas fa-eye"></i></button></td>
            </tr>`;
        });
    }
    historialHtml += '</tbody></table>';
    DOM.tablaHistorialCliente.innerHTML = historialHtml;
}

export function guardarVehiculo() {
    const clienteId = parseInt(DOM.vehiculoClienteId.value);
    const vehiculoId = DOM.vehiculoId.value ? parseInt(DOM.vehiculoId.value) : null;
    
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex === -1) return;

    const datosVehiculo = {
        marca: DOM.vehiculoMarca.value,
        modelo: DOM.vehiculoModelo.value,
        anio: DOM.vehiculoAnio.value,
        trim: DOM.vehiculoTrim.value,
        region: DOM.vehiculoRegion.value,
        combustible: DOM.vehiculoCombustible.value,
        placa: DOM.vehiculoPlaca.value,
        vin: DOM.vehiculoVin.value,
    };

    if (!datosVehiculo.marca || !datosVehiculo.modelo || !datosVehiculo.anio) {
        mostrarMensaje('Marca, Modelo y Año son obligatorios.', 'warning');
        return;
    }

    if (vehiculoId) {
        // Actualizar
        const vehiculoIndex = clientes[clienteIndex].vehicles.findIndex(v => v.id === vehiculoId);
        if (vehiculoIndex > -1) {
            clientes[clienteIndex].vehicles[vehiculoIndex] = { ...clientes[clienteIndex].vehicles[vehiculoIndex], ...datosVehiculo };
        }
    } else {
        // Crear
        const nuevoId = clientes[clienteIndex].vehicles.length > 0 ? Math.max(...clientes[clienteIndex].vehicles.map(v => v.id)) + 1 : 1;
        clientes[clienteIndex].vehicles.push({ id: nuevoId, ...datosVehiculo });
    }

    guardarClientesEnStorage();
    mostrarHistorialCliente(clienteId); // Refrescar la vista del cliente
    if (DOM.vehiculoModal) DOM.vehiculoModal.hide();
    mostrarMensaje('Vehículo guardado con éxito.', 'success');
}

export function eliminarVehiculo(clienteId, vehiculoId) {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
        const clienteIndex = clientes.findIndex(c => c.id === clienteId);
        if (clienteIndex > -1) {
            clientes[clienteIndex].vehicles = clientes[clienteIndex].vehicles.filter(v => v.id !== vehiculoId);
            guardarClientesEnStorage();
            mostrarHistorialCliente(clienteId); // Refrescar
            mostrarMensaje('Vehículo eliminado.', 'danger');
        }
    }
}

/**
 * Guarda un nuevo cliente desde el modal
 */
export function guardarCliente() {
    const clienteId = DOM.clienteId.value ? parseInt(DOM.clienteId.value) : null;
    const nombre = DOM.clienteNombre.value.trim();
    const telefono = DOM.clienteTelefono.value.trim();
    const email = DOM.clienteEmail.value.trim();
    
    if (!nombre || !telefono) {
        mostrarMensaje('Nombre y teléfono son obligatorios.', 'warning');
        return;
    }

    if (clienteId) {
        // Editar
        const clienteIndex = clientes.findIndex(c => c.id === clienteId);
        if (clienteIndex > -1) {
            clientes[clienteIndex].nombre = nombre;
            clientes[clienteIndex].telefono = telefono;
            clientes[clienteIndex].email = email;
            guardarClientesEnStorage();
            if (DOM.clienteModal) DOM.clienteModal.hide();
            renderClientes();
            mostrarHistorialCliente(clienteId); // Refrescar vista
            mostrarMensaje('Cliente actualizado con éxito.', 'success');
        }
    } else {
        // Crear
        const clienteExistente = clientes.find(c => c.telefono === telefono);
        if (clienteExistente) {
            mostrarMensaje('Ya existe un cliente con este número de teléfono.', 'danger');
            return;
        }

        const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
        clientes.push({ id: nuevoId, nombre, telefono, email, notes: '', vehicles: [] });
        
        guardarClientesEnStorage();
        renderClientes();
        if (DOM.clienteModal) DOM.clienteModal.hide();
        mostrarMensaje('Cliente agregado con éxito.', 'success');
    }
}

export function abrirModalCliente(clienteId = null) {
    if (DOM.clienteForm) DOM.clienteForm.reset();
    if (clienteId) {
        // Editar
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
            if (DOM.clienteModalEl) DOM.clienteModalEl.querySelector('.modal-title').textContent = 'Editar Cliente';
            if (DOM.clienteId) DOM.clienteId.value = cliente.id;
            if (DOM.clienteNombre) DOM.clienteNombre.value = cliente.nombre;
            if (DOM.clienteTelefono) DOM.clienteTelefono.value = cliente.telefono;
            if (DOM.clienteEmail) DOM.clienteEmail.value = cliente.email || '';
        }
    } else {
        // Crear
        if (DOM.clienteModalEl) DOM.clienteModalEl.querySelector('.modal-title').textContent = 'Gestión de Cliente';
        if (DOM.clienteId) DOM.clienteId.value = '';
    }
    if (DOM.clienteModal) DOM.clienteModal.show();
}

// Event Listeners para la sección de clientes
if (DOM.btnNuevoCliente) DOM.btnNuevoCliente.addEventListener('click', () => abrirModalCliente());
if (DOM.btnGuardarCliente) DOM.btnGuardarCliente.addEventListener('click', guardarCliente);
if (DOM.filtroClientes) DOM.filtroClientes.addEventListener('input', renderClientes);
if (DOM.btnGuardarVehiculo) DOM.btnGuardarVehiculo.addEventListener('click', guardarVehiculo);

if (DOM.pillsClientesTab) {
    DOM.pillsClientesTab.addEventListener('shown.bs.tab', () => {
        renderClientes();
        // Ocultar el panel de detalles si no hay cliente seleccionado
        const clienteActivo = document.querySelector('#listaClientes .list-group-item-action.active');
        if (!clienteActivo) {
            if (DOM.historialClienteContainer) DOM.historialClienteContainer.style.display = 'none';
            if (DOM.placeholderCliente) DOM.placeholderCliente.style.display = 'block';
        }
    });
}

// Exponer funciones globalmente para onclick en HTML
window.abrirModalVehiculo = abrirModalVehiculo;
window.eliminarVehiculo = eliminarVehiculo;
window.abrirModalCliente = abrirModalCliente;