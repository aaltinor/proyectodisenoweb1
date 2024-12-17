let api_call = 'http://74.207.237.111:8000/api/ordenes_pago_read/';

fillDataTable(api_call);



async function fillDataTable(finalUrl)
{

    let response = await fetch(finalUrl);

    let data = await response.json();

    let result = await data.results; 

    console.log(result);
  
    var user = JSON.parse(localStorage.getItem("logged_user"));
    let array_test = [];

    for (let i = 0; i < result.length; i++) 
    {   
        let arr = [];
        
        if (user.id === result[i].id_coordinador.id){

            arr.push(result[i].id);
            arr.push(result[i].fecha_de_ingreso);
            arr.push(result[i].acreedor);
            arr.push(result[i].factura);
            arr.push(result[i].monto);
            arr.push(result[i].descuento);
            arr.push(result[i].impuesto);
            arr.push(result[i].moneda);
            arr.push(result[i].id_estado_pago.descripcion);
            arr.push(result[i].documentacion_compensacion);
            arr.push(result[i].impuesto);
            arr.push(result[i].fecha_factura);
            arr.push(result[i].fecha_pago);
            arr.push(result[i].fecha_vencimiento);
            arr.push(result[i].id_tipo_pago.descripcion);
            arr.push(result[i].urgente);
            arr.push(result[i].id_analista.nombre + ' ' + result[i].id_analista.primer_apellido);
            arr.push(result[i].fecha_revisado);
            arr.push('<button type="button" id="' + result[i].id + '"class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Modificar</button> <button type="button" id="' + result[i].id + '_borrar"class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Borrar</button> <button type="button" id="' + result[i].id + '"class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Asignar</button>' );
            array_test.push(arr);
        }

    }



    table = new DataTable('#myTable', {
        data: array_test,
        searchPanes: {
            threshold: 1,

            columns: [1, 2, 7, 8, 11, 12, 13, 14, 15, 16, 17],
        },
        'paging': false,
        dom: 'PQlfrtip',
        initComplete: function (settings, json) {
            var table = document.getElementById("myTable");
            var rowCount = table.rows.length;
        
            for (var r = 1; r < rowCount; r++) {
            
                const id = table.rows[r].cells[18].childNodes[2].id;

                document.getElementById(id).addEventListener('click', function(e)
                {
                
                    const finalUrl = api_call + id.split('_')[0] + '/';
    
                    fetch(finalUrl, 
                    {
                        method: 'DELETE',
                    })
                    .then(() => {
                        window.location.reload();
                    })
                    .catch(error => console.error(error))
                }, false);
                
        
            }
        }
        
    });

    

    
    return array_test;
};
