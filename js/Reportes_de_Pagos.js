document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'http://74.207.237.111:8000/api/ordenes_pago';
    const coordinadorFilter = document.getElementById("coordinadorFilter");
    const analistaFilter = document.getElementById("analistaFilter");
    const tipoPagoFilter = document.getElementById("tipoPagoFilter");
    const applyFilters = document.getElementById("applyFilters");
    const rangeFilter = document.getElementById("rangeFilter");
    const rangeValue = document.getElementById("rangeValue");
    const paymentsTable = document.getElementById("paymentsTable").querySelector("tbody");

    // Actualizar valor del slider
    rangeFilter.addEventListener("input", () => {
        rangeValue.textContent = rangeFilter.value;
    });

    // Cargar filtros iniciales
    async function loadFilters() {
        try {
            const coordinadores = await fetch('http://74.207.237.111:8000/api/usuarios').then(res => res.json());
            const tiposPago = await fetch('http://74.207.237.111:8000/api/tipos_pago').then(res => res.json());
            const analistas = await fetch('http://74.207.237.111:8000/api/usuarios').then(res => res.json());

            coordinadores.forEach(user => {
                coordinadorFilter.innerHTML += `<option value="${user.id}">${user.nombre}</option>`;
            });
            analistas.forEach(user => {
                analistaFilter.innerHTML += `<option value="${user.id}">${user.nombre}</option>`;
            });
            tiposPago.forEach(tipo => {
                tipoPagoFilter.innerHTML += `<option value="${tipo.id}">${tipo.descripcion}</option>`;
            });
        } catch (error) {
            console.error('Error cargando filtros:', error);
        }
    }

    // Cargar datos iniciales
    async function loadPayments(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const data = await fetch(`${apiUrl}_read/?${params}`).then(res => res.json());
            paymentsTable.innerHTML = "";
            data.forEach(payment => {
                paymentsTable.innerHTML += `
                    <tr>
                        <td>${payment.fecha_de_ingreso}</td>
                        <td>${payment.id_coordinador?.nombre || 'N/A'}</td>
                        <td>${payment.id_analista?.nombre || 'N/A'}</td>
                        <td>${payment.id_tipo_pago?.descripcion || 'N/A'}</td>
                        <td>${payment.monto}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Error cargando pagos:', error);
            paymentsTable.innerHTML = `<tr><td colspan="5">Error al cargar los datos.</td></tr>`;
        }
    }

    // Aplicar filtros
    applyFilters.addEventListener("click", () => {
        const filters = {
            coordinador: coordinadorFilter.value,
            analista: analistaFilter.value,
            tipo_pago: tipoPagoFilter.value,
            limit: rangeFilter.value
        };
        loadPayments(filters);
    });

    // Inicialización
    loadFilters();
    loadPayments();
});
