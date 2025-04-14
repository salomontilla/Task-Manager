function showMessage(message, type) {
    let messageBox = document.getElementById("message");
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;

    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.className = "message";
    }, 3000);
}
window.showMessage = showMessage;

async function fetchWithAuth(url, options = {}) {
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Your session has expired. Please log in again.");
        window.location.href = "/public/login.html";
        return;
    }

   
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(url, options);

        if (response.status === 401 || response.status === 403) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("token"); 
            window.location.href = "/public/login.html";
            return;
        }
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred. Please try again.");
    }
}
window.fetchWithAuth = fetchWithAuth;