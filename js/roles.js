let api_call = 'http://74.207.237.111:8000/api/roles';

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
        array_test.push(arr);

    }



    table = new DataTable('#myTable', {
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
        },
        columnDefs: [
            {
                data: null,
                defaultContent: '<button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Borrar</button>',
                targets: -1
            }
        ], 
        data: array_test,
        searchPanes: {
            threshold: 1,
            layout: 'columns-3'
        },
        dom: 'PQlfrtip',
        
    });


    return array_test;
}