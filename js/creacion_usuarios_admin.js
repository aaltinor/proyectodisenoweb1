fillRoles(); 

async function fillRoles()
{

    let response = await fetch('http://74.207.237.111:8000/api/roles/');

    let data = await response.json();

    let result = await data.results; 
  

    select = document.getElementById('rol');
    for (let i = 0; i < result.length; i++) 
    {   
        var opt = document.createElement('option');
        opt.id = result[i].id;
        opt.value = result[i].id;
        opt.innerHTML = result[i].nombre_rol;

        select.appendChild(opt);


    }
}

$(document).ready(function () {
    $('#crear_usuarios').on('submit', function (e) {
        e.preventDefault();

    var formData = {
        cedula: $('#cedula').val(),
        nombre: $('#nombre').val(),
        primer_apellido: $('#primer_apellido').val(),
        segundo_apellido: $('#segundo_apellido').val(),
        estado: "Activo",
        correo: $('#correo').val(),
        contrasena: "12345678", 
        id_rol: $('#rol').find(":selected").val()
    }

    console.log(formData);
    $.ajax({
        url: 'http://74.207.237.111:8000/api/usuarios/',
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