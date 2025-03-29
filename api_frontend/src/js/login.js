const submitBtn = document.getElementById("submit_btn");
submitBtn.addEventListener("click", userLogin);

async function userLogin(event) {
    event.preventDefault();
    
    let username = document.getElementById("username_input").value.trim();
    let password = document.getElementById("password_input").value.trim();

    if (!username || !password) {
        showMessage("Please, fill all fields", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/auth/login", { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Usuario o contraseña incorrectos");
        }
        showMessage("Successfully Logged in...", "success");
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "./dashboard.html";
        

    } catch (error) {
        alert(error.message);
    }
}

