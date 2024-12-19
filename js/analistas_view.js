document.addEventListener('DOMContentLoaded', () => {
    const dateFrom = document.querySelector('#date-from');
    const dateTo = document.querySelector('#date-to');
    const filterButton = document.querySelector('#filter-button');
    const tableBody = document.querySelector('#payments-table tbody');
    const apiUrl = 'http://74.207.237.111:8000/api/ordenes_pago';
    let currentPage = 1;

    // Trigger filtering when the button is clicked
    filterButton.addEventListener('click', () => {
        const fromDate = dateFrom.value;
        const toDate = dateTo.value;
        if (validateDates(fromDate, toDate)) {
            fetchPayments(fromDate, toDate, currentPage);
        }
    });

    // Validate date inputs
    function validateDates(fromDate, toDate) {
        if (!fromDate || !toDate) {
            alert('Por favor, seleccione un rango de fechas válido.');
            return false;
        }
        if (new Date(fromDate) > new Date(toDate)) {
            alert('La fecha From no puede ser mayor que la fecha To.');
            return false;
        }
        return true;
    }

        async function fetchPayments(fromDate, toDate, page) {
        try {
            let queryParams = `?page=${page}`;
            if (fromDate) queryParams += `&fecha_pago__gte=${fromDate}`;
            if (toDate) queryParams += `&fecha_pago__lte=${toDate}`;
    
            const url = `${apiUrl}${queryParams}`;
            console.log('Fetching URL:', url);
    
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
    
            // Filter payments within the date range and id_estado_pago !== 14
            const filteredPayments = data.results.filter(payment => {
                const paymentDate = new Date(payment.fecha_pago);
                const from = new Date(fromDate);
                const to = new Date(toDate);
                return payment.id_estado_pago !== 14 && paymentDate >= from && paymentDate <= to;
            });
    
            if (filteredPayments.length === 0) {
                alert('No hay pagos para el rango de fechas seleccionado.');
                tableBody.innerHTML = '';
                return;
            }
    
            updateTable(filteredPayments);
            setupPagination(data.count, fromDate, toDate);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    }

    // Update table rows
    function updateTable(payments) {
        tableBody.innerHTML = ''; 
        payments.forEach(payment => {
            const status = payment.id_estado_pago === 12 ? 'No Pagada' : 'Other';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.id}</td>
                <td>${payment.fecha_pago}</td>
                <td>${payment.factura}</td>
                <td>${payment.acreedor}</td>
                <td>${payment.monto}</td>
                <td>${payment.urgente}</td>
                <td>${status}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Setup pagination
    function setupPagination(totalItems, fromDate, toDate) {
        const pagination = document.getElementById('pagination');
        const itemsPerPage = 10;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.disabled = i === currentPage;
            button.addEventListener('click', () => {
                currentPage = i;
                fetchPayments(fromDate, toDate, currentPage);
            });
            pagination.appendChild(button);
        }
    }
});
