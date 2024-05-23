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

// Máquina de la suerte
document.getElementById('randomTicketButton').addEventListener('click', () => {
    const ticketQuantity = parseInt(document.getElementById('ticketQuantity').value);
    if (ticketQuantity > 0 && ticketQuantity <= totalTickets) {
        const availableTickets = Array.from(document.querySelectorAll('#ticketTable td:not(.selected)'));
        for (let i = 0; i < ticketQuantity; i++) {
            const randomIndex = Math.floor(Math.random() * availableTickets.length);
            const selectedTicket = availableTickets.splice(randomIndex, 1)[0];
            selectTicket(selectedTicket);
        }
    }
});

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

// Botón de verificar
document.getElementById('verifyButton').addEventListener('click', () => {
    const ticketNumber = prompt('Ingrese el número de boleto a verificar:').padStart(3, '0');
    firebase.database().ref('tickets/' + ticketNumber).get().then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            alert(`Boleto ${ticketNumber} está reservado por:\nNombre: ${data.name}\nCelular: ${data.phone}\nEstado: ${data.state}`);
        } else {
            alert(`Boleto ${ticketNumber} está disponible.`);
        }
    });
});

// Botón de acceso
document.getElementById('accessButton').addEventListener('click', () => {
    document.getElementById('accessForm').classList.remove('hidden');
});

// Acceso al CRM
document.getElementById('accessVerificationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('accessPassword').value;
    if (password === '560$Iimams') {
        document.getElementById('accessForm').classList.add('hidden');
        document.getElementById('crmPanel').classList.remove('hidden');
    } else {
        alert('Contraseña incorrecta.');
    }
});
