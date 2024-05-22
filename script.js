// Inicializar variables globales
let selectedTickets = [];
const ticketPrice = 99;
const totalTickets = 149;

// Crear tabla de boletos
const table = document.getElementById('ticketTable');
for (let i = 0; i < 10; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 10; j++) {
        const cell = row.insertCell();
        const ticketNumber = (i * 10 + j + 1).toString().padStart(3, '0');
        cell.textContent = ticketNumber;
        cell.id = 'ticket-' + ticketNumber;
        cell.addEventListener('click', () => selectTicket(cell));
    }
}

// Seleccionar boleto
function selectTicket(cell) {
    const ticketNumber = cell.textContent;
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedTickets = selectedTickets.filter(ticket => ticket !== ticketNumber);
    } else {
        cell.classList.add('selected');
        selectedTickets.push(ticketNumber);
    }
    updateReserveButton();
}

// Actualizar botón de reservar
function updateReserveButton() {
    const reserveButton = document.getElementById('reserveButton');
    if (selectedTickets.length > 0) {
        reserveButton.disabled = false;
    } else {
        reserveButton.disabled = true;
    }
}

// Evento al reservar boletos
document.getElementById('reserveButton').addEventListener('click', () => {
    document.getElementById('customerForm').classList.remove('hidden');
});

// Enviar formulario de reserva
document.getElementById('reservationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const state = document.getElementById('state').value;
    const totalCost = selectedTickets.length * ticketPrice;

    const message = `Nombre: ${name}\nCelular: ${phone}\nEstado: ${state}\nBoletos: ${selectedTickets.join(', ')}\nTotal a pagar: $${totalCost}\nGracias por tu confianza, tienes 3 horas para apartar el boleto.`;
    const whatsappURL = `https://wa.me/526647185248?text=${encodeURIComponent(message)}`;

    // Guardar en Firebase
    selectedTickets.forEach(ticket => {
        firebase.database().ref('tickets/' + ticket).set({
            name,
            phone,
            state,
            status: 'reserved'
        });
    });

    // Redireccionar a WhatsApp
    window.location.href = whatsappURL;
});
