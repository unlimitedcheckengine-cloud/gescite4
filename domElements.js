// js/domElements.js

// --- Selectores del DOM ---
export const citaForm = document.getElementById('citaForm');
export const listaCitas = document.getElementById('listaCitas');
export const grupoFiltros = document.getElementById('grupo-filtros');
export const btnExportarExcel = document.getElementById('btnExportarExcel');
export const btnGuardarManual = document.getElementById('btnGuardarManual');
export const btnImportarExcel = document.getElementById('btnImportarExcel');
export const btnCopiarLista = document.getElementById('btnCopiarLista');
export const importarArchivoInput = document.getElementById('importarArchivo');
export const servicioSelect = document.getElementById('servicio');
export const otroServicioContainer = document.getElementById('otroServicioContainer');
export const otroServicioInput = document.getElementById('otroServicio');
export const filtroFechaInput = document.getElementById('filtroFecha');
export const regionSelect = document.getElementById('region');
export const combustibleSelect = document.getElementById('combustible');
export const trimInput = document.getElementById('trim');

export const filtroMesSelect = document.getElementById('filtroMes');
export const filtroAnioSelect = document.getElementById('filtroAnio');
export const filtroFacturadoInput = document.getElementById('filtroFacturado');
export const filtroBusquedaInput = document.getElementById('filtroBusqueda');
export const archivoExcelInput = document.getElementById('archivoExcel');
export const importarExcelModalEl = document.getElementById('importarExcelModal');
export const importarExcelModal = importarExcelModalEl ? new bootstrap.Modal(importarExcelModalEl) : null;
export const btnAccionImportar = document.getElementById('btnAccionImportar');
export const btnAjustarMapeo = document.getElementById('btnAjustarMapeo');
export const mapeoColumnasContainer = document.getElementById('mapeoColumnasContainer');
export const mapeoColumnasForm = document.getElementById('mapeoColumnasForm');
export const vistaPreviaContainer = document.querySelector('.import-preview');
export const agenteSelect = document.getElementById('agente');
export const configuracionModalEl = document.getElementById('configuracionModal');
export const configuracionModal = configuracionModalEl ? new bootstrap.Modal(configuracionModalEl) : null;
export const gestionAgentesModalEl = document.getElementById('gestionAgentesModal');
export const gestionAgentesModal = gestionAgentesModalEl ? new bootstrap.Modal(gestionAgentesModalEl) : null;
export const agenteForm = document.getElementById('agenteForm');
export const gestionServiciosModalEl = document.getElementById('gestionServiciosModal');
export const gestionServiciosModal = gestionServiciosModalEl ? new bootstrap.Modal(gestionServiciosModalEl) : null;
export const servicioForm = document.getElementById('servicioForm');
export const tablaServicios = document.getElementById('tablaServicios');
export const btnGuardarServicio = document.getElementById('btnGuardarServicio');

export const btnGuardarAgente = document.getElementById('btnGuardarAgente');
export const btnEliminarAgente = document.getElementById('btnEliminarAgente');
export const tablaAgentes = document.getElementById('tablaAgentes');

// Modal para editar
export const editarCitaModalEl = document.getElementById('editarCitaModal');
export const editarCitaModal = editarCitaModalEl ? new bootstrap.Modal(editarCitaModalEl) : null;
export const editarCitaForm = document.getElementById('editarCitaForm');
export const btnGuardarEdicion = document.getElementById('btnGuardarEdicion');
export const editarIdInput = document.getElementById('editarId');
export const editarNombreClienteInput = document.getElementById('editarNombreCliente');
export const editarTelefonoInput = document.getElementById('editarTelefono');
export const editarMarcaInput = document.getElementById('editarMarca');
export const editarModeloInput = document.getElementById('editarModelo');
export const editarAnioInput = document.getElementById('editarAnio');
export const editarFechaInput = document.getElementById('editarFecha');
export const editarHoraInput = document.getElementById('editarHora');
export const editarRegionSelect = document.getElementById('editarRegion');
export const editarCombustibleSelect = document.getElementById('editarCombustible');
export const editarTrimInput = document.getElementById('editarTrim');
export const editarServicioSelect = document.getElementById('editarServicio');
export const editarOtroServicioContainer = document.getElementById('editarOtroServicioContainer');
export const editarOtroServicioInput = document.getElementById('editarOtroServicio');
export const editarNotasInput = document.getElementById('editarNotas');
export const editarAgenteInput = document.getElementById('editarAgente');
export const editarEstadoSelect = document.getElementById('editarEstado');
export const editarFacturadoInput = document.getElementById('editarFacturado');
export const editarMontoInput = document.getElementById('editarMonto');
export const editarTieneCotizacionSelect = document.getElementById('editarTieneCotizacion');
export const editarMotivoCotizacionContainer = document.getElementById('editarMotivoCotizacionContainer');
export const editarMotivoCotizacionInput = document.getElementById('editarMotivoCotizacion');
export const editarEsPromocionCheck = document.getElementById('editarEsPromocion');
export const editarPromoContainer = document.getElementById('editarPromoContainer');
export const editarPrecioRegularInput = document.getElementById('editarPrecioRegular');
export const editarPrecioPromocionalInput = document.getElementById('editarPrecioPromocional');

