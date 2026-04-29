const API_LOGIN = `${API_URL}/auth/login`;

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const errorBox = document.getElementById("error");
    errorBox.innerText = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        errorBox.innerText = "Completa todos los campos";
        return;
    }

    try {
        const res = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Password: password
            })
        });

        if (res.status === 401) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        if (!res.ok) {
            throw new Error("Error en el servidor");
        }

        const data = await res.json();

        if (!data.token) {
            throw new Error("El servidor no envió token");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "admin.html";

    } catch (err) {
        if (err.message.includes("Failed to fetch")) {
            errorBox.innerText = "No se puede conectar al servidor";
        } else {
            errorBox.innerText = err.message;
        }
    }
});