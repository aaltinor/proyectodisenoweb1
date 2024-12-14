let api_call = 'http://74.207.237.111:8000/api/roles/';

fillDataTable(api_call);



async function fillDataTable(finalUrl)
{

    let response = await fetch(finalUrl);

    let data = await response.json();

    let result = await data.results; 
  
    let array_test = [];
    for (let i = 0; i < result.length; i++) 
    {   
        let arr = [];
        arr.push(result[i].id);
        arr.push(result[i].nombre_rol);
        arr.push('<button type="button" id="' + result[i].id + '"class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Borrar</button>');
        array_test.push(arr);

    }



    table = new DataTable('#myTable', {
        data: array_test,
        searchPanes: {
            threshold: 1,
            layout: 'columns-3'
        },
        'paging': false,
        dom: 'PQlfrtip',
        initComplete: function (settings, json) {
            var table = document.getElementById("myTable");
            var rowCount = table.rows.length;
        
            for (var r = 1; r < rowCount; r++) {
            
                const id = table.rows[r].cells[2].firstChild.id;
                document.getElementById(id).addEventListener('click', function(e)
                {
                
                    const finalUrl = 'http://74.207.237.111:8000/api/roles/' + id + '/';
    
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

let submit_button = document.getElementById("entity_submit");

submit_button.addEventListener('click', function(e)
{

    const rol = document.getElementById("nombre_rol").value; 

    const body = JSON.stringify({ "nombre_rol": rol });

    console.log(body);
    createEntityInDB(body);
    
}, false);


function createEntityInDB(body)
{


    // const finalUrl = api_call + '/?format=json';
   
 
    // console.log($.post('http://74.207.237.111:8000/api/roles/?format=json', body));

    const requestOptions = {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Allow': 'POST',
            'Content-Type': 'application/json',
        },
        body: {'nombre_rol':'mango'}
    };

    fetch('https://74.207.237.111:8000/api/roles/?format=json', requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};