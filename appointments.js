// js/features/appointments.js

import { citas, guardarCitasEnStorage, agentes, clientes, guardarClientesEnStorage } from '../dataStore.js';
import { configuracion, serviciosPredefinidos } from '../constants.js';
import { mostrarMensaje, getBadgeClass, getFinanzasIcons, formatearMonto, sanitizeHTML, formatearFechaParaVisualizacion, parsearMonto, generarLinkWhatsApp } from '../utils.js';
import { renderSeguimiento } from './followUp.js';
import { renderPostVenta } from './postSale.js';
import { actualizarResumen } from './dashboard.js';
import { calcularEstadisticas, cargarFiltroAnios, cargarServiciosEnSelects } from './reports.js';
import { sincronizarClientesDesdeCitas } from '../dataStore.js';
import * as DOM from '../domElements.js';

let citaIdAEliminar = null;

/**
 * Renderiza la tabla de citas en el DOM.
 */
export function renderCitas() {
    if (!DOM.listaCitas) return;
    
    DOM.listaCitas.innerHTML = '';
    
    // Filtrar las citas
    const citasFiltradas = obtenerCitasFiltradas();
    
    citasFiltradas.forEach(cita => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-estado-cita', cita.estado);
        tr.setAttribute('data-fecha-cita', cita.fecha);
        
        // Obtener nombre del agente
        const agente = agentes.find(a => a.id === cita.agente) || { nombre: 'N/A' }; // Usar ===
        
        tr.innerHTML = `
            <td>${formatearFechaParaVisualizacion(cita.fecha)}<br><span class="text-muted">${cita.hora}</span></td>
            <td>
                ${sanitizeHTML(cita.nombreCliente)} ${cita.enCamino ? '<i class="fas fa-car text-success ms-2" title="Cliente en camino"></i>' : ''}<br>
                <span class="text-muted">
                    ${sanitizeHTML(cita.telefono)}
                    <a href="${generarLinkWhatsApp(cita)}" target="_blank" class="ms-2 text-success" title="Enviar recordatorio por WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </span>
            </td>
            <td>${sanitizeHTML(cita.marca)}</td>
            <td>${sanitizeHTML(cita.modelo)}</td>
            <td>${cita.anio}</td>
            <td>${sanitizeHTML(cita.region) || 'N/A'}</td>
            <td>${sanitizeHTML(agente.nombre)}</td>
            <td>
                <span class="${getBadgeClass(cita.estado)}">${cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1).replace('_', ' ')}</span>
            </td>
            <td>
                ${getFinanzasIcons(cita)}
                ${cita.facturado ? `<div class="text-small">${formatearMonto(cita.monto)}</div>` : ''}
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn ${cita.enCamino ? 'btn-success' : 'btn-outline-secondary'} btn-action" onclick="window.marcarEnCamino(${cita.id})" title="${cita.enCamino ? "Desmarcar 'En Camino'" : "Marcar 'En Camino'"}">
                        <i class="fas fa-car"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning btn-action" onclick="window.abrirEditarModal(${cita.id})" title="Editar cita">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info btn-action" onclick="window.abrirCuponModal(${cita.id})" title="Ver cupón">
                        <i class="fas fa-ticket-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-action" onclick="window.abrirConfirmacionEliminar(${cita.id})" title="Eliminar cita">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        DOM.listaCitas.appendChild(tr);
    });

    // Recalcular las estadísticas basadas en el conjunto filtrado
    calcularEstadisticas(citasFiltradas);
    
    // Actualizar resumen
    actualizarResumen();
    
    // Renderizar la lista de seguimiento para mantenerla actualizada
    renderSeguimiento();

    // Renderizar la lista de post-venta para mantenerla actualizada
    renderPostVenta();
}

/**
 * Obtiene las citas filtradas según los controles de la UI.
 * @returns {Array<object>} Un array con las citas que cumplen los criterios de filtro.
 */
export function obtenerCitasFiltradas() {
    const busquedaTermino = (DOM.filtroBusquedaInput.value || '').toLowerCase().trim();
    const estadosActivos = [...DOM.grupoFiltros.querySelectorAll('button.active')].map(btn => btn.dataset.estado);
    const todasActivo = estadosActivos.includes('todas');
    const fechaFiltro = DOM.filtroFechaInput.value;
    const mesFiltro = DOM.filtroMesSelect.value;
    const anioFiltro = DOM.filtroAnioSelect.value;
    const facturadoFiltro = DOM.filtroFacturadoInput.checked;

    return citas.filter(cita => {
        const coincideBusqueda = !busquedaTermino ||
            (cita.nombreCliente && cita.nombreCliente.toLowerCase().includes(busquedaTermino)) ||
            (cita.telefono && cita.telefono.toLowerCase().includes(busquedaTermino)) ||
            (cita.marca && cita.marca.toLowerCase().includes(busquedaTermino)) ||
            (cita.modelo && cita.modelo.toLowerCase().includes(busquedaTermino)) ||
            (cita.anio && cita.anio.toString().includes(busquedaTermino));

        const coincideEstado = todasActivo || estadosActivos.includes(cita.estado);
        const coincideFecha = !fechaFiltro || cita.fecha === fechaFiltro;

        let coincideMes = true;
        if (mesFiltro) {
            const fechaCita = new Date(cita.fecha + 'T12:00:00');
            const mesCita = (fechaCita.getMonth() + 1).toString().padStart(2, '0');
            coincideMes = mesCita === mesFiltro;
        }

        let coincideAnio = true;
        if (anioFiltro) {
            const fechaCita = new Date(cita.fecha + 'T12:00:00');
            const anioCita = fechaCita.getFullYear().toString();
            coincideAnio = anioCita === anioFiltro;
        }

        const coincideFacturado = !facturadoFiltro || cita.facturado;
        return coincideBusqueda && coincideEstado && coincideFecha && coincideMes && coincideAnio && coincideFacturado;
    });
}

/**
 * Agrega una nueva cita desde el formulario.
 * @param {Event} event - El evento de envío del formulario.
 */
export function agregarCita(event) {
    event.preventDefault();

    const nuevaCita = {
        nombreCliente: DOM.nombreClienteInput.value,
        telefono: DOM.telefonoInput.value,
        marca: DOM.marca.value,
        modelo: DOM.modelo.value,
        anio: DOM.anio.value,
        region: DOM.regionSelect.value,
        combustible: DOM.combustibleSelect.value,
        trim: DOM.trimInput.value,
        fecha: DOM.fecha.value,
        hora: DOM.hora.value,
        servicio: DOM.servicioSelect.value,
        notas: DOM.notas.value,
        agente: DOM.agente.value,
        estado: "pendiente",
        facturado: false,
        monto: 0,
        tieneCotizacion: "no_aplica",
        motivoCotizacion: "",
        otroServicio: DOM.servicioSelect.value === 'Otro' ? DOM.otroServicioInput.value : "",
        enCamino: false,
        esPromocion: DOM.esPromocionCheck.checked,
        precioRegular: parsearMonto(DOM.precioRegular.value),
        precioPromocional: parsearMonto(DOM.precioPromocional.value),
        seguimiento: { status: 'pending', lastContact: null, notes: '' },
        postVenta: { status: 'pending', lastContact: null, satisfaction: null, notes: '' }
    };

    const nuevoId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
    nuevaCita.id = nuevoId;

    citas.push(nuevaCita);
    guardarCitasEnStorage();
    renderCitas();
    cargarFiltroAnios();
    cargarServiciosEnSelects();
    DOM.citaForm.reset();
    mostrarMensaje("Cita agregada con éxito.", "success");
    
    // Cambiar a la pestaña de gestión de citas
    if (DOM.pillsCitasTab) DOM.pillsCitasTab.click();
}

/**
 * Abre el modal de confirmación para eliminar una cita.
 * @param {number} id - El ID de la cita a eliminar.
 */
export function abrirConfirmacionEliminar(id) {
    citaIdAEliminar = id;
    if (DOM.confirmarEliminarModal) DOM.confirmarEliminarModal.show();
}

/**
 * Elimina una cita de la lista.
 */
export function eliminarCita() {
    if (citaIdAEliminar !== null) {
        const initialLength = citas.length;
        citas = citas.filter(cita => cita.id !== citaIdAEliminar);
        if (citas.length < initialLength) { // Only save and render if something was actually removed
            guardarCitasEnStorage();
            renderCitas();
            cargarFiltroAnios();
            cargarServiciosEnSelects();
            mostrarMensaje("Cita eliminada correctamente.", "danger");
        } else {
            mostrarMensaje("No se encontró la cita para eliminar.", "warning");
        }
        if (DOM.confirmarEliminarModal) DOM.confirmarEliminarModal.hide();
        citaIdAEliminar = null;
    }
}

/**
 * Marca o desmarca una cita como 'en camino'.
 * @param {number} id - El ID de la cita.
 */
export function marcarEnCamino(id) {
    const index = citas.findIndex(c => c.id === id);
    if (index !== -1) {
        citas[index].enCamino = !citas[index].enCamino;
        guardarCitasEnStorage();
        renderCitas();
        const mensaje = citas[index].enCamino 
            ? `Cita de ${citas[index].nombreCliente} marcada como 'En Camino'.`
            : `Se ha desmarcado 'En Camino' para la cita de ${citas[index].nombreCliente}.`;
        mostrarMensaje(mensaje, citas[index].enCamino ? 'info' : 'warning');
    }
}

/**
 * Abre el modal de edición con los datos de una cita.
 * @param {number} id - El ID de la cita a editar.
 */
export function abrirEditarModal(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        DOM.editarIdInput.value = cita.id;
        DOM.editarNombreClienteInput.value = cita.nombreCliente;
        DOM.editarTelefonoInput.value = cita.telefono;
        DOM.editarMarcaInput.value = cita.marca;
        DOM.editarModeloInput.value = cita.modelo;
        DOM.editarAnioInput.value = cita.anio;
        DOM.editarRegionSelect.value = cita.region || '';
        DOM.editarCombustibleSelect.value = cita.combustible || '';
        DOM.editarTrimInput.value = cita.trim || '';
        DOM.editarFechaInput.value = cita.fecha;
        DOM.editarHoraInput.value = cita.hora;
        DOM.editarServicioSelect.value = cita.servicio;
        if (cita.servicio === "Otro") {
            DOM.editarOtroServicioContainer.style.display = '';
            DOM.editarOtroServicioInput.value = cita.otroServicio || '';
        } else {
            DOM.editarOtroServicioContainer.style.display = 'none';
            DOM.editarOtroServicioInput.value = '';
        }
        DOM.editarNotasInput.value = cita.notas;
        DOM.editarAgenteInput.value = cita.agente || '';
        DOM.editarEstadoSelect.value = cita.estado;
        DOM.editarFacturadoInput.checked = cita.facturado;
        DOM.editarMontoInput.value = cita.facturado ? cita.monto : '';
        DOM.editarTieneCotizacionSelect.value = cita.tieneCotizacion;
        if (cita.tieneCotizacion === "no") {
            DOM.editarMotivoCotizacionContainer.style.display = '';
            DOM.editarMotivoCotizacionInput.value = cita.motivoCotizacion || '';
        } else {
            DOM.editarMotivoCotizacionContainer.style.display = 'none';
            DOM.editarMotivoCotizacionInput.value = '';
        }
        
        DOM.editarEsPromocionCheck.checked = cita.esPromocion || false;
        DOM.editarPromoContainer.style.display = cita.esPromocion ? '' : 'none';
        if (cita.esPromocion) {
            DOM.editarPrecioRegularInput.value = cita.precioRegular || '';
            DOM.editarPrecioPromocionalInput.value = cita.precioPromocional || '';
        }

        if (DOM.editarCitaModal) DOM.editarCitaModal.show();
    }
}

/**
 * Guarda los cambios de una cita editada.
 */
export function guardarEdicion() {
    const id = parseInt(DOM.editarIdInput.value);
    const citaOriginal = citas.find(c => c.id === id);
    const index = citas.findIndex(c => c.id === id);
    if (index !== -1) {
        const servicio = DOM.editarServicioSelect.value;
        const tieneCotizacion = DOM.editarTieneCotizacionSelect.value;
        const motivoCotizacion = tieneCotizacion === "no" ? DOM.editarMotivoCotizacionInput.value : "";

        const nuevoEstado = DOM.editarEstadoSelect.value;

        citas[index] = {
            id: id,
            nombreCliente: DOM.editarNombreClienteInput.value,
            telefono: DOM.editarTelefonoInput.value,
            marca: DOM.editarMarcaInput.value,
            modelo: DOM.editarModeloInput.value,
            anio: parseInt(DOM.editarAnioInput.value),
            region: DOM.editarRegionSelect.value,
            combustible: DOM.editarCombustibleSelect.value,
            trim: DOM.editarTrimInput.value,
            fecha: DOM.editarFechaInput.value,
            hora: DOM.editarHoraInput.value,
            servicio: servicio,
            otroServicio: servicio === 'Otro' ? DOM.editarOtroServicioInput.value : "",
            notas: DOM.editarNotasInput.value,
            agente: DOM.editarAgenteInput.value,
            estado: nuevoEstado,
            facturado: DOM.editarFacturadoInput.checked,
            monto: DOM.editarFacturadoInput.checked ? parsearMonto(DOM.editarMontoInput.value) : 0,
            tieneCotizacion: tieneCotizacion,
            motivoCotizacion: motivoCotizacion,
            enCamino: citas[index].enCamino, // Preservar estado 'en camino'
            esPromocion: DOM.editarEsPromocionCheck.checked,
            precioRegular: parsearMonto(DOM.editarPrecioRegularInput.value),
            precioPromocional: parsearMonto(DOM.editarPrecioPromocionalInput.value),
            // Preservar datos de seguimiento existentes
            seguimiento: citas[index].seguimiento || { status: 'pending', lastContact: null, notes: '' },
            postVenta: citas[index].postVenta || { status: 'pending', lastContact: null, satisfaction: null, notes: '' }
        };

        // Resetear la bandera de seguimiento si el estado cambia a uno relevante
        if ((nuevoEstado === 'cancelada' || nuevoEstado === 'no_asistio') && citaOriginal.estado !== nuevoEstado) {
            citas[index].seguimiento.status = 'pending';
        } else if (nuevoEstado === 'reagendada') {
            // Si se reagenda desde el modal, cerrar el seguimiento.
            citas[index].seguimiento.status = 'rebooked';
        }

        guardarCitasEnStorage();
        renderCitas();
        cargarFiltroAnios();
        cargarServiciosEnSelects();
        if (DOM.editarCitaModal) DOM.editarCitaModal.hide();
        mostrarMensaje("Cita editada con éxito.", "warning");

        // Sincronizar clientes por si se completó una cita
        sincronizarClientesDesdeCitas();
    }
}

/**
 * Abre el modal para ver e imprimir el cupón.
 * @param {number} id - El ID de la cita para el cupón.
 */
export function abrirCuponModal(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
        const agente = agentes.find(a => a.id === cita.agente) || { nombre: 'N/A' }; // Usar ===

        // Lógica para la sección de oferta/precio
        let offerHtml = '';
        if (servicio === 'Chequeo libre de costo') {
            const precioRegularCortesia = 2990; // Precio de ejemplo para el chequeo
            offerHtml = `
                <div class="cupon-island cupon-offer">
                    <h6 class="text-success"><i class="fas fa-star me-2"></i>Oferta Especial</h6>
                    <div>Precio Regular: <span class="precio-original">${formatearMonto(precioRegularCortesia)}</span></div>
                    <div class="precio-cortesia">SIN COSTO</div>
                    <small class="text-muted">¡Servicio de cortesía por ser nuestro cliente!</small>
                </div>
            `;
        } else if (cita.esPromocion && cita.precioPromocional > 0) {
            offerHtml = `
                <div class="cupon-island cupon-offer">
                    <h6 class="text-success"><i class="fas fa-tag me-2"></i>Precio Promocional</h6>
                    <div>Precio Regular: <span class="precio-original">${formatearMonto(cita.precioRegular)}</span></div>
                    <div class="precio-promocional">${formatearMonto(cita.precioPromocional)}</div>
                    <small class="text-muted">¡Válido solo con este cupón!</small>
                </div>
            `;
        } else if (cita.facturado && cita.monto > 0) {
             offerHtml = `
                <div class="cupon-island">
                    <h6><i class="fas fa-file-invoice-dollar me-2"></i>Monto Facturado</h6>
                    <div class="text-center precio-promocional">${formatearMonto(cita.monto)}</div>
                </div>
            `;
        }

        // Lógica para las notas
        const notasHtml = cita.notas ? `
            <div class="cupon-island">
                <h6><i class="fas fa-sticky-note me-2"></i>Notas Adicionales</h6>
                <p>${sanitizeHTML(cita.notas)}</p>
            </div>
        ` : '';

        if (DOM.cuponContent) DOM.cuponContent.innerHTML = `
            <div class="cupon-container">
                <div class="cupon-banner">
                    <img src="${configuracion.logo}" alt="Logo">
                    <h3>${sanitizeHTML(configuracion.nombreEmpresa)}</h3>
                </div>
                <div class="cupon-body">
                    <div class="cupon-island">
                        <h6><i class="fas fa-user me-2"></i>Datos del Cliente</h6>
                        <p><strong>Nombre:</strong> ${sanitizeHTML(cita.nombreCliente)}</p>
                        <p><strong>Vehículo:</strong> ${sanitizeHTML(cita.marca)} ${sanitizeHTML(cita.modelo)} (${cita.anio})</p>
                    </div>
                    <div class="cupon-island">
                        <h6><i class="fas fa-calendar-alt me-2"></i>Detalles de la Cita</h6>
                        <p><strong>Fecha y Hora:</strong> ${formatearFechaParaVisualizacion(cita.fecha)} - ${cita.hora}</p>
                        <p><strong>Servicio:</strong> ${servicio}</p>
                        <p><strong>Agente:</strong> ${agente.nombre}</p>
                    </div>
                    ${offerHtml}
                    ${notasHtml}
                </div>
                <div class="cupon-footer">
                    <div class="cupon-footer-text">
                        <div>Válido solo para la fecha y hora indicadas.</div>
                        <div>${sanitizeHTML(configuracion.direccion)}</div>
                    </div>
                    <div class="cupon-qr">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(configuracion.qrUrl || `CitaID-${cita.id}`)}" alt="QR Code">
                    </div>
                </div>
            </div>
        `;
        if (DOM.cuponModal) DOM.cuponModal.show();
    }
}

/**
 * Imprime el contenido del cupón.
 */
export function imprimirCupon() {
    if (!DOM.cuponContent) return;
    const contenido = DOM.cuponContent.innerHTML;
    const ventanaImpresion = window.open('', '', 'height=600,width=800');
    ventanaImpresion.document.write('<html><head><title>Cupón de Servicio</title>');
    ventanaImpresion.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    ventanaImpresion.document.write('<link rel="stylesheet" href="css/style.css">'); // Importar CSS para estilos del cupón
    ventanaImpresion.document.write('</head><body>');
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.onload = function() {
        ventanaImpresion.print();
    };
}

/**
 * Limpia el formulario de nueva cita, incluyendo los campos de promoción.
 */
export function limpiarFormularioNuevaCita() {
    if (DOM.citaForm) DOM.citaForm.reset();
    if (DOM.promoContainer) DOM.promoContainer.style.display = 'none';
    if (DOM.vehiculoExistenteContainer) DOM.vehiculoExistenteContainer.style.display = 'none';
    if (DOM.otroServicioContainer) DOM.otroServicioContainer.style.display = 'none';
}

/**
 * Autocompleta los datos del cliente y sus vehículos si el teléfono ya existe.
 */
export function autocompletarCliente() {
    const telefono = DOM.telefonoInput.value.trim();
    if (!telefono) {
        // Limpiar si el campo de teléfono está vacío
        if (DOM.clienteExistenteIcon) DOM.clienteExistenteIcon.style.display = 'none';
        if (DOM.vehiculoExistenteContainer) DOM.vehiculoExistenteContainer.style.display = 'none';
        if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.innerHTML = '';
        return;
    }

    const cliente = clientes.find(c => c.telefono === telefono);

    if (cliente) {
        // Cliente encontrado
        if (DOM.nombreClienteInput) DOM.nombreClienteInput.value = cliente.nombre;
        if (DOM.clienteExistenteIcon) DOM.clienteExistenteIcon.style.display = 'inline-block';

        if (cliente.vehicles && cliente.vehicles.length > 0) {
            if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.innerHTML = '<option value="">Seleccione un vehículo...</option>';
            cliente.vehicles.forEach(v => {
                const option = document.createElement('option');
                option.value = v.id;
                option.textContent = `${v.marca} ${v.modelo} (${v.anio}) ${v.placa ? '- ' + v.placa : ''}`;
                option.dataset.vehiculoData = JSON.stringify(v); // Guardar todos los datos del vehículo
                if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.appendChild(option);
            });
            if (DOM.vehiculoExistenteContainer) DOM.vehiculoExistenteContainer.style.display = 'block';
        } else {
            if (DOM.vehiculoExistenteContainer) DOM.vehiculoExistenteContainer.style.display = 'none';
            if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.innerHTML = '';
        }
    } else {
        // Cliente no encontrado
        if (DOM.clienteExistenteIcon) DOM.clienteExistenteIcon.style.display = 'none';
        if (DOM.vehiculoExistenteContainer) DOM.vehiculoExistenteContainer.style.display = 'none';
        if (DOM.vehiculoExistenteSelect) DOM.vehiculoExistenteSelect.innerHTML = '';
        // Opcional: limpiar el nombre si se busca un nuevo teléfono
        // DOM.nombreClienteInput.value = ''; 
    }
}

/**
 * Rellena los campos del vehículo al seleccionarlo del dropdown.
 */
export function seleccionarVehiculoExistente() {
    if (!DOM.vehiculoExistenteSelect) return;
    const selectedOption = DOM.vehiculoExistenteSelect.options[DOM.vehiculoExistenteSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
        // Si se selecciona la opción "Seleccione...", se limpian los campos para permitir entrada manual
        if (DOM.marca) DOM.marca.value = '';
        if (DOM.modelo) DOM.modelo.value = '';
        if (DOM.anio) DOM.anio.value = '';
        if (DOM.regionSelect) DOM.regionSelect.value = '';
        if (DOM.combustibleSelect) DOM.combustibleSelect.value = '';
        if (DOM.trimInput) DOM.trimInput.value = '';
        return;
    }

    const vehiculo = JSON.parse(selectedOption.dataset.vehiculoData);
    if (DOM.marca) DOM.marca.value = vehiculo.marca;
    if (DOM.modelo) DOM.modelo.value = vehiculo.modelo;
    if (DOM.anio) DOM.anio.value = vehiculo.anio;
    if (DOM.regionSelect) DOM.regionSelect.value = vehiculo.region || '';
    if (DOM.combustibleSelect) DOM.combustibleSelect.value = vehiculo.combustible || '';
    if (DOM.trimInput) DOM.trimInput.value = vehiculo.trim || '';
}

// Exponer funciones globalmente para onclick en HTML
window.marcarEnCamino = marcarEnCamino;
window.abrirEditarModal = abrirEditarModal;
window.abrirCuponModal = abrirCuponModal;
window.imprimirCupon = imprimirCupon;
window.abrirConfirmacionEliminar = abrirConfirmacionEliminar;

// Event Listeners para el modal de edición
if (DOM.editarServicioSelect) DOM.editarServicioSelect.addEventListener('change', () => {
    if (DOM.editarServicioSelect.value === 'Otro') {
        if (DOM.editarOtroServicioContainer) DOM.editarOtroServicioContainer.style.display = '';
    } else {
        if (DOM.editarOtroServicioContainer) DOM.editarOtroServicioContainer.style.display = 'none';
    }
});

if (DOM.editarTieneCotizacionSelect) DOM.editarTieneCotizacionSelect.addEventListener('change', () => {
    if (DOM.editarTieneCotizacionSelect.value === 'no') {
        if (DOM.editarMotivoCotizacionContainer) DOM.editarMotivoCotizacionContainer.style.display = '';
    } else {
        if (DOM.editarMotivoCotizacionContainer) DOM.editarMotivoCotizacionContainer.style.display = 'none';
    }
});

if (DOM.btnGuardarEdicion) DOM.btnGuardarEdicion.addEventListener('click', guardarEdicion);
if (DOM.btnConfirmarEliminar) DOM.btnConfirmarEliminar.addEventListener('click', eliminarCita);