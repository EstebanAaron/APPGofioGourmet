// Añadir estilos al documento
const style = document.createElement('style');
style.innerHTML = `
    /* Estilos para el logo */
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

    /* Animación de giro para el logo */
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Animación de voltereta para el chatbot */
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

    /* Estilos para el chatbot */
    #chatbot {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 300px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        display: none; /* Oculto por defecto */
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
    #chatbot-header {
        background: #007bff;
        color: #fff;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: center;
    }
    #chatbot-body {
        height: 300px;
        overflow-y: auto;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    #chatbot-input {
        display: flex;
        padding: 10px;
    }
    #chatbot-input input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-right: 10px;
    }
    #chatbot-input button {
        padding: 10px 20px;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
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
`;
document.head.appendChild(style);

// Añadir HTML al documento
const chatbotHTML = `
    <!-- Logo del chatbot -->
    <img id="chatbot-logo" src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Chatbot Logo">

    <!-- Ventana del chatbot -->
    <div id="chatbot">
        <div id="chatbot-header">
            Chatbot de Reservas
        </div>
        <div id="chatbot-body">
            <!-- Aquí se mostrarán los mensajes -->
        </div>
        <div id="chatbot-input">
            <input type="text" id="user-input" placeholder="Escribe tu mensaje...">
            <button onclick="sendMessage()">Enviar</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// Mostrar/ocultar el chatbot al hacer clic en el logo
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
            appendMessage('bot', 'Hola, buenas tardes. ¿En qué puedo ayudarte?');
        }, 10);
    }
});

// Función para enviar un mensaje al chatbot
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Mostrar el mensaje del usuario en el chat
    appendMessage('user', userInput);

    // Limpiar el input
    document.getElementById('user-input').value = '';

    try {
        // Enviar el mensaje a la API de Laravel
        const response = await fetch('https://bot.conectatec.com/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Procesar la respuesta JSON
        const data = await response.json();

        // Mostrar la respuesta del bot en el chat
        if (data.response) {
            appendMessage('bot', data.response);
        } else {
            appendMessage('bot', 'Lo siento, no pude generar una respuesta.');
        }
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Hubo un error al procesar tu mensaje.');
    }
}

// Función para agregar un mensaje al chat
function appendMessage(sender, message) {
    const chatBody = document.getElementById('chatbot-body');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageElement);

    // Desplazar el chat hacia abajo
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Escuchar el evento "Enter" para hacer submit del mensaje
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevenir el comportamiento por defecto (salto de línea)
        sendMessage();  // Llamar la función para enviar el mensaje
    }
});
