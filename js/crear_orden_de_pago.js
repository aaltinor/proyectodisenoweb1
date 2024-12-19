fillTiposDePago(); 

async function fillTiposDePago()
{

    let response = await fetch('http://74.207.237.111:8000/api/tipos_pago/');

    let data = await response.json();

    let result = await data.results; 
  

    select = document.getElementById('tipos_de_pago');
    for (let i = 0; i < result.length; i++) 
    {   
        var opt = document.createElement('option');
        opt.id = result[i].id;
        opt.value = result[i].id;
        opt.innerHTML = result[i].descripcion;

        select.appendChild(opt);


    }
}

async function getEstadosDePago()
{

    

    let response = await fetch('http://74.207.237.111:8000/api/estados_pago/');

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
                moneda: $('#moneda').find(":selected").val(),
                documentacion_compensacion: $('#documento_compensacion').val(),
                fecha_factura: $('#fecha_factura').val(),
                fecha_pago: null,
                fecha_vencimiento: $('#fecha_vencimiento').val(),
                urgente: $('#urgente').val(),
                fecha_revisado: null, 
                id_estado_pago: id_creado,
                id_coordinador: user.id,
                id_tipo_pago: Number($('#tipos_de_pago').find(":selected").val()),
                id_analista: null, 

            };

            $.ajax({
                url: 'http://74.207.237.111:8000/api/ordenes_pago/',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function (response) {
                    location.reload();
                },
                error: function (xhr, error) {
                    console.error('Error al enviar la orden de pago:', error);
                    console.log(xhr.responseText);
                    alert('No se pudo enviar la orden de pago.');
                }
            });
        
        }); 


        
        
    });
});