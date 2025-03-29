document.getElementById("register_btn").addEventListener("click", async (event) => {
    event.preventDefault(); 

    let username = document.getElementById("username_input").value.trim();
    let password = document.getElementById("password_input").value.trim();
    let email = document.getElementById("email_input").value.trim();
    let confirmPassword = document.getElementById("password_confirm_input").value.trim();

    if (!username || !password || !confirmPassword || !email) {
        showMessage("Please, fill all fields", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords are not the same.", "error");
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

        showMessage("Successfully registered...", "success");
        window.location.href = "./index.html";

    } catch (error) {
        showMessage(error.message, "error");
    }
});

