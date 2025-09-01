// js/features/config.js

import { configuracion, setConfiguracion } from '../constants.js';
import { mostrarMensaje, obtenerSimboloMoneda } from '../utils.js';
import * as DOM from '../domElements.js';

/**
 * Aplica la configuración cargada a la interfaz
 */
export function aplicarConfiguracion() {
    // Actualizar logo y nombre de empresa
    if (DOM.headerLogo) DOM.headerLogo.src = configuracion.logo;
    if (DOM.headerEmpresaNombre) DOM.headerEmpresaNombre.textContent = configuracion.nombreEmpresa;
    
    // Actualizar símbolos de moneda
    const simbolo = obtenerSimboloMoneda();
    document.querySelectorAll('.currency-symbol').forEach(span => {
        if (span) span.textContent = simbolo;
    });
    // Aplicar colores
    document.documentElement.style.setProperty('--primary-color', configuracion.primaryColor || '#2c3e50');
    document.documentElement.style.setProperty('--secondary-color', configuracion.secondaryColor || '#3498db');
    
    // Actualizar formulario de configuración
    if (DOM.configNombreEmpresa) {
        DOM.configNombreEmpresa.value = configuracion.nombreEmpresa;
        DOM.configSucursal.value = configuracion.sucursal;
        DOM.configDireccion.value = configuracion.direccion;
        DOM.configTelefono.value = configuracion.telefono;
        DOM.configMoneda.value = configuracion.moneda;
        DOM.configFormatoMoneda.value = configuracion.formatoMoneda;
        if (DOM.logoPreview) DOM.logoPreview.src = configuracion.logo;
        if (DOM.configQrUrlInput) DOM.configQrUrlInput.value = configuracion.qrUrl || '';
        if (DOM.configPrimaryColorInput) DOM.configPrimaryColorInput.value = configuracion.primaryColor || '#2c3e50';
        if (DOM.configSecondaryColorInput) DOM.configSecondaryColorInput.value = configuracion.secondaryColor || '#3498db';
        if (DOM.configMostrarMontosSinDecimales) DOM.configMostrarMontosSinDecimales.checked = configuracion.mostrarMontosSinDecimales || false;
        if (DOM.configWhatsappReagendarTemplate) DOM.configWhatsappReagendarTemplate.value = configuracion.plantillaReagendar || '';
        if (DOM.configWhatsappPostVentaTemplate) DOM.configWhatsappPostVentaTemplate.value = configuracion.plantillaPostVenta || '';
        if (DOM.configWhatsappTemplate) DOM.configWhatsappTemplate.value = configuracion.plantillaWhatsapp || '';
    }
}

/**
 * Guarda la configuración en localStorage
 */
export function guardarConfiguracion() {
    const newConfig = {
        nombreEmpresa: DOM.configNombreEmpresa.value,
        sucursal: DOM.configSucursal.value,
        direccion: DOM.configDireccion.value,
        telefono: DOM.configTelefono.value,
        moneda: DOM.configMoneda.value,
        formatoMoneda: DOM.configFormatoMoneda.value,
        qrUrl: DOM.configQrUrlInput.value,
        primaryColor: DOM.configPrimaryColorInput.value,
        secondaryColor: DOM.configSecondaryColorInput.value,
        mostrarMontosSinDecimales: DOM.configMostrarMontosSinDecimales.checked,
        plantillaWhatsapp: DOM.configWhatsappTemplate.value,
        plantillaReagendar: DOM.configWhatsappReagendarTemplate.value,
        plantillaPostVenta: DOM.configWhatsappPostVentaTemplate.value,
        logo: configuracion.logo // Mantener el logo actual si no se carga uno nuevo
    };

    setConfiguracion(newConfig);
    localStorage.setItem('configuracion', JSON.stringify(configuracion));
    aplicarConfiguracion();
    mostrarMensaje("Configuración guardada correctamente.", "success");
    if (DOM.configuracionModal) DOM.configuracionModal.hide();
}

// Event Listeners para la configuración
if (DOM.configLogo) DOM.configLogo.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            if (DOM.logoPreview) DOM.logoPreview.src = event.target.result;
            setConfiguracion({ logo: event.target.result }); // Actualizar el logo en la configuración
        };
        reader.readAsDataURL(file);
    }
});

if (DOM.btnGuardarConfiguracion) DOM.btnGuardarConfiguracion.addEventListener('click', guardarConfiguracion);