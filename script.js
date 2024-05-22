// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjpLyfV-wo9uM6K14N0q9DzsabKIIX4gA",
    authDomain: "padelucky-e80e6.firebaseapp.com",
    projectId: "padelucky-e80e6",
    storageBucket: "padelucky-e80e6.appspot.com",
    messagingSenderId: "87499387761",
    appId: "1:87499387761:web:e446eb19d6505e924afcd0",
    measurementId: "G-HZRERWE8TS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Variables globales
let selectedTickets = [];
const ticketPrice = 99;
const totalTickets = 149;

// Crear tabla de boletos
const table = document.getElementById('ticketTable');
for (let i = 0; i < 10; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 10; j++) {
        const cell = row.insertCell();
        cell.textContent = (i * 10 + j + 1).toString().padStart(3, '0');
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
        db.ref('tickets/' + ticket).set({
            name,
            phone,
            state,
            status: 'reserved'
        });
    });

    // Redireccionar a WhatsApp
    window.location.href = whatsappURL;
});

// CRM Login
document.getElementById('crmLoginButton').addEventListener('click', () => {
    const password = document.getElementById('crmPassword').value;
    if (password === '560$Iimams') {
        document.getElementById('crmPanel').classList.remove('hidden');
    } else {
        alert('Contraseña incorrecta');
    }
});

// Cerrar panel CRM
document.querySelector('.closeButton').addEventListener('click', () => {
    document.getElementById('crmPanel').classList.add('hidden');
});
