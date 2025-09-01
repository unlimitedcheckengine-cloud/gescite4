// js/dataStore.js

import { configuracion, setConfiguracion, serviciosPredefinidos, setServiciosPredefinidos } from './constants.js';
import { mostrarMensaje, normalizarFecha, normalizarHora } from './utils.js';

export let citas = [];
export let clientes = [];
export let agentes = [];

export function cargarCitasDesdeStorage() {
    const citasGuardadas = localStorage.getItem('citas');
    citas = citasGuardadas ? JSON.parse(citasGuardadas) : [];
}

export function guardarCitasEnStorage() {
    localStorage.setItem('citas', JSON.stringify(citas));
}

export function cargarClientesDesdeStorage() {
    const clientesGuardados = localStorage.getItem('clientes');
    clientes = clientesGuardados ? JSON.parse(clientesGuardados) : [];
}

export function guardarClientesEnStorage() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

export function cargarAgentesDesdeStorage() {
    const agentesGuardados = localStorage.getItem('agentes');
    agentes = agentesGuardados ? JSON.parse(agentesGuardados) : [
        { id: 1, nombre: "Juan Pérez", email: "juan@checkenginerd.com", telefono: "809-555-0101", activo: true },
        { id: 2, nombre: "María García", email: "maria@checkenginerd.com", telefono: "809-555-0102", activo: true },
        { id: 3, nombre: "Carlos Rodríguez", email: "carlos@checkenginerd.com", telefono: "809-555-0103", activo: true }
    ];
}

export function guardarAgentesEnStorage() {
    localStorage.setItem('agentes', JSON.stringify(agentes));
}

export function cargarServiciosPredefinidosDesdeStorage() {
    const serviciosGuardados = localStorage.getItem('serviciosPredefinidos');
    if (serviciosGuardados) {
        setServiciosPredefinidos(JSON.parse(serviciosGuardados));
    } else {
        localStorage.setItem('serviciosPredefinidos', JSON.stringify(serviciosPredefinidos));
    }
}

export function guardarServiciosPredefinidosEnStorage() {
    localStorage.setItem('serviciosPredefinidos', JSON.stringify(serviciosPredefinidos));
}

export function migrarDatosAntiguos() {
    let necesitaGuardar = false;
    
    for (let i = 0; i < citas.length; i++) {
        // Si existe el campo 'vehiculo' pero no 'marca', migrar los datos
        if (citas[i].vehiculo && !citas[i].marca) {
            citas[i].marca = citas[i].vehiculo;
            delete citas[i].vehiculo;
            necesitaGuardar = true;
        }
        
        // Si no existe el campo 'modelo', crearlo vacío
        if (!citas[i].hasOwnProperty('modelo')) {
            citas[i].modelo = "";
            necesitaGuardar = true;
        }
        
        // Si no existe el campo 'agente', crearlo vacío
        if (!citas[i].hasOwnProperty('agente')) {
            citas[i].agente = "";
            necesitaGuardar = true;
        }
        
        // Si no existe el campo 'tieneCotizacion', crearlo con valor por defecto
        if (!citas[i].hasOwnProperty('tieneCotizacion')) {
            citas[i].tieneCotizacion = "no_aplica";
            necesitaGuardar = true;
        }
        
        // Si no existe el campo 'motivoCotizacion', crearlo vacío
        if (!citas[i].hasOwnProperty('motivoCotizacion')) {
            citas[i].motivoCotizacion = "";
            necesitaGuardar = true;
        }
        
        // Si no existe el campo 'otroServicio', crearlo vacío
        if (!citas[i].hasOwnProperty('otroServicio')) {
            citas[i].otroServicio = "";
            necesitaGuardar = true;
        }

        // Si no existen los campos de promoción, crearlos con valores por defecto
        if (!citas[i].hasOwnProperty('esPromocion')) {
            citas[i].esPromocion = false;
            citas[i].precioRegular = 0;
            citas[i].precioPromocional = 0;
            necesitaGuardar = true;
        }

        // Migración para el objeto de Seguimiento
        if (!citas[i].hasOwnProperty('seguimiento')) {
            citas[i].seguimiento = { status: 'pending', lastContact: null, notes: '' };
            necesitaGuardar = true;
        }

        // Migración para el objeto de Post-Venta
        if (!citas[i].hasOwnProperty('postVenta')) {
            citas[i].postVenta = { status: 'pending', lastContact: null, satisfaction: null, notes: '' };
            necesitaGuardar = true;
        }

        // Migración para campos de vehículo
        if (!citas[i].hasOwnProperty('region')) {
            citas[i].region = "";
            citas[i].combustible = "";
            citas[i].trim = "";
            necesitaGuardar = true;
        }

        // Normalizar fecha y hora para asegurar compatibilidad con FullCalendar
        const fechaOriginal = citas[i].fecha;
        const horaOriginal = citas[i].hora;
        
        const fechaNormalizada = normalizarFecha(fechaOriginal);
        const horaNormalizada = normalizarHora(horaOriginal);

        if (fechaNormalizada !== fechaOriginal || horaNormalizada !== horaOriginal) {
            citas[i].fecha = fechaNormalizada;
            citas[i].hora = horaNormalizada;
            necesitaGuardar = true;
        }
    }
    
    if (necesitaGuardar) {
        guardarCitasEnStorage();
        mostrarMensaje("Datos antiguos migrados y normalizados correctamente.", "info");
    }

    // Actualizar la versión de los datos para que la migración no se ejecute de nuevo.
    setConfiguracion({ dataVersion: '1.7' });
    localStorage.setItem('configuracion', JSON.stringify(configuracion));
}

export function actualizarCitasPasadas() {
    const hoy = new Date().toISOString().split('T')[0];
    let cambiosRealizados = false;

    citas.forEach(cita => {
        // Comprueba si la cita está pendiente y su fecha es anterior a hoy
        if (cita.estado === 'pendiente' && cita.fecha < hoy) {
            cita.estado = 'no_asistio';
            // No es necesario el if (cita.seguimiento) porque la migración asegura que existe.
            cita.seguimiento.status = 'pending'; // Resetear para que aparezca en seguimiento
            cambiosRealizados = true;
        }
    });

    if (cambiosRealizados) {
        guardarCitasEnStorage();
        mostrarMensaje("Se han actualizado las citas pendientes pasadas a 'No Asistió'.", 'info');
    }
}

export function sincronizarClientesDesdeCitas() {
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
        guardarClientesEnStorage();
    }
}