   /**
         * It checks for multiple possible names for a column.
         * @param {Array<string>} headers - Array of header names (lowercase, trimmed).
         * @param {Array<string>} possibleNames - Array of possible names for the column (lowercase).
         * @returns {number} The index of the column, or -1 if not found.
         */
        function findColumnIndex(headers, possibleNames) {
            for (const name of possibleNames) {
                const index = headers.indexOf(name);
                if (index !== -1) return index;
            }
            return -1;
        }

        // --- Citas de ejemplo (se cargan del localStorage) ---
        let citas = [];
        let clientes = [];
        let agentes = [];
        let mecanicos = [];
        let serviciosPredefinidos = [];
        let fuentes = [];
        let configuracion = {
            nombreEmpresa: "CheckEngineRD Unlimited",
            sucursal: "Santo Domingo",
            direccion: "Av. de los Próceres 25, Santo Domingo",
            telefono: "(809) 555-1234",
            moneda: "RD",
            formatoMoneda: "es-DO",
            primaryColor: '#2c3e50',
            secondaryColor: '#3498db',
            plantillaWhatsapp: "¡Hola {cliente}! Te recordamos tu cita en {nombreEmpresa} para tu {marca} {modelo} el día {fecha} a las {hora}. ¡Te esperamos!",
            plantillaPostVenta: "Hola {cliente}, ¿qué tal tu experiencia con el servicio de {servicio} para tu {marca} {modelo}? En {nombreEmpresa} valoramos mucho tu opinión. ¡Gracias!",
            plantillaReagendar: "Hola {cliente}, notamos que no pudiste asistir a tu cita del {fecha}. ¿Te gustaría reagendar?",
            welcomeText: "¡Hola, bienvenido!",
            headerTextColor: "#ffffff",
            plantillaPostVenta: "Hola {cliente}, ¿qué tal tu experiencia con el servicio de {servicio} para tu {marca} {modelo}? En {nombreEmpresa} valoramos mucho tu opinión. ¡Gracias!",
            qrUrl: "https://www.instagram.com/checkenginerd/", // URL por defecto para el QR
            logo: "https://placehold.co/180x50/ffffff/3498db?text=CheckEngineRD",
            dataVersion: "1.7", // Versión de la estructura de datos
            mostrarMontosSinDecimales: false, // Nueva opción para mostrar montos sin decimales
            seguimientoDiasRecibido: 3 // Días para que una cita 'recibida' aparezca en seguimiento
        };

        // --- Selectores del DOM ---
        const citaForm = document.getElementById('citaForm');
        const listaCitas = document.getElementById('listaCitas');
        const grupoFiltros = document.getElementById('grupo-filtros');
        const btnExportarExcel = document.getElementById('btnExportarExcel');
        const btnGuardarManual = document.getElementById('btnGuardarManual');
        const btnImportarExcel = document.getElementById('btnImportarExcel');
        const btnCopiarLista = document.getElementById('btnCopiarLista');
        const importarArchivoInput = document.getElementById('importarArchivo');
        const servicioSelect = document.getElementById('servicio');
        const otroServicioContainer = document.getElementById('otroServicioContainer');
        const otroServicioInput = document.getElementById('otroServicio');
        const filtroFechaInput = document.getElementById('filtroFecha');
        const regionSelect = document.getElementById('region');
        const combustibleSelect = document.getElementById('combustible');
        const trimInput = document.getElementById('trim');

        const filtroMesSelect = document.getElementById('filtroMes');
        const filtroAnioSelect = document.getElementById('filtroAnio');
        const filtroFacturadoInput = document.getElementById('filtroFacturado');
        const filtroBusquedaInput = document.getElementById('filtroBusqueda');
        const archivoExcelInput = document.getElementById('archivoExcel');
        const importarExcelModalEl = document.getElementById('importarExcelModal');
        const importarExcelModal = new bootstrap.Modal(importarExcelModalEl);
        const btnAccionImportar = document.getElementById('btnAccionImportar');
        const btnAjustarMapeo = document.getElementById('btnAjustarMapeo');
        const mapeoColumnasContainer = document.getElementById('mapeoColumnasContainer');
        const mapeoColumnasForm = document.getElementById('mapeoColumnasForm');
        const vistaPreviaContainer = document.querySelector('.import-preview');
        const agenteSelect = document.getElementById('agente');
        const fuenteSelect = document.getElementById('fuente');
        const otroFuenteContainer = document.getElementById('otroFuenteContainer');
        const otroFuenteInput = document.getElementById('otroFuente');
        const configuracionModalEl = document.getElementById('configuracionModal');
        const configuracionModal = new bootstrap.Modal(configuracionModalEl);
        const gestionAgentesModalEl = document.getElementById('gestionAgentesModal');
        const gestionAgentesModal = new bootstrap.Modal(gestionAgentesModalEl);
        const agenteForm = document.getElementById('agenteForm');
        const gestionServiciosModalEl = document.getElementById('gestionServiciosModal');
        const gestionServiciosModal = gestionServiciosModalEl ? new bootstrap.Modal(gestionServiciosModalEl) : null;
        const servicioForm = document.getElementById('servicioForm');
        const tablaServicios = document.getElementById('tablaServicios');
        const btnGuardarServicio = document.getElementById('btnGuardarServicio');

        // Mecánicos
        const gestionMecanicosModalEl = document.getElementById('gestionMecanicosModal');
        const gestionMecanicosModal = new bootstrap.Modal(gestionMecanicosModalEl);
        const mecanicoForm = document.getElementById('mecanicoForm');
        const tablaMecanicos = document.getElementById('tablaMecanicos');
        const btnGuardarMecanico = document.getElementById('btnGuardarMecanico');
        const btnEliminarMecanico = document.getElementById('btnEliminarMecanico');
        const mecanicoIdInput = document.getElementById('mecanicoId');
        const mecanicoNombreInput = document.getElementById('mecanicoNombre');
        const mecanicoEspecialidadInput = document.getElementById('mecanicoEspecialidad');
        const mecanicoActivoInput = document.getElementById('mecanicoActivo');

        // Fuentes de Cita
        const gestionFuentesModalEl = document.getElementById('gestionFuentesModal');
        const gestionFuentesModal = gestionFuentesModalEl ? new bootstrap.Modal(gestionFuentesModalEl) : null;
        const fuenteForm = document.getElementById('fuenteForm');
        const tablaFuentes = document.getElementById('tablaFuentes');
        const btnGuardarFuente = document.getElementById('btnGuardarFuente');

        // Gestión de Trabajos
        const listaTrabajos = document.getElementById('listaTrabajos');
        const asignarMecanicoModalEl = document.getElementById('asignarMecanicoModal');
        const asignarMecanicoModal = new bootstrap.Modal(asignarMecanicoModalEl);
        const btnGuardarMecanicosAsignados = document.getElementById('btnGuardarMecanicosAsignados');

        const btnGuardarAgente = document.getElementById('btnGuardarAgente');
        const btnEliminarAgente = document.getElementById('btnEliminarAgente');
        const tablaAgentes = document.getElementById('tablaAgentes');

        // Modal para editar
        const editarCitaModalEl = document.getElementById('editarCitaModal');
        const editarCitaForm = document.getElementById('editarCitaForm');
        const btnGuardarEdicion = document.getElementById('btnGuardarEdicion');
        const editarIdInput = document.getElementById('editarId');
        const editarNombreClienteInput = document.getElementById('editarNombreCliente');
        const editarTelefonoInput = document.getElementById('editarTelefono');
        const editarMarcaInput = document.getElementById('editarMarca');
        const editarModeloInput = document.getElementById('editarModelo');
        const editarAnioInput = document.getElementById('editarAnio');
        const editarFechaInput = document.getElementById('editarFecha');
        const editarHoraInput = document.getElementById('editarHora');
        const editarRegionSelect = document.getElementById('editarRegion');
        const editarCombustibleSelect = document.getElementById('editarCombustible');
        const editarTrimInput = document.getElementById('editarTrim');
        const editarServicioSelect = document.getElementById('editarServicio');
        const editarOtroServicioContainer = document.getElementById('editarOtroServicioContainer');
        const editarOtroServicioInput = document.getElementById('editarOtroServicio');
        const editarNotasInput = document.getElementById('editarNotas');
        const editarAgenteInput = document.getElementById('editarAgente');
        const editarFuenteSelect = document.getElementById('editarFuente');
        const editarOtroFuenteContainer = document.getElementById('editarOtroFuenteContainer');
        const editarOtroFuenteInput = document.getElementById('editarOtroFuente');
        const editarEstadoSelect = document.getElementById('editarEstado');
        const editarFacturadoInput = document.getElementById('editarFacturado');
        const editarMontoInput = document.getElementById('editarMonto');
        const editarTieneCotizacionSelect = document.getElementById('editarTieneCotizacion');
        const editarMotivoCotizacionContainer = document.getElementById('editarMotivoCotizacionContainer');
        const editarMotivoCotizacionInput = document.getElementById('editarMotivoCotizacion');
        const editarEsPromocionCheck = document.getElementById('editarEsPromocion');
        const editarPromoContainer = document.getElementById('editarPromoContainer');
        const editarPrecioRegularInput = document.getElementById('editarPrecioRegular');
        const editarPrecioPromocionalInput = document.getElementById('editarPrecioPromocional');

        // Modal para el cupón
        const cuponModalEl = document.getElementById('cuponModal');
        const cuponContent = document.getElementById('cuponContent');

        // Modal de confirmación para eliminar
        const confirmarEliminarModalEl = document.getElementById('confirmarEliminarModal');
        const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
        let citaIdAEliminar = null;

        // Configuración
        const configNombreEmpresa = document.getElementById('configNombreEmpresa');
        const configSucursal = document.getElementById('configSucursal');
        const configDireccion = document.getElementById('configDireccion');
        const configTelefono = document.getElementById('configTelefono');
        const configLogo = document.getElementById('configLogo');
        const logoPreview = document.getElementById('logoPreview');
        const configMoneda = document.getElementById('configMoneda');
        const configFormatoMoneda = document.getElementById('configFormatoMoneda');
        const btnGuardarConfiguracion = document.getElementById('btnGuardarConfiguracion');
        const configQrUrlInput = document.getElementById('configQrUrl');
        const headerLogo = document.getElementById('headerLogo');
        const headerEmpresaNombre = document.getElementById('headerEmpresaNombre');
        const configPrimaryColorInput = document.getElementById('configPrimaryColor');
        const configSecondaryColorInput = document.getElementById('configSecondaryColor');
        const configMostrarMontosSinDecimales = document.getElementById('configMostrarMontosSinDecimales');
        const configWelcomeTextInput = document.getElementById('configWelcomeText');
        const configHeaderTextColorInput = document.getElementById('configHeaderTextColor');

        // Agente Form
        const agenteIdInput = document.getElementById('agenteId');
        const agenteNombreInput = document.getElementById('agenteNombre');
        const agenteEmailInput = document.getElementById('agenteEmail');
        const agenteTelefonoInput = document.getElementById('agenteTelefono');
        const agenteActivoInput = document.getElementById('agenteActivo');

        // Formulario de nueva cita - Promoción
        const esPromocionCheck = document.getElementById('esPromocion');
        const promoContainer = document.getElementById('promoContainer');

        // Formulario de nueva cita - Autocompletado
        const telefonoInput = document.getElementById('telefono');
        const nombreClienteInput = document.getElementById('nombreCliente');
        const clienteExistenteIcon = document.getElementById('clienteExistenteIcon');
        const vehiculoExistenteContainer = document.getElementById('vehiculoExistenteContainer');
        const vehiculoExistenteSelect = document.getElementById('vehiculoExistenteSelect');
        // Dashboard
        const welcomeUserText = document.getElementById('welcomeUserText');
        const proximasCitasContainer = document.getElementById('proximasCitasContainer');
        const actividadRecienteContainer = document.getElementById('actividadRecienteContainer');

        // Reportes
        const filtroReporteFechaInicioInput = document.getElementById('filtroReporteFechaInicio');
        const filtroReporteFechaFinInput = document.getElementById('filtroReporteFechaFin');
        const filtroReporteAgenteSelect = document.getElementById('filtroReporteAgente');
        const filtroReporteServicioSelect = document.getElementById('filtroReporteServicio');
        const grupoFiltrosReportes = document.getElementById('grupo-filtros-reportes');
        const filtroReporteRegionSelect = document.getElementById('filtroReporteRegion');
        const filtroReporteCombustibleSelect = document.getElementById('filtroReporteCombustible');
        const filtroReporteFacturadoInput = document.getElementById('filtroReporteFacturado');
        let fuenteCitasChart = null;

        // Clientes (Nuevos y modificados)
        const listaClientes = document.getElementById('listaClientes');
        const filtroClientes = document.getElementById('filtroClientes');
        const historialClienteContainer = document.getElementById('historialClienteContainer');
        const placeholderCliente = document.getElementById('placeholderCliente');
        const nombreClienteHistorial = document.getElementById('nombreClienteHistorial');
        const telefonoClienteHistorial = document.getElementById('telefonoClienteHistorial');
        const emailClienteHistorial = document.getElementById('emailClienteHistorial');
        const tablaHistorialCliente = document.getElementById('tablaHistorialCliente');
        const btnNuevoCliente = document.getElementById('btnNuevoCliente');
        const btnEditarCliente = document.getElementById('btnEditarCliente');
        const clienteModalEl = document.getElementById('clienteModal');
        const clienteModal = new bootstrap.Modal(clienteModalEl);
        const clienteForm = document.getElementById('clienteForm');
        const btnGuardarCliente = document.getElementById('btnGuardarCliente');
        const clienteTotalCitas = document.getElementById('clienteTotalCitas');
        const clienteTotalFacturado = document.getElementById('clienteTotalFacturado');
        const clienteUltimaVisita = document.getElementById('clienteUltimaVisita');
        const listaVehiculosCliente = document.getElementById('listaVehiculosCliente');
        const notasClienteText = document.getElementById('notasClienteText');
        const btnGuardarNotasCliente = document.getElementById('btnGuardarNotasCliente');
        const btnNuevoVehiculo = document.getElementById('btnNuevoVehiculo');

        // Modal de Vehículo
        const vehiculoModalEl = document.getElementById('vehiculoModal');
        const vehiculoModal = vehiculoModalEl ? new bootstrap.Modal(vehiculoModalEl) : null;
        const vehiculoForm = document.getElementById('vehiculoForm');
        const btnGuardarVehiculo = document.getElementById('btnGuardarVehiculo');
        const theadSeguimiento = document.getElementById('theadSeguimiento');
        const listaSeguimientoUnificada = document.getElementById('listaSeguimientoUnificada');
        const filtroSeguimientoAgente = document.getElementById('filtroSeguimientoAgente');
        const filtroSeguimientoInicio = document.getElementById('filtroSeguimientoInicio');
        const filtroSeguimientoFin = document.getElementById('filtroSeguimientoFin');

        // Post-Venta
        const theadPostVenta = document.getElementById('theadPostVenta');
        const listaPostVentaUnificada = document.getElementById('listaPostVentaUnificada');
        const filtroPostVentaAgente = document.getElementById('filtroPostVentaAgente');
        const postVentaNotasModalEl = document.getElementById('postVentaNotasModal');
        const btnGuardarNotasPostVenta = document.getElementById('btnGuardarNotasPostVenta');
        const filtroPostVentaInicio = document.getElementById('filtroPostVentaInicio');
        const filtroPostVentaFin = document.getElementById('filtroPostVentaFin');


        // Datos para importación
        let datosImportados = [];
        let datosExcelCrudos = { // Para guardar datos crudos y reprocesarlos con mapeo manual
            headers: [],
            jsonData: []
        };

        // Configuración para el mapeo de columnas de Excel
        const camposMapeo = [
            { key: 'nombre', label: 'Nombre*', required: true, possibleNames: ['nombre', 'cliente'] },
            { key: 'telefono', label: 'Teléfono*', required: true, possibleNames: ['whatsapp', 'teléfono', 'telefono'] },
            { key: 'marca', label: 'Marca', required: false, possibleNames: ['marca'] },
            { key: 'modelo', label: 'Modelo', required: false, possibleNames: ['modelo'] },
            { key: 'anio', label: 'Año', required: false, possibleNames: ['año', 'ano'] },
            { key: 'fecha', label: 'Fecha', required: false, possibleNames: ['cita', 'fecha'] },
            { key: 'hora', label: 'Hora', required: false, possibleNames: ['hora'] },
            { key: 'servicio', label: 'Servicio', required: false, possibleNames: ['función', 'funcion', 'servicio'] },
            { key: 'estado', label: 'Estado', required: false, possibleNames: ['estado'] },
            { key: 'notas', label: 'Notas', required: false, possibleNames: ['notas', 'observaciones'] },
            { key: 'agente', label: 'Agente', required: false, possibleNames: ['agente'] },
            { key: 'monto', label: 'Monto', required: false, possibleNames: ['monto', 'precio'] },
            { key: 'facturado', label: 'Facturado (Sí/No)', required: false, possibleNames: ['facturación', 'facturacion'] },
            { key: 'trim', label: 'Trim/Versión', required: false, possibleNames: ['trim', 'version', 'versión'] },
            { key: 'region', label: 'Región', required: false, possibleNames: ['region', 'región'] },
            { key: 'combustible', label: 'Combustible', required: false, possibleNames: ['combustible'] }
        ];
        // Gráficos
        let estadoChart = null;
        let facturacionChart = null;
        let serviciosPopularesChart = null;
        let origenVehiculoChart = null;
        const calendarioEl = document.getElementById('calendario');
        let calendario = null;

        // --- Funciones de Utilidad ---
        /**
         * Muestra un mensaje temporal en la pantalla.
         * @param {string} mensaje - El texto del mensaje.
         * @param {string} tipo - El tipo de alerta ('success', 'danger', 'warning', 'info').
         */
        function mostrarMensaje(mensaje, tipo) {
            const mensajeContainer = document.getElementById('mensajeContainer');
            const mensajeAlerta = document.getElementById('mensajeAlerta');
            mensajeAlerta.textContent = mensaje;
            mensajeAlerta.className = `alert alert-${tipo}`;
            mensajeContainer.style.display = 'block';
            setTimeout(() => {
                mensajeContainer.style.display = 'none';
            }, 3000);
        }

        /**
         * Retorna la clase de badge de Bootstrap según el estado.
         * @param {string} estado - El estado de la cita.
         * @returns {string} La clase CSS para el badge.
         */
        function getBadgeClass(estado) {
            switch (estado) {
                case 'pendiente':
                    return 'badge bg-secondary';
                case 'recibido':
                    return 'badge bg-info';
                case 'completada':
                    return 'badge bg-success';
                case 'reagendada':
                    return 'badge bg-warning';
                case 'no_asistio':
                    return 'badge bg-danger';
                case 'cancelada':
                    return 'badge bg-dark';
                default:
                    return 'badge bg-primary';
            }
        }

        /**
         * Retorna el color para el evento del calendario según el estado de la cita.
         * @param {string} estado - El estado de la cita.
         * @returns {string} El código de color hexadecimal.
         */
        function getEventColor(estado) {
            switch (estado) {
                case 'pendiente': return '#6c757d'; // secondary
                case 'recibido': return '#17a2b8'; // info
                case 'completada': return '#28a745'; // success
                case 'reagendada': return '#ffc107'; // warning
                case 'no_asistio': return '#dc3545'; // danger
                case 'cancelada': return '#343a40'; // dark
                default: return '#3498db'; // primary
            }
        }

        /**
         * Sanitiza una cadena de texto para prevenir ataques XSS.
         * Convierte los caracteres especiales de HTML en sus entidades correspondientes.
         * @param {string} str - La cadena a sanitizar.
         * @returns {string} La cadena sanitizada.
         */
        function sanitizeHTML(str) {
            if (!str) return '';
            return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        }

        /**
         * Retorna los íconos de estado financiero.
         * @param {object} cita - Objeto de la cita.
         * @returns {string} HTML con los íconos.
         */
        function getFinanzasIcons(cita) {
            let icons = '';
            // Ícono de facturación
            const facturadoIcon = cita.facturado
                ? '<i class="fas fa-money-bill-wave text-success finanzas-icon" title="Facturado"></i>'
                : '<i class="fas fa-money-bill-wave text-muted finanzas-icon" title="No facturado"></i>';
            icons += facturadoIcon;

            // Ícono de cotización
            switch (cita.tieneCotizacion) {
                case 'si':
                    icons += '<i class="fas fa-check-circle text-success finanzas-icon" title="Con cotización"></i>';
                    break;
                case 'no':
                    icons += '<i class="fas fa-exclamation-circle text-danger finanzas-icon" title="¡Sin cotización!"></i>';
                    break;
                case 'no_aplica':
                default:
                    icons += '<i class="fas fa-minus-circle text-secondary finanzas-icon" title="No aplica cotización"></i>';
                    break;
            }
            return icons;
        }

        /**
         * Retorna un icono HTML basado en la fuente de la cita.
         * @param {string} fuente - La fuente de la cita.
         * @returns {string} El HTML del icono.
         */
        function getIconoFuente(fuente) {
            if (!fuente) return '<i class="fas fa-desktop text-muted fa-lg" title="Otro"></i>';
            switch (fuente.toLowerCase()) {
                case 'whatsapp':
                    return '<i class="fab fa-whatsapp text-success fa-lg" title="WhatsApp"></i>';
                case 'llamada':
                    return '<i class="fas fa-phone-alt text-primary fa-lg" title="Llamada"></i>';
                case 'tiktok':
                    return '<i class="fab fa-tiktok fa-lg" title="TikTok" style="color: #000;"></i>';
                case 'instagram':
                    return '<i class="fab fa-instagram fa-lg" title="Instagram" style="color: #E4405F;"></i>';
                case 'referido':
                    return '<i class="fas fa-user-friends text-info fa-lg" title="Referido"></i>';
                default:
                    return '<i class="fas fa-desktop text-muted fa-lg" title="Otro"></i>';
            }
        }

        /**
         * Convierte el estado de Excel al formato interno
         * @param {string} estadoExcel - Estado en formato Excel
         * @returns {string} Estado en formato interno
         */
        function convertirEstado(estadoExcel) {
            if (!estadoExcel) return 'pendiente';
            
            const estados = {
                'pendiente': 'pendiente',
                'recibido': 'recibido',
                'completada': 'completada',
                'reagendada': 'reagendada',
                'no asistio': 'no_asistio',
                'no asistió': 'no_asistio',
                'no_asistio': 'no_asistio',
                'cancelada': 'cancelada',
                'facturado': 'completada'
            };
            
            return estados[estadoExcel.toLowerCase()] || 'pendiente';
        }

        /**
         * Convierte la hora de Excel al formato interno
         * @param {string} horaExcel - Hora en formato Excel
         * @returns {string} Hora en formato interno
         */
        function convertirHora(horaExcel) {
            if (!horaExcel) return '08:00';
            
            // Intentar parsear diferentes formatos de hora
            const hora = horaExcel.toString().toLowerCase();
            
            if (hora.includes('8:00') || hora.includes('8:00')) return '08:00';
            if (hora.includes('9:00') || hora.includes('9:00')) return '09:00';
            if (hora.includes('10:00')) return '10:00';
            if (hora.includes('11:00')) return '11:00';
            if (hora.includes('12:00')) return '12:00';
            if (hora.includes('13:00') || hora.includes('1:00')) return '13:00';
            if (hora.includes('14:00') || hora.includes('2:00')) return '14:00';
            if (hora.includes('15:00') || hora.includes('3:00')) return '15:00';
            if (hora.includes('16:00') || hora.includes('4:00')) return '16:00';
            
            return '08:00';
        }

        /**
         * Formatea un monto a formato de dinero según la configuración
         * @param {number} monto - Monto a formatear
         * @returns {string} Monto formateado
         */
        function formatearMonto(monto) {
            if (!monto || isNaN(monto)) {
                switch(configuracion.moneda) {
                    case 'USD': return '$0.00';
                    case 'EUR': return '€0,00';
                    default: return 'RD$0.00';
                }
            }
            
            const opciones = {
                style: 'currency',
                currency: configuracion.moneda === 'RD' ? 'DOP' : configuracion.moneda,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };
            
            // Para el peso dominicano, forzamos el símbolo RD$
            if (configuracion.moneda === 'RD') {
                opciones.currencyDisplay = 'code';
            }
            
            let valorFormateado = new Intl.NumberFormat(configuracion.formatoMoneda, opciones).format(monto);
            
            // Reemplazar DOP con RD$ para el peso dominicano
            if (configuracion.moneda === 'RD') {
                valorFormateado = valorFormateado.replace('DOP', 'RD$');
            }
            
            return valorFormateado;
        }

        /**
         * Obtiene el símbolo de moneda según la configuración
         * @returns {string} Símbolo de moneda
         */
        function obtenerSimboloMoneda() {
            switch(configuracion.moneda) {
                case 'USD': return '$';
                case 'EUR': return '€';
                default: return 'RD$';
            }
        }

        /**
         * Parsea un monto desde diferentes formatos y lo convierte a un entero (sin decimales).
         * La detección automática ha sido mejorada para ser más explícita.
         * El nuevo "Sistema de Importación 2.0" permite configurar el formato.
         * @param {string|number} montoStr - String o número del monto.
         * @param {string} formato - 'auto', 'us' (1,234.56), or 'eu' (1.234,56).
         * @returns {number} Monto parseado como número entero.
         */
        function parsearMonto(montoStr, formato = 'auto') {
             if (montoStr === null || montoStr === undefined || String(montoStr).trim() === '') {
                 return 0;
             }
             let s = String(montoStr).trim();
             // Limpiar caracteres no deseados (ej. '$', '€'), manteniendo dígitos, punto, coma y signo menos.
             s = s.replace(/[^\d.,-]/g, '');
 
             let cleanedNumberStr;
 
             if (formato === 'us') {
                 // Formato 1,234.56: asume coma es separador de miles, punto es decimal. Eliminar comas.
                 cleanedNumberStr = s.replace(/,/g, '');
             } else if (formato === 'eu') {
                 // Formato 1.234,56: asume punto es separador de miles, coma es decimal. Eliminar puntos, cambiar coma por punto.
                 cleanedNumberStr = s.replace(/\./g, '').replace(/,/g, '.');
             } else { // 'auto' detection
                 const hasDot = s.includes('.');
                 const hasComma = s.includes(',');
                 const lastDotIndex = s.lastIndexOf('.');
                 const lastCommaIndex = s.lastIndexOf(',');
 
                 if (hasDot && hasComma) {
                     // Ambos existen. El que está más a la derecha es probablemente el decimal.
                     if (lastCommaIndex > lastDotIndex) {
                         // Ejemplo: 1.234,56 (coma es decimal, punto es miles)
                         cleanedNumberStr = s.replace(/\./g, '').replace(',', '.');
                     } else {
                         // Ejemplo: 1,234.56 (punto es decimal, coma es miles)
                         cleanedNumberStr = s.replace(/,/g, '');
                     }
                 } else if (hasComma) {
                     // Solo coma existe. Determinar si es decimal o de miles.
                     // Si la coma está seguida de 1 o 2 dígitos, es decimal (ej. 123,45).
                     const digitsAfterComma = s.length - (lastCommaIndex + 1);
                     if (digitsAfterComma === 1 || digitsAfterComma === 2) {
                         cleanedNumberStr = s.replace(',', '.');
                     } else {
                         // Asumir que es separador de miles (ej. 1,234)
                         cleanedNumberStr = s.replace(/,/g, '');
                     }
                 } else {
                     // Solo punto existe, o ninguno. Asumir punto es decimal o no hay separadores.
                     cleanedNumberStr = s;
                 }
             }
             const montoFloat = parseFloat(cleanedNumberStr); // Convertir a flotante
             if (isNaN(montoFloat)) { return 0; } // Si no es un número, retornar 0
             return Math.trunc(montoFloat); // Truncar para obtener solo la parte entera
        }

        /**
         * Convierte una fecha de Excel a formato JavaScript
         * @param {number} excelDate - Fecha en formato Excel (número de serie)
         * @returns {string} Fecha en formato YYYY-MM-DD
         */
        function convertirFechaExcel(excelDate) {
            try {
                // Si es un número de serie de Excel (días desde 1900-01-01)
                if (typeof excelDate === 'number' && excelDate > 1) {
                    const fecha = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
                    return normalizarFecha(fecha);
                }
                // Si ya es una cadena o cualquier otro formato, intentar normalizarla
                return normalizarFecha(excelDate);
            } catch (e) {
                return normalizarFecha(new Date()); // Fallback a la fecha de hoy
            }
        }

        // --- Funciones Principales ---
        /**
         * Carga las citas desde localStorage.
         */
        function cargarCitas() {
            const citasGuardadas = localStorage.getItem('citas');
            try {
                citas = citasGuardadas ? JSON.parse(citasGuardadas) : [];
            } catch (e) {
                console.error("Error al cargar las citas desde localStorage. Se iniciará con una lista vacía.", e);
                citas = [];
                // Limpiar el dato corrupto para evitar futuros errores
                localStorage.removeItem('citas');
            }
            
            // Cargar agentes, clientes, configuración
            cargarAgentes();
            cargarMecanicos();
            cargarClientes();
            cargarServiciosPredefinidos();
            cargarFuentes();
            cargarConfiguracion(true); // true to apply UI changes
            
            // Migrar datos antiguos si es necesario
            if ((configuracion.dataVersion || '1.0') < '1.7') {
                migrarDatosAntiguos();
            }
            
            // Actualizar citas pendientes pasadas a "No Asistió"
            actualizarCitasPasadas();

            // Sincronizar clientes con citas (bueno tenerlo aquí)
            sincronizarClientesDesdeCitas();

            // Cargar todos los filtros y selects
            cargarFiltroAnios();
            cargarAgentesEnSelects();
            cargarServiciosEnFormularios();
            cargarServiciosEnSelects();
            cargarFuentesEnSelects();
            cargarRegionesEnSelects();
            cargarCombustiblesEnSelects();
            cargarAgentesFiltroSeguimiento();
            cargarAgentesFiltroPostVenta();

            // Renderizar la UI inicial
            renderCitas(); // Esto renderiza la tabla principal y llama a actualizarResumen, renderSeguimiento, etc.
            renderDashboard(); // Esto renderiza los widgets de la pestaña de inicio.
        }

        /**
         * Carga la configuración desde localStorage
         */
        function cargarConfiguracion(aplicar = false) {
            const configGuardada = localStorage.getItem('configuracion');
            if (configGuardada) {
                try {
                    // Fusionar la configuración guardada con la por defecto para asegurar que nuevas propiedades existan
                    const configGuardadaObj = JSON.parse(configGuardada);
                    configuracion = { ...configuracion, ...configGuardadaObj };
                } catch (e) {
                    console.error("Error al cargar la configuración desde localStorage. Se usará la configuración por defecto.", e);
                    localStorage.removeItem('configuracion');
                    // No es necesario hacer nada más, 'configuracion' ya tiene los valores por defecto.
                }
            }
            if (aplicar) {
                aplicarConfiguracion();
            }
        }

        /**
         * Calcula la luminosidad de un color hexadecimal para determinar si es claro u oscuro.
         * @param {string} hex - El color en formato hexadecimal (ej. "#RRGGBB").
         * @returns {number} Un valor entre 0 (oscuro) y 1 (claro).
         */
        function getLuminance(hex) {
            if (!hex) return 0;
            // Expande el formato corto (ej. "03F") al completo (ej. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return 0;

            let [r, g, b] = result.slice(1).map(c => parseInt(c, 16));

            // Fórmula de luminosidad percibida
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        }

        /**
         * Ajusta el color del texto y los iconos del encabezado según la luminosidad del fondo.
         */
        function updateHeaderStyle() {
            const header = document.querySelector('.app-header');
            if (!header) return;

            // 1. Actualizar texto de bienvenida
            if(welcomeUserText) {
                welcomeUserText.textContent = configuracion.welcomeText || '¡Hola, bienvenido!';
            }

            // 2. Ajustar color del texto según la configuración del usuario
            const textColor = configuracion.headerTextColor || '#ffffff';
            document.querySelector('.app-header .header-title').style.color = textColor;
            document.querySelector('.app-header .welcome-user').style.color = textColor;
            document.querySelectorAll('.app-header .btn-icon').forEach(btn => btn.style.color = textColor);

            // 3. Ajustar filtro del logo según la luminosidad del fondo
            const primaryColor = configuracion.primaryColor || '#2c3e50';
            const luminance = getLuminance(primaryColor);
            header.classList.toggle('header-light-bg', luminance > 0.6); // Usar un umbral un poco más alto para logos
        }

        /**
         * Aplica la configuración cargada a la interfaz
         */
        function aplicarConfiguracion() {
            // Actualizar logo y nombre de empresa
            headerLogo.src = configuracion.logo;
            logoPreview.src = configuracion.logo;
            headerEmpresaNombre.textContent = configuracion.nombreEmpresa;
            
            // Actualizar símbolos de moneda
            const simbolo = obtenerSimboloMoneda();
            document.querySelectorAll('.currency-symbol').forEach(span => {
                if (span) span.textContent = simbolo;
            });
            // Aplicar colores
            document.documentElement.style.setProperty('--primary-color', configuracion.primaryColor || '#2c3e50');
            document.documentElement.style.setProperty('--secondary-color', configuracion.secondaryColor || '#3498db');
            
            // Función para convertir hex a rgb para usar en rgba()
            function hexToRgb(hex) {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }
            const primaryRgb = hexToRgb(configuracion.primaryColor || '#2c3e50');
            if (primaryRgb) {
                document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
            }

            // Ajustar el texto y los colores del header
            updateHeaderStyle();

            // Actualizar formulario de configuración
            if (configNombreEmpresa) {
                configNombreEmpresa.value = configuracion.nombreEmpresa;
                configSucursal.value = configuracion.sucursal;
                configDireccion.value = configuracion.direccion;
                configTelefono.value = configuracion.telefono;
                configMoneda.value = configuracion.moneda;
                configFormatoMoneda.value = configuracion.formatoMoneda;
                configQrUrlInput.value = configuracion.qrUrl || '';
                configPrimaryColorInput.value = configuracion.primaryColor || '#2c3e50';
                configSecondaryColorInput.value = configuracion.secondaryColor || '#3498db';
                configMostrarMontosSinDecimales.checked = configuracion.mostrarMontosSinDecimales || false;
                configWelcomeTextInput.value = configuracion.welcomeText || '¡Hola, bienvenido!';
                configHeaderTextColorInput.value = configuracion.headerTextColor || '#ffffff';
                const configWhatsappReagendarTemplate = document.getElementById('configWhatsappReagendarTemplate');
                if (configWhatsappReagendarTemplate) {
                    configWhatsappReagendarTemplate.value = configuracion.plantillaReagendar || '';
                }
                const configWhatsappPostVentaTemplate = document.getElementById('configWhatsappPostVentaTemplate');
                if (configWhatsappPostVentaTemplate) {
                    configWhatsappPostVentaTemplate.value = configuracion.plantillaPostVenta || '';
                }
                const configWhatsappTemplate = document.getElementById('configWhatsappTemplate');
                if (configWhatsappTemplate) {
                    configWhatsappTemplate.value = configuracion.plantillaWhatsapp || '';
                }
            }
        }

        /**
         * Guarda la configuración en localStorage
         */
        function saveAndApplyConfiguration(newConfig) {
            // Actualizar el objeto de configuración global fusionando los datos nuevos
            configuracion = { ...configuracion, ...newConfig };
            
            // Guardar en localStorage
            localStorage.setItem('configuracion', JSON.stringify(configuracion));
            
            // Aplicar los cambios a toda la interfaz de usuario
            aplicarConfiguracion();
            
            // Mostrar mensaje de éxito y cerrar el modal
            mostrarMensaje("Configuración guardada correctamente.", "success");
            configuracionModal.hide();
        }

        /**
         * Guarda la configuración en localStorage
         */
        function guardarConfiguracion() {
            localStorage.setItem('configuracion', JSON.stringify(configuracion));
        }

        /**
         * Carga los clientes desde localStorage
         */
        function cargarClientes() {
            const clientesGuardados = localStorage.getItem('clientes');
            try {
                clientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];
            } catch (e) {
                console.error("Error al cargar los clientes desde localStorage. Se iniciará con una lista vacía.", e);
                clientes = [];
                localStorage.removeItem('clientes');
            }
            
            // --- MIGRACIÓN DE DATOS DE CLIENTES ---
            let necesitaGuardar = false;
            clientes.forEach(cliente => {
                if (!cliente.hasOwnProperty('notes')) {
                    cliente.notes = '';
                    necesitaGuardar = true;
                }
                if (!cliente.hasOwnProperty('vehicles')) {
                    cliente.vehicles = [];
                    // Buscar en las citas para poblar los vehículos iniciales
                    citas.filter(c => c.telefono === cliente.telefono).forEach(cita => {
                        const vehiculoExistente = cliente.vehicles.find(v => 
                            v.marca === cita.marca && v.modelo === cita.modelo && v.anio === cita.anio
                        );
                        if (!vehiculoExistente && cita.marca) {
                            cliente.vehicles.push({
                                id: cliente.vehicles.length > 0 ? Math.max(...cliente.vehicles.map(v => v.id)) + 1 : 1,
                                marca: cita.marca,
                                modelo: cita.modelo,
                                anio: cita.anio,
                                region: cita.region || '',
                                combustible: cita.combustible || '',
                                trim: cita.trim || '',
                                placa: '',
                                vin: ''
                            });
                        }
                    });
                    necesitaGuardar = true;
                }
            });

            if (necesitaGuardar) {
                guardarClientes();
            }
            // --- FIN DE MIGRACIÓN ---

            renderClientes();
        }

        /**
         * Guarda los clientes en localStorage
         */
        function guardarClientes() {
            localStorage.setItem('clientes', JSON.stringify(clientes));
        }

        /**
         * Carga los agentes desde localStorage
         */
        function cargarAgentes() {
            const agentesGuardados = localStorage.getItem('agentes');
            const agentesDefault = [
                    { id: 1, nombre: "Juan Pérez", email: "juan@checkenginerd.com", telefono: "809-555-0101", activo: true },
                    { id: 2, nombre: "María García", email: "maria@checkenginerd.com", telefono: "809-555-0102", activo: true },
                    { id: 3, nombre: "Carlos Rodríguez", email: "carlos@checkenginerd.com", telefono: "809-555-0103", activo: true }
                ];
            try {
                const agentesTemp = agentesGuardados ? JSON.parse(agentesGuardados) : null;
                // Usar los datos guardados solo si existen y no están vacíos.
                if (agentesTemp && agentesTemp.length > 0) {
                    agentes = agentesTemp;
                } else {
                    agentes = agentesDefault;
                }
            } catch (e) {
                console.error("Error al cargar los agentes desde localStorage. Se usarán los valores por defecto.", e);
                localStorage.removeItem('agentes'); // Limpiar dato corrupto
                agentes = agentesDefault; // Cargar defaults como fallback
            }
            
            // Renderizar tabla de agentes
            renderAgentes();
        }

        /**
         * Guarda los agentes en localStorage
         */
        function guardarAgentes() {
            localStorage.setItem('agentes', JSON.stringify(agentes));
            renderAgentes();
            cargarAgentesEnSelects();
        }

        /**
         * Carga los servicios predefinidos desde localStorage
         */
        function cargarServiciosPredefinidos() {
            const serviciosGuardados = localStorage.getItem('serviciosPredefinidos');
            const serviciosDefault = [
                    { id: 1, nombre: "Chequeo General", precio: 1500 },
                    { id: 2, nombre: "Chequeo libre de costo", precio: 0 },
                    { id: 3, nombre: "Mantenimiento Inyección", precio: 2500 },
                    { id: 4, nombre: "Cambio de Aceite", precio: 1800 },
                    { id: 5, nombre: "Diagnóstico Computarizado", precio: 2000 },
                    { id: 6, nombre: "Trabajo a Realizar", precio: 0 },
                ];
            try {
                const serviciosTemp = serviciosGuardados ? JSON.parse(serviciosGuardados) : null;
                if (serviciosTemp && serviciosTemp.length > 0) {
                    serviciosPredefinidos = serviciosTemp;
                } else {
                    serviciosPredefinidos = serviciosDefault;
                }
            } catch (e) {
                console.error("Error al cargar los servicios desde localStorage. Se usarán los valores por defecto.", e);
                localStorage.removeItem('serviciosPredefinidos');
                serviciosPredefinidos = serviciosDefault;
            }
            renderServiciosPredefinidos();
        }

        /**
         * Guarda los servicios predefinidos en localStorage
         */
        function guardarServiciosPredefinidos() {
            localStorage.setItem('serviciosPredefinidos', JSON.stringify(serviciosPredefinidos));
            renderServiciosPredefinidos();
            cargarServiciosEnFormularios();
            cargarServiciosEnSelects(); // Actualizar filtro de reportes
        }

        /**
         * Renderiza la tabla de servicios en el modal de gestión
         */
        function renderServiciosPredefinidos() {
            if (!tablaServicios) return;
            tablaServicios.innerHTML = '';
            const serviciosOrdenados = [...serviciosPredefinidos].sort((a, b) => a.nombre.localeCompare(b.nombre));

            serviciosOrdenados.forEach(servicio => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => editarServicio(servicio.id);
                tr.innerHTML = `
                    <td>${sanitizeHTML(servicio.nombre)}</td>
                    <td>${servicio.precio > 0 ? formatearMonto(servicio.precio) : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); eliminarServicio(${servicio.id})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaServicios.appendChild(tr);
            });
        }

        /**
         * Carga las fuentes de cita desde localStorage
         */
        function cargarFuentes() {
            const fuentesGuardadas = localStorage.getItem('fuentes');
            const fuentesDefault = [
                { id: 1, nombre: "WhatsApp" },
                { id: 2, nombre: "Llamada" },
                { id: 3, nombre: "TikTok" },
                { id: 4, nombre: "Instagram" },
                { id: 5, nombre: "Referido" }
            ];
            try {
                const fuentesTemp = fuentesGuardadas ? JSON.parse(fuentesGuardadas) : null;
                if (fuentesTemp && fuentesTemp.length > 0) {
                    fuentes = fuentesTemp;
                } else {
                    fuentes = fuentesDefault;
                }
            } catch (e) {
                console.error("Error al cargar las fuentes desde localStorage. Se usarán los valores por defecto.", e);
                localStorage.removeItem('fuentes');
                fuentes = fuentesDefault;
            }
            renderFuentes();
        }

        /**
         * Guarda las fuentes de cita en localStorage
         */
        function guardarFuentes() {
            localStorage.setItem('fuentes', JSON.stringify(fuentes));
            renderFuentes();
            cargarFuentesEnSelects();
        }

        /**
         * Renderiza la tabla de servicios en el modal de gestión
         */
        function renderServiciosPredefinidos() {
            if (!tablaServicios) return;
            tablaServicios.innerHTML = '';
            const serviciosOrdenados = [...serviciosPredefinidos].sort((a, b) => a.nombre.localeCompare(b.nombre));

            serviciosOrdenados.forEach(servicio => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => editarServicio(servicio.id);
                tr.innerHTML = `
                    <td>${sanitizeHTML(servicio.nombre)}</td>
                    <td>${servicio.precio > 0 ? formatearMonto(servicio.precio) : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); eliminarServicio(${servicio.id})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaServicios.appendChild(tr);
            });
        }

        /**
         * Renderiza la tabla de fuentes en el modal de gestión
         */
        function renderFuentes() {
            if (!tablaFuentes) return;
            tablaFuentes.innerHTML = '';
            const fuentesOrdenadas = [...fuentes].sort((a, b) => a.nombre.localeCompare(b.nombre));

            fuentesOrdenadas.forEach(fuente => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => editarFuente(fuente.id);
                tr.innerHTML = `
                    <td>${sanitizeHTML(fuente.nombre)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); eliminarFuente(${fuente.id})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tablaFuentes.appendChild(tr);
            });
        }

        /**
         * Guarda un servicio nuevo o editado
         */
        function guardarServicio(event) {
            event.preventDefault();
            const id = document.getElementById('servicioId').value ? parseInt(document.getElementById('servicioId').value) : null;
            const nombre = document.getElementById('servicioNombre').value.trim();
            const precio = parseFloat(document.getElementById('servicioPrecio').value) || 0;

            if (!nombre) {
                mostrarMensaje('El nombre del servicio es obligatorio.', 'warning');
                return;
            }

            if (id) { // Editar
                const index = serviciosPredefinidos.findIndex(s => s.id === id);
                if (index > -1) serviciosPredefinidos[index] = { id, nombre, precio };
            } else { // Crear
                const nuevoId = serviciosPredefinidos.length > 0 ? Math.max(...serviciosPredefinidos.map(s => s.id)) + 1 : 1;
                serviciosPredefinidos.push({ id: nuevoId, nombre, precio });
            }
            guardarServiciosPredefinidos();
            servicioForm.reset();
            document.getElementById('servicioFormTitulo').textContent = 'Crear Nuevo Servicio';
            document.getElementById('btnGuardarServicio').innerHTML = '<i class="fas fa-plus me-1"></i> Crear Servicio';
            mostrarMensaje(`Servicio ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        }

        /**
         * Carga los datos de un servicio en el formulario para editarlo
         */
        function editarServicio(id) {
            const servicio = serviciosPredefinidos.find(s => s.id === id);
            if (servicio) {
                document.getElementById('servicioFormTitulo').textContent = `Editando: ${servicio.nombre}`;
                document.getElementById('servicioId').value = servicio.id;
                document.getElementById('servicioNombre').value = servicio.nombre;
                document.getElementById('servicioPrecio').value = servicio.precio || '';
                document.getElementById('btnGuardarServicio').innerHTML = '<i class="fas fa-save me-1"></i> Guardar Cambios';
            }
        }

        /**
         * Elimina un servicio predefinido
         */
        function eliminarServicio(id) {
            if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
                serviciosPredefinidos = serviciosPredefinidos.filter(s => s.id !== id);
                guardarServiciosPredefinidos();
                mostrarMensaje('Servicio eliminado.', 'danger');
            }
        }

        /**
         * Gestiona la creación de una nueva fuente si no existe.
         * @param {string} nombre - El nombre de la nueva fuente.
         * @returns {string|null} El nombre de la fuente (nueva o existente) o null si el nombre es inválido.
         */
        function gestionarNuevaFuente(nombre) {
            const nombreLimpio = nombre.trim();
            if (!nombreLimpio) {
                return null;
            }

            // Revisa si la fuente ya existe (ignorando mayúsculas/minúsculas)
            const fuenteExistente = fuentes.find(f => f.nombre.toLowerCase() === nombreLimpio.toLowerCase());

            if (fuenteExistente) {
                return fuenteExistente.nombre; // Retorna el nombre existente con la capitalización correcta
            } else {
                // Crea la nueva fuente
                const nuevoId = fuentes.length > 0 ? Math.max(...fuentes.map(f => f.id)) + 1 : 1;
                const nuevaFuente = { id: nuevoId, nombre: nombreLimpio };
                fuentes.push(nuevaFuente);
                guardarFuentes(); // Guarda en localStorage y actualiza los menús desplegables
                mostrarMensaje(`Nueva fuente "${nombreLimpio}" creada y seleccionada.`, 'info');
                return nombreLimpio;
            }
        }
        /**
         * Guarda una fuente nueva o editada
         */
        function guardarFuente(event) {
            event.preventDefault();
            const id = document.getElementById('fuenteId').value ? parseInt(document.getElementById('fuenteId').value) : null;
            const nombre = document.getElementById('fuenteNombre').value.trim();

            if (!nombre) {
                mostrarMensaje('El nombre de la fuente es obligatorio.', 'warning');
                return;
            }

            if (id) { // Editar
                const index = fuentes.findIndex(f => f.id === id);
                if (index > -1) {
                    // Antes de cambiar el nombre, actualizar las citas que usan el nombre antiguo
                    const nombreAntiguo = fuentes[index].nombre;
                    if (nombreAntiguo !== nombre) {
                        citas.forEach(cita => {
                            if (cita.fuente === nombreAntiguo) {
                                cita.fuente = nombre;
                            }
                        });
                        guardarCitas(); // Guardar los cambios en las citas
                    }
                    fuentes[index] = { id, nombre };
                }
            } else { // Crear
                const nuevoId = fuentes.length > 0 ? Math.max(...fuentes.map(f => f.id)) + 1 : 1;
                fuentes.push({ id: nuevoId, nombre });
            }
            guardarFuentes();
            fuenteForm.reset();
            document.getElementById('fuenteFormTitulo').textContent = 'Crear Nueva Fuente';
            document.getElementById('btnGuardarFuente').innerHTML = '<i class="fas fa-plus me-1"></i> Crear Fuente';
            document.getElementById('fuenteId').value = '';
            mostrarMensaje(`Fuente ${id ? 'actualizada' : 'creada'} con éxito.`, 'success');
        }

        /**
         * Carga los datos de una fuente en el formulario para editarla
         */
        window.editarFuente = function(id) {
            const fuente = fuentes.find(f => f.id === id);
            if (fuente) {
                document.getElementById('fuenteFormTitulo').textContent = `Editando: ${fuente.nombre}`;
                document.getElementById('fuenteId').value = fuente.id;
                document.getElementById('fuenteNombre').value = fuente.nombre;
                document.getElementById('btnGuardarFuente').innerHTML = '<i class="fas fa-save me-1"></i> Guardar Cambios';
            }
        }

        /**
         * Elimina una fuente
         */
        window.eliminarFuente = function(id) {
            const fuenteAEliminar = fuentes.find(f => f.id === id);
            if (!fuenteAEliminar) return;

            const fuenteEnUso = citas.some(c => c.fuente === fuenteAEliminar.nombre);
            if (fuenteEnUso) {
                mostrarMensaje('No se puede eliminar. Esta fuente está siendo utilizada en al menos una cita.', 'danger');
                return;
            }

            if (confirm('¿Estás seguro de que quieres eliminar esta fuente?')) {
                fuentes = fuentes.filter(f => f.id !== id);
                guardarFuentes();
                mostrarMensaje('Fuente eliminada.', 'danger');
            }
        }

        /**
         * Renderiza la tabla de agentes
         */
        function renderAgentes() {
            if (!tablaAgentes) return;
            
            tablaAgentes.innerHTML = '';
            
            const agentesOrdenados = [...agentes].sort((a, b) => a.nombre.localeCompare(b.nombre));

            agentesOrdenados.forEach(agente => {
                const citasDelAgente = citas.filter(c => c.agente == agente.id);
                const citasCompletadas = citasDelAgente.filter(c => c.estado === 'completada').length;

                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => editarAgente(agente.id);

                tr.innerHTML = `
                    <td><strong>${agente.nombre}</strong><br><small class="text-muted">${agente.email || ''}</small></td>
                    <td><span class="badge ${agente.activo ? 'bg-success' : 'bg-secondary'}">${agente.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td class="text-center">${citasDelAgente.length}</td>
                    <td class="text-center">${citasCompletadas}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); editarAgente(${agente.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                tablaAgentes.appendChild(tr);
            });
        }

        /**
         * Carga los agentes en los selects del formulario
         */
        function cargarAgentesEnSelects() {
            if (!agenteSelect || !editarAgenteInput) return;
            
            // Limpiar selects
            agenteSelect.innerHTML = '';
            editarAgenteInput.innerHTML = '';
            
            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione un agente...';
            agenteSelect.appendChild(defaultOption.cloneNode(true));
            editarAgenteInput.appendChild(defaultOption.cloneNode(true));
            
            // Agregar agentes activos
            agentes.filter(a => a.activo).forEach(agente => {
                const option = document.createElement('option');
                option.value = agente.id;
                option.textContent = agente.nombre;
                agenteSelect.appendChild(option.cloneNode(true));
                editarAgenteInput.appendChild(option.cloneNode(true));
            });
        }

        /**
         * Carga los servicios predefinidos en los selects de los formularios de citas.
         */
        function cargarServiciosEnFormularios() {
            const selects = [document.getElementById('servicio'), document.getElementById('editarServicio')];
            const serviciosOrdenados = [...serviciosPredefinidos].sort((a, b) => a.nombre.localeCompare(b.nombre));

            selects.forEach(select => {
                if (!select) return;
                const currentValue = select.value;
                select.innerHTML = '<option value="">Seleccione un servicio...</option>';
                serviciosOrdenados.forEach(servicio => {
                    const option = document.createElement('option');
                    option.value = servicio.nombre;
                    option.textContent = servicio.nombre;
                    select.appendChild(option);
                });
                select.innerHTML += '<option value="Otro">Otro (especificar)</option>';
                select.value = currentValue;
            });
        }
        /**
         * Carga las fuentes de cita en los selects de los formularios.
         */
        function cargarFuentesEnSelects() {
            const selects = [document.getElementById('fuente'), document.getElementById('editarFuente')];
            const fuentesOrdenadas = [...fuentes].sort((a, b) => a.nombre.localeCompare(b.nombre));

            selects.forEach(select => {
                if (!select) return;
                const currentValue = select.value;
                select.innerHTML = '<option value="">Seleccione una fuente...</option>';
                fuentesOrdenadas.forEach(fuente => {
                    const option = document.createElement('option');
                    option.value = fuente.nombre;
                    option.textContent = fuente.nombre;
                    select.appendChild(option);
                });
                // Añadir opción para crear una nueva fuente manualmente
                const otroOption = document.createElement('option');
                otroOption.value = '_otro_';
                otroOption.textContent = 'Otro (especificar)...';
                select.appendChild(otroOption);

                select.value = currentValue;
            });
        }
        /**
         * Carga los servicios únicos en el select de filtros de reportes.
         */
        function cargarServiciosEnSelects() {
            if (!filtroReporteServicioSelect) return;

            // Crear un Set para almacenar todos los servicios únicos y evitar duplicados.
            const todosLosServicios = new Set();

            // 1. Añadir todos los servicios predefinidos.
            serviciosPredefinidos.forEach(s => todosLosServicios.add(s.nombre));

            // 2. Añadir todos los servicios (incluyendo "otros") de las citas existentes.
            citas.forEach(cita => {
                const servicioReal = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
                if (servicioReal) todosLosServicios.add(servicioReal);
            });

            filtroReporteServicioSelect.innerHTML = '<option value="">Todos los servicios</option>';
            const serviciosOrdenados = Array.from(todosLosServicios).sort(); // Convertir el Set a un array y ordenarlo.
            serviciosOrdenados.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio;
                option.textContent = servicio;
                filtroReporteServicioSelect.appendChild(option);
            });
        }

        /**
         * Carga las regiones únicas en el select de filtros de reportes.
         */
        function cargarRegionesEnSelects() {
            if (!filtroReporteRegionSelect) return;

            const regionesUnicas = new Set(citas.map(c => c.region).filter(Boolean));
            const regionesOrdenadas = Array.from(regionesUnicas).sort();

            filtroReporteRegionSelect.innerHTML = '<option value="">Todas las regiones</option>';
            regionesOrdenadas.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                filtroReporteRegionSelect.appendChild(option);
            });
        }

        /**
         * Carga los combustibles únicos en el select de filtros de reportes.
         */
        function cargarCombustiblesEnSelects() {
            if (!filtroReporteCombustibleSelect) return;

            const combustiblesUnicos = new Set(citas.map(c => c.combustible).filter(Boolean));
            const combustiblesOrdenados = Array.from(combustiblesUnicos).sort();

            filtroReporteCombustibleSelect.innerHTML = '<option value="">Todos los combustibles</option>';
            combustiblesOrdenados.forEach(combustible => {
                filtroReporteCombustibleSelect.innerHTML += `<option value="${combustible}">${combustible}</option>`;
            });
        }
        /**
         * Carga los agentes en el select de filtro de seguimiento.
         */
        function cargarAgentesFiltroSeguimiento() {
            if (!filtroSeguimientoAgente) return;
            
            filtroSeguimientoAgente.innerHTML = '<option value="">Todos los Agentes</option>';
            
            // Usar una copia de los agentes para no afectar el array original
            const agentesActivos = [...agentes].filter(a => a.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));

            agentesActivos.forEach(agente => {
                const option = document.createElement('option');
                option.value = agente.id;
                option.textContent = agente.nombre;
                filtroSeguimientoAgente.appendChild(option);
            });
        }

        /**
         * Carga los agentes en el select de filtro de post-venta.
         */
        function cargarAgentesFiltroPostVenta() {
            if (!filtroPostVentaAgente) return;
            
            filtroPostVentaAgente.innerHTML = '<option value="">Todos los Agentes</option>';
            
            // Usar una copia de los agentes para no afectar el array original
            const agentesActivos = [...agentes].filter(a => a.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));

            agentesActivos.forEach(agente => {
                const option = document.createElement('option');
                option.value = agente.id;
                option.textContent = agente.nombre;
                filtroPostVentaAgente.appendChild(option);
            });
        }
        /**
         * Carga los años disponibles en el filtro
         */
        function cargarFiltroAnios() {
            if (!filtroAnioSelect) return;
            
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
            filtroAnioSelect.innerHTML = '<option value="">Todos los años</option>';
            
            // Agregar años
            aniosOrdenados.forEach(anio => {
                const option = document.createElement('option');
                option.value = anio;
                option.textContent = anio;
                filtroAnioSelect.appendChild(option);
            });
        }

        /**
         * Función para migrar datos antiguos a la nueva estructura
         */
        function migrarDatosAntiguos() {
            let necesitaGuardar = false;
            
            citas.forEach(cita => {
                // Si existe el campo 'vehiculo' pero no 'marca', migrar los datos
                if (cita.vehiculo && !cita.marca) {
                    cita.marca = cita.vehiculo;
                    delete cita.vehiculo;
                    necesitaGuardar = true;
                }
                
                // Si no existe el campo 'modelo', crearlo vacío
                if (!cita.hasOwnProperty('modelo')) {
                    cita.modelo = "";
                    necesitaGuardar = true;
                }
                
                // Si no existe el campo 'agente', crearlo vacío
                if (!cita.hasOwnProperty('agente')) {
                    cita.agente = "";
                    necesitaGuardar = true;
                }
                
                // Si no existe el campo 'tieneCotizacion', crearlo con valor por defecto
                if (!cita.hasOwnProperty('tieneCotizacion')) {
                    cita.tieneCotizacion = "no_aplica";
                    necesitaGuardar = true;
                }
                
                // Si no existe el campo 'motivoCotizacion', crearlo vacío
                if (!cita.hasOwnProperty('motivoCotizacion')) {
                    cita.motivoCotizacion = "";
                    necesitaGuardar = true;
                }
                
                // Si no existe el campo 'otroServicio', crearlo vacío
                if (!cita.hasOwnProperty('otroServicio')) {
                    cita.otroServicio = "";
                    necesitaGuardar = true;
                }

                // Si no existe el campo 'enCamino', crearlo con valor por defecto
                if (!cita.hasOwnProperty('enCamino')) {
                    cita.enCamino = false;
                    necesitaGuardar = true;
                }

                // Si no existen los campos de promoción, crearlos con valores por defecto
                if (!cita.hasOwnProperty('esPromocion')) {
                    cita.esPromocion = false;
                    cita.precioRegular = 0;
                    cita.precioPromocional = 0;
                    necesitaGuardar = true;
                }

                // Migración para mecánicos asignados
                if (!cita.hasOwnProperty('mecanicosAsignados')) {
                    cita.mecanicosAsignados = [];
                    necesitaGuardar = true;
                }

                // --- MIGRACIÓN DE SEGUIMIENTO ---
                if (!cita.hasOwnProperty('seguimiento')) {
                    cita.seguimiento = {
                        status: cita.seguimientoRealizado ? 'contacted' : 'pending', // Usar la bandera antigua si existe
                        lastContact: null,
                        notes: cita.notasSeguimiento || ''
                    };
                    delete cita.seguimientoRealizado;
                    delete cita.notasSeguimiento;
                    necesitaGuardar = true;
                }

                // --- MIGRACIÓN DE POST-VENTA ---
                if (!cita.hasOwnProperty('postVenta')) {
                    cita.postVenta = {
                        status: cita.postVentaRealizado ? 'contacted' : 'pending', // Usar la bandera antigua si existe
                        lastContact: null,
                        satisfaction: null,
                        notes: cita.notasPostVenta || ''
                    };
                    delete cita.postVentaRealizado;
                    delete cita.notasPostVenta;
                    necesitaGuardar = true;
                }

                // Migración para campos de vehículo
                if (!cita.hasOwnProperty('region')) {
                    cita.region = "";
                    cita.combustible = "";
                    cita.trim = "";
                    necesitaGuardar = true;
                }

                // Migración para separar mecánicos de chequeo y trabajo
                if (!cita.hasOwnProperty('mecanicosChequeo')) {
                    cita.mecanicosChequeo = [];
                    necesitaGuardar = true;
                }
                if (cita.mecanicosAsignados) { // Si existe la propiedad antigua
                    cita.mecanicosTrabajo = cita.mecanicosAsignados;
                    delete cita.mecanicosAsignados;
                    necesitaGuardar = true;
                }
                if (!cita.hasOwnProperty('mecanicosTrabajo')) { cita.mecanicosTrabajo = []; necesitaGuardar = true; }

                // Normalizar fecha y hora para asegurar compatibilidad con FullCalendar
                const fechaOriginal = cita.fecha;

                // Normalizar y agregar propiedad 'fuente'
                if (cita.hasOwnProperty('fuente') && cita.fuente) {
                    // Normalizar el valor existente a la versión capitalizada de la lista de fuentes
                    const matchingFuente = fuentes.find(f => f.nombre.toLowerCase() === cita.fuente.toLowerCase());
                    if (matchingFuente && cita.fuente !== matchingFuente.nombre) {
                        cita.fuente = matchingFuente.nombre;
                        necesitaGuardar = true;
                    }
                } else {
                    // Si no existe, agregarla con el valor por defecto 'Otro'
                    const fuenteOtro = fuentes.find(f => f.nombre.toLowerCase() === 'otro');
                    cita.fuente = fuenteOtro ? fuenteOtro.nombre : 'Otro';
                    necesitaGuardar = true;
                }

                const horaOriginal = cita.hora;
                
                const fechaNormalizada = normalizarFecha(fechaOriginal);
                const horaNormalizada = normalizarHora(horaOriginal);

                if (fechaNormalizada !== fechaOriginal || horaNormalizada !== horaOriginal) {
                    cita.fecha = fechaNormalizada;
                    cita.hora = horaNormalizada;
                    necesitaGuardar = true;
                }
            });
            
            if (necesitaGuardar) {
                guardarCitas();
                mostrarMensaje("Datos antiguos migrados y normalizados correctamente.", "info");
            }

            // Actualizar la versión de los datos para que la migración no se ejecute de nuevo.
            configuracion.dataVersion = '1.7';
            localStorage.setItem('configuracion', JSON.stringify(configuracion));
        }
        
        /**
         * Actualiza el estado de las citas pendientes de días anteriores a 'No Asistió'.
         */
        function actualizarCitasPasadas() {
            const hoy = new Date().toISOString().split('T')[0];
            let cambiosRealizados = false;

            citas.forEach(cita => {
                // Comprueba si la cita está pendiente y su fecha es anterior a hoy
                if (cita.estado === 'pendiente' && cita.fecha < hoy) {
                    cita.estado = 'no_asistio';
                    if (cita.seguimiento) {
                        cita.seguimiento.status = 'pending'; // Resetear para que aparezca en seguimiento
                    }
                    cambiosRealizados = true;
                }
            });

            if (cambiosRealizados) {
                guardarCitas();
                mostrarMensaje("Se han actualizado las citas pendientes pasadas a 'No Asistió'.", 'info');
            }
        }
        
        /**
         * Sincroniza la lista de clientes con las citas completadas/recibidas
         */
        function sincronizarClientesDesdeCitas() {
            let cambiosRealizados = false;
            citas.forEach(cita => {
                if (cita.estado === 'recibido' || cita.estado === 'completada') {
                    let clienteExistente = clientes.find(cli => cli.telefono === cita.telefono);
                    
                    if (!clienteExistente) {
                        const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
                        clienteExistente = { 
                            id: nuevoId, 
                            nombre: cita.nombreCliente, 
                            telefono: cita.telefono, 
                            email: '',
                            notes: '',
                            vehicles: []
                        };
                        clientes.push(clienteExistente);
                        cambiosRealizados = true;
                    }

                    // Sincronizar vehículo de la cita con el perfil del cliente
                    if (cita.marca) {
                        const vehiculoEnPerfil = clienteExistente.vehicles.find(v => 
                            v.marca === cita.marca && v.modelo === cita.modelo && v.anio == cita.anio
                        );
                        if (!vehiculoEnPerfil) {
                            const nuevoVehiculoId = clienteExistente.vehicles.length > 0 ? Math.max(...clienteExistente.vehicles.map(v => v.id)) + 1 : 1;
                            clienteExistente.vehicles.push({
                                id: nuevoVehiculoId,
                                marca: cita.marca,
                                modelo: cita.modelo,
                                anio: cita.anio,
                                region: cita.region || '',
                                combustible: cita.combustible || '',
                                trim: cita.trim || '',
                                placa: '',
                                vin: ''
                            });
                            cambiosRealizados = true;
                        }
                    }
                }
            });

            if (cambiosRealizados) {
                guardarClientes();
                // Renderizar siempre la lista de clientes para mantener la consistencia de los datos en la UI.
                renderClientes();
            }
        }

        /**
         * Guarda las citas en localStorage.
         */
        function guardarCitas() {
            localStorage.setItem('citas', JSON.stringify(citas));
        }

        /**
         * Renderiza la tabla de citas en el DOM.
         */
        function renderCitas() {
            if (!listaCitas) return; // Si el elemento no existe, no hagas nada.
            
            listaCitas.innerHTML = ''; // <-- ESTA ES LA LÍNEA CLAVE. Limpia la tabla antes de volver a llenarla.
            
            // Filtrar las citas
            const citasFiltradas = obtenerCitasFiltradas();
            
            citasFiltradas.forEach(cita => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-estado-cita', cita.estado);
                tr.setAttribute('data-fecha-cita', cita.fecha);
                
                // Obtener nombre del agente
                const agente = agentes.find(a => a.id == cita.agente) || { nombre: 'N/A' };
                
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
                            <button type="button" class="btn ${cita.enCamino ? 'btn-success' : 'btn-outline-secondary'} btn-action" onclick="marcarEnCamino(${cita.id})" title="${cita.enCamino ? "Desmarcar 'En Camino'" : "Marcar 'En Camino'"}">
                                <i class="fas fa-car"></i>
                            </button>
                            <button type="button" class="btn btn-outline-warning btn-action" onclick="abrirEditarModal(${cita.id})" title="Editar cita">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-outline-info btn-action" onclick="abrirCuponModal(${cita.id})" title="Ver cupón">
                                <i class="fas fa-ticket-alt"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-action" onclick="abrirConfirmacionEliminar(${cita.id})" title="Eliminar cita">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                listaCitas.appendChild(tr);
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

        function renderDashboard() {
            actualizarResumen();
            renderProximasCitas();
            renderActividadReciente();
        }

        /**
         * Renderiza la lista de próximas citas en el dashboard.
         */
        function renderProximasCitas() {
            if (!proximasCitasContainer) return;

            const hoy = new Date().toISOString().split('T')[0];
            const proximas = citas
                .filter(c => c.fecha >= hoy && c.estado === 'pendiente')
                .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
                .slice(0, 5);

            proximasCitasContainer.innerHTML = '';
            if (proximas.length === 0) {
                proximasCitasContainer.innerHTML = '<li class="list-group-item text-center text-muted">No hay citas pendientes próximas.</li>';
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
                    <button class="btn btn-sm btn-outline-primary" onclick="abrirEditarModal(${cita.id})"><i class="fas fa-eye"></i></button>
                `;
                proximasCitasContainer.appendChild(li);
            });
        }

        /**
         * Renderiza la lista de actividad reciente en el dashboard.
         */
        function renderActividadReciente() {
            if (!actividadRecienteContainer) return;

            const recientes = [...citas].sort((a, b) => b.id - a.id).slice(0, 5);
            actividadRecienteContainer.innerHTML = '';

            recientes.forEach(cita => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<strong>${cita.nombreCliente}</strong> - Cita ${cita.estado === 'pendiente' ? 'creada' : 'actualizada a ' + cita.estado} para el ${formatearFechaParaVisualizacion(cita.fecha)}.`;
                actividadRecienteContainer.appendChild(li);
            });
        }

        /**
         * Obtiene las citas filtradas según los controles de la UI.
         * @returns {Array<object>} Un array con las citas que cumplen los criterios de filtro.
         */
        function obtenerCitasFiltradas() {
            const busquedaTermino = (filtroBusquedaInput.value || '').toLowerCase().trim();
            const estadosActivos = [...grupoFiltros.querySelectorAll('button.active')].map(btn => btn.dataset.estado);
            const todasActivo = estadosActivos.includes('todas');
            const fechaFiltro = filtroFechaInput.value;
            const mesFiltro = filtroMesSelect.value;
            const anioFiltro = filtroAnioSelect.value;
            const facturadoFiltro = filtroFacturadoInput.checked;

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
         * Renderiza la lista de clientes
         */
        function renderClientes() {
            if (!listaClientes) return;
            listaClientes.innerHTML = '';
            const filtro = (filtroClientes.value || '').toLowerCase();
            
            const clientesFiltrados = clientes.filter(c => 
                c.nombre.toLowerCase().includes(filtro) || 
                (c.telefono && c.telefono.includes(filtro))
            ).sort((a, b) => a.nombre.localeCompare(b.nombre));

            if (clientesFiltrados.length === 0 && !filtro) {
                listaClientes.innerHTML = '<div class="list-group-item text-center text-muted">No se encontraron clientes.</div>';
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
                listaClientes.appendChild(item);
            });
        }


        /**
         * Muestra el historial de un cliente seleccionado
         * @param {number} clienteId - El ID del cliente
         */
        function mostrarHistorialCliente(clienteId) {
            const cliente = clientes.find(c => c.id === clienteId);
            if (!cliente) return;

            placeholderCliente.style.display = 'none';
            historialClienteContainer.style.display = 'block';

            // --- Poblar Cabecera y Resumen ---
            nombreClienteHistorial.textContent = sanitizeHTML(cliente.nombre);
            telefonoClienteHistorial.textContent = sanitizeHTML(cliente.telefono);
            emailClienteHistorial.textContent = sanitizeHTML(cliente.email) || 'No registrado';

            const citasCliente = citas.filter(c => c.telefono === cliente.telefono).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            const totalFacturado = citasCliente.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
            const ultimaVisita = citasCliente.length > 0 ? formatearFechaParaVisualizacion(citasCliente[0].fecha) : 'N/A';

            clienteTotalCitas.textContent = citasCliente.length;
            clienteTotalFacturado.textContent = formatearMonto(totalFacturado);
            clienteUltimaVisita.textContent = ultimaVisita;

            // --- Renderizar Pestañas ---
            renderHistorialCitasCliente(citasCliente);
            renderVehiculosCliente(cliente);
            renderMecanicosCliente(citasCliente);
            
            // --- Poblar Notas ---
            notasClienteText.value = cliente.notes || '';

            // --- Asignar Event Listeners ---
            // (Se usa .onclick para sobreescribir listeners anteriores y evitar fugas de memoria)
            btnEditarCliente.onclick = () => abrirModalCliente(cliente.id);
            btnAbrirModalWhatsapp.onclick = () => abrirModalWhatsapp(cliente.id);
            btnGuardarNotasCliente.onclick = () => guardarNotasCliente(cliente.id);
            btnNuevoVehiculo.onclick = () => abrirModalVehiculo(cliente.id);
        }

        function abrirModalWhatsapp(clienteId) {
            const cliente = clientes.find(c => c.id === clienteId);
            if (!cliente) return;

            const whatsappModalEl = document.getElementById('whatsappModal');
            const whatsappModal = new bootstrap.Modal(whatsappModalEl);

            document.getElementById('whatsappClienteId').value = cliente.id;
            document.getElementById('whatsappNombreCliente').textContent = cliente.nombre;

            const templateSelect = document.getElementById('whatsappTemplateSelect');
            templateSelect.innerHTML = `
                <option value="recordatorio">Recordatorio de Cita</option>
                <option value="seguimiento">Seguimiento (Reagendar)</option>
                <option value="postventa">Post-Venta</option>
                <option value="personalizado">Mensaje Personalizado</option>
            `;

            // Función para actualizar el textarea
            const actualizarMensaje = () => {
                const tipoPlantilla = templateSelect.value;
                const citasCliente = citas.filter(c => c.telefono === cliente.telefono).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                const ultimaCita = citasCliente[0] || {}; // Usar la última cita para los datos
                let plantilla = '';
                switch(tipoPlantilla) {
                    case 'recordatorio': plantilla = configuracion.plantillaWhatsapp; break;
                    case 'seguimiento': plantilla = configuracion.plantillaReagendar; break;
                    case 'postventa': plantilla = configuracion.plantillaPostVenta; break;
                    default: plantilla = '';
                }
                document.getElementById('whatsappMessageText').value = reemplazarPlaceholders(plantilla, { ...ultimaCita, nombreCliente: cliente.nombre });
            };

            templateSelect.onchange = actualizarMensaje;
            actualizarMensaje(); // Cargar el primer mensaje

            document.getElementById('btnAbrirEnWhatsapp').onclick = () => {
                const mensaje = document.getElementById('whatsappMessageText').value;
                abrirWhatsApp(cliente.telefono, mensaje);
            };
            document.getElementById('btnCopiarMensajeWhatsapp').onclick = () => {
                const mensaje = document.getElementById('whatsappMessageText').value;
                copiarAlPortapapeles(mensaje);
            };

            whatsappModal.show();
        }

        function renderVehiculosCliente(cliente) {
            listaVehiculosCliente.innerHTML = '';
            if (!cliente.vehicles || cliente.vehicles.length === 0) {
                listaVehiculosCliente.innerHTML = '<p class="text-muted text-center mt-3">No hay vehículos registrados para este cliente.</p>';
                return;
            }

            cliente.vehicles.forEach(vehiculo => {
                const card = document.createElement('div');
                card.className = 'card mb-2 vehicle-card';
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
                                <button class="btn btn-xs btn-outline-secondary" onclick="abrirModalVehiculo(${cliente.id}, ${vehiculo.id})"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-xs btn-outline-danger" onclick="eliminarVehiculo(${cliente.id}, ${vehiculo.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                listaVehiculosCliente.appendChild(card);
            });
        }

        /**
         * Renderiza la lista de mecánicos que han trabajado con un cliente.
         * @param {Array<object>} citasCliente - Las citas del cliente.
         */
        function renderMecanicosCliente(citasCliente) {
            const container = document.getElementById('listaMecanicosCliente');
            if (!container) return;

            const mecanicosTrabajos = {};

            citasCliente.forEach(cita => {
                // Usar un Set para evitar contar a un mecánico dos veces en la misma cita si hizo chequeo y trabajo
                const idsMecanicosUnicos = new Set([
                    ...(cita.mecanicosChequeo || []),
                    ...(cita.mecanicosTrabajo || [])
                ]);

                if (idsMecanicosUnicos.size > 0) {
                    idsMecanicosUnicos.forEach(mecanicoId => {
                        if (!mecanicosTrabajos[mecanicoId]) {
                            const mecanicoInfo = mecanicos.find(m => m.id === mecanicoId);
                            if (mecanicoInfo) {
                                mecanicosTrabajos[mecanicoId] = {
                                    ...mecanicoInfo,
                                    trabajos: 0
                                };
                            }
                        }
                        if (mecanicosTrabajos[mecanicoId]) {
                            mecanicosTrabajos[mecanicoId].trabajos++;
                        }
                    });
                }
            });

            const listaMecanicos = Object.values(mecanicosTrabajos);

            if (listaMecanicos.length === 0) {
                container.innerHTML = '<p class="text-muted text-center mt-3">No se han asignado mecánicos a los trabajos de este cliente.</p>';
                return;
            }

            container.innerHTML = '';
            listaMecanicos.forEach(mecanico => {
                const card = document.createElement('div');
                card.className = 'card mb-2';
                card.innerHTML = `
                    <div class="card-body p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title mb-1">${sanitizeHTML(mecanico.nombre)}</h6>
                            <p class="card-text small text-muted mb-0">
                                Especialidad: ${sanitizeHTML(mecanico.especialidad) || 'General'}
                            </p>
                        </div>
                        <span class="badge bg-info rounded-pill">${mecanico.trabajos} trabajo(s)</span>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function guardarNotasCliente(clienteId) {
            const clienteIndex = clientes.findIndex(c => c.id === clienteId);
            if (clienteIndex > -1) {
                clientes[clienteIndex].notes = notasClienteText.value;
                guardarClientes();
                mostrarMensaje('Notas del cliente guardadas.', 'success');
            }
        }

        let clienteIdActualParaVehiculo = null;

        function abrirModalVehiculo(clienteId, vehiculoId = null) {
            clienteIdActualParaVehiculo = clienteId;
            vehiculoForm.reset();
            document.getElementById('vehiculoClienteId').value = clienteId;

            if (vehiculoId) {
                // Editar vehículo existente
                const cliente = clientes.find(c => c.id === clienteId);
                const vehiculo = cliente.vehicles.find(v => v.id === vehiculoId);
                if (vehiculo) {
                    document.getElementById('vehiculoModalTitulo').textContent = 'Editar Vehículo';
                    document.getElementById('vehiculoId').value = vehiculo.id;
                    document.getElementById('vehiculoMarca').value = vehiculo.marca;
                    document.getElementById('vehiculoModelo').value = vehiculo.modelo;
                    document.getElementById('vehiculoAnio').value = vehiculo.anio;
                    document.getElementById('vehiculoTrim').value = vehiculo.trim || '';
                    document.getElementById('vehiculoRegion').value = vehiculo.region || '';
                    document.getElementById('vehiculoCombustible').value = vehiculo.combustible || '';
                    document.getElementById('vehiculoPlaca').value = vehiculo.placa || '';
                    document.getElementById('vehiculoVin').value = vehiculo.vin || '';
                }
            } else {
                // Añadir nuevo vehículo
                document.getElementById('vehiculoModalTitulo').textContent = 'Añadir Vehículo';
                document.getElementById('vehiculoId').value = '';
            }
            vehiculoModal.show();
        }

        function renderHistorialCitasCliente(citasCliente) {
            let historialHtml = '<table class="table table-sm table-hover"><thead><tr><th>Fecha</th><th>Servicio</th><th>Vehículo</th><th class="text-center">Estado</th><th class="text-end">Monto</th><th class="text-center">Acciones</th></tr></thead><tbody>';
            if (citasCliente.length === 0) {
                historialHtml += '<tr><td colspan="5" class="text-center">Este cliente no tiene citas registradas.</td></tr>';
            } else {
                citasCliente.forEach(cita => {
                    historialHtml += `<tr>
                        <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                        <td>${sanitizeHTML(cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio)}</td>
                        <td>${sanitizeHTML(cita.marca)} ${sanitizeHTML(cita.modelo)} (${cita.anio})</td>
                        <td class="text-center"><span class="${getBadgeClass(cita.estado)}">${capitalizar(cita.estado.replace('_', ' '))}</span></td>
                        <td class="text-end">${cita.facturado ? formatearMonto(cita.monto) : 'N/A'}</td>
                        <td class="text-center"><button class="btn btn-xs btn-outline-primary" onclick="abrirEditarModal(${cita.id})"><i class="fas fa-eye"></i></button></td>
                    </tr>`;
                });
            }
            historialHtml += '</tbody></table>';
            tablaHistorialCliente.innerHTML = historialHtml;
        }

        /**
         * Renderiza el calendario de citas.
         */
        function renderCalendario() {
            if (!calendarioEl) return;

            // No renderizar el calendario si su contenedor no está visible.
            // Esto evita problemas de layout cuando la pestaña está oculta en la carga inicial.
            if (calendarioEl.offsetParent === null) {
                return;
            }

            // Transformar citas a eventos de FullCalendar
            const eventos = citas.map(cita => {
                const agente = agentes.find(a => a.id == cita.agente) || { nombre: 'N/A' };
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
            if (calendario) {
                calendario.destroy();
            }

            calendario = new FullCalendar.Calendar(calendarioEl, {
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
                        
                        // Formatear fecha a YYYY-MM-DD
                        const nuevaFecha = nuevaFechaHora.getFullYear() + '-' + 
                                           ('0' + (nuevaFechaHora.getMonth() + 1)).slice(-2) + '-' + 
                                           ('0' + nuevaFechaHora.getDate()).slice(-2);

                        // Formatear hora a HH:mm
                        const nuevaHora = ('0' + nuevaFechaHora.getHours()).slice(-2) + ':' + 
                                          ('0' + nuevaFechaHora.getMinutes()).slice(-2);

                        citas[index].fecha = nuevaFecha;
                        // Si se arrastra a una vista de día completo (como el mes), la hora se resetea a 00:00.
                        // En ese caso, conservamos la hora original de la cita.
                        // Solo actualizamos la hora si la nueva hora no es medianoche.
                        if (nuevaHora !== '00:00') {
                            citas[index].hora = nuevaHora;
                        }

                        guardarCitas();
                        renderCitas(); // Re-renderiza todo para mantener la consistencia
                        
                        mostrarMensaje(`La cita de ${citas[index].nombreCliente} ha sido reagendada.`, 'info');
                    } else {
                        info.revert();
                        mostrarMensaje('Hubo un error al actualizar la cita.', 'danger');
                    }
                }
            });

            calendario.render();
        }

        /**
         * Sincroniza la vista del calendario con los filtros de fecha activos.
         */
        function sincronizarCalendarioConFiltros() {
            if (!calendario) return;

            const fechaFiltro = filtroFechaInput.value;
            const mesFiltro = filtroMesSelect.value;
            const anioFiltro = filtroAnioSelect.value;

            // Solo actuar si hay un filtro de fecha
            if (fechaFiltro) {
                // Se añade T12:00 para evitar que la fecha se interprete como UTC a medianoche,
                // lo que causaría que se muestre el día anterior en algunas zonas horarias.
                calendario.gotoDate(fechaFiltro + 'T12:00:00');
                calendario.changeView('timeGridDay');
            } else if (mesFiltro && anioFiltro) {
                calendario.gotoDate(`${anioFiltro}-${mesFiltro}-01`);
                calendario.changeView('dayGridMonth');
            } else if (anioFiltro) {
                calendario.gotoDate(`${anioFiltro}-01-01`);
                calendario.changeView('dayGridMonth');
            }
        }

        /**
         * Actualiza el panel de resumen
         */
        function actualizarResumen() {
            const hoy = new Date().toISOString().split('T')[0];
            
            const totalCitas = citas.length;
            const citasHoy = citas.filter(c => c.fecha === hoy).length;
            const citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
            const montoTotal = citas.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
            
            if (document.getElementById('resumenTotal')) {
                document.getElementById('resumenTotal').textContent = totalCitas;
                document.getElementById('resumenHoy').textContent = citasHoy;
                document.getElementById('resumenPendientes').textContent = citasPendientes;
                document.getElementById('resumenFacturado').textContent = formatearMonto(montoTotal);
            }
        }

        /**
         * Obtiene las citas filtradas específicamente para los reportes.
         * @returns {Array<object>} Un array con las citas que cumplen los criterios de filtro de reportes.
         */
        function obtenerCitasFiltradasParaReportes() {
            const fechaInicio = filtroReporteFechaInicioInput.value;
            const fechaFin = filtroReporteFechaFinInput.value;
            const agenteId = filtroReporteAgenteSelect.value;
            const servicioFiltro = filtroReporteServicioSelect.value;
                const regionFiltro = filtroReporteRegionSelect.value;
                const combustibleFiltro = filtroReporteCombustibleSelect.value;
            const estadosActivos = [...grupoFiltrosReportes.querySelectorAll('button.active')].map(btn => btn.dataset.estado);
            const todasActivo = estadosActivos.includes('todas');
            const facturadoFiltro = filtroReporteFacturadoInput.checked;

            return citas.filter(cita => {
                const citaFecha = new Date(cita.fecha + 'T12:00:00');

                // Filtro por rango de fechas
                if (fechaInicio && citaFecha < new Date(fechaInicio + 'T12:00:00')) return false;
                if (fechaFin && citaFecha > new Date(fechaFin + 'T12:00:00')) return false;

                // Filtro por agente
                if (agenteId && cita.agente != agenteId) return false;

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
        function generarGraficoEstados(citasParaReportes) {
            const ctx = document.getElementById('estadoChart');
            if (!ctx) return;
            
            const estados = ['pendiente', 'recibido', 'completada', 'reagendada', 'no_asistio', 'cancelada'];
            const conteoEstados = {};
            
            estados.forEach(estado => {
                conteoEstados[estado] = citasParaReportes.filter(c => c.estado === estado).length;
            });
            
            // Destruir gráfico anterior si existe
            if (estadoChart) {
                estadoChart.destroy();
            }
            
            estadoChart = new Chart(ctx, {
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
        function generarReportes() {
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
            generarGraficoFuenteCitas(citasParaReportes);
            generarReporteProductividadMecanicos(citasParaReportes);
        }

        /**
         * Genera el gráfico de facturación mensual
         */
        function generarGraficoFacturacion(citasParaReportes) {
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
            if (facturacionChart) {
                facturacionChart.destroy();
            }
            
            facturacionChart = new Chart(ctx, {
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
        function generarTablaReportes(citasParaReportes) {
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
        function generarGraficoServiciosPopulares(citasParaReportes) {
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

            if (serviciosPopularesChart) serviciosPopularesChart.destroy();

            serviciosPopularesChart = new Chart(ctx, {
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
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { 
                        y: { 
                            beginAtZero: true 
                        } 
                    }
                }
            });
        }

        /**
         * Genera el gráfico de distribución por origen de vehículo.
         */
        function generarGraficoOrigenVehiculos(citasParaReportes) {
            const ctx = document.getElementById('origenVehiculoChart');
            if (!ctx) return;

            const conteoOrigen = {};
            citasParaReportes.forEach(cita => {
                const origen = cita.region || 'No especificado';
                conteoOrigen[origen] = (conteoOrigen[origen] || 0) + 1;
            });

            const etiquetas = Object.keys(conteoOrigen);
            const valores = Object.values(conteoOrigen);

            if (origenVehiculoChart) origenVehiculoChart.destroy();

            origenVehiculoChart = new Chart(ctx, {
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
         * Genera el gráfico de distribución por fuente de cita.
         */
        function generarGraficoFuenteCitas(citasParaReportes) {
            const ctx = document.getElementById('fuenteCitasChart');
            if (!ctx) return;

            const conteoFuente = {};
            
            // Contar las fuentes desde las citas filtradas
            citasParaReportes.forEach(cita => {
                const fuente = cita.fuente || 'Otro'; // Usar 'Otro' como fallback
                conteoFuente[fuente] = (conteoFuente[fuente] || 0) + 1;
            });

            // Ordenar por cantidad para mostrar los más relevantes
            const fuentesOrdenadas = Object.entries(conteoFuente).sort((a, b) => b[1] - a[1]);

            const etiquetas = fuentesOrdenadas.map(item => item[0]);
            const valores = fuentesOrdenadas.map(item => item[1]);

            // Paleta de colores para reutilizar
            const colorPalette = ['#25D366', '#3498db', '#010101', '#E4405F', '#f1c40f', '#95a5a6', '#e74c3c', '#9b59b6', '#34495e', '#1abc9c'];
            const backgroundColors = etiquetas.map((_, index) => colorPalette[index % colorPalette.length]);


            if (fuenteCitasChart) fuenteCitasChart.destroy();

            fuenteCitasChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        data: valores,
                        backgroundColor: backgroundColors,
                        borderColor: '#fff'
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
        function generarTablaReporteServicios(citasParaReportes) {
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
         * Genera la tabla de reporte de productividad de mecánicos.
         * @param {Array<object>} citasParaReportes - Las citas filtradas para el reporte.
         */
        function generarReporteProductividadMecanicos(citasParaReportes) {
            const tablaBody = document.getElementById('tablaReportesMecanicos');
            if (!tablaBody) return;

            const productividad = {};

            // Inicializar objeto de productividad para todos los mecánicos
            mecanicos.forEach(mecanico => {
                productividad[mecanico.id] = {
                    nombre: mecanico.nombre,
                    chequeos: 0,
                    Trabajos: 0,
                    totalFacturado: 0
                };
            });

            // Filtrar solo trabajos completados dentro del rango del reporte
            const trabajosCompletados = citasParaReportes.filter(c => c.estado === 'completada');

            // Iterar sobre los trabajos para atribuir valor a cada mecánico
            trabajosCompletados.forEach(cita => {
                // Atribuir chequeos
                if (cita.mecanicosChequeo && cita.mecanicosChequeo.length > 0) {
                    cita.mecanicosChequeo.forEach(mecanicoId => {
                        if (productividad[mecanicoId]) {
                            productividad[mecanicoId].chequeos++;
                        }
                    });
                }

                // Atribuir trabajos y el valor facturado
                if (cita.mecanicosTrabajo && cita.mecanicosTrabajo.length > 0) {
                    const valorPorMecanico = (cita.facturado && cita.monto > 0) ?
                        (cita.monto || 0) / cita.mecanicosTrabajo.length :
                        0;

                    cita.mecanicosTrabajo.forEach(mecanicoId => {
                        if (productividad[mecanicoId]) {
                            productividad[mecanicoId].Trabajos++;
                            productividad[mecanicoId].totalFacturado += valorPorMecanico;
                        }
                    });
                }
            });

            const mecanicosOrdenados = Object.values(productividad).sort((a, b) => (b.chequeos + b.Trabajos) - (a.chequeos + a.Trabajos));

            tablaBody.innerHTML = '';
            mecanicosOrdenados.forEach(datos => {
                const totalTrabajos = datos.chequeos + datos.Trabajos;
                const montoPromedio = totalTrabajos > 0 ? datos.totalFacturado / totalTrabajos : 0;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${sanitizeHTML(datos.nombre)}</strong></td>
                    <td class="text-center">${datos.chequeos}</td>
                    <td class="text-center">${datos.Trabajos}</td>
                    <td>${formatearMonto(datos.totalFacturado)}</td>
                    <td>${formatearMonto(montoPromedio)}</td>
                `;
                tablaBody.appendChild(tr);
            });
        }

        /**
         * Renderiza la tabla de seguimiento post-venta.
         */
        function renderPostVenta() {
            if (!listaPostVentaUnificada) return;

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const LIMITE_DIAS_INICIO = 3; // Empezar seguimiento después de 3 días
            const agenteIdFiltro = filtroPostVentaAgente.value;
            const fechaInicioPostVenta = filtroPostVentaInicio.value;
            const fechaFinPostVenta = filtroPostVentaFin.value;

            const filtroActivo = document.querySelector('#filtrosPostVentaEstado .btn.active').dataset.filtro;
            theadPostVenta.innerHTML = '';
            listaPostVentaUnificada.innerHTML = '';

            // Citas que necesitan seguimiento post-venta
            const citasParaPostVenta = citas.filter(cita => {
                if (cita.estado !== 'completada') return false;
                if (agenteIdFiltro && cita.agente != agenteIdFiltro) return false;
                if (cita.postVenta.status !== 'pending') return false;

                const fechaCita = new Date(cita.fecha + 'T12:00:00');
                const diffTiempo = hoy.getTime() - fechaCita.getTime();
                const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

                // Debe tener al menos 3 días de completada
                if (diffDias < LIMITE_DIAS_INICIO) return false;

                // Filtro por rango de fechas manual sobre la fecha de la cita
                const fechaCitaStr = cita.fecha; // YYYY-MM-DD
                if (fechaInicioPostVenta && fechaCitaStr < fechaInicioPostVenta) return false;
                if (fechaFinPostVenta && fechaCitaStr > fechaFinPostVenta) return false;

                return true;
            }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Mostrar las más antiguas primero

            // Citas ya contactadas en el período
            const citasYaContactadas = citas.filter(cita => {
                if (cita.estado !== 'completada') return false;
                if (agenteIdFiltro && cita.agente != agenteIdFiltro) return false;
                if (cita.postVenta.status === 'pending') return false; // Mostrar todos los que no estén pendientes

                // BUG FIX: Filtrar por la fecha de contacto, no la fecha de la cita, para que coincida con el título "Contactados (90 días)"
                if (!cita.postVenta.lastContact) return false; // Debe tener una fecha de contacto para estar en esta lista

                // Filtro por rango de fechas manual
                const fechaContacto = cita.postVenta.lastContact; // YYYY-MM-DD
                if (fechaInicioPostVenta && fechaContacto < fechaInicioPostVenta) return false;
                if (fechaFinPostVenta && fechaContacto > fechaFinPostVenta) return false;

                return true;
            }).sort((a, b) => new Date(b.postVenta.lastContact) - new Date(a.postVenta.lastContact));

            // Actualizar contador de contactados
            const porContactarEl = document.getElementById('postVentaPorContactar');
            const contactadosEl = document.getElementById('postVentaContactados');
            if (contactadosEl) {
                porContactarEl.textContent = citasParaPostVenta.length;
                contactadosEl.textContent = citasYaContactadas.length;
            }

            if (filtroActivo === 'pending') {
                theadPostVenta.innerHTML = '<tr><th>Cliente</th><th>Fecha Servicio</th><th>Servicio Realizado</th><th class="text-center">Acciones</th></tr>';
                if (citasParaPostVenta.length === 0) {
                    listaPostVentaUnificada.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay clientes por contactar en este rango.</td></tr>';
                } else {
                    citasParaPostVenta.forEach(cita => {
                        const tr = document.createElement('tr');
                        const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
                        tr.innerHTML = `
                            <td>${cita.nombreCliente || 'N/A'} <br><small class="text-muted">${cita.telefono || ''}</small></td>
                            <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                            <td>${servicio}</td>
                            <td class="text-center">
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-info" title="Registrar Feedback" onclick="abrirModalNotasPostVenta(${cita.id})">
                                        <i class="fas fa-comment-dots"></i>
                                    </button>
                                    <button class="btn btn-secondary" title="Copiar Mensaje" onclick="copiarMensajeWhatsApp(${cita.id}, 'postventa')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <a href="${generarLinkWhatsApp(cita, 'postventa')}" target="_blank" class="btn btn-success" title="Contactar por WhatsApp">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </td>
                        `;
                        listaPostVentaUnificada.appendChild(tr);
                    });
                }
            } else { // 'contacted'
                theadPostVenta.innerHTML = '<tr><th>Cliente</th><th>Fecha Servicio</th><th>Servicio</th><th class="text-center">Satisfacción</th><th>Notas</th><th class="text-center">Acciones</th></tr>';
                if (citasYaContactadas.length === 0) {
                    listaPostVentaUnificada.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay clientes contactados en este rango.</td></tr>';
                } else {
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
                            <td class="text-center">
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-secondary" title="Ver/Editar Feedback" onclick="abrirModalNotasPostVenta(${cita.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-secondary" title="Copiar Mensaje" onclick="copiarMensajeWhatsApp(${cita.id}, 'postventa')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <a href="${generarLinkWhatsApp(cita, 'postventa')}" target="_blank" class="btn btn-success" title="Contactar por WhatsApp">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </td>
                        `;
                        listaPostVentaUnificada.appendChild(tr);
                    });
                }
            }
        }

        /**
         * Abre el modal para agregar o editar notas de post-venta.
         */
        window.abrirModalNotasPostVenta = function(id) {
            const cita = citas.find(c => c.id === id);
            if (cita) {
                document.getElementById('postVentaCitaId').value = id;
                document.getElementById('postVentaNombreCliente').textContent = cita.nombreCliente;
                document.getElementById('postVentaNotasText').value = cita.postVenta.notes || '';
                // Reset and set satisfaction radio
                document.querySelectorAll('input[name="satisfaccion"]').forEach(radio => radio.checked = false);
                if (cita.postVenta.satisfaction) {
                    document.getElementById(`satisfaccion_${cita.postVenta.satisfaction}`).checked = true;
                }
                const modal = new bootstrap.Modal(postVentaNotasModalEl);
                modal.show();
            }
        }

        /**
         * Guarda las notas de post-venta desde el modal.
         */
        function guardarNotasPostVenta() {
            const id = parseInt(document.getElementById('postVentaCitaId').value);
            const satisfaccion = document.querySelector('input[name="satisfaccion"]:checked')?.value || null;
            const notas = document.getElementById('postVentaNotasText').value;
            const citaIndex = citas.findIndex(c => c.id === id);
            if (citaIndex > -1) {
                citas[citaIndex].postVenta.status = 'contacted';
                citas[citaIndex].postVenta.satisfaction = satisfaccion;
                citas[citaIndex].postVenta.notes = notas;
                citas[citaIndex].postVenta.lastContact = new Date().toISOString().split('T')[0];
                guardarCitas();
                renderPostVenta();
                bootstrap.Modal.getInstance(postVentaNotasModalEl).hide();
                mostrarMensaje('Notas de post-venta guardadas.', 'success');
            }
        }

        /**
         * Reemplaza los placeholders en una plantilla de mensaje con los datos de la cita.
         * @param {string} plantilla - La plantilla de texto.
         * @param {object} cita - El objeto de la cita.
         * @returns {string} El mensaje con los placeholders reemplazados.
         */
        function reemplazarPlaceholders(plantilla, cita) {
            if (!plantilla) return '';
            return plantilla
                .replace(/{cliente}/g, cita.nombreCliente || '')
                .replace(/{marca}/g, cita.marca || '')
                .replace(/{servicio}/g, cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio)
                .replace(/{modelo}/g, cita.modelo || '')
                .replace(/{fecha}/g, formatearFechaParaVisualizacion(cita.fecha) || '')
                .replace(/{hora}/g, cita.hora || '')
                .replace(/{nombreEmpresa}/g, configuracion.nombreEmpresa || '');
        }

        /**
         * Abre una URL de WhatsApp en una nueva pestaña.
         * @param {string} telefono - El número de teléfono del destinatario.
         * @param {string} mensaje - El mensaje a enviar.
         */
        function abrirWhatsApp(telefono, mensaje) {
            const numero = telefono.replace(/\D/g, '');
            const numeroConCodigo = numero.startsWith('1') ? numero : `1${numero}`;
            const url = `whatsapp://send?phone=${numeroConCodigo}&text=${encodeURIComponent(mensaje)}`;
            window.location.href = url;
        }

        /**
         * Pone en mayúscula la primera letra de una cadena.
         * @param {string} str - La cadena a capitalizar.
         * @returns {string} La cadena capitalizada.
         */
        function capitalizar(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        /**
         * Renderiza la tabla de seguimiento de clientes.
         */
        function renderSeguimiento() {
            if (!listaSeguimientoUnificada) return;
 
            const filtroActivo = document.querySelector('#filtrosSeguimientoEstado .btn.active').dataset.filtro;
            theadSeguimiento.innerHTML = '';
            listaSeguimientoUnificada.innerHTML = '';

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparaciones de día
            const DIAS_LIMITE_RECIBIDO = configuracion.seguimientoDiasRecibido || 3;
            const agenteIdFiltro = filtroSeguimientoAgente.value;
             const fechaInicioSeguimiento = filtroSeguimientoInicio.value;
             const fechaFinSeguimiento = filtroSeguimientoFin.value;
 
            // --- Lista "Por Contactar" ---
            const porContactar = citas.filter(cita => {
                // Filtro por agente
                if (agenteIdFiltro && cita.agente != agenteIdFiltro) return false;
                
                // Solo considerar citas con seguimiento pendiente
                if (!cita.seguimiento || cita.seguimiento.status !== 'pending') return false;

                const fechaCita = new Date(cita.fecha + 'T12:00:00');
                const diffTiempo = hoy.getTime() - fechaCita.getTime();
                const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
 
                // Condición 1: Cancelada o No Asistió (dentro del rango seleccionado)
                const esCanceladoNoAsistio = (cita.estado === 'cancelada' || cita.estado === 'no_asistio');
 
                // Condición 2: Recibida pero estancada (sin facturar) por más de X días (y dentro del rango)
                const esRecibidoEstancado = cita.estado === 'recibido' && !cita.facturado && diffDias > DIAS_LIMITE_RECIBIDO;

                if (esCanceladoNoAsistio) cita.motivoSeguimiento = capitalizar(cita.estado.replace('_', ' '));
                if (esRecibidoEstancado) cita.motivoSeguimiento = 'Recibido (sin completar)';

                return esCanceladoNoAsistio || esRecibidoEstancado;
            }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Mostrar las más antiguas primero

            // --- Lista "Contactados" ---
            const contactados = citas.filter(cita => {
               // Filtro por agente
               if (agenteIdFiltro && cita.agente != agenteIdFiltro) return false;

               // Debe tener un estado de seguimiento que no sea 'pending'
               if (!cita.seguimiento || cita.seguimiento.status === 'pending') return false;

               // Debe tener una fecha de último contacto
               if (!cita.seguimiento.lastContact) return false;

                // Filtro por rango de fechas manual
                const fechaContacto = cita.seguimiento.lastContact; // YYYY-MM-DD
                if (fechaInicioSeguimiento && fechaContacto < fechaInicioSeguimiento) return false;
                if (fechaFinSeguimiento && fechaContacto > fechaFinSeguimiento) return false;

                return true;
            }).sort((a, b) => new Date(b.seguimiento.lastContact) - new Date(a.seguimiento.lastContact));
 
             // Actualizar los contadores
             const porContactarEl = document.getElementById('seguimientoPorContactar');
             const contactadosEl = document.getElementById('seguimientoContactados');
             if (porContactarEl && contactadosEl) {
                 porContactarEl.textContent = porContactar.length;
                 contactadosEl.textContent = contactados.length;
             }
  
            if (filtroActivo === 'pending') {
                theadSeguimiento.innerHTML = '<tr><th>Cliente</th><th>Fecha Original</th><th>Motivo</th><th class="text-center">Acciones</th></tr>';
                if (porContactar.length === 0) {
                    listaSeguimientoUnificada.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay clientes por contactar.</td></tr>';
                } else {
                    porContactar.forEach(cita => {
                        const tr = document.createElement('tr');
                        const badgeClass = cita.motivoSeguimiento === 'Recibido (sin completar)' ? getBadgeClass('recibido') : getBadgeClass(cita.estado);
                        tr.innerHTML = `
                            <td>${cita.nombreCliente || 'N/A'} <br><small class="text-muted">${cita.telefono || ''}</small></td>
                            <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                            <td><span class="${badgeClass}">${cita.motivoSeguimiento}</span></td>
                            <td class="text-center">
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-info" title="Registrar Contacto" onclick="abrirModalNotas(${cita.id})">
                                        <i class="fas fa-phone-alt"></i>
                                    </button>
                                    <button class="btn btn-secondary" title="Copiar Mensaje" onclick="copiarMensajeWhatsApp(${cita.id}, 'seguimiento')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <a href="${generarLinkWhatsApp(cita, 'seguimiento')}" target="_blank" class="btn btn-success" title="Contactar por WhatsApp">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </td>
                        `;
                        listaSeguimientoUnificada.appendChild(tr);
                    });
                }
            } else { // 'contacted'
                theadSeguimiento.innerHTML = '<tr><th>Cliente</th><th>Fecha Cita Original</th><th class="text-center">Estado</th><th>Último Contacto</th><th>Notas</th><th class="text-center">Acciones</th></tr>';
                if (contactados.length === 0) {
                    listaSeguimientoUnificada.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay seguimientos contactados en este rango.</td></tr>';
                } else {
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
                            <td class="text-center">${estadoSeguimientoBadge}</td>
                            <td>${cita.seguimiento.lastContact ? formatearFechaParaVisualizacion(cita.seguimiento.lastContact) : 'N/A'}</td>
                            <td title="${sanitizeHTML(cita.seguimiento.notes)}">${sanitizeHTML(notasPreview)}</td>
                            <td class="text-center">
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-secondary" title="Ver/Editar Notas" onclick="abrirModalNotas(${cita.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-secondary" title="Copiar Mensaje" onclick="copiarMensajeWhatsApp(${cita.id}, 'seguimiento')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <a href="${generarLinkWhatsApp(cita, 'seguimiento')}" target="_blank" class="btn btn-success" title="Contactar por WhatsApp">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </td>
                        `;
                        listaSeguimientoUnificada.appendChild(tr);
                    });
                }
            }
         }

        /**
         * Abre el modal para agregar o editar notas de seguimiento.
         * @param {number} id - El ID de la cita.
         */
        window.abrirModalNotas = function(id) {
            const cita = citas.find(c => c.id === id);
            if (cita) {
                document.getElementById('seguimientoCitaId').value = id;
                document.getElementById('seguimientoNombreCliente').textContent = cita.nombreCliente;
                document.getElementById('seguimientoNotasText').value = cita.seguimiento.notes || '';
                document.getElementById('seguimientoResultadoSelect').value = cita.seguimiento.status === 'pending' ? 'contacted' : cita.seguimiento.status;
                const modal = new bootstrap.Modal(document.getElementById('seguimientoNotasModal'));
                modal.show();
            }
        }

        /**
         * Guarda las notas de seguimiento desde el modal.
         */
        function guardarNotasSeguimiento() {
            const id = parseInt(document.getElementById('seguimientoCitaId').value);
            const nuevoEstado = document.getElementById('seguimientoResultadoSelect').value;
            const notas = document.getElementById('seguimientoNotasText').value;
            const citaIndex = citas.findIndex(c => c.id === id);

            if (nuevoEstado.startsWith('closed') && !notas) {
                mostrarMensaje('Las notas son obligatorias para cerrar un seguimiento.', 'warning');
                return;
            }

            if (citaIndex > -1) {
                citas[citaIndex].seguimiento.status = nuevoEstado;
                citas[citaIndex].seguimiento.notes = notas;
                citas[citaIndex].seguimiento.lastContact = new Date().toISOString().split('T')[0];
                guardarCitas();
                renderSeguimiento();
                bootstrap.Modal.getInstance(document.getElementById('seguimientoNotasModal')).hide();
                mostrarMensaje('Interacción de seguimiento registrada.', 'success');
            }
        }

        /**
         * Formatea una fecha para visualización (DD/MM/YYYY)
         * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
         * @returns {string} Fecha formateada
         */
        function formatearFechaParaVisualizacion(fechaStr) {
            if (!fechaStr) return '';
            
            try {
                const partes = fechaStr.split('-');
                if (partes.length === 3) {
                    return `${partes[2]}/${partes[1]}/${partes[0]}`;
                }
                return fechaStr;
            } catch (e) {
                return fechaStr;
            }
        }

        /**
         * Formatea una fecha desde varios formatos posibles a YYYY-MM-DD
         * @param {string} fechaStr - Fecha en formato string
         * @returns {string} Fecha en formato YYYY-MM-DD
         */
        function formatearFecha(fechaStr) {
            if (!fechaStr) return new Date().toISOString().split('T')[0];
            
            try {
                // Probar formato DD/MM/YYYY
                if (fechaStr.includes('/')) {
                    const partes = fechaStr.split('/');
                    if (partes.length === 3) {
                        const day = partes[0].padStart(2, '0');
                        const month = partes[1].padStart(2, '0');
                        const year = partes[2];
                        return `${year}-${month}-${day}`;
                    }
                }
                
                // Probar formato MM/DD/YYYY
                if (fechaStr.includes('-')) {
                    const partes = fechaStr.split('-');
                    if (partes.length === 3) {
                        const day = partes[2].padStart(2, '0');
                        const month = partes[1].padStart(2, '0');
                        const year = partes[0];
                        return `${year}-${month}-${day}`;
                    }
                }
                
                // Intentar parsear como fecha
                const fecha = new Date(fechaStr);
                if (!isNaN(fecha.getTime())) {
                    return fecha.toISOString().split('T')[0];
                }
            } catch (e) {
                console.error("Error formateando fecha:", e);
            }
            
            return new Date().toISOString().split('T')[0];
        }

        /**
         * Normaliza una fecha a formato YYYY-MM-DD desde varios formatos posibles.
         * @param {string | Date} fechaInput - La fecha a normalizar.
         * @returns {string} Fecha en formato YYYY-MM-DD.
         */
        function normalizarFecha(fechaInput) {
            if (!fechaInput) return new Date().toISOString().split('T')[0];
            
            // Si ya es un objeto Date, lo formateamos
            if (fechaInput instanceof Date) {
                return fechaInput.toISOString().split('T')[0];
            }

            try {
                let fecha;
                if (String(fechaInput).includes('/')) {
                    const partes = fechaInput.split('/');
                    // Asumimos DD/MM/YYYY
                    if (partes.length === 3) {
                        // Asegurarse que el año tenga 4 dígitos
                        const anio = partes[2].length === 2 ? `20${partes[2]}` : partes[2];
                        // Se crea la fecha usando los componentes para forzar la zona horaria local
                        // y evitar la interpretación como UTC que causa el desfase de un día.
                        fecha = new Date(anio, partes[1] - 1, partes[0]);
                    }
                } else {
                    // Para YYYY-MM-DD, que se interpreta como UTC.
                    // Esto causa el problema del "retraso" de un día en zonas horarias detrás de UTC.
                    // Solución: Dividimos la fecha y la reconstruimos para forzar la zona horaria local.
                    const partes = String(fechaInput).split('T')[0].split('-');
                    if (partes.length === 3) {
                        // new Date(año, mes - 1, día) se interpreta en la zona horaria local.
                        fecha = new Date(partes[0], partes[1] - 1, partes[2]);
                    } else {
                        fecha = new Date(fechaInput); // Fallback para otros formatos
                    }
                }

                if (isNaN(fecha.getTime())) return new Date().toISOString().split('T')[0];

                const anio = fecha.getFullYear();
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const dia = String(fecha.getDate()).padStart(2, '0');
                
                return `${anio}-${mes}-${dia}`;

            } catch (e) {
                console.error("Error normalizando fecha:", fechaInput, e);
                return new Date().toISOString().split('T')[0];
            }
        }

        /**
         * Normaliza una hora a formato HH:mm.
         * @param {string} horaInput - La hora a normalizar.
         * @returns {string} Hora en formato HH:mm.
         */
        function normalizarHora(horaInput) {
            if (!horaInput) return '08:00';
            
            const horaStr = String(horaInput).toLowerCase();
            const match = horaStr.match(/(\d{1,2}):?(\d{2})?/);
            
            if (match) {
                let horas = parseInt(match[1], 10);
                const minutos = match[2] ? parseInt(match[2], 10) : 0;
                if (horaStr.includes('pm') && horas < 12) horas += 12;
                if (horaStr.includes('am') && horas === 12) horas = 0;
                return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
            }
            return '08:00';
        }

        /**
         * Agrega una nueva cita desde el formulario.
         * @param {Event} event - El evento de envío del formulario.
         */
        function agregarCita(event) {
            event.preventDefault();

            let fuenteCita = fuenteSelect.value;
            if (fuenteCita === '_otro_') {
                const nuevaFuenteNombre = otroFuenteInput.value;
                if (!nuevaFuenteNombre.trim()) {
                    mostrarMensaje('Por favor, especifique la nueva fuente.', 'warning');
                    otroFuenteInput.focus();
                    return;
                }
                fuenteCita = gestionarNuevaFuente(nuevaFuenteNombre);
                if (!fuenteCita) return; // Detener si la nueva fuente es inválida
            }

            const nuevaCita = {
                nombreCliente: document.getElementById('nombreCliente').value,
                telefono: document.getElementById('telefono').value,
                marca: document.getElementById('marca').value,
                modelo: document.getElementById('modelo').value,
                anio: document.getElementById('anio').value,
                region: document.getElementById('region').value,
                combustible: document.getElementById('combustible').value,
                trim: document.getElementById('trim').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                servicio: servicioSelect.value,
                notas: document.getElementById('notas').value,
                agente: agenteSelect.value,
                fuente: fuenteCita,
                estado: "pendiente",
                facturado: false,
                monto: 0,
                tieneCotizacion: "no_aplica",
                motivoCotizacion: "",
                otroServicio: servicioSelect.value === 'Otro' ? otroServicioInput.value : "",
                enCamino: false,
                esPromocion: document.getElementById('esPromocion').checked,
                precioRegular: parsearMonto(document.getElementById('precioRegular').value),
                precioPromocional: parsearMonto(document.getElementById('precioPromocional').value),
                mecanicosAsignados: [], // Nuevo campo para mecánicos
                seguimiento: { status: 'pending', lastContact: null, notes: '' },
                postVenta: { status: 'pending', lastContact: null, satisfaction: null, notes: '' }
            };

            const nuevoId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
            nuevaCita.id = nuevoId;

            citas.push(nuevaCita);
            guardarCitas();
            renderCitas();
            cargarFiltroAnios();
            cargarServiciosEnSelects();
            citaForm.reset();
            mostrarMensaje("Cita agregada con éxito.", "success");
            
            // Cambiar a la pestaña de gestión de citas
            document.getElementById('pills-citas-tab').click();
        }

        /**
         * Abre el modal de confirmación para eliminar una cita.
         * @param {number} id - El ID de la cita a eliminar.
         */
        function abrirConfirmacionEliminar(id) {
            citaIdAEliminar = id;
            const confirmarEliminarModal = new bootstrap.Modal(confirmarEliminarModalEl);
            confirmarEliminarModal.show();
        }

        /**
         * Elimina una cita de la lista.
         */
        function eliminarCita() {
            if (citaIdAEliminar !== null) {
                citas = citas.filter(cita => cita.id !== citaIdAEliminar);
                guardarCitas();
                renderCitas();
                cargarFiltroAnios();
                cargarServiciosEnSelects();
                mostrarMensaje("Cita eliminada correctamente.", "danger");
                bootstrap.Modal.getInstance(confirmarEliminarModalEl).hide();
                citaIdAEliminar = null;
            }
        }

        /**
         * Marca o desmarca una cita como 'en camino'.
         * @param {number} id - El ID de la cita.
         */
        function marcarEnCamino(id) {
            const index = citas.findIndex(c => c.id === id);
            if (index !== -1) {
                citas[index].enCamino = !citas[index].enCamino;
                guardarCitas();
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
        function abrirEditarModal(id) {
            const cita = citas.find(c => c.id === id);
            if (cita) {
                editarIdInput.value = cita.id;
                editarNombreClienteInput.value = cita.nombreCliente;
                editarTelefonoInput.value = cita.telefono;
                editarMarcaInput.value = cita.marca;
                editarModeloInput.value = cita.modelo;
                editarAnioInput.value = cita.anio;
                editarRegionSelect.value = cita.region || '';
                editarCombustibleSelect.value = cita.combustible || '';
                editarTrimInput.value = cita.trim || '';
                editarFechaInput.value = cita.fecha;
                editarHoraInput.value = cita.hora;
                editarServicioSelect.value = cita.servicio;
                if (cita.servicio === "Otro") {
                    editarOtroServicioContainer.style.display = '';
                    editarOtroServicioInput.value = cita.otroServicio || '';
                } else {
                    editarOtroServicioContainer.style.display = 'none';
                    editarOtroServicioInput.value = '';
                }
                editarNotasInput.value = cita.notas;
                editarAgenteInput.value = cita.agente || '';
                editarFuenteSelect.value = cita.fuente || '';
                // Ocultar el campo "otro" por defecto al abrir
                if (editarOtroFuenteContainer) {
                    editarOtroFuenteContainer.style.display = 'none';
                    editarOtroFuenteInput.value = '';
                    editarOtroFuenteInput.required = false;
                }
                editarEstadoSelect.value = cita.estado;
                editarFacturadoInput.checked = cita.facturado;
                editarMontoInput.value = cita.facturado ? cita.monto : '';
                editarTieneCotizacionSelect.value = cita.tieneCotizacion;
                if (cita.tieneCotizacion === "no") {
                    editarMotivoCotizacionContainer.style.display = '';
                    editarMotivoCotizacionInput.value = cita.motivoCotizacion || '';
                } else {
                    editarMotivoCotizacionContainer.style.display = 'none';
                    editarMotivoCotizacionInput.value = '';
                }
                
                editarEsPromocionCheck.checked = cita.esPromocion || false;
                editarPromoContainer.style.display = cita.esPromocion ? '' : 'none';
                if (cita.esPromocion) {
                    editarPrecioRegularInput.value = cita.precioRegular || '';
                    editarPrecioPromocionalInput.value = cita.precioPromocional || '';
                }

                // --- Asignación de Mecánicos ---
                renderMecanicosEnEditor(cita);
                const editarMecanicosContainer = document.getElementById('editarMecanicosContainer');
                editarMecanicosContainer.style.display = cita.estado === 'completada' ? 'block' : 'none';


                const editarCitaModal = new bootstrap.Modal(editarCitaModalEl);
                editarCitaModal.show();
            }
        }

        /**
         * Guarda los cambios de una cita editada.
         */
        function guardarEdicion() {
            const id = parseInt(editarIdInput.value);
            const citaOriginal = citas.find(c => c.id === id);
            const index = citas.findIndex(c => c.id === id);
            if (index !== -1) {
                const servicio = editarServicioSelect.value;
                const tieneCotizacion = editarTieneCotizacionSelect.value;
                const motivoCotizacion = tieneCotizacion === "no" ? editarMotivoCotizacionInput.value : "";

                let fuenteEditada = editarFuenteSelect.value;
                if (fuenteEditada === '_otro_') {
                    const nuevaFuenteNombre = editarOtroFuenteInput.value;
                    if (!nuevaFuenteNombre.trim()) {
                        mostrarMensaje('Por favor, especifique la nueva fuente.', 'warning');
                        editarOtroFuenteInput.focus();
                        return;
                    }
                    fuenteEditada = gestionarNuevaFuente(nuevaFuenteNombre);
                    if (!fuenteEditada) return; // Detener si es inválida
                }

                const nuevoEstado = editarEstadoSelect.value;

                let mecanicosAsignados = citas[index].mecanicosAsignados || [];
                if (nuevoEstado === 'completada') {
                    const selectedCheckboxes = document.querySelectorAll('#editarMecanicosLista input[type="checkbox"]:checked');
                    mecanicosAsignados = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
                } else {
                    // Opcional: Limpiar mecánicos si el estado ya no es "Completada". Por ahora, los mantenemos.
                    // mecanicosAsignados = [];
                }

                citas[index] = {
                    id: id,
                    nombreCliente: editarNombreClienteInput.value,
                    telefono: editarTelefonoInput.value,
                    marca: editarMarcaInput.value,
                    modelo: editarModeloInput.value,
                    anio: parseInt(editarAnioInput.value),
                    region: editarRegionSelect.value,
                    combustible: editarCombustibleSelect.value,
                    trim: editarTrimInput.value,
                    fecha: editarFechaInput.value,
                    hora: editarHoraInput.value,
                    servicio: servicio,
                    otroServicio: servicio === 'Otro' ? editarOtroServicioInput.value : "",
                    notas: editarNotasInput.value,
                    agente: editarAgenteInput.value,
                    fuente: fuenteEditada,
                    estado: nuevoEstado,
                    facturado: editarFacturadoInput.checked,
                    monto: editarFacturadoInput.checked ? parsearMonto(editarMontoInput.value) : 0,
                    tieneCotizacion: tieneCotizacion,
                    motivoCotizacion: motivoCotizacion,
                    enCamino: citas[index].enCamino, // Preservar estado 'en camino'
                    esPromocion: editarEsPromocionCheck.checked,
                    precioRegular: parsearMonto(editarPrecioRegularInput.value),
                    precioPromocional: parsearMonto(editarPrecioPromocionalInput.value),
                    // Preservar datos de seguimiento existentes
                    mecanicosAsignados: mecanicosAsignados,
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

                guardarCitas();
                renderCitas();
                cargarFiltroAnios();
                cargarServiciosEnSelects();
                bootstrap.Modal.getInstance(editarCitaModalEl).hide();
                mostrarMensaje("Cita editada con éxito.", "warning");

                // Sincronizar clientes por si se completó una cita
                sincronizarClientesDesdeCitas();
            }
        }

        /**
         * Abre el modal para ver e imprimir el cupón.
         * @param {number} id - El ID de la cita para el cupón.
         */
        function abrirCuponModal(id) {
            const cita = citas.find(c => c.id === id);
            if (cita) {
                const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
                const agente = agentes.find(a => a.id == cita.agente) || { nombre: 'N/A' };

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

                cuponContent.innerHTML = `
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
                const cuponModal = new bootstrap.Modal(cuponModalEl);
                cuponModal.show();
            }
        }

        /**
         * Genera un enlace de WhatsApp con un mensaje predefinido.
         * @param {object} cita - La cita para la cual generar el enlace.
         * @returns {string} La URL de WhatsApp.
         */
        function generarLinkWhatsApp(cita, tipo = 'recordatorio') {
            if (!cita.telefono) return '#'; // Return a safe link if no phone number

            const numero = cita.telefono.replace(/\D/g, '');
            const numeroConCodigo = numero.startsWith('1') ? numero : `1${numero}`;
            
            let plantilla = '';
            switch(tipo) {
                case 'seguimiento':
                    plantilla = configuracion.plantillaReagendar || "Hola {cliente}, notamos que no pudiste asistir a tu cita del {fecha}. ¿Te gustaría reagendar?";
                    break;
                case 'postventa':
                    plantilla = configuracion.plantillaPostVenta || "Hola {cliente}, ¿qué tal tu experiencia con el servicio de {servicio} para tu {marca} {modelo}? En {nombreEmpresa} valoramos mucho tu opinión.";
                    break;
                case 'recordatorio':
                default:
                    plantilla = configuracion.plantillaWhatsapp || "¡Hola {cliente}! Te recordamos tu cita en {nombreEmpresa} para tu {marca} {modelo} el día {fecha} a las {hora}. ¡Te esperamos!";
                    break;
            }

            const mensaje = reemplazarPlaceholders(plantilla, cita);
            return `whatsapp://send?phone=${numeroConCodigo}&text=${encodeURIComponent(mensaje)}`;
        }

        /**
         * Imprime el contenido del cupón abriendo una nueva ventana con estilos.
         */
         function imprimirCupon() {
            const contenido = document.getElementById('cuponContent').innerHTML;
            const ventanaImpresion = window.open('', '', 'height=800,width=600');
            
            ventanaImpresion.document.write('<html><head><title>Cupón de Servicio</title>');
            // Enlaces a Bootstrap y Font Awesome para mantener el estilo
            ventanaImpresion.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
            ventanaImpresion.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">');
            // Estilos personalizados para el cupón y la impresión
            ventanaImpresion.document.write(`
                <style>
                    :root { --primary-color: ${configuracion.primaryColor || '#2c3e50'}; --secondary-color: ${configuracion.secondaryColor || '#3498db'}; }
                    body { background-color: #fff; padding: 20px; }
                    .cupon-container { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 1.5rem; max-width: 500px; margin: auto; }
                    .cupon-banner { text-align: center; border-bottom: 2px dashed var(--primary-color); padding-bottom: 1rem; margin-bottom: 1rem; }
                    .cupon-banner img { max-height: 50px; margin-bottom: 0.5rem; }
                    .cupon-banner h3 { margin: 0; color: var(--primary-color); font-weight: 600; }
                    .cupon-body .cupon-island { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                    .cupon-island h6 { font-weight: 600; color: var(--secondary-color); margin-bottom: 0.75rem; display: flex; align-items: center; }
                    .cupon-island p { margin-bottom: 0.25rem; font-size: 0.9rem; }
                    .cupon-offer .precio-original { text-decoration: line-through; color: #6c757d; font-size: 0.9rem; }
                    .cupon-offer .precio-promocional, .cupon-offer .precio-cortesia { font-size: 1.75rem; font-weight: 700; color: #28a745; text-align: center; margin: 0.5rem 0; }
                    .cupon-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; }
                    .cupon-footer-text { font-size: 0.75rem; color: #6c757d; }
                    .cupon-qr img { max-width: 80px; }
                    @media print {
                        body { padding: 0; margin: 0; }
                        .cupon-container { box-shadow: none; border: 1px solid #000; width: 100%; max-width: 100%; }
                        -webkit-print-color-adjust: exact; color-adjust: exact;
                    }
                </style>
            `);
            ventanaImpresion.document.write('</head><body>');
            ventanaImpresion.document.write(contenido);
            ventanaImpresion.document.write('</body></html>');
            ventanaImpresion.document.close();
            ventanaImpresion.onload = function() {
                ventanaImpresion.focus();
                ventanaImpresion.print();
                ventanaImpresion.close();
            };
        }

        /**
         * Genera un texto copiable con las citas del día agrupadas por agente
         */
        function generarTextoParaCopiar() {
            // Obtener la fecha seleccionada en el filtro o usar la de hoy
            const fechaFiltro = filtroFechaInput.value;
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
            const citasFiltradas = obtenerCitasFiltradas();
            
            // Agrupar por agente
            const citasPorAgente = {};
            citasFiltradas.forEach(cita => {
                const agenteId = cita.agente || 'sin-asignar';
                const agente = agentes.find(a => a.id == agenteId) || { nombre: 'Sin asignar' };
                
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
         * Renderiza la tabla de trabajos completados.
         */
        function renderTrabajos() {
            if (!listaTrabajos) return;

            const trabajosCompletados = citas.filter(c => c.estado === 'completada').sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            listaTrabajos.innerHTML = '';

            if (trabajosCompletados.length === 0) {
                listaTrabajos.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay trabajos completados para mostrar.</td></tr>';
                return;
            }

            trabajosCompletados.forEach(cita => {
                const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
                
                let mecanicosChequeoHtml = '<span class="text-muted small">N/A</span>';
                if (cita.mecanicosChequeo && cita.mecanicosChequeo.length > 0) {
                    mecanicosChequeoHtml = cita.mecanicosChequeo.map(mecanicoId => {
                        const mecanico = mecanicos.find(m => m.id === mecanicoId);
                        return mecanico ? `<span class="badge bg-info me-1">${sanitizeHTML(mecanico.nombre)}</span>` : '';
                    }).join('');
                }

                let mecanicosTrabajoHtml = '<span class="text-muted small">N/A</span>';
                if (cita.mecanicosTrabajo && cita.mecanicosTrabajo.length > 0) {
                    mecanicosTrabajoHtml = cita.mecanicosTrabajo.map(mecanicoId => {
                        const mecanico = mecanicos.find(m => m.id === mecanicoId);
                        return mecanico ? `<span class="badge bg-secondary me-1">${sanitizeHTML(mecanico.nombre)}</span>` : '';
                    }).join('');
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${formatearFechaParaVisualizacion(cita.fecha)}</td>
                    <td>
                        <strong>${sanitizeHTML(cita.nombreCliente)}</strong><br>
                        <small class="text-muted">${sanitizeHTML(cita.marca)} ${sanitizeHTML(cita.modelo)} (${cita.anio})</small>
                    </td>
                    <td>${sanitizeHTML(servicio)}</td>
                    <td>${mecanicosChequeoHtml}</td>
                    <td>${mecanicosTrabajoHtml}</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-info" onclick="abrirModalAsignarMecanico(${cita.id}, 'chequeo')" title="Asignar Mecánico de Chequeo">
                                <i class="fas fa-stethoscope"></i>
                            </button>
                            <button class="btn btn-primary" onclick="abrirModalAsignarMecanico(${cita.id}, 'trabajo')" title="Asignar Mecánico de Trabajo">
                                <i class="fas fa-tools"></i>
                            </button>
                        </div>
                    </td>
                `;
                listaTrabajos.appendChild(tr);
            });
        }

        /**
         * Abre el modal para asignar mecánicos a una cita.
         * @param {number} citaId - El ID de la cita.
         * @param {string} tipo - El tipo de asignación ('chequeo' o 'trabajo').
         */
        function abrirModalAsignarMecanico(citaId, tipo) {
            const cita = citas.find(c => c.id === citaId);
            if (!cita) return;

            document.getElementById('asignarMecanicoCitaId').value = citaId;
            document.getElementById('asignarMecanicoTipo').value = tipo;
            document.getElementById('asignarMecanicoInfoCliente').textContent = `${cita.nombreCliente} - ${cita.marca} ${cita.modelo}`;

            const modalTitle = document.querySelector('#asignarMecanicoModal .modal-title');
            modalTitle.innerHTML = `<i class="fas fa-user-plus me-2"></i>Asignar Mecánicos (${capitalizar(tipo)})`;

            const listaMecanicosEl = document.getElementById('asignarMecanicoLista');
            listaMecanicosEl.innerHTML = '';

            const mecanicosActivos = mecanicos.filter(m => m.activo);
            const mecanicosYaAsignados = (tipo === 'chequeo' ? cita.mecanicosChequeo : cita.mecanicosTrabajo) || [];

            if (mecanicosActivos.length === 0) {
                listaMecanicosEl.innerHTML = '<p class="text-center text-muted">No hay mecánicos activos para asignar.</p>';
            } else {
                mecanicosActivos.forEach(mecanico => {
                    const isChecked = mecanicosYaAsignados.includes(mecanico.id);
                    const item = document.createElement('label');
                    item.className = 'list-group-item';
                    item.innerHTML = `
                        <input class="form-check-input me-1" type="checkbox" value="${mecanico.id}" ${isChecked ? 'checked' : ''}>
                        ${sanitizeHTML(mecanico.nombre)}
                    `;
                    listaMecanicosEl.appendChild(item);
                });
            }

            asignarMecanicoModal.show();
        }

        /**
         * Guarda la asignación de mecánicos para una cita.
         */
        function guardarMecanicosAsignados() {
            const citaId = parseInt(document.getElementById('asignarMecanicoCitaId').value);
            const tipo = document.getElementById('asignarMecanicoTipo').value;
            const citaIndex = citas.findIndex(c => c.id === citaId);

            if (citaIndex > -1) {
                const selectedCheckboxes = document.querySelectorAll('#asignarMecanicoLista input[type="checkbox"]:checked');
                const mecanicosIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

                if (tipo === 'chequeo') {
                    citas[citaIndex].mecanicosChequeo = mecanicosIds;
                } else if (tipo === 'trabajo') {
                    citas[citaIndex].mecanicosTrabajo = mecanicosIds;
                }

                guardarCitas();
                renderTrabajos(); // Actualizar la tabla de trabajos
                asignarMecanicoModal.hide();
                mostrarMensaje(`Mecánicos de ${tipo} asignados correctamente.`, 'success');
            }
        }

        /**
         * Copia el texto al portapapeles
         * @param {string} texto - Texto a copiar
         */
        function copiarAlPortapapeles(texto) {
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

        /**
         * Inicia el proceso de importación desde un archivo Excel/CSV.
         * Lee el archivo, intenta un mapeo automático y, si falla, muestra la UI de mapeo manual.
         * @param {File} file - Archivo a procesar
         */
        function procesarArchivoExcel(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    if (jsonData.length < 2) {
                        mostrarMensaje("El archivo no contiene datos válidos.", "danger");
                        return;
                    }

                    const headers = jsonData[0].map(h => h ? h.toString().toLowerCase().trim() : '');

                    // Guardar datos crudos para poder reprocesarlos con mapeo manual si es necesario
                    datosExcelCrudos.headers = headers;
                    datosExcelCrudos.jsonData = jsonData;

                    // --- Intento de Mapeo Automático ---
                    const autoColMap = {};
                    camposMapeo.forEach(campo => {
                        autoColMap[campo.key] = findColumnIndex(headers, campo.possibleNames);
                    });

                    // --- Punto de Decisión ---
                    if (autoColMap.nombre === -1 || autoColMap.telefono === -1) {
                        // Falló el mapeo automático para campos requeridos
                        mapeoColumnasContainer.style.display = 'block';
                        btnAjustarMapeo.style.display = 'none';
                        vistaPreviaContainer.style.display = 'none';
                        popularMapeoColumnas(headers, autoColMap);
                        btnAccionImportar.textContent = 'Aplicar Mapeo y Previsualizar';
                        btnAccionImportar.disabled = false;
                    } else {
                        // El mapeo automático tuvo éxito
                        btnAjustarMapeo.style.display = 'block';
                        mapeoColumnasContainer.style.display = 'none';
                        vistaPreviaContainer.style.display = 'block';
                        procesarDatosConMapeo(autoColMap); // Procesar y mostrar vista previa
                        btnAccionImportar.textContent = 'Importar Datos';
                        btnAccionImportar.disabled = false;
                    }

                } catch (error) {
                    console.error("Error al procesar el archivo:", error);
                    mostrarMensaje("Error al procesar el archivo. Asegúrate de que es un formato válido.", "danger");
                }
            };

            reader.onerror = function() {
                mostrarMensaje("Error al leer el archivo.", "danger");
            };

            reader.readAsArrayBuffer(file);
        }

        /**
         * Rellena la interfaz de mapeo manual con las columnas del archivo Excel.
         * @param {string[]} headers - Los encabezados del archivo Excel.
         * @param {object} autoColMap - El resultado del intento de mapeo automático para preseleccionar valores.
         */
        function popularMapeoColumnas(headers, autoColMap) {
            mapeoColumnasForm.innerHTML = '';
            camposMapeo.forEach(campo => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-4 mb-2';

                const label = document.createElement('label');
                label.htmlFor = `map_${campo.key}`;
                label.className = 'form-label';
                label.textContent = campo.label;

                const select = document.createElement('select');
                select.id = `map_${campo.key}`;
                select.className = 'form-select form-select-sm';
                select.dataset.campo = campo.key;

                select.innerHTML = '<option value="-1">-- No importar --</option>';

                headers.forEach((header, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = header || `Columna ${index + 1}`;
                    select.appendChild(option);
                });

                if (autoColMap[campo.key] !== -1) {
                    select.value = autoColMap[campo.key];
                }

                colDiv.appendChild(label);
                colDiv.appendChild(select);
                mapeoColumnasForm.appendChild(colDiv);
            });
        }

        /**
         * Procesa los datos crudos de Excel usando un mapa de columnas (automático o manual) y genera la vista previa.
         * @param {object} colMap - Un objeto que mapea claves de campo (ej. 'nombre') a índices de columna.
         */
        function procesarDatosConMapeo(colMap) {
            const { jsonData } = datosExcelCrudos;
            const formatoNumeros = document.getElementById('formatoNumerosImportacion').value;
            datosImportados = []; // Limpiar datos anteriores

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || row.length === 0) continue;

                const nombre = colMap.nombre !== -1 ? row[colMap.nombre] : '';
                const telefono = colMap.telefono !== -1 ? row[colMap.telefono] : '';

                if (nombre && telefono) {
                    let importStatus = { text: 'OK', class: 'success' };

                    const marca = String((colMap.marca !== -1 ? row[colMap.marca] : '') || '');
                    const modelo = String((colMap.modelo !== -1 ? row[colMap.modelo] : '') || '');
                    const anio = String((colMap.anio !== -1 ? row[colMap.anio] : '') || '');
                    let fecha = colMap.fecha !== -1 ? row[colMap.fecha] : '';
                    const hora = (colMap.hora !== -1 ? row[colMap.hora] : '') || '08:00';
                    let servicio = String((colMap.servicio !== -1 ? row[colMap.servicio] : '') || '');
                    let otroServicio = '';
                    const estadoOriginal = String((colMap.estado !== -1 ? row[colMap.estado] : '') || '');
                    const notas = String((colMap.notas !== -1 ? row[colMap.notas] : '') || '');
                    const agenteNombre = String((colMap.agente !== -1 ? row[colMap.agente] : '') || '');
                    const montoExcelValue = colMap.monto !== -1 ? row[colMap.monto] : ''; // Get raw monto value
                    const parsedMonto = parsearMonto(montoExcelValue, formatoNumeros); // Always parse monto if column exists
                    const facturadoStr = String((colMap.facturado !== -1 ? row[colMap.facturado] : '') || '').toLowerCase();
                    const trim = String((colMap.trim !== -1 ? row[colMap.trim] : '') || '');
                    const region = String((colMap.region !== -1 ? row[colMap.region] : '') || '');
                    const combustible = String((colMap.combustible !== -1 ? row[colMap.combustible] : '') || '');

                    if (document.getElementById('corregirFechas').checked) {
                        fecha = convertirFechaExcel(fecha);
                    } else {
                        fecha = normalizarFecha(fecha);
                    }

                    const esFacturado = facturadoStr.includes('facturado') || facturadoStr.includes('sí') || facturadoStr.includes('si');
                    let estadoFinal = convertirEstado(estadoOriginal);

                    if (esFacturado && estadoFinal !== 'cancelada') {
                        estadoFinal = 'completada';
                    }

                    if (isNaN(new Date(fecha).getTime())) {
                        importStatus = { text: 'Fecha inválida', class: 'danger' };
                        fecha = new Date().toISOString().split('T')[0];
                    }

                    const standardServices = serviciosPredefinidos.map(s => s.nombre);
                    if (servicio && !standardServices.includes(servicio) && servicio.toLowerCase() !== 'otro') {
                        otroServicio = servicio;
                        servicio = 'Otro';
                    }

                    if (agenteNombre && !agentes.find(a => a.nombre.toLowerCase() === agenteNombre.toLowerCase())) {
                        importStatus = { text: 'Nuevo Agente', class: 'info' };
                    }

                    datosImportados.push({
                        nombre, telefono: String(telefono), marca, modelo, anio, trim, region, combustible,
                        fecha: fecha, hora: normalizarHora(hora), servicio, otroServicio, estado: estadoFinal, notas, agente: agenteNombre,
                        facturado: esFacturado || parsedMonto > 0, // Mark as facturado if the column says so OR if a positive monto was provided
                        monto: parsedMonto, // Always store the parsed monto
                        importStatus: importStatus
                    });
                }
            }

            vistaPreviaContainer.style.display = 'block';
            mostrarVistaPrevia();
        }

        /**
         * Muestra una vista previa de los datos importados
         */
        function mostrarVistaPrevia() {
            vistaPreviaDatos.innerHTML = '';
            
            if (datosImportados.length === 0) {
                vistaPreviaDatos.innerHTML = '<tr><td colspan="11" class="text-center">No hay datos válidos para importar</td></tr>';
                return;
            }
            
            // Mostrar máximo 10 registros en la vista previa
            const previewData = datosImportados.slice(0, 10);
            
            previewData.forEach(dato => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dato.nombre}</td>
                    <td>${dato.telefono}</td>
                    <td>${dato.marca}</td>
                    <td>${dato.modelo}</td>
                    <td>${dato.anio}</td>
                    <td>${formatearFechaParaVisualizacion(dato.fecha)}</td>
                    <td>${dato.hora}</td>
                    <td>${dato.servicio}</td>
                    <td><span class="badge ${getBadgeClass(dato.estado)}">${capitalizar(dato.estado)}</span></td>
                    <td>${formatearMonto(dato.monto)}</td>
                    <td><span class="badge bg-${dato.importStatus.class}">${dato.importStatus.text}</span></td>
                `;
                vistaPreviaDatos.appendChild(tr);
            });
            
            if (datosImportados.length > 10) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="11" class="text-center">... y ${datosImportados.length - 10} registros más</td>`;
                vistaPreviaDatos.appendChild(tr);
            }
        }

        /**
         * Confirma la importación de datos desde Excel
         */
        function confirmarImportacion() {
            if (datosImportados.length === 0) {
                mostrarMensaje("No hay datos para importar.", "warning");
                return;
            }
            
            const sobrescribir = document.getElementById('sobrescribirDatos').checked;
            
            if (sobrescribir) {
                citas = [];
            }
            
            // Agregar los datos importados
            let contador = 0;
            const nuevoId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
            
            datosImportados.forEach((dato, index) => {
                const id = nuevoId + index;
                
                // Buscar si el agente existe
                let agenteId = '';
                if (dato.agente) {
                    const agenteExistente = agentes.find(a => a.nombre.toLowerCase() === dato.agente.toLowerCase());
                    if (agenteExistente) { 
                        agenteId = agenteExistente.id;
                    } else {
                        // Crear un nuevo agente
                        const nuevoAgenteId = agentes.length > 0 ? Math.max(...agentes.map(a => a.id)) + 1 : 1;
                        const nuevoAgente = {
                            id: nuevoAgenteId,
                            nombre: dato.agente,
                            email: '',
                            telefono: '',
                            activo: true
                        };
                        agentes.push(nuevoAgente);
                        agenteId = nuevoAgente.id;
                    }
                }
                
                citas.push({
                    id: id,
                    nombreCliente: dato.nombre,
                    telefono: dato.telefono,
                    marca: dato.marca,
                    modelo: dato.modelo,
                    anio: dato.anio,
                    fecha: dato.fecha,
                    hora: dato.hora,
                    servicio: dato.servicio,
                    notas: dato.notas,
                    agente: agenteId,
                    estado: dato.estado,
                    facturado: dato.facturado,
                    monto: dato.monto,
                    tieneCotizacion: "no_aplica",
                    motivoCotizacion: "",
                    otroServicio: dato.otroServicio || "",
                    enCamino: false,
                    region: dato.region || "",
                    combustible: dato.combustible || "",
                    trim: dato.trim || "",
                    seguimiento: { status: 'pending', lastContact: null, notes: '' },
                    postVenta: { status: 'pending', lastContact: null, satisfaction: null, notes: '' },
                    mecanicosAsignados: []
                });
                
                contador++;
            });
            
            guardarCitas();
            guardarAgentes();
            renderCitas();
            importarExcelModal.hide();
            mostrarMensaje(`Se importaron ${contador} citas correctamente.`, "success");
        }

        /**
         * Exporta los datos de la tabla a un archivo CSV (Excel) con el formato solicitado,
         * incluyendo la codificación correcta y los saltos de línea entre citas.
         */
        function exportarAExcel() {
            const citasParaExportar = obtenerCitasFiltradas();
            // Añadir el Byte Order Mark (BOM) para asegurar la compatibilidad con tildes y ñ en Excel.
            let csv = "\ufeff";

            // Cabeceras solicitadas en el formato de la imagen
            const headers = "Observaciones,Nombre,Correo,Whatsapp,Marca,Modelo,Trim,Región,Año,Cita,Combustible,Sucursal,Función,Estado,Facturación,Monto,Agente";
            csv += headers + "\n";
            
            citasParaExportar.forEach(cita => {
                const servicio = cita.servicio === 'Otro' ? cita.otroServicio : cita.servicio;
                // Obtener nombre del agente
                const agente = agentes.find(a => a.id == cita.agente) || { nombre: '' };
                
                // Los campos no disponibles se marcan como "N/A"
                csv += `"${(cita.notas || '').replace(/"/g, '""')}",` + // Observaciones, escapando comillas
                       `"${(cita.nombreCliente || '').replace(/"/g, '""')}",` + // Nombre, escapando comillas
                       `"N/A",` + // Correo
                       `"${(cita.telefono || '').replace(/"/g, '""')}",` + // Whatsapp, escapando comillas
                       `"${(cita.marca || '').replace(/"/g, '""')}",` +      
                       `"${(cita.modelo || '').replace(/"/g, '""')}",` +
                       `"${(cita.trim || 'N/A').replace(/"/g, '""')}",` + // Trim
                       `"${(cita.region || 'N/A').replace(/"/g, '""')}",` + // Región
                       `"${cita.anio}",` + // Año
                       `"${formatearFechaParaVisualizacion(cita.fecha)} ${cita.hora}",` + // Cita
                       `"${(cita.combustible || 'N/A').replace(/"/g, '""')}",` + // Combustible
                       `"${configuracion.sucursal}",` + // Sucursal
                       `"${(servicio || '').replace(/"/g, '""')}",` + // Función, escapando comillas
                       `"${cita.estado.replace('_', ' ')}",` + // Estado
                       `"${cita.facturado ? 'Sí' : 'No'}",` + // Facturación
                       `"${cita.facturado ? formatearMonto(cita.monto).replace('RD$', '').replace('$', '').replace('€', '').trim() : '0'}",` + // Monto
                       `"${agente.nombre || ''}"` + // Agente
                       `\n`; // Fin de la fila de datos

                // Añadir una fila vacía para el "salto" solicitado
        
            });

            const blob = new Blob([csv], {
                type: 'text/csv;charset=utf-8;'
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "citas_checkengine.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * Guarda las citas actuales en un archivo JSON para respaldo.
         */
        function guardarManual() {
            mostrarMensaje("Generando respaldo...", "info");

            try {
                const backupData = {
                    version: "1.1",
                    createdAt: new Date().toISOString(),
                    citas,
                    clientes,
                    agentes,
                    mecanicos,
                    configuracion,
                    serviciosPredefinidos
                };
                const dataStr = JSON.stringify(backupData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const fileName = `respaldo_gescita_${new Date().toISOString().split('T')[0]}.json`;
                
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                mostrarMensaje("Respaldo descargado con éxito.", "success");
            } catch (e) {
                console.error("Error al generar el respaldo:", e);
                mostrarMensaje("Ocurrió un error al generar el respaldo.", "danger");
            }
        }

        function importarDatos(event) {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Comprobar si es el nuevo formato de respaldo completo
                    if (importedData && importedData.citas && importedData.clientes && importedData.agentes && importedData.configuracion) {
                        citas = importedData.citas || [];
                        clientes = importedData.clientes || [];
                        agentes = importedData.agentes || [];
                        mecanicos = importedData.mecanicos || []; // Restaurar mecánicos
                        configuracion = importedData.configuracion || {};

                        guardarCitas();
                        guardarClientes();
                        guardarAgentes();
                        guardarMecanicos();
                        guardarConfiguracion(); // Esto también llama a aplicarConfiguracion()
                        
                        // Recargar la UI
                        cargarCitas(); // Carga y renderiza todo
                        renderCitas();
                        mostrarMensaje("Respaldo completo restaurado con éxito.", "success");

                    } else if (Array.isArray(importedData)) { // Compatibilidad con formato antiguo
                        citas = importedData;
                        migrarDatosAntiguos();
                        guardarCitas();
                        renderCitas();
                        mostrarMensaje("Respaldo de citas (formato antiguo) importado correctamente.","info");
                    } else {
                        mostrarMensaje("El archivo no contiene un formato de datos válido.","danger");
                    }
                } catch (error) {
                    console.error("Error al importar respaldo:", error);
                    mostrarMensaje("Error al procesar el archivo. Asegúrate de que es un archivo JSON válido.","danger");
                }
            };
            reader.readAsText(file);
            // Limpiar el input para permitir re-importar el mismo archivo
            event.target.value = '';
        }

        function calcularEstadisticas(citasFiltradas) {
            const totalCitas = citasFiltradas.length;
            const recibidas = citasFiltradas.filter(c => c.estado === 'recibido' || c.estado === 'completada').length;
            const facturadas = citasFiltradas.filter(c => c.facturado).length;
            const montoTotal = citasFiltradas.filter(c => c.facturado).reduce((sum, c) => sum + (c.monto || 0), 0);
            const efectividad = totalCitas > 0 ? (recibidas / totalCitas) * 100 : 0;

            document.getElementById('statsTotal').textContent = totalCitas;
            document.getElementById('statsRecibidas').textContent = recibidas;
            document.getElementById('statsMonto').textContent = formatearMonto(montoTotal);
            document.getElementById('statsEfectividad').textContent = `${efectividad.toFixed(0)}%`;
        }

        /**
         * Guarda un agente nuevo o editado
         */
        function guardarAgente() {
            const id = agenteIdInput.value ? parseInt(agenteIdInput.value) : (agentes.length > 0 ? Math.max(...agentes.map(a => a.id)) + 1 : 1);
            const nombre = agenteNombreInput.value;
            const email = agenteEmailInput.value;
            const telefono = agenteTelefonoInput.value;
            const activo = agenteActivoInput.checked;
            
            if (!nombre) {
                mostrarMensaje("El nombre del agente es obligatorio.", "warning");
                return;
            }
            
            const esEdicion = !!agenteIdInput.value;

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
            
            guardarAgentes();
            
            // Limpiar el formulario para permitir agregar otro agente o cerrar.
            agenteForm.reset();
            document.getElementById('agenteFormTitulo').textContent = 'Crear Nuevo Agente';
            btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
            btnEliminarAgente.style.display = 'none';
            agenteIdInput.value = '';

            mostrarMensaje(`Agente ${esEdicion ? 'actualizado' : 'agregado'} correctamente.`, "success");
        }

        /**
         * Edita un agente existente
         * @param {number} id - ID del agente a editar
         */
        function editarAgente(id) {
            const agente = agentes.find(a => a.id === id);
            if (agente) {
                document.getElementById('agenteFormTitulo').textContent = `Editando a: ${agente.nombre}`;
                agenteIdInput.value = agente.id;
                agenteNombreInput.value = agente.nombre;
                agenteEmailInput.value = agente.email || '';
                agenteTelefonoInput.value = agente.telefono || '';
                agenteActivoInput.checked = agente.activo;
                
                btnGuardarAgente.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Cambios`;
                btnEliminarAgente.style.display = 'block';
                
                // Scroll al formulario para mejor UX
                agenteForm.scrollIntoView({ behavior: 'smooth' });
            }
        }

        /**
         * Elimina el agente actualmente en edición
         */
        function eliminarAgente() {
            const id = parseInt(agenteIdInput.value);
            if (!id) return;

            const citasAsignadas = citas.filter(cita => cita.agente == id);
            if (citasAsignadas.length > 0) {
                mostrarMensaje(`No se puede eliminar. El agente tiene ${citasAsignadas.length} cita(s) asignada(s).`, 'danger');
                return;
            }

            if (confirm("¿Estás seguro de que quieres eliminar este agente? Esta acción no se puede deshacer.")) {
                agentes = agentes.filter(a => a.id !== id);
                guardarAgentes();

                // Limpiar el formulario
                agenteForm.reset();
                document.getElementById('agenteFormTitulo').textContent = 'Crear Nuevo Agente';
                btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
                btnEliminarAgente.style.display = 'none';
                agenteIdInput.value = '';

                mostrarMensaje("Agente eliminado correctamente.", "success");
            }
        }

        /**
         * Carga los mecánicos desde localStorage
         */
        function cargarMecanicos() {
            const mecanicosGuardados = localStorage.getItem('mecanicos');
            const mecanicosDefault = [
                    { id: 1, nombre: "Pedro Martinez", especialidad: "Frenos", activo: true },
                    { id: 2, nombre: "Luis Gomez", especialidad: "Motor", activo: false }
                ];
            try {
                const mecanicosTemp = mecanicosGuardados ? JSON.parse(mecanicosGuardados) : null;
                if (mecanicosTemp && mecanicosTemp.length > 0) {
                    mecanicos = mecanicosTemp;
                } else {
                    mecanicos = mecanicosDefault;
                }
            } catch (e) {
                console.error("Error al cargar los mecánicos desde localStorage. Se usarán los valores por defecto.", e);
                localStorage.removeItem('mecanicos');
                mecanicos = mecanicosDefault;
            }
            renderMecanicos();
        }

        /**
         * Guarda los mecánicos en localStorage
         */
        function guardarMecanicos() {
            localStorage.setItem('mecanicos', JSON.stringify(mecanicos));
            renderMecanicos();
        }

        /**
         * Renderiza la tabla de mecánicos en el modal de gestión
         */
        function renderMecanicos() {
            if (!tablaMecanicos) return;
            tablaMecanicos.innerHTML = '';
            const mecanicosOrdenados = [...mecanicos].sort((a, b) => a.nombre.localeCompare(b.nombre));

            mecanicosOrdenados.forEach(mecanico => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.onclick = () => editarMecanico(mecanico.id);
                tr.innerHTML = `
                    <td><strong>${mecanico.nombre}</strong></td>
                    <td>${mecanico.especialidad || 'General'}</td>
                    <td><span class="badge ${mecanico.activo ? 'bg-success' : 'bg-secondary'}">${mecanico.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); editarMecanico(${mecanico.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                tablaMecanicos.appendChild(tr);
            });
        }

        /**
         * Renderiza la lista de mecánicos en el modal de edición de citas.
         * @param {object} cita - La cita que se está editando.
         */
        function renderMecanicosEnEditor(cita) {
            const editarMecanicosLista = document.getElementById('editarMecanicosLista');
            if (!editarMecanicosLista) return;
            editarMecanicosLista.innerHTML = '';
            const mecanicosActivos = mecanicos.filter(m => m.activo);

            if (mecanicosActivos.length === 0) {
                editarMecanicosLista.innerHTML = '<p class="text-center text-muted small my-2">No hay mecánicos activos para asignar.</p>';
                return;
            }

            mecanicosActivos.forEach(mecanico => {
                const isChecked = cita.mecanicosAsignados && cita.mecanicosAsignados.includes(mecanico.id);
                const item = document.createElement('div');
                item.className = 'form-check';
                item.innerHTML = `
                    <input class="form-check-input" type="checkbox" value="${mecanico.id}" id="mecanico_edit_${mecanico.id}" ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label" for="mecanico_edit_${mecanico.id}">
                        ${sanitizeHTML(mecanico.nombre)}
                    </label>
                `;
                editarMecanicosLista.appendChild(item);
            });
        }

        /**
         * Guarda un mecánico nuevo o editado
         */
        function guardarMecanico() {
            const id = mecanicoIdInput.value ? parseInt(mecanicoIdInput.value) : (mecanicos.length > 0 ? Math.max(...mecanicos.map(m => m.id)) + 1 : 1);
            const nombre = mecanicoNombreInput.value.trim();
            const especialidad = mecanicoEspecialidadInput.value.trim();
            const activo = mecanicoActivoInput.checked;

            if (!nombre) {
                mostrarMensaje("El nombre del mecánico es obligatorio.", "warning");
                return;
            }

            const esEdicion = !!mecanicoIdInput.value;

            if (esEdicion) {
                const index = mecanicos.findIndex(m => m.id === id);
                if (index !== -1) {
                    mecanicos[index] = { id, nombre, especialidad, activo };
                }
            } else {
                mecanicos.push({ id, nombre, especialidad, activo });
            }

            guardarMecanicos();
            mecanicoForm.reset();
            document.getElementById('mecanicoFormTitulo').textContent = 'Crear Nuevo Mecánico';
            btnGuardarMecanico.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Mecánico`;
            btnEliminarMecanico.style.display = 'none';
            mecanicoIdInput.value = '';

            mostrarMensaje(`Mecánico ${esEdicion ? 'actualizado' : 'creado'} correctamente.`, "success");
        }

        /**
         * Carga los datos de un mecánico en el formulario para editarlo
         */
        function editarMecanico(id) {
            const mecanico = mecanicos.find(m => m.id === id);
            if (mecanico) {
                document.getElementById('mecanicoFormTitulo').textContent = `Editando a: ${mecanico.nombre}`;
                mecanicoIdInput.value = mecanico.id;
                mecanicoNombreInput.value = mecanico.nombre;
                mecanicoEspecialidadInput.value = mecanico.especialidad || '';
                mecanicoActivoInput.checked = mecanico.activo;

                btnGuardarMecanico.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Cambios`;
                btnEliminarMecanico.style.display = 'block';

                mecanicoForm.scrollIntoView({ behavior: 'smooth' });
            }
        }

        /**
         * Elimina el mecánico actualmente en edición
         */
        function eliminarMecanico() {
            const id = parseInt(mecanicoIdInput.value);
            if (!id) return;

            const trabajosAsignados = citas.filter(c => 
                (c.mecanicosChequeo && c.mecanicosChequeo.includes(id)) ||
                (c.mecanicosTrabajo && c.mecanicosTrabajo.includes(id))
            );
            if (trabajosAsignados.length > 0) {
                mostrarMensaje(`No se puede eliminar. El mecánico está asignado a ${trabajosAsignados.length} trabajo(s).`, 'danger');
                return;
            }

            if (confirm("¿Estás seguro de que quieres eliminar este mecánico?")) {
                mecanicos = mecanicos.filter(m => m.id !== id);
                guardarMecanicos();

                mecanicoForm.reset();
                document.getElementById('mecanicoFormTitulo').textContent = 'Crear Nuevo Mecánico';
                btnGuardarMecanico.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Mecánico`;
                btnEliminarMecanico.style.display = 'none';
                mecanicoIdInput.value = '';

                mostrarMensaje("Mecánico eliminado correctamente.", "success");
            }
        }

        function guardarVehiculo() {
            const clienteId = parseInt(document.getElementById('vehiculoClienteId').value);
            const vehiculoId = document.getElementById('vehiculoId').value ? parseInt(document.getElementById('vehiculoId').value) : null;
            
            const clienteIndex = clientes.findIndex(c => c.id === clienteId);
            if (clienteIndex === -1) return;

            const datosVehiculo = {
                marca: document.getElementById('vehiculoMarca').value,
                modelo: document.getElementById('vehiculoModelo').value,
                anio: document.getElementById('vehiculoAnio').value,
                trim: document.getElementById('vehiculoTrim').value,
                region: document.getElementById('vehiculoRegion').value,
                combustible: document.getElementById('vehiculoCombustible').value,
                placa: document.getElementById('vehiculoPlaca').value,
                vin: document.getElementById('vehiculoVin').value,
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

            guardarClientes();
            mostrarHistorialCliente(clienteId); // Refrescar la vista del cliente
            vehiculoModal.hide();
            mostrarMensaje('Vehículo guardado con éxito.', 'success');
        }

        function eliminarVehiculo(clienteId, vehiculoId) {
            if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
                const clienteIndex = clientes.findIndex(c => c.id === clienteId);
                if (clienteIndex > -1) {
                    clientes[clienteIndex].vehicles = clientes[clienteIndex].vehicles.filter(v => v.id !== vehiculoId);
                    guardarClientes();
                    mostrarHistorialCliente(clienteId); // Refrescar
                    mostrarMensaje('Vehículo eliminado.', 'danger');
                }
            }
        }

        /**
         * Guarda un nuevo cliente desde el modal
         */
        function guardarCliente() {
            const clienteId = document.getElementById('clienteId').value ? parseInt(document.getElementById('clienteId').value) : null;
            const nombre = document.getElementById('clienteNombre').value.trim();
            const telefono = document.getElementById('clienteTelefono').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            
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
                    guardarClientes();
                    clienteModal.hide();
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
                
                guardarClientes();
                renderClientes();
                clienteModal.hide();
                mostrarMensaje('Cliente agregado con éxito.', 'success');
            }
        }

        function abrirModalCliente(clienteId = null) {
            clienteForm.reset();
            if (clienteId) {
                // Editar
                const cliente = clientes.find(c => c.id === clienteId);
                if (cliente) {
                    document.querySelector('#clienteModal .modal-title').textContent = 'Editar Cliente';
                    document.getElementById('clienteId').value = cliente.id;
                    document.getElementById('clienteNombre').value = cliente.nombre;
                    document.getElementById('clienteTelefono').value = cliente.telefono;
                    document.getElementById('clienteEmail').value = cliente.email || '';
                }
            } else {
                // Crear
                document.querySelector('#clienteModal .modal-title').textContent = 'Gestión de Cliente';
                document.getElementById('clienteId').value = '';
            }
            clienteModal.show();
        }

        /**
         * Autocompleta los datos del cliente y sus vehículos si el teléfono ya existe.
         */
        function autocompletarCliente() {
            const telefono = telefonoInput.value.trim();
            const vehiculoDivider = document.getElementById('vehiculoDivider');
            const nuevoVehiculoTitle = document.getElementById('nuevoVehiculoTitle');

            if (!telefono) {
                // Limpiar si el campo de teléfono está vacío
                clienteExistenteIcon.style.display = 'none';
                vehiculoExistenteContainer.style.display = 'none';
                vehiculoExistenteSelect.innerHTML = '';
                if (vehiculoDivider) vehiculoDivider.style.display = 'none';
                if (nuevoVehiculoTitle) nuevoVehiculoTitle.textContent = 'Introducir datos del vehículo';
                return;
            }

            const cliente = clientes.find(c => c.telefono === telefono);

            if (cliente) {
                // Cliente encontrado
                nombreClienteInput.value = cliente.nombre;
                clienteExistenteIcon.style.display = 'inline-block';

                if (cliente.vehicles && cliente.vehicles.length > 0) {
                    vehiculoExistenteSelect.innerHTML = '<option value="">Seleccione un vehículo...</option>';
                    cliente.vehicles.forEach(v => {
                        const option = document.createElement('option');
                        option.value = v.id;
                        option.textContent = `${v.marca} ${v.modelo} (${v.anio}) ${v.placa ? '- ' + v.placa : ''}`;
                        option.dataset.vehiculoData = JSON.stringify(v); // Guardar todos los datos del vehículo
                        vehiculoExistenteSelect.appendChild(option);
                    });
                    vehiculoExistenteContainer.style.display = 'block';
                    if (vehiculoDivider) vehiculoDivider.style.display = 'block';
                    if (nuevoVehiculoTitle) nuevoVehiculoTitle.textContent = 'O introduce un vehículo nuevo';
                } else {
                    vehiculoExistenteContainer.style.display = 'none';
                    vehiculoExistenteSelect.innerHTML = '';
                    if (vehiculoDivider) vehiculoDivider.style.display = 'none';
                    if (nuevoVehiculoTitle) nuevoVehiculoTitle.textContent = 'Introducir datos del vehículo';
                }
            } else {
                // Cliente no encontrado
                clienteExistenteIcon.style.display = 'none';
                vehiculoExistenteContainer.style.display = 'none';
                vehiculoExistenteSelect.innerHTML = '';
                if (vehiculoDivider) vehiculoDivider.style.display = 'none';
                if (nuevoVehiculoTitle) nuevoVehiculoTitle.textContent = 'Introducir datos del vehículo';
                // Opcional: limpiar el nombre si se busca un nuevo teléfono
                // nombreClienteInput.value = ''; 
            }
        }

        /**
         * Rellena los campos del vehículo al seleccionarlo del dropdown.
         */
        function seleccionarVehiculoExistente() {
            const selectedOption = vehiculoExistenteSelect.options[vehiculoExistenteSelect.selectedIndex];
            if (!selectedOption || !selectedOption.value) {
                // Si se selecciona la opción "Seleccione...", se limpian los campos para permitir entrada manual
                document.getElementById('marca').value = '';
                document.getElementById('modelo').value = '';
                document.getElementById('anio').value = '';
                document.getElementById('region').value = '';
                document.getElementById('combustible').value = '';
                document.getElementById('trim').value = '';
                return;
            }

            const vehiculo = JSON.parse(selectedOption.dataset.vehiculoData);
            document.getElementById('marca').value = vehiculo.marca;
            document.getElementById('modelo').value = vehiculo.modelo;
            document.getElementById('anio').value = vehiculo.anio;
            document.getElementById('region').value = vehiculo.region || '';
            document.getElementById('combustible').value = vehiculo.combustible || '';
            document.getElementById('trim').value = vehiculo.trim || '';
        }

        // --- Event Listeners ---
        document.addEventListener('DOMContentLoaded', () => {
            // Asegurar que el filtro "Todas" esté activo por defecto ANTES de cargar los datos.
            // Esto soluciona el problema de que la lista aparezca vacía inicialmente.
            grupoFiltros.querySelector('[data-estado="todas"]').classList.add('active');

            cargarCitas();
            
            // Establecer la fecha mínima para el campo de nueva cita para evitar fechas pasadas.
            document.getElementById('fecha').min = new Date().toISOString().split('T')[0];
            
            // Pre-rellenar los filtros de fecha en la pestaña de reportes con el mes actual.
            const hoy = new Date();
            const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
            const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];
            if (filtroReporteFechaInicioInput) filtroReporteFechaInicioInput.value = primerDiaMes;
            if (filtroReporteFechaFinInput) filtroReporteFechaFinInput.value = ultimoDiaMes;            

            // Pre-rellenar filtros de fecha en Seguimiento y Post-Venta con los últimos 90 días.
            const hace90dias = new Date();
            hace90dias.setDate(hoy.getDate() - 90);
            const hoyStr = hoy.toISOString().split('T')[0];
            const hace90diasStr = hace90dias.toISOString().split('T')[0];

            if (filtroSeguimientoInicio) filtroSeguimientoInicio.value = hace90diasStr;
            if (filtroSeguimientoFin) filtroSeguimientoFin.value = hoyStr;
            if (filtroPostVentaInicio) filtroPostVentaInicio.value = hace90diasStr;
            if (filtroPostVentaFin) filtroPostVentaFin.value = hoyStr;
        });

        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
            });
        }

        // Manejar la visualización de la pestaña de citas para renderizar la lista
        document.getElementById('pills-citas-tab').addEventListener('shown.bs.tab', renderCitas);
        
        // Manejar la visualización de la pestaña de inicio para recargar el dashboard
        const inicioTab = document.getElementById('pills-inicio-tab');
        if (inicioTab) {
            inicioTab.addEventListener('shown.bs.tab', renderDashboard);
        }

        // Manejar la visualización de la pestaña de reportes para generar los gráficos
        const reportesTab = document.getElementById('pills-reportes-tab');
        if (reportesTab) {
            reportesTab.addEventListener('shown.bs.tab', generarReportes);
        }

        // Manejar la visualización de la pestaña de post-venta
        const postVentaTab = document.getElementById('pills-postventa-tab');
        if (postVentaTab) {
            postVentaTab.addEventListener('shown.bs.tab', renderPostVenta);
        }

        // Manejar la visualización de la pestaña de gestión de trabajos
        const trabajosTab = document.getElementById('pills-trabajos-tab');
        if (trabajosTab) {
            trabajosTab.addEventListener('shown.bs.tab', renderTrabajos);
        }


        // Manejar el formulario de nueva cita
        citaForm.addEventListener('submit', agregarCita);

        // Limpiar formulario al hacer clic en la pestaña "Nueva Cita"
        document.getElementById('pills-nueva-tab').addEventListener('click', () => {
            limpiarFormularioNuevaCita();
            telefonoInput.value = ''; // Limpiar también el teléfono para un nuevo inicio
        });

        // Manejar el cambio en el select de servicio para mostrar/ocultar el campo "Otro"
        servicioSelect.addEventListener('change', () => {
            if (servicioSelect.value === 'Otro') {
                otroServicioContainer.style.display = '';
            } else {
                otroServicioContainer.style.display = 'none';
            }
        });

        // Manejar el checkbox de promoción en el formulario de nueva cita
        esPromocionCheck.addEventListener('change', () => {
            promoContainer.style.display = esPromocionCheck.checked ? '' : 'none';
        });

        // Manejar el checkbox de promoción en el formulario de edición
        editarEsPromocionCheck.addEventListener('change', () => {
            editarPromoContainer.style.display = editarEsPromocionCheck.checked ? '' : 'none';
        });

        // Listener para autocompletar cliente al salir del campo de teléfono
        telefonoInput.addEventListener('blur', autocompletarCliente);

        // Listener para rellenar datos del vehículo al seleccionarlo
        if (servicioForm) {
            servicioForm.addEventListener('submit', guardarServicio);
        }

        // Limpiar formulario de servicio al ocultar el modal
        if (gestionServiciosModalEl) {
            gestionServiciosModalEl.addEventListener('hidden.bs.modal', () => {
                document.getElementById('servicioId').value = '';
                servicioForm.reset();
                document.getElementById('servicioFormTitulo').textContent = 'Crear Nuevo Servicio';
                document.getElementById('btnGuardarServicio').innerHTML = '<i class="fas fa-plus me-1"></i> Crear Servicio';
            });
        }

        vehiculoExistenteSelect.addEventListener('change', () => {
            seleccionarVehiculoExistente();
        });

        /**
         * Limpia el formulario de nueva cita, incluyendo los campos de promoción.
         */
        function limpiarFormularioNuevaCita() {
            citaForm.reset();
            promoContainer.style.display = 'none';
            vehiculoExistenteContainer.style.display = 'none';
            otroServicioContainer.style.display = 'none';
            // Also reset the vehicle section title and divider
            const vehiculoDivider = document.getElementById('vehiculoDivider');
            const nuevoVehiculoTitle = document.getElementById('nuevoVehiculoTitle');
            if (vehiculoDivider) vehiculoDivider.style.display = 'none';
            if (nuevoVehiculoTitle) nuevoVehiculoTitle.textContent = 'Introducir datos del vehículo';
        }

        // Limpiar el modal de edición al cerrarse
        editarCitaModalEl.addEventListener('hidden.bs.modal', () => {
            editarOtroFuenteContainer.style.display = 'none';
            editarOtroFuenteInput.value = '';
            editarOtroFuenteInput.required = false;
        });

        // Manejar los clics en los botones de filtro
        grupoFiltros.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON') {
                const estado = target.dataset.estado;
                const todasBtn = grupoFiltros.querySelector('[data-estado="todas"]');

                if (estado === 'todas') {
                    // Si se hace clic en "Todas", se activa y se desactivan los demás.
                    if (!target.classList.contains('active')) {
                        grupoFiltros.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                        target.classList.add('active');
                    }
                } else {
                    // Si se hace clic en otro botón, se alterna su estado.
                    target.classList.toggle('active');
                    // Y se desactiva "Todas".
                    todasBtn.classList.remove('active');
                }

                // Si no hay ningún filtro de estado específico activo, se activa "Todas".
                const algunActivo = grupoFiltros.querySelector('button.active:not([data-estado="todas"])');
                if (!algunActivo) {
                    todasBtn.classList.add('active');
                }

                renderCitas();
            }
        });

        // Manejar los filtros de reportes
        if (filtroReporteFechaInicioInput) {
            filtroReporteFechaInicioInput.addEventListener('change', generarReportes);
            filtroReporteFechaFinInput.addEventListener('change', generarReportes);
            filtroReporteAgenteSelect.addEventListener('change', generarReportes);
            filtroReporteServicioSelect.addEventListener('change', generarReportes);
            filtroReporteRegionSelect.addEventListener('change', generarReportes);
            filtroReporteCombustibleSelect.addEventListener('change', generarReportes);
            filtroReporteFacturadoInput.addEventListener('change', generarReportes);

            grupoFiltrosReportes.addEventListener('click', (e) => {
                const target = e.target;
                if (target.tagName === 'BUTTON') {
                    const estado = target.dataset.estado;
                    const todasBtn = grupoFiltrosReportes.querySelector('[data-estado="todas"]');

                    if (estado === 'todas') {
                        if (!target.classList.contains('active')) {
                            grupoFiltrosReportes.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                            target.classList.add('active');
                        }
                    } else {
                        target.classList.toggle('active');
                        todasBtn.classList.remove('active');
                    }

                    const algunActivo = grupoFiltrosReportes.querySelector('button.active:not([data-estado="todas"])');
                    if (!algunActivo) {
                        todasBtn.classList.add('active');
                    }
                    generarReportes();
                }
            });
        }

        // Manejar el botón de exportar a Excel
        btnExportarExcel.addEventListener('click', exportarAExcel);

        // Manejar el botón de guardar manual
        btnGuardarManual.addEventListener('click', guardarManual);

        // Manejar el botón de importar desde Excel
        btnImportarExcel.addEventListener('click', () => {
            importarExcelModal.show();
        });

        // Manejar la selección de archivo Excel
        archivoExcelInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                procesarArchivoExcel(e.target.files[0]);
            }
        });

        // Manejar la confirmación de importación
        btnAccionImportar.addEventListener('click', () => {
            if (mapeoColumnasContainer.style.display === 'block') {
                // Estamos en modo de mapeo manual, el botón aplica el mapeo
                const manualColMap = {};
                const selects = mapeoColumnasForm.querySelectorAll('select');
                selects.forEach(select => {
                    manualColMap[select.dataset.campo] = parseInt(select.value, 10);
                });

                // Validar campos requeridos
                if (manualColMap.nombre === -1 || manualColMap.telefono === -1) {
                    mostrarMensaje('Debes asignar columnas para "Nombre" y "Teléfono".', 'warning');
                    return;
                }

                procesarDatosConMapeo(manualColMap);
                mapeoColumnasContainer.style.display = 'none';
                btnAccionImportar.textContent = 'Importar Datos';
            } else {
                // Estamos en modo de confirmación, el botón importa los datos
                confirmarImportacion();
            }
        });

        // Manejar el botón para forzar el mapeo manual
        btnAjustarMapeo.addEventListener('click', () => {
            mapeoColumnasContainer.style.display = 'block';
            vistaPreviaContainer.style.display = 'none';
            btnAjustarMapeo.style.display = 'none';

            // Repoblar el formulario de mapeo con la detección automática como sugerencia
            const autoColMap = {};
            camposMapeo.forEach(campo => {
                autoColMap[campo.key] = findColumnIndex(datosExcelCrudos.headers, campo.possibleNames);
            });
            popularMapeoColumnas(datosExcelCrudos.headers, autoColMap);

            btnAccionImportar.textContent = 'Aplicar Mapeo y Previsualizar';
            btnAccionImportar.disabled = false;
        });

        // Manejar el input de archivo para importar JSON
        importarArchivoInput.addEventListener('change', importarDatos);

        // Manejar el botón de copiar lista
        btnCopiarLista.addEventListener('click', () => {
            const texto = generarTextoParaCopiar();
            copiarAlPortapapeles(texto);
        });

        // Manejar la edición del servicio en el modal
        editarServicioSelect.addEventListener('change', () => {
            if (editarServicioSelect.value === 'Otro') {
                editarOtroServicioContainer.style.display = '';
            } else {
                editarOtroServicioContainer.style.display = 'none';
            }
        });
        
        // Manejar el cambio en el select de cotización para mostrar/ocultar el motivo
        editarTieneCotizacionSelect.addEventListener('change', () => {
            if (editarTieneCotizacionSelect.value === 'no') {
                editarMotivoCotizacionContainer.style.display = '';
            } else {
                editarMotivoCotizacionContainer.style.display = 'none';
            }
        });

        // Mostrar/ocultar la asignación de mecánicos en el modal de edición
        editarEstadoSelect.addEventListener('change', () => {
            const editarMecanicosContainer = document.getElementById('editarMecanicosContainer');
            editarMecanicosContainer.style.display = editarEstadoSelect.value === 'completada' ? 'block' : 'none';
        });

        // Manejar el botón de guardar edición en el modal
        btnGuardarEdicion.addEventListener('click', guardarEdicion);

        // Manejar eventos de la sección de clientes
        const clientesTab = document.getElementById('pills-clientes-tab');
        if (clientesTab) {
            clientesTab.addEventListener('shown.bs.tab', () => {
                renderClientes();
                // Ocultar el panel de detalles si no hay cliente seleccionado
                const clienteActivo = document.querySelector('#listaClientes .list-group-item-action.active');
                if (!clienteActivo) {
                    historialClienteContainer.style.display = 'none';
                placeholderCliente.style.display = 'flex';
                }
            });
        }

        if (btnNuevoCliente) {
            btnNuevoCliente.addEventListener('click', () => abrirModalCliente());
            btnGuardarCliente.addEventListener('click', guardarCliente);
            filtroClientes.addEventListener('input', renderClientes);
        }

        // Manejar guardado de vehículo
        if (btnGuardarVehiculo) {
            btnGuardarVehiculo.addEventListener('click', guardarVehiculo);
        }

        // Manejar el filtro de seguimiento por agente
        if (filtroSeguimientoAgente) {
            filtroSeguimientoAgente.addEventListener('change', renderSeguimiento);
        }

        // Manejar filtros de estado en Seguimiento
        const filtrosSeguimientoEstado = document.getElementById('filtrosSeguimientoEstado');
        if (filtrosSeguimientoEstado) {
            filtrosSeguimientoEstado.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    filtrosSeguimientoEstado.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    renderSeguimiento();
                }
            });
        }

        // Manejar filtros de fecha en Seguimiento
        if (filtroSeguimientoInicio && filtroSeguimientoFin) {
            filtroSeguimientoInicio.addEventListener('change', renderSeguimiento);
            filtroSeguimientoFin.addEventListener('change', renderSeguimiento);
        }

        // Manejar filtros de estado en Post-Venta
        const filtrosPostVentaEstado = document.getElementById('filtrosPostVentaEstado');
        if (filtrosPostVentaEstado) {
            filtrosPostVentaEstado.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    filtrosPostVentaEstado.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    renderPostVenta();
                }
            });
        }

        // Manejar filtros de fecha en Post-Venta
        if (filtroPostVentaInicio && filtroPostVentaFin) {
            filtroPostVentaInicio.addEventListener('change', renderPostVenta);
            filtroPostVentaFin.addEventListener('change', renderPostVenta);
        }

        // Manejar el guardado de notas de seguimiento
        const btnGuardarNotas = document.getElementById('btnGuardarNotasSeguimiento');
        if (btnGuardarNotas) {
            btnGuardarNotas.addEventListener('click', guardarNotasSeguimiento);
        }

        // Manejar el filtro de post-venta por agente
        if (filtroPostVentaAgente) {
            filtroPostVentaAgente.addEventListener('change', renderPostVenta);
        }

        // Manejar el guardado de notas de post-venta
        if (btnGuardarNotasPostVenta) {
            btnGuardarNotasPostVenta.addEventListener('click', guardarNotasPostVenta);
        }

        // Manejar el botón de confirmar eliminación en el modal
        btnConfirmarEliminar.addEventListener('click', eliminarCita);

        // Manejar el cambio en el input de fecha para las estadísticas
        filtroFechaInput.addEventListener('change', () => {
            renderCitas();
            sincronizarCalendarioConFiltros();
        });

        // Manejar la visualización de la pestaña del calendario para renderizarlo correctamente
        const calendarioTab = document.getElementById('pills-calendario-tab');
        if (calendarioTab) {
            calendarioTab.addEventListener('shown.bs.tab', function () {
                // Cuando la pestaña se muestra, el calendario (que pudo haber sido inicializado
                // en un contenedor oculto) necesita ser renderizado.
                setTimeout(() => {
                    // Se vuelve a llamar a renderCalendario para que se dibuje con las dimensiones correctas.
                    renderCalendario();
                }, 10); // Un pequeño delay para asegurar que el contenedor es completamente visible.
            });
        }

        // Manejar el cambio en el select de mes
        filtroMesSelect.addEventListener('change', () => {
            renderCitas();
            sincronizarCalendarioConFiltros();
        });

        // Manejar el cambio en el select de año
        filtroAnioSelect.addEventListener('change', () => {
            renderCitas();
            sincronizarCalendarioConFiltros();
        });

        // Manejar el cambio en el switch de facturado
        filtroFacturadoInput.addEventListener('change', renderCitas);

        // Manejar el filtro de búsqueda por texto
        filtroBusquedaInput.addEventListener('input', renderCitas);

        // Manejar la carga de logo
        configLogo.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    logoPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Manejar el guardado de configuración
        btnGuardarConfiguracion.addEventListener('click', () => {
            // 1. Recolectar todos los datos del formulario en un objeto temporal.
            const newConfigData = {
                nombreEmpresa: configNombreEmpresa.value,
                sucursal: configSucursal.value,
                direccion: configDireccion.value,
                telefono: configTelefono.value,
                moneda: configMoneda.value,
                formatoMoneda: configFormatoMoneda.value,
                qrUrl: configQrUrlInput.value,
                primaryColor: configPrimaryColorInput.value,
                secondaryColor: configSecondaryColorInput.value,
                mostrarMontosSinDecimales: configMostrarMontosSinDecimales.checked,
                plantillaWhatsapp: document.getElementById('configWhatsappTemplate').value,
                welcomeText: configWelcomeTextInput.value,
                headerTextColor: configHeaderTextColorInput.value,
                // Asegurarse de que los elementos existen antes de acceder a .value
                plantillaReagendar: document.getElementById('configWhatsappReagendarTemplate').value,
                plantillaPostVenta: document.getElementById('configWhatsappPostVentaTemplate').value
            };

            // 2. Manejar la carga asíncrona del archivo del logo.
            if (configLogo.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    newConfigData.logo = event.target.result;
                    saveAndApplyConfiguration(newConfigData); // Guardar después de que el logo se cargue.
                };
                reader.readAsDataURL(configLogo.files[0]);
            } else {
                saveAndApplyConfiguration(newConfigData); // Guardar inmediatamente si no hay un logo nuevo.
            }
        });

        // Manejar el guardado de agente
        agenteForm.addEventListener('submit', (e) => { e.preventDefault(); guardarAgente(); });

        // Manejar el guardado de mecánico
        if (mecanicoForm) {
            mecanicoForm.addEventListener('submit', (e) => { e.preventDefault(); guardarMecanico(); });
        }

        // Manejar la eliminación de mecánico
        if (btnEliminarMecanico) {
            btnEliminarMecanico.addEventListener('click', eliminarMecanico);
        }

        // Manejar el guardado de mecánicos asignados
        if (btnGuardarMecanicosAsignados) {
            btnGuardarMecanicosAsignados.addEventListener('click', guardarMecanicosAsignados);
        }

        // Manejar el cambio en el select de fuente para la nueva cita
        if (fuenteSelect) {
            fuenteSelect.addEventListener('change', () => {
                const esOtro = fuenteSelect.value === '_otro_';
                otroFuenteContainer.style.display = esOtro ? 'block' : 'none';
                otroFuenteInput.required = esOtro;
                if (!esOtro) otroFuenteInput.value = '';
            });
        }

        // Manejar el cambio en el select de fuente para editar cita
        if (editarFuenteSelect) {
            editarFuenteSelect.addEventListener('change', () => {
                const esOtro = editarFuenteSelect.value === '_otro_';
                editarOtroFuenteContainer.style.display = esOtro ? 'block' : 'none';
                editarOtroFuenteInput.required = esOtro;
                if (!esOtro) editarOtroFuenteInput.value = '';
            });
        }

        // Manejar el guardado de fuente de cita
        if (fuenteForm) {
            fuenteForm.addEventListener('submit', guardarFuente);
        }

        // Manejar la eliminación de agente
        btnEliminarAgente.addEventListener('click', eliminarAgente);

        // Limpiar formulario de agente al ocultar el modal
        gestionAgentesModalEl.addEventListener('hidden.bs.modal', () => {
            agenteIdInput.value = '';
            agenteForm.reset();
            document.getElementById('agenteFormTitulo').textContent = 'Crear Nuevo Agente';
            btnGuardarAgente.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Agente`;
            btnEliminarAgente.style.display = 'none';
        });

        // Limpiar formulario de fuente al ocultar el modal
        if (gestionFuentesModalEl) {
            gestionFuentesModalEl.addEventListener('hidden.bs.modal', () => {
                document.getElementById('fuenteId').value = '';
                fuenteForm.reset();
                document.getElementById('fuenteFormTitulo').textContent = 'Crear Nueva Fuente';
                document.getElementById('btnGuardarFuente').innerHTML = '<i class="fas fa-plus me-1"></i> Crear Fuente';
            });
        }

        // Limpiar formulario de mecánico al ocultar el modal
        if (gestionMecanicosModalEl) {
            gestionMecanicosModalEl.addEventListener('hidden.bs.modal', () => {
                mecanicoIdInput.value = '';
                mecanicoForm.reset();
                document.getElementById('mecanicoFormTitulo').textContent = 'Crear Nuevo Mecánico';
                btnGuardarMecanico.innerHTML = `<i class="fas fa-plus me-1"></i> Crear Mecánico`;
                btnEliminarMecanico.style.display = 'none';
            });
        }

        // Refrescar la lista de citas si el usuario vuelve a esta pestaña del navegador
        // para asegurar que los datos (ej. estados actualizados automáticamente) estén al día.
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // Actualizar estados de citas pasadas para reflejar la realidad si el día cambió.
                // Esto es importante si la aplicación se deja abierta de un día para otro.
                actualizarCitasPasadas(); 
                // Re-renderizar la vista actual para reflejar cualquier cambio.
                renderCitas();
            }
        });

        // Registrar el Service Worker para la funcionalidad PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(registration => {
                    console.log('ServiceWorker registrado con éxito:', registration.scope);
                }).catch(error => {
                    console.log('Fallo en el registro de ServiceWorker:', error);
                });
            });
        }