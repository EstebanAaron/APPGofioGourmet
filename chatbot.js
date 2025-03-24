// Añadir estilos al documento
const style = document.createElement('style');
style.innerHTML = `
    /* Estilos personalizados */
    #chatbot-logo {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
    }
    #chatbot-logo:hover {
        transform: scale(1.1);
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes flipIn {
        from {
            transform: rotateX(-90deg);
            opacity: 0;
        }
        to {
            transform: rotateX(0deg);
            opacity: 1;
        }
    }
    #chatbot {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 600px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    #chatbot.show {
        display: block;
        opacity: 1;
        transform: translateY(0);
        animation: flipIn 0.5s ease;
    }
    #chatbot-body {
        height: calc(100% - 170px);
        overflow-y: auto;
        padding: 10px;
    }
    .message {
        margin-bottom: 10px;
    }
    .message.user {
        text-align: right;
    }
    .message.bot {
        text-align: left;
    }
    .message p {
        display: inline-block;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
    }
    .message.user p {
        background: #007bff;
        color: #fff;
    }
    .message.bot p {
        background: #f1f1f1;
        color: #333;
    }
    .help-buttons {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
    }
    .help-buttons button {
        background:rgb(196, 211, 228);
        color: #333;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
    }
    .help-buttons button:hover {
        opacity: 1;
    }
    .form-step {
        display: none;
    }
    .form-step.active {
        display: block;
    }
    /* Estilos para el formulario de reserva */
    .reservation-form {
        background: #fff;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .reservation-form label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .reservation-form select, 
    .reservation-form input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .reservation-form button {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }
    .reservation-form button:hover {
        background: #0056b3;
    }
    .room-details {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    .children-ages-container {
        margin-top: 10px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 4px;
    }
    .form-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }
    .btn-prev {
        background: #6c757d !important;
    }
    .btn-next {
        background: #28a745 !important;
    }
    .language-selector {
        margin-bottom: 15px;
    }
`;
document.head.appendChild(style);

// Añadir HTML al documento
const chatbotHTML = `
    <!-- Logo del chatbot -->
    <img id="chatbot-logo" src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Chatbot Logo">

    <!-- Ventana del chatbot -->
    <div id="chatbot" class="card">
        <div id="chatbot-header" class="card-header text-white bg-primary">
            Chatbot de Reservas
        </div>
        <div id="chatbot-body" class="card-body">
            <!-- Aquí se mostrarán los mensajes -->
        </div>
        <div class="help-buttons p-2">
            <button class="btn btn-secondary" onclick="redirectTo('https://example.com/help1')">Ayuda 1</button>
            <button class="btn btn-secondary" onclick="redirectTo('https://example.com/help2')">Ayuda 2</button>
            <button class="btn btn-secondary" onclick="redirectTo('https://example.com/help1')">Ayuda 1</button>
            <button class="btn btn-secondary" onclick="redirectTo('https://example.com/help2')">Ayuda 2</button>
        </div>
        <div id="chatbot-input" class="input-group p-2">
            <input type="text" id="user-input" class="form-control" placeholder="Escribe tu mensaje...">
            <div class="input-group-append">
                <button class="btn btn-primary" onclick="sendMessage()">Enviar</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// Variables para el formulario de reserva
let reservationData = {
    roomsCount: 0,
    rooms: [],
    coupon: '',
    isCanaryResident: false,
    dateArrival: '',
    dateDeparture: '',
    language: 'es' // Idioma por defecto
};

// Modificar el evento de clic del logo del chatbot
document.getElementById('chatbot-logo').addEventListener('click', function() {
    const chatbotLogo = document.getElementById('chatbot-logo');
    const chatbot = document.getElementById('chatbot');
    chatbotLogo.style.animation = 'spin 0.5s ease';
    setTimeout(() => {
        chatbotLogo.style.animation = '';
    }, 500);
    if (chatbot.classList.contains('show')) {
        chatbot.classList.remove('show');
        setTimeout(() => {
            chatbot.style.display = 'none';
        }, 300);
    } else {
        chatbot.style.display = 'block';
        setTimeout(() => {
            chatbot.classList.add('show');
            if (!chatbot.dataset.greeted) {
                askForLanguage();
                chatbot.dataset.greeted = 'true';
            }
        }, 10);
    }
});
// Función para preguntar por el idioma
function askForLanguage() {
    const chatBody = document.getElementById('chatbot-body');
    const languageMessage = document.createElement('div');
    languageMessage.classList.add('message', 'bot');
    languageMessage.innerHTML = `
        <p>Por favor, seleccione su idioma / Please select your language:</p>
        <div class="language-options">
            <button onclick="setLanguage('es')">Español</button>
            <button onclick="setLanguage('en')">English</button>
            <button onclick="setLanguage('fr')">Français</button>
            <button onclick="setLanguage('de')">Deutsch</button>
        </div>
    `;
    chatBody.appendChild(languageMessage);
    
    // Añadir estilos para los botones de idioma
    const style = document.createElement('style');
    style.innerHTML = `
        .language-options {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        .language-options button {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
        }
        .language-options button:hover {
            background: #0056b3;
        }
    `;
    document.head.appendChild(style);
}

// Función para establecer el idioma
window.setLanguage = function(language) {
    reservationData.language = language;
    const chatBody = document.getElementById('chatbot-body');
    
    // Limpiar el mensaje de selección de idioma
    const languageMessage = chatBody.querySelector('.message.bot:last-child');
    if (languageMessage) {
        chatBody.removeChild(languageMessage);
    }
    
    // Mostrar mensaje de bienvenida en el idioma seleccionado
    const welcomeMessages = {
        es: '¡Hola! Soy tu asistente de reservas. ¿En qué puedo ayudarte hoy?',
        en: 'Hello! I am your booking assistant. How can I help you today?',
        fr: 'Bonjour ! Je suis votre assistant de réservation. Comment puis-je vous aider aujourd\'hui ?',
        de: 'Hallo! Ich bin Ihr Buchungsassistent. Wie kann ich Ihnen heute helfen?'
    };
    
    appendMessage('bot', welcomeMessages[language]);
    
    // Mostrar opciones de ayuda en el idioma seleccionado
    const helpButtons = document.querySelectorAll('.help-buttons button');
    const helpTexts = {
        es: ['Ayuda con reservas', 'Preguntas frecuentes', 'Contactar soporte', 'Políticas'],
        en: ['Booking help', 'FAQs', 'Contact support', 'Policies'],
        fr: ['Aide à la réservation', 'FAQ', 'Contacter le support', 'Politiques'],
        de: ['Buchungshilfe', 'FAQs', 'Support kontaktieren', 'Richtlinien']
    };
    
    helpButtons.forEach((button, index) => {
        button.textContent = helpTexts[language][index];
    });
    
    // Actualizar placeholder del input
    const placeholders = {
        es: 'Escribe tu mensaje...',
        en: 'Type your message...',
        fr: 'Tapez votre message...',
        de: 'Geben Sie Ihre Nachricht ein...'
    };
    document.getElementById('user-input').placeholder = placeholders[language];
    
    // Actualizar el título del chatbot
    const titles = {
        es: 'Chatbot de Reservas',
        en: 'Booking Chatbot',
        fr: 'Chatbot de Réservation',
        de: 'Buchungs-Chatbot'
    };
    document.getElementById('chatbot-header').textContent = titles[language];
};

// Función para enviar un mensaje al chatbot
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch('https://bot.conectatec.com/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        if (data.response) {
            appendMessage('bot', data.response);
            if (data.response.toLowerCase().includes('reserva') || data.response.toLowerCase().includes('reservation') || 
                data.response.toLowerCase().includes('réservation') || data.response.toLowerCase().includes('buchung')) {
                showReservationForm(reservationData.language);
            }
        } else {
            appendMessage('bot', getTranslation('Sorry, I could not generate a response.', reservationData.language));
        }
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', getTranslation('There was an error processing your message.', reservationData.language));
    }
}

// Función para agregar un mensaje al chat
function appendMessage(sender, message) {
    const chatBody = document.getElementById('chatbot-body');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Función para redirigir a una URL
function redirectTo(url) {
    window.location.href = url;
}

// Función de traducción simple
function getTranslation(key, language) {
    const translations = {
        'Hello, good afternoon. How can I help you?': {
            es: 'Hola, buenas tardes. ¿En qué puedo ayudarte?',
            en: 'Hello, good afternoon. How can I help you?',
            fr: 'Bonjour, bon après-midi. Comment puis-je vous aider?',
            de: 'Hallo, guten Tag. Wie kann ich Ihnen helfen?'
        },
        'Sorry, I could not generate a response.': {
            es: 'Lo siento, no pude generar una respuesta.',
            en: 'Sorry, I could not generate a response.',
            fr: 'Désolé, je n\'ai pas pu générer de réponse.',
            de: 'Entschuldigung, ich konnte keine Antwort generieren.'
        },
        'There was an error processing your message.': {
            es: 'Hubo un error al procesar tu mensaje.',
            en: 'There was an error processing your message.',
            fr: 'Une erreur s\'est produite lors du traitement de votre message.',
            de: 'Beim Verarbeiten Ihrer Nachricht ist ein Fehler aufgetreten.'
        },
        'Reservation Form': {
            es: 'Formulario de Reserva',
            en: 'Reservation Form',
            fr: 'Formulaire de Réservation',
            de: 'Reservierungsformular'
        },
        'Stay dates': {
            es: 'Fechas de estancia',
            en: 'Stay dates',
            fr: 'Dates de séjour',
            de: 'Aufenthaltsdaten'
        },
        'Select dates': {
            es: 'Seleccione fechas',
            en: 'Select dates',
            fr: 'Sélectionnez les dates',
            de: 'Daten auswählen'
        },
        'Number of rooms (max. 6 people per room)': {
            es: 'Número de habitaciones (máx. 6 personas por habitación)',
            en: 'Number of rooms (max. 6 people per room)',
            fr: 'Nombre de chambres (max. 6 personnes par chambre)',
            de: 'Anzahl der Zimmer (max. 6 Personen pro Zimmer)'
        },
        'Select...': {
            es: 'Seleccione...',
            en: 'Select...',
            fr: 'Sélectionner...',
            de: 'Auswählen...'
        },
        'room': {
            es: 'habitación',
            en: 'room',
            fr: 'chambre',
            de: 'Zimmer'
        },
        'rooms': {
            es: 'habitaciones',
            en: 'rooms',
            fr: 'chambres',
            de: 'Zimmer'
        },
        'Next': {
            es: 'Siguiente',
            en: 'Next',
            fr: 'Suivant',
            de: 'Weiter'
        },
        'Guest details': {
            es: 'Detalles de los huéspedes',
            en: 'Guest details',
            fr: 'Détails des invités',
            de: 'Gästedetails'
        },
        'Room': {
            es: 'Habitación',
            en: 'Room',
            fr: 'Chambre',
            de: 'Zimmer'
        },
        'Adults': {
            es: 'Adultos',
            en: 'Adults',
            fr: 'Adultes',
            de: 'Erwachsene'
        },
        'adult': {
            es: 'adulto',
            en: 'adult',
            fr: 'adulte',
            de: 'Erwachsener'
        },
        'adults': {
            es: 'adultos',
            en: 'adults',
            fr: 'adultes',
            de: 'Erwachsene'
        },
        'Children (0-12 years)': {
            es: 'Niños (0-12 años)',
            en: 'Children (0-12 years)',
            fr: 'Enfants (0-12 ans)',
            de: 'Kinder (0-12 Jahre)'
        },
        'children': {
            es: 'niños',
            en: 'children',
            fr: 'enfants',
            de: 'Kinder'
        },
        'child': {
            es: 'niño',
            en: 'child',
            fr: 'enfant',
            de: 'Kind'
        },
        'Previous': {
            es: 'Anterior',
            en: 'Previous',
            fr: 'Précédent',
            de: 'Zurück'
        },
        'Additional options': {
            es: 'Opciones adicionales',
            en: 'Additional options',
            fr: 'Options supplémentaires',
            de: 'Zusätzliche Optionen'
        },
        'Discount code (optional)': {
            es: 'Código de descuento (opcional)',
            en: 'Discount code (optional)',
            fr: 'Code de réduction (optionnel)',
            de: 'Rabattcode (optional)'
        },
        'Enter your coupon': {
            es: 'Introduzca su cupón',
            en: 'Enter your coupon',
            fr: 'Entrez votre coupon',
            de: 'Geben Sie Ihren Gutschein ein'
        },
        'I am a Canary Islands resident': {
            es: 'Soy residente canario',
            en: 'I am a Canary Islands resident',
            fr: 'Je suis résident des îles Canaries',
            de: 'Ich bin auf den Kanarischen Inseln ansässig'
        },
        'Book now': {
            es: 'Reservar ahora',
            en: 'Book now',
            fr: 'Réserver maintenant',
            de: 'Jetzt buchen'
        },
        'Children ages': {
            es: 'Edades de los niños',
            en: 'Children ages',
            fr: 'Âges des enfants',
            de: 'Alter der Kinder'
        },
        'Select age': {
            es: 'Seleccione edad',
            en: 'Select age',
            fr: 'Sélectionnez l\'âge',
            de: 'Alter auswählen'
        },
        'Child': {
            es: 'Niño',
            en: 'Child',
            fr: 'Enfant',
            de: 'Kind'
        },
        'year': {
            es: 'año',
            en: 'year',
            fr: 'an',
            de: 'Jahr'
        },
        'years': {
            es: 'años',
            en: 'years',
            fr: 'ans',
            de: 'Jahre'
        },
        'Please complete all required fields.': {
            es: 'Por favor complete todos los campos requeridos.',
            en: 'Please complete all required fields.',
            fr: 'Veuillez remplir tous les champs obligatoires.',
            de: 'Bitte füllen Sie alle erforderlichen Felder aus.'
        },
        'Room {roomNumber} exceeds the maximum of 6 people.': {
            es: 'La habitación {roomNumber} excede el máximo de 6 personas.',
            en: 'Room {roomNumber} exceeds the maximum of 6 people.',
            fr: 'La chambre {roomNumber} dépasse le maximum de 6 personnes.',
            de: 'Zimmer {roomNumber} überschreitet das Maximum von 6 Personen.'
        },
        'Please enter the age of all children in room {roomNumber}.': {
            es: 'Por favor ingrese la edad de todos los niños en la habitación {roomNumber}.',
            en: 'Please enter the age of all children in room {roomNumber}.',
            fr: 'Veuillez entrer l\'âge de tous les enfants dans la chambre {roomNumber}.',
            de: 'Bitte geben Sie das Alter aller Kinder in Zimmer {roomNumber} ein.'
        }
    };
    
    // Reemplazar marcadores de posición si existen
    if (key.includes('{roomNumber}')) {
        const roomNumber = key.match(/\{roomNumber\}/) ? key.match(/\{roomNumber\}/)[0] : null;
        if (roomNumber) {
            const translated = translations[key.replace(/\{roomNumber\}/, '')]?.[language] || key;
            return translated.replace('{roomNumber}', roomNumber);
        }
    }
    
    return translations[key]?.[language] || key;
}

// Función para mostrar el formulario de reserva en diferentes idiomas
function showReservationForm(language = 'es') {
    reservationData.language = language;
    const chatBody = document.getElementById('chatbot-body');
    const reservationForm = document.createElement('div');
    reservationForm.classList.add('message', 'bot');
    reservationForm.innerHTML = `
        <div class="reservation-form">
            <h4>${getTranslation('Reservation Form', language)}</h4>
            
            <div class="form-steps">
                <!-- Los pasos se generarán dinámicamente -->
            </div>
        </div>
    `;
    chatBody.appendChild(reservationForm);
    
    // Mostrar el primer paso en el idioma seleccionado
    showReservationStep1(language);
    
    // Asegurarse de que jQuery y daterangepicker están cargados
    loadDependencies();
}

// Función para cambiar el idioma del formulario
window.changeFormLanguage = function(language) {
    reservationData.language = language;
    const currentStep = document.querySelector('.form-step.active');
    if (currentStep.id === 'reservation-step-1') {
        showReservationStep1(language);
    } else if (currentStep.id === 'reservation-step-2') {
        showReservationStep2(language);
    } else if (currentStep.id === 'reservation-step-3') {
        showReservationStep3(language);
    }
};

// Paso 1: Fechas y número de habitaciones en diferentes idiomas
function showReservationStep1(language) {
    const formSteps = document.querySelector('.reservation-form .form-steps');
    formSteps.innerHTML = `
        <div class="form-step active" id="reservation-step-1">
            <div class="form-group">
                <label for="reservation-date-range">${getTranslation('Stay dates', language)}:</label>
                <input type="text" id="reservation-date-range" class="form-control" placeholder="${getTranslation('Select dates', language)}" required>
            </div>
            <div class="form-group">
                <label for="rooms-count">${getTranslation('Number of rooms (max. 6 people per room)', language)}:</label>
                <select id="rooms-count" class="form-control" required>
                    <option value="">${getTranslation('Select...', language)}</option>
                    <option value="1">1 ${getTranslation('room', language)}</option>
                    <option value="2">2 ${getTranslation('rooms', language)}</option>
                    <option value="3">3 ${getTranslation('rooms', language)}</option>
                    <option value="4">4 ${getTranslation('rooms', language)}</option>
                </select>
            </div>
            <div class="form-navigation">
                <button type="button" class="btn btn-next" onclick="validateReservationStep1()">${getTranslation('Next', language)}</button>
            </div>
        </div>
    `;
    
    // Configuración del datepicker según el idioma
    const localeSettings = {
        es: {
            format: 'DD/MM/YYYY',
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            firstDay: 1
        },
        en: {
            format: 'MM/DD/YYYY',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 0
        },
        fr: {
            format: 'DD/MM/YYYY',
            applyLabel: 'Appliquer',
            cancelLabel: 'Annuler',
            daysOfWeek: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
            monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            firstDay: 1
        },
        de: {
            format: 'DD.MM.YYYY',
            applyLabel: 'Anwenden',
            cancelLabel: 'Abbrechen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    };
    
    // Inicializar el datepicker
    $('#reservation-date-range').daterangepicker({
        locale: localeSettings[language] || localeSettings.es,
        opens: 'right'
    });

    $('#reservation-date-range').on('apply.daterangepicker', function(ev, picker) {
        reservationData.dateArrival = picker.startDate.format('DD/MM/YYYY');
        reservationData.dateDeparture = picker.endDate.format('DD/MM/YYYY');
    });
}

// Validar paso 1 y mostrar paso 2
window.validateReservationStep1 = function() {
    const language = reservationData.language;
    const dateRange = document.getElementById('reservation-date-range').value;
    const roomsCount = document.getElementById('rooms-count').value;
    
    if (!dateRange || !roomsCount) {
        appendMessage('bot', getTranslation('Please complete all required fields.', language));
        return;
    }
    
    reservationData.roomsCount = parseInt(roomsCount);
    reservationData.rooms = Array(reservationData.roomsCount).fill().map(() => ({ 
        adults: 2, 
        children: 0, 
        childrenAges: [] 
    }));
    
    showReservationStep2(language);
};

// Paso 2: Detalles por habitación en diferentes idiomas
function showReservationStep2(language) {
    const formSteps = document.querySelector('.reservation-form .form-steps');
    let html = `
        <div class="form-step active" id="reservation-step-2">
            <h5>${getTranslation('Guest details', language)}</h5>
    `;
    
    for (let i = 1; i <= reservationData.roomsCount; i++) {
        html += `
            <div class="room-details" data-room="${i}">
                <h6>${getTranslation('Room', language)} ${i}</h6>
                <div class="form-group">
                    <label for="adults-${i}">${getTranslation('Adults', language)}:</label>
                    <select id="adults-${i}" class="form-control adults-select" data-room="${i}" required>
                        <option value="1">1 ${getTranslation('adult', language)}</option>
                        <option value="2" selected>2 ${getTranslation('adults', language)}</option>
                        <option value="3">3 ${getTranslation('adults', language)}</option>
                        <option value="4">4 ${getTranslation('adults', language)}</option>
                        <option value="5">5 ${getTranslation('adults', language)}</option>
                        <option value="6">6 ${getTranslation('adults', language)}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="children-${i}">${getTranslation('Children (0-12 years)', language)}:</label>
                    <select id="children-${i}" class="form-control children-select" data-room="${i}" required>
                        <option value="0">0 ${getTranslation('children', language)}</option>
                        <option value="1">1 ${getTranslation('child', language)}</option>
                        <option value="2">2 ${getTranslation('children', language)}</option>
                        <option value="3">3 ${getTranslation('children', language)}</option>
                        <option value="4">4 ${getTranslation('children', language)}</option>
                    </select>
                </div>
                <div id="children-ages-${i}" class="children-ages-container" style="display: none;"></div>
            </div>
        `;
    }
    
    html += `
            <div class="form-navigation">
                <button type="button" class="btn btn-prev" onclick="showReservationStep1(document.getElementById('form-language').value)">${getTranslation('Previous', language)}</button>
                <button type="button" class="btn btn-next" onclick="validateReservationStep2()">${getTranslation('Next', language)}</button>
            </div>
        </div>
    `;
    
    formSteps.innerHTML = html;
    
    // Configurar event listeners
    document.querySelectorAll('.adults-select').forEach(select => {
        select.addEventListener('change', function() {
            const roomNum = parseInt(this.dataset.room);
            reservationData.rooms[roomNum-1].adults = parseInt(this.value);
            updateChildrenOptions(roomNum, language);
        });
    });
    
    document.querySelectorAll('.children-select').forEach(select => {
        select.addEventListener('change', function() {
            const roomNum = parseInt(this.dataset.room);
            const numChildren = parseInt(this.value);
            reservationData.rooms[roomNum-1].children = numChildren;
            showChildrenAgesInputs(roomNum, numChildren, language);
        });
    });
    
    // Inicializar selects
    for (let i = 1; i <= reservationData.roomsCount; i++) {
        updateChildrenOptions(i, language);
    }
}

// Actualizar opciones de niños según adultos seleccionados
function updateChildrenOptions(roomNum, language) {
    const adultsSelect = document.getElementById(`adults-${roomNum}`);
    const childrenSelect = document.getElementById(`children-${roomNum}`);
    const maxAdults = 6;
    const selectedAdults = parseInt(adultsSelect.value);
    const maxChildren = maxAdults - selectedAdults;
    
    // Actualizar opciones de niños
    const currentChildren = parseInt(childrenSelect.value);
    childrenSelect.innerHTML = `<option value="0">0 ${getTranslation('children', language)}</option>`;
    
    for (let i = 1; i <= maxChildren; i++) {
        childrenSelect.innerHTML += `<option value="${i}">${i} ${i === 1 ? getTranslation('child', language) : getTranslation('children', language)}</option>`;
    }
    
    // Ajustar selección actual si excede el nuevo máximo
    if (currentChildren > maxChildren) {
        childrenSelect.value = maxChildren;
        reservationData.rooms[roomNum-1].children = maxChildren;
        showChildrenAgesInputs(roomNum, maxChildren, language);
    } else if (currentChildren > 0) {
        showChildrenAgesInputs(roomNum, currentChildren, language);
    } else {
        document.getElementById(`children-ages-${roomNum}`).style.display = 'none';
    }
}

// Mostrar inputs de edades para niños
function showChildrenAgesInputs(roomNum, numChildren, language) {
    const container = document.getElementById(`children-ages-${roomNum}`);
    container.innerHTML = '';
    
    if (numChildren > 0) {
        container.style.display = 'block';
        container.innerHTML = `<p>${getTranslation('Children ages', language)}:</p>`;
        
        for (let i = 1; i <= numChildren; i++) {
            container.innerHTML += `
                <div class="form-group">
                    <label for="child-age-${roomNum}-${i}">${getTranslation('Child', language)} ${i}:</label>
                    <select id="child-age-${roomNum}-${i}" class="form-control child-age" required>
                        <option value="">${getTranslation('Select age', language)}</option>
                        ${Array.from({length: 13}, (_, age) => 
                            `<option value="${age}">${age} ${age === 1 ? 
                                getTranslation('year', language) : 
                                getTranslation('years', language)}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }
    } else {
        container.style.display = 'none';
    }
}

// Validar paso 2 y mostrar paso 3
window.validateReservationStep2 = function() {
    const language = reservationData.language;
    let isValid = true;
    
    // Validar que no se exceda el máximo de personas por habitación
    for (let i = 1; i <= reservationData.roomsCount; i++) {
        const adults = parseInt(document.getElementById(`adults-${i}`).value);
        const children = parseInt(document.getElementById(`children-${i}`).value);
        
        if (adults + children > 6) {
            appendMessage('bot', getTranslation('Room {roomNumber} exceeds the maximum of 6 people.', language).replace('{roomNumber}', i));
            isValid = false;
        }
        
        // Validar edades de los niños
        if (children > 0) {
            const ageInputs = document.querySelectorAll(`#children-ages-${i} .child-age`);
            for (let input of ageInputs) {
                if (!input.value) {
                    appendMessage('bot', getTranslation('Please enter the age of all children in room {roomNumber}.', language).replace('{roomNumber}', i));
                    isValid = false;
                    break;
                }
            }
        }
    }
    
    if (isValid) {
        // Guardar edades de los niños
        for (let i = 1; i <= reservationData.roomsCount; i++) {
            const children = reservationData.rooms[i-1].children;
            if (children > 0) {
                reservationData.rooms[i-1].childrenAges = [];
                const ageInputs = document.querySelectorAll(`#children-ages-${i} .child-age`);
                ageInputs.forEach(input => {
                    reservationData.rooms[i-1].childrenAges.push(parseInt(input.value));
                });
            }
        }
        
        showReservationStep3(language);
    }
};

// Paso 3: Cupón y residente canario en diferentes idiomas
function showReservationStep3(language) {
    const formSteps = document.querySelector('.reservation-form .form-steps');
    formSteps.innerHTML = `
        <div class="form-step active" id="reservation-step-3">
            <h5>${getTranslation('Additional options', language)}</h5>
            <div class="form-group">
                <label for="coupon">${getTranslation('Discount code (optional)', language)}:</label>
                <input type="text" id="coupon" class="form-control" placeholder="${getTranslation('Enter your coupon', language)}">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="is-canary-resident"> ${getTranslation('I am a Canary Islands resident', language)}
                </label>
            </div>
            <div class="form-navigation">
                <button type="button" class="btn btn-prev" onclick="showReservationStep2(document.getElementById('form-language').value)">${getTranslation('Previous', language)}</button>
                <button type="button" class="btn btn-next" onclick="submitReservation()">${getTranslation('Book now', language)}</button>
            </div>
        </div>
    `;
}

// Enviar reserva
window.submitReservation = function() {
   
    // Comprobar si el idioma es inglés o español, en caso contrario, establecer español
    if (reservationData.language !== 'es' && reservationData.language !== 'en') {
        reservationData.language = 'es';
    }
    const language = reservationData.language;
    // Guardar datos del paso 3
    reservationData.coupon = document.getElementById('coupon').value;
    reservationData.isCanaryResident = document.getElementById('is-canary-resident').checked;
    
    // Construir URL de reserva
    let url = `https://bookings.hotelparadisepark.com/${language}/book/search?loc=&dateArrival=${encodeURIComponent(reservationData.dateArrival)}&dateDeparture=${encodeURIComponent(reservationData.dateDeparture)}&roomsCount=${reservationData.roomsCount}`;
    
    // Añadir parámetros de cada habitación
    reservationData.rooms.forEach((room, index) => {
        url += `&adults_${index+1}=${room.adults}&children_${index+1}=${room.children}`;
        
        // Añadir edades de los niños si existen
        if (room.children > 0) {
            room.childrenAges.forEach((age, childIndex) => {
                url += `&childage_${index+1}_${childIndex+1}=${age}`;
            });
        }
    });
    
    // Añadir cupón si existe
    if (reservationData.coupon) {
        url += `&coupon=${encodeURIComponent(reservationData.coupon)}`;
    }
    
    // Añadir residente canario si está marcado
    if (reservationData.isCanaryResident) {
        url += `&resident=1`;
    }
    
    // Redirigir a la URL de reserva
    window.location.href = url;
};

// Cargar dependencias (jQuery y daterangepicker)
function loadDependencies() {
    if (typeof jQuery === 'undefined') {
        const scriptJQuery = document.createElement('script');
        scriptJQuery.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        scriptJQuery.onload = initDateRangePicker;
        document.head.appendChild(scriptJQuery);
    } else {
        initDateRangePicker();
    }
}

function initDateRangePicker() {
    if (typeof $.fn.daterangepicker === 'undefined') {
        const scriptMoment = document.createElement('script');
        scriptMoment.src = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js';
        
        const scriptDaterangepicker = document.createElement('script');
        scriptDaterangepicker.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-daterangepicker/3.1/daterangepicker.js';
        
        const linkDaterangepicker = document.createElement('link');
        linkDaterangepicker.rel = 'stylesheet';
        linkDaterangepicker.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-daterangepicker/3.1/daterangepicker.css';
        
        document.head.appendChild(scriptMoment);
        document.head.appendChild(scriptDaterangepicker);
        document.head.appendChild(linkDaterangepicker);
    }
}

// Escuchar el evento "Enter" para enviar mensajes
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
