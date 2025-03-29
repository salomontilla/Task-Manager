document.getElementById("register_btn").addEventListener("click", async (event) => {
    event.preventDefault(); 

    let username = document.getElementById("username_input").value.trim();
    let password = document.getElementById("password_input").value.trim();
    let email = document.getElementById("email_input").value.trim();
    let confirmPassword = document.getElementById("password_confirm_input").value.trim();

    if (!username || !password || !confirmPassword || !email) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/user/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, email, password })
        });

        if (!response.ok) {
            throw new Error("Error en el registro. Inténtalo de nuevo.");
        }

        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "./index.html";

    } catch (error) {
        alert(error.message);
    }
});
