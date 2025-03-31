const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.querySelector("#tabla tbody");

    if (!token) {
        alert("Please log in...");
        window.location.href = "login.html";
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
            throw new Error("Error loading data");
        }
        return response.json();
    })
    .then(tasks => {
        tablaBody.innerHTML = "";

        if (tasks.length === 0) {
            tablaBody.innerHTML = `<tr ><td colspan="5" style="text-align: center";>You have no pending tasks!</td></tr>`;
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
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center">There was an error loading tasks</td></tr>`;
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");

    taskForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const status = document.getElementById("status").value.toUpperCase();
        console.log(status);
        

        if (!title || !description) {
            alert("Title and description are required!");
            return;
        }

        const newTask = {
            title,
            description,
            status,
        };

        try {
            
            const response = await fetch("http://localhost:8080/tasks", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to add task");

            const data = await response.json();
            alert("Task added successfully!");
            taskForm.reset();
            addTaskToTable(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding task. Please try again.");
        }
    });
});


function addTaskToTable(task) {
    const index = document.querySelectorAll("#tabla tbody tr").length;
    const tableBody = document.querySelector("#tabla tbody");
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

    tableBody.appendChild(row);
}

function logout(){
    const confirmLogout = confirm("Are you sure you want to log out?");
    if(confirmLogout){
        localStorage.removeItem("token");
        window.location.href = "/public/login.html";
    }
    
}