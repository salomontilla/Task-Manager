const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.querySelector("#tabla tbody");

    if (!token) {
        alert("Please log in...");
        window.location.href = "/public/login.html";
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
            row.dataset.taskId = task.id;
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
            console.log(row.dataset.taskId);
            tablaBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error:", error);
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center">There was an error loading tasks</td></tr>`;
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-btn");
    const taskForm = document.getElementById("task-form");

    addTaskBtn.addEventListener("click", async function (event) {
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

function editTask(taskId) {
    const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
    if (!row) {
        console.error("Task row not found.");
        return;
    }

    console.log(row);

    const title = row.children[1].textContent;
    const description = row.children[2].textContent;
    const status = row.children[3].querySelector("span").textContent.toLowerCase();

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    document.getElementById("status").value = status;

    // Cambia el título del formulario
    document.querySelector(".task-form-container h2").textContent = "Edit Task";    

    // Oculta el botón "Add Task" y muestra "Edit Task"
    document.getElementById("add-btn").style.display = "none";
    document.getElementById("edit-btn").style.display = "block";

    putMethod(taskId);
}

function putMethod(taskId) {
    const editBtn = document.getElementById("edit-btn");
    const taskForm = document.getElementById("task-form");

    editBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        const id = taskId;
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const status = document.getElementById("status").value.toUpperCase();

        if (!title || !description) {
            alert("Title and description are required!");
            return;
        }

        const updatedTask = {
            id,
            title,
            description,
            status,
        };

        try {
            const response = await fetch("http://localhost:8080/tasks", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error("Failed to edit task");

            alert("Task edited successfully!");
            taskForm.reset();

            const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
            if (row) {
                row.children[1].textContent = title;
                row.children[2].textContent = description;
                row.children[3].querySelector("span").textContent = status;
                row.children[3].querySelector("span").className = `status ${status.toLowerCase()}`;
            }

            // Restablece los botones al estado inicial
            document.getElementById("add-btn").style.display = "block";
            editBtn.style.display = "none";
            document.querySelector(".task-form-container h2").textContent = "Add Task";    

        } catch (error) {
            console.error("Error:", error);
            alert("Error editing task. Please try again.");
        }
    });
}

async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Failed to delete task");

        alert("Task deleted successfully!");

        const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
        if (row) {
            row.remove();
            updateTaskIndexes();
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error deleting task. Please try again.");
    }
}

function updateTaskIndexes() {
    const rows = document.querySelectorAll("#tabla tbody tr");
    rows.forEach((row, index) => {
        row.children[0].textContent = index + 1;
    });

    if (rows.length === 0) {
        document.querySelector("#tabla tbody").innerHTML = `
            <tr><td colspan="5" style="text-align: center;">You have no pending tasks!</td></tr>
        `;
    }
}
