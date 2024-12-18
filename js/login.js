let api_call = 'http://74.207.237.111:8000/api/usuarios-contraseña/credenciales/?correo=';

let submit_button = document.getElementById("submit");


submit_button.addEventListener('click', function(e)
{

    const email = document.getElementById('email');    

    const password = document.getElementById('password');


    checkAttributes(api_call, email, password);
    
}, false);


/**
 * Hace un llamado al API de python que se le indica para validar campos
 *
 * @param {string} finalUrl API al cuál debe de llamar.
 * @return {boolean} Si/Applications/Postman.app/Contents/Resources/app.asar/html/scratchpad.html el campo fue encontrado o no.
 */
async function checkAttributes(api_call, email, password)
{

    let finalUrl = api_call + email.value;

    let response = await fetch(finalUrl, {"method":"get"});   
    

    let data = await response.json();
    console.log(data);

    api_password = data.contrasena;

    if (password.value == '' || email.value == '')
    {
        document.getElementById('error-logger').innerHTML = 'Ingrese todos los datos';
    }
    else if (password.value == api_password)
    {
        let user = {
            correo: email.value,
            id: data.id,
            contrasena: password.value
        }
        localStorage.setItem("logged_user",JSON.stringify(user));
        if (data.id_rol === 15)
        {   
            window.location.href = "landing_page_coordinador_logeado.html";
        } else if (data.id_rol === 2)
        {
            window.location.href = "landing_page_analistas_logueado.html";
        }
        
    }  
    else if (data.error == 'Usuario no encontrado' && !(email.value  == ''))
    {
        document.getElementById('error-logger').innerHTML = 'Correo Incorrecto';
    } 
    else if (!(password.value == api_password) && !(password.value  == ''))
    {
        document.getElementById('error-logger').innerHTML = 'Contraseña Incorrecta';
    }
}
