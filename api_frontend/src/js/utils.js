function showMessage(message, type) {
    let messageBox = document.getElementById("message");
    messageBox.textContent = message;
    messageBox.className = `message ${type}`; // Agrega clase según el tipo de mensaje

    setTimeout(() => {
        messageBox.textContent = ""; // Borra el mensaje después de 3s
        messageBox.className = "message";
    }, 3000);
}
window.showMessage = showMessage;