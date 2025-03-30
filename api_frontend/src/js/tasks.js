document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.querySelector("#tabla tbody");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No tienes una sesión activa. Inicia sesión primero.");
        window.location.href = "login.html"; // Redirige al login si no hay token
        return;
    }

    fetch("http://localhost:8080/tasks", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener las tareas");
        }
        return response.json();
    })
    .then(tasks => {
        tablaBody.innerHTML = "";

        if (tasks.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5">You have no pending tasks!</td></tr>`;
            return;
        }

        tasks.forEach((task, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td><span class="status ${task.status.toLowerCase()}">${task.status}</span></td>
                <td>
                    <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </td>
            `;
            tablaBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error:", error);
        tablaBody.innerHTML = `<tr><td colspan="5">There was an error loading tasks</td></tr>`;
    });
});