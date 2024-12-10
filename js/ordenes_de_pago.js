fillDataTable();


async function fillDataTable()
{

    let result = [{"year":"2024", "mes":"10", "fecha":"2024-10-01", "ruta":"123", "gasto":"200"}, {"year":"2024", "mes":"12", "fecha":"2024-10-01", "ruta":"123", "gasto":"200"}];


    let array_test = [];
    for (let i = 0; i < result.length; i++) 
    {   
        let arr = [];
        arr.push(result[i].year);
        arr.push(result[i].mes);
        arr.push(result[i].fecha);
        arr.push(result[i].ruta);
        arr.push('CRC ' + result[i].gasto);
        array_test.push(arr);

    }



    table = new DataTable('#myTable', {
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
        },
        data: array_test,
        searchPanes: {
            threshold: 1,
            layout: 'columns-3'
        },
        dom: 'PQlfrtip',
        // footerCallback: function (row, data, start, end, display) {
        //     let api = this.api();
     
        //     // Quitar todo lo no númerico. En el caso de nuestra tabla, tenemos el CRC.
        //     let intVal = function (i) {
        //         return typeof i === 'string'
        //             ? i.replace(/[\CRC,]/g, '') * 1
        //             : typeof i === 'number'
        //             ? i
        //             : 0;
        //     };
            
        //     // Saca los totales de todas las página luego de filtrar.
        //     total = api
        //     .column(3, {filter:'applied'})
        //     .data()
        //     .reduce((a, b) => intVal(a) + intVal(b), 0);
            
        //     // Actualiza el footer del total.
        //     api.column(2).footer().innerHTML =
        //         'CRC ' + total;
        // }
    });


    return array_test;
}