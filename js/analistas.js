var id_orden;
let idOrdenSeleccionada;
let estadosPago = []; 
function cargarEstadosDePago() {
    fetch("http://74.207.237.111:8000/api/estados_pago/")
        .then(response => response.json())
        .then(data => {
            estadosPago = data.results; 
        })
        .catch(error => {
            console.error("Error al cargar los estados de pago:", error);
        });
}
function cargarOrdenes() {
    fetch("http://74.207.237.111:8000/api/ordenes_pago/")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar órdenes. Código: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tablaCuerpo = document.getElementById("tablaOrdenes").querySelector("tbody");
            tablaCuerpo.innerHTML = "";
            data.results.forEach(orden => {
                id_orden = orden.id;
                const estadoPago = obtenerEstadoPago(orden.id_estado_pago); 
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${orden.acreedor}</td>
                    <td>${orden.fecha_de_ingreso}</td>
                    <td>${orden.factura}</td>
                    <td>${orden.monto}</td>
                    <td>${orden.fecha_vencimiento}</td>
                    <td>${estadoPago}</td>
                    <td>${orden.urgente}</td>
                    <td>
                        <button onclick="abrirModalDevolucion(${orden.id})" class="btn btn-danger" type="button">Devolver</button>
                        <button onclick="marcarComoPagada(${orden.id})" class="btn btn-success">Marcar como Pagada</button>
                    </td>
                `;
                tablaCuerpo.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar órdenes:", error);
            alert("Hubo un problema al cargar las órdenes.");
        });
}

function obtenerEstadoPago(idEstadoPago) {
    const estado = estadosPago.find(estado => estado.id === idEstadoPago);
    return estado ? estado.descripcion : "Desconocido"; 
}
cargarEstadosDePago();
document.addEventListener('DOMContentLoaded', cargarOrdenes);
function abrirModalDevolucion(idOrden) {
    idOrdenSeleccionada = idOrden; 
    cargarTiposDevolucion(); 
    cargarAnalistas(); 
    const modalTitle = document.getElementById("modalLabel");
    modalTitle.textContent = `Devolver Orden ${idOrdenSeleccionada}`; 
    $('#devolucionModal').modal('show'); 
}

function cargarTiposDevolucion() {
    fetch("http://74.207.237.111:8000/api/tipos_devolucion/")
        .then(response => response.json())
        .then(data => {
            const selectTipoDevolucion = document.getElementById("tipoDevolucion");
            selectTipoDevolucion.innerHTML = ''; 
            data.results.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.id;
                option.textContent = tipo.descripcion;
                selectTipoDevolucion.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar tipos de devolución:", error));
}


function cargarAnalistas() {
    fetch("http://74.207.237.111:8000/api/usuarios/?id_rol=2")
        .then(response => response.json())
        .then(data => {
            const selectAnalista = document.getElementById("analista");
            selectAnalista.innerHTML = ''; 
            data.results.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario.id;
                option.textContent = `${usuario.nombre} ${usuario.primer_apellido}`;
                selectAnalista.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar analistas:", error));
}

function enviarDevolucion() {
    const descripcion = $("#descripcion").val();
    const acreedor = $("#acreedor").val();
    const idTipoDevolucion = $("#tipoDevolucion").val();
    const idAnalista = $("#analista").val();
    const idOrdenPago = idOrdenSeleccionada; 
    const data = {
        descripcion: descripcion,
        Acreedor: acreedor,
        id_tipo_devolucion: idTipoDevolucion,
        id_orden_pago: idOrdenPago,
        id_analista: idAnalista
    };
    $.ajax({
        url: 'http://74.207.237.111:8000/api/devoluciones/',  
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log('Devolución creada con éxito:', response);
            alert('Devolución enviada con éxito');
            $("#tablaOrdenes tbody tr").each(function() {
                if ($(this).data("id") == idOrdenPago) { // Usamos data-id para buscar la fila
                    $(this).remove();
                    return false; // Detenemos la iteración
                }
            });
            $('#devolucionModal').modal('hide');  
        },
        error: function(xhr, status, error) {
            console.error('Error al enviar la devolución:', error);
            alert('Hubo un error al enviar la devolución.');
        }
    });
}
document.getElementById("btnEnviarDevolucion").addEventListener("click", enviarDevolucion);

function marcarComoPagada(id, descripcion) {
    $.ajax({
        url: 'http://74.207.237.111:8000/api/estados_pago/', 
        method: 'GET',
        success: function (response) {
            console.log('Respuesta de estados de pago:', response); 
            let estadoPagadoId = null;
            if (response.results && Array.isArray(response.results)) {
                response.results.forEach(estado => {
                    console.log(estado); 
                    if (estado.descripcion.toLowerCase() === 'pagada') {
                        estadoPagadoId = estado.id;
                    }
                });
            } else {
                console.error('Respuesta inesperada de estados de pago:', response);
                alert('No se pudo obtener la lista de estados de pago.');
                return;
            }

            if (estadoPagadoId === null) {
                alert('No se encontró el estado de pago "Pagada"');
                return;
            }
        $.ajax({
            url: 'http://74.207.237.111:8000/api/ordenes_pago/' + id + '/', 
            method: 'GET',
            success: function (orden) {
                console.log('Estado actual de la orden:', orden.id_estado_pago);
                if (orden.id_estado_pago !== estadoPagadoId) {
                    const datosPago = {
                        "id_estado_pago": estadoPagadoId,
                        "descripcion": descripcion
                    };
                    $.ajax({
                        url: 'http://74.207.237.111:8000/api/ordenes_pago/' + id + '/',
                        method: 'PATCH',
                        contentType: 'application/json',
                        data: JSON.stringify(datosPago),
                        success: function (response) {
                            console.log('Estado de pago actualizado:', response);
                            alert('Estado de pago actualizado con éxito.');
                            cargarOrdenes(); 
                        },
                        error: function (xhr, status, error) {
                            console.error('Error al actualizar el estado de pago:', error);
                            alert('No se pudo actualizar el estado de pago.');
                        }
                    });
                } else {
                    alert('Esta orden ya está marcada como pagada.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener el estado de la orden:', error);
                alert('No se pudo obtener el estado de la orden.');
            }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los estados de pago:', error);
            alert('No se pudieron obtener los estados de pago.');
        }
    });
}
$(document).ready(function() {
    cargarOrdenes();
});