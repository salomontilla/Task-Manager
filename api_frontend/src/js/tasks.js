const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
    const tablaBody = document.querySelector("#tabla tbody");

    if (!localStorage.getItem("token")) {
        alert("Please log in...");
        window.location.href = "/public/login.html";
        return;
    }

    try {
        const tasks = await fetchWithAuth("http://localhost:8080/tasks");

        tablaBody.innerHTML = "";

        if (!tasks || tasks.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">You have no pending tasks!</td></tr>`;
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
            tablaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">There was an error loading tasks</td></tr>`;
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-btn");
    const taskForm = document.getElementById("task-form");

    addTaskBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const status = document.getElementById("status").value.toUpperCase();

        if (!title || !description) {
            showMessage("Title and description are required!", "error");
            return;
        }

        const newTask = { title, description, status };

        try {
            const data = await fetchWithAuth("http://localhost:8080/tasks", {
                method: "POST",
                body: JSON.stringify(newTask),
            });

            showMessage("Task added successfully!", "succes");
            taskForm.reset();
            addTaskToTable(data);
        } catch (error) {
            console.error("Error:", error);
            showMessage("Error adding task. Please try again.", "error");
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

        const updatedTask = {
            id: taskId,
            title: document.getElementById("title").value.trim(),
            description: document.getElementById("description").value.trim(),
            status: document.getElementById("status").value.toUpperCase(),
        };

        if (!updatedTask.title || !updatedTask.description) {
            showMessage("Title and description are required!", "error");
            return;
        }

        try {
            await fetchWithAuth("http://localhost:8080/tasks", {
                method: "PUT",
                body: JSON.stringify(updatedTask),
            });

            showMessage("Task edited succesfully!", "success");
            taskForm.reset();

            // Actualizar la fila correspondiente en la tabla
            const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
            if (row) {
                row.children[1].textContent = updatedTask.title;
                row.children[2].textContent = updatedTask.description;
                const statusSpan = row.children[3].querySelector("span");
                statusSpan.textContent = updatedTask.status;
                statusSpan.className = `status ${updatedTask.status.toLowerCase()}`;
            }

            // Restablecer la UI al estado inicial
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
        await fetchWithAuth(`http://localhost:8080/tasks/${taskId}`, {
            method: "DELETE",
        });

        showMessage("Task deleted succesfully!", "success");

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