// Modal para el cupón
export const cuponModalEl = document.getElementById('cuponModal');
export const cuponModal = cuponModalEl ? new bootstrap.Modal(cuponModalEl) : null;
export const cuponContent = document.getElementById('cuponContent');

// Modal de confirmación para eliminar
export const confirmarEliminarModalEl = document.getElementById('confirmarEliminarModal');
export const confirmarEliminarModal = confirmarEliminarModalEl ? new bootstrap.Modal(confirmarEliminarModalEl) : null;
export const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// Configuración
export const configNombreEmpresa = document.getElementById('configNombreEmpresa');
export const configSucursal = document.getElementById('configSucursal');
export const configDireccion = document.getElementById('configDireccion');
export const configTelefono = document.getElementById('configTelefono');
export const configLogo = document.getElementById('configLogo');
export const logoPreview = document.getElementById('logoPreview');
export const configMoneda = document.getElementById('configMoneda');
export const configFormatoMoneda = document.getElementById('configFormatoMoneda');
export const btnGuardarConfiguracion = document.getElementById('btnGuardarConfiguracion');
export const configQrUrlInput = document.getElementById('configQrUrl');
export const headerLogo = document.getElementById('headerLogo');
export const headerEmpresaNombre = document.getElementById('headerEmpresaNombre');
export const configPrimaryColorInput = document.getElementById('configPrimaryColor');
export const configSecondaryColorInput = document.getElementById('configSecondaryColor');
export const configMostrarMontosSinDecimales = document.getElementById('configMostrarMontosSinDecimales');
export const configWhatsappTemplate = document.getElementById('configWhatsappTemplate');
export const configWhatsappReagendarTemplate = document.getElementById('configWhatsappReagendarTemplate');
export const configWhatsappPostVentaTemplate = document.getElementById('configWhatsappPostVentaTemplate');

// Agente Form
export const agenteIdInput = document.getElementById('agenteId');
export const agenteNombreInput = document.getElementById('agenteNombre');
export const agenteEmailInput = document.getElementById('agenteEmail');
export const agenteTelefonoInput = document.getElementById('agenteTelefono');
export const agenteActivoInput = document.getElementById('agenteActivo');

// Formulario de nueva cita - Promoción
export const esPromocionCheck = document.getElementById('esPromocion');
export const promoContainer = document.getElementById('promoContainer');

// Formulario de nueva cita - Autocompletado
export const telefonoInput = document.getElementById('telefono');
export const nombreClienteInput = document.getElementById('nombreCliente');
export const clienteExistenteIcon = document.getElementById('clienteExistenteIcon');
export const vehiculoExistenteContainer = document.getElementById('vehiculoExistenteContainer');
export const vehiculoExistenteSelect = document.getElementById('vehiculoExistenteSelect');

// Dashboard
export const proximasCitasContainer = document.getElementById('proximasCitasContainer');
export const actividadRecienteContainer = document.getElementById('actividadRecienteContainer');

// Reportes
export const filtroReporteFechaInicioInput = document.getElementById('filtroReporteFechaInicio');
export const filtroReporteFechaFinInput = document.getElementById('filtroReporteFechaFin');
export const filtroReporteAgenteSelect = document.getElementById('filtroReporteAgente');
export const filtroReporteServicioSelect = document.getElementById('filtroReporteServicio');
export const grupoFiltrosReportes = document.getElementById('grupo-filtros-reportes');
export const filtroReporteRegionSelect = document.getElementById('filtroReporteRegion');
export const filtroReporteCombustibleSelect = document.getElementById('filtroReporteCombustible');
export const filtroReporteFacturadoInput = document.getElementById('filtroReporteFacturado');
export let estadoChart = null;
export let facturacionChart = null;
export let serviciosPopularesChart = null;
export let origenVehiculoChart = null;

// Clientes (Nuevos y modificados)
export const listaClientes = document.getElementById('listaClientes');
export const filtroClientes = document.getElementById('filtroClientes');
export const historialClienteContainer = document.getElementById('historialClienteContainer');
export const placeholderCliente = document.getElementById('placeholderCliente');
export const nombreClienteHistorial = document.getElementById('nombreClienteHistorial');
export const telefonoClienteHistorial = document.getElementById('telefonoClienteHistorial');
export const emailClienteHistorial = document.getElementById('emailClienteHistorial');
export const tablaHistorialCliente = document.getElementById('tablaHistorialCliente');
export const btnNuevoCliente = document.getElementById('btnNuevoCliente');
export const btnEditarCliente = document.getElementById('btnEditarCliente');
export const clienteModalEl = document.getElementById('clienteModal');
export const clienteModal = clienteModalEl ? new bootstrap.Modal(clienteModalEl) : null;
export const clienteForm = document.getElementById('clienteForm');
export const btnGuardarCliente = document.getElementById('btnGuardarCliente');
export const clienteTotalCitas = document.getElementById('clienteTotalCitas');
export const clienteTotalFacturado = document.getElementById('clienteTotalFacturado');
export const clienteUltimaVisita = document.getElementById('clienteUltimaVisita');
export const listaVehiculosCliente = document.getElementById('listaVehiculosCliente');
export const notasClienteText = document.getElementById('notasClienteText');
export const btnGuardarNotasCliente = document.getElementById('btnGuardarNotasCliente');
export const btnNuevoVehiculo = document.getElementById('btnNuevoVehiculo');

// Modal de Vehículo
export const vehiculoModalEl = document.getElementById('vehiculoModal');
export const vehiculoModal = vehiculoModalEl ? new bootstrap.Modal(vehiculoModalEl) : null;
export const vehiculoForm = document.getElementById('vehiculoForm');
export const btnGuardarVehiculo = document.getElementById('btnGuardarVehiculo');

// Seguimiento
export const listaSeguimiento = document.getElementById('listaSeguimiento');
export const filtroSeguimientoAgente = document.getElementById('filtroSeguimientoAgente');
export const listaSeguimientoContactados = document.getElementById('listaSeguimientoContactados');
export const seguimientoNotasModalEl = document.getElementById('seguimientoNotasModal');
export const seguimientoNotasModal = seguimientoNotasModalEl ? new bootstrap.Modal(seguimientoNotasModalEl) : null;
export const btnGuardarNotasSeguimiento = document.getElementById('btnGuardarNotasSeguimiento');

// Post-Venta
export const listaPostVenta = document.getElementById('listaPostVenta');
export const filtroPostVentaAgente = document.getElementById('filtroPostVentaAgente');
export const listaPostVentaContactados = document.getElementById('listaPostVentaContactados');
export const postVentaNotasModalEl = document.getElementById('postVentaNotasModal');
export const postVentaNotasModal = postVentaNotasModalEl ? new bootstrap.Modal(postVentaNotasModalEl) : null;
export const btnGuardarNotasPostVenta = document.getElementById('btnGuardarNotasPostVenta');

// Mensaje global
export const mensajeContainer = document.getElementById('mensajeContainer');
export const mensajeAlerta = document.getElementById('mensajeAlerta');

// Calendario
export const calendarioEl = document.getElementById('calendario');
export let calendario = null;

// Datos para importación
export let datosImportados = [];
export let datosExcelCrudos = { // Para guardar datos crudos y reprocesarlos con mapeo manual
    headers: [],
    jsonData: []
};

export let citaIdAEliminar = null;
export function setCitaIdAEliminar(id) {
    citaIdAEliminar = id;
}

export let clienteIdActualParaVehiculo = null;
export function setClienteIdActualParaVehiculo(id) {
    clienteIdActualParaVehiculo = id;
}