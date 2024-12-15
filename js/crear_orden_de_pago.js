
async function getEstadosDePago()
{

    let api_call = 'http://74.207.237.111:8000/api/estados_pago/';

    let response = await fetch(api_call);

    let data = await response.json();

    let result = await data.results; 

    let id_creado = 0;
    for (let i = 0; i < result.length; i++) 
    {   

        if (result[i].descripcion.toUpperCase() === 'CREADO')
        {
            id_creado = result[i].id;
        }
    }

    return id_creado;

}


$(document).ready(function () {
    $('#orden_de_pago_form').on('submit', function (e) {
        e.preventDefault();

        getEstadosDePago().then(function(results){

            var id_creado = results;

            var user = JSON.parse(localStorage.getItem("logged_user"));
        
        

            var formData = {
                acreedor: $('#acreedor').val(),
                factura: $('#factura').val(),
                monto: $('#monto').val(),
                descuento: $('#descuento').val(),
                impuesto: $('#impuesto').val(),
                moneda: $('#moneda').val(),
                documento_compensacion: $('#documento_compensacion').val(),
                fecha_factura: $('#fecha_factura').val(),
                fecha_pago: null,
                fecha_vencimiento: $('#fecha_vencimiento').val(),
                urgente: $('#urgente').val(),
                fecha_revisado: null, 
                id_estado_pago: id_creado,
                id_coordinador: user.id,
                id_tipo_pago: null,
                id_analista: null, 

            };

            console.log(formData);
        
        }); 


        
        // $.ajax({
        //     url: api_call,
        //     method: 'POST',
        //     contentType: 'application/json',
        //     data: JSON.stringify(formData),
        //     success: function (response) {
        //         location.reload();
        //     },
        //     error: function (xhr, error) {
        //         console.error('Error al enviar la orden de pago:', error);
        //         console.log(xhr.responseText);
        //         alert('No se pudo enviar la orden de pago.');
        //     }
        // });
    });
});