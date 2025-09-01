// js/constants.js

export let configuracion = {
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
    logo: "https://placehold.co/180x50/ffffff/3498db?text=CheckEngineRD",
    dataVersion: "1.7", // Versión de la estructura de datos
    mostrarMontosSinDecimales: false, // Nueva opción para mostrar montos sin decimales
    seguimientoDiasRecibido: 3 // Días para que una cita 'recibida' aparezca en seguimiento
};

export let serviciosPredefinidos = [
    { id: 1, nombre: "Chequeo General", precio: 1500 },
    { id: 2, nombre: "Chequeo libre de costo", precio: 0 },
    { id: 3, nombre: "Mantenimiento Inyección", precio: 2500 },
    { id: 4, nombre: "Cambio de Aceite", precio: 1800 },
    { id: 5, nombre: "Diagnóstico Computarizado", precio: 2000 },
    { id: 6, nombre: "Trabajo a Realizar", precio: 0 },
];

export const camposMapeo = [
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

export function setConfiguracion(newConfig) {
    configuracion = { ...configuracion, ...newConfig };
}

export function setServiciosPredefinidos(newServices) {
    serviciosPredefinidos = newServices;
}