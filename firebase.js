// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjpLyfV-wo9uM6K14N0q9DzsabKIIX4gA",
    authDomain: "padelucky-e80e6.firebaseapp.com",
    databaseURL: "https://padelucky-e80e6-default-rtdb.firebaseio.com",
    projectId: "padelucky-e80e6",
    storageBucket: "padelucky-e80e6.appspot.com",
    messagingSenderId: "87499387761",
    appId: "1:87499387761:web:e446eb19d6505e924afcd0",
    measurementId: "G-HZRERWE8TS"
};

firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const db = firebase.database();

// Guardar boletos apartados
function saveBookedTickets(ticketNumber, customerData) {
    db.ref('bookedTickets/' + ticketNumber).set(customerData);
}

// Obtener boletos apartados
function getBookedTickets(callback) {
    db.ref('bookedTickets').once('value', snapshot => {
        callback(snapshot.val());
    });
}

// Verificar si un boleto está apartado
function checkTicketAvailability(ticketNumber, callback) {
    db.ref('bookedTickets/' + ticketNumber).once('value', snapshot => {
        callback(snapshot.val());
    });
}

// Reactivar un boleto apartado
function reactivateTicketInFirebase(ticketNumber) {
    db.ref('bookedTickets/' + ticketNumber).remove();
}
