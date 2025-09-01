// js/utils.js

import { configuracion } from './constants.js';
import { mensajeAlerta, mensajeContainer } from './domElements.js';

/**
 * Helper function to find the column index in an array of headers.
 * It checks for multiple possible names for a column.
 * @param {Array<string>} headers - Array of header names (lowercase, trimmed).
 * @param {Array<string>} possibleNames - Array of possible names for the column (lowercase).
 * @returns {number} The index of the column, or -1 if not found.
 */
export function findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
        const index = headers.indexOf(name);
        if (index !== -1) return index;
    }
    return -1;
}

/**
 * Muestra un mensaje temporal en la pantalla.
 * @param {string} mensaje - El texto del mensaje.
 * @param {string} tipo - El tipo de alerta ('success', 'danger', 'warning', 'info').
 */
export function mostrarMensaje(mensaje, tipo) {
    if (!mensajeContainer || !mensajeAlerta) return;
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
export function getBadgeClass(estado) {
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
export function getEventColor(estado) {
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
export function sanitizeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Retorna los íconos de estado financiero.
 * @param {object} cita - Objeto de la cita.
 * @returns {string} HTML con los íconos.
 */
export function getFinanzasIcons(cita) {
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
 * Convierte el estado de Excel al formato interno
 * @param {string} estadoExcel - Estado en formato Excel
 * @returns {string} Estado en formato interno
 */
export function convertirEstado(estadoExcel) {
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
export function convertirHora(horaExcel) {
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
export function formatearMonto(monto) {
    if (monto === null || monto === undefined || isNaN(monto)) {
        switch(configuracion.moneda) {
            case 'USD': return '$0.00';
            case 'EUR': return '€0,00';
            default: return 'RD$0.00';
        }
    }
    
    const opciones = {
        style: 'currency',
        currency: configuracion.moneda === 'RD' ? 'DOP' : configuracion.moneda,
        minimumFractionDigits: configuracion.mostrarMontosSinDecimales ? 0 : 2,
        maximumFractionDigits: configuracion.mostrarMontosSinDecimales ? 0 : 2
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
export function obtenerSimboloMoneda() {
    switch(configuracion.moneda) {
        case 'USD': return '$';
        case 'EUR': return '€';
        default: return 'RD$';
    }
}

/**
 * Parsea un monto desde diferentes formatos y lo convierte a un número flotante.
 * @param {string|number} montoStr - String o número del monto.
 * @param {string} formato - 'auto', 'us' (1,234.56), or 'eu' (1.234,56).
 * @returns {number} Monto parseado como número flotante.
 */
export function parsearMonto(montoStr, formato = 'auto') {
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
     return montoFloat; // Retornar el valor flotante completo
}

/**
 * Convierte una fecha de Excel a formato JavaScript
 * @param {number} excelDate - Fecha en formato Excel (número de serie)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function convertirFechaExcel(excelDate) {
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

/**
 * Formatea una fecha para visualización (DD/MM/YYYY)
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export function formatearFechaParaVisualizacion(fechaStr) {
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
 * Normaliza una fecha a formato YYYY-MM-DD desde varios formatos posibles.
 * @param {string | Date} fechaInput - La fecha a normalizar.
 * @returns {string} Fecha en formato YYYY-MM-DD.
 */
export function normalizarFecha(fechaInput) {
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
                fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
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
export function normalizarHora(horaInput) {
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
 * Reemplaza los placeholders en una plantilla de mensaje con los datos de la cita.
 * @param {string} plantilla - La plantilla de texto.
 * @param {object} cita - El objeto de la cita.
 * @returns {string} El mensaje con los placeholders reemplazados.
 */
export function reemplazarPlaceholders(plantilla, cita) {
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
export function abrirWhatsApp(telefono, mensaje) {
    const numero = telefono.replace(/\D/g, '');
    const numeroConCodigo = numero.startsWith('1') ? numero : `1${numero}`; // Asume código de país 1 (RD)
    const url = `https://wa.me/${numeroConCodigo}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

/**
 * Pone en mayúscula la primera letra de una cadena.
 * @param {string} str - La cadena a capitalizar.
 * @returns {string} La cadena capitalizada.
 */
export function capitalizar(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Genera un enlace de WhatsApp con un mensaje predefinido.
 * @param {object} cita - La cita para la cual generar el enlace.
 * @returns {string} La URL de WhatsApp.
 */
export function generarLinkWhatsApp(cita) {
    const numero = cita.telefono.replace(/\D/g, ''); // Limpiar el número de teléfono
    const mensaje = `¡Hola ${cita.nombreCliente}! Te recordamos tu cita en ${configuracion.nombreEmpresa} para tu ${cita.marca} ${cita.modelo} el día ${formatearFechaParaVisualizacion(cita.fecha)} a las ${cita.hora}. ¡Te esperamos!`;
    
    // Asegurarse de que el número tenga el código de país si es necesario.
    // Este ejemplo asume números locales de RD. Ajustar si es necesario.
    const numeroConCodigo = numero.startsWith('1') ? numero : `1${numero}`;

    return `https://wa.me/${numeroConCodigo}?text=${encodeURIComponent(mensaje)}`;
}