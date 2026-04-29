

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

if (!token || !user) {
    window.location.href = "login.html";
}

function getProductImage(product) {
    if (!product.Url || product.Url.trim() === "") {
        return "https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand-thumbnail.png";
    }

    return `${API_BASE_URL}${product.Url}`;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

let selectedId = null;

fetch(`${API_URL}/Products`, {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => {
    if (!res.ok) throw new Error("Error al cargar productos");
    return res.json();
})
.then(data => {
    const container = document.getElementById("productsContainer");

    data.forEach(product => {
      const imageUrl = getProductImage(product);

            const card = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card">
                    <img src="${imageUrl}"
                        onerror="this.src='https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand-thumbnail.png'"
                        class="card-img-top">

                    <div class="card-body">
                        <h5>${product.Name}</h5>
                        <p>${product.Description}</p>
                        <p><strong>$${product.Price}</strong></p>

                        <button class="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            data-id="${product.id}"
                            onclick="setModalInfo(this)">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `;
        container.innerHTML += card;
    });
})
.catch(err => {
    showNotification("Error al cargar productos", "error");
});


function setModalInfo(button) {
    selectedId = button.getAttribute("data-id");
}


function deleteProduct() {
    fetch(`${API_URL}/Products/${selectedId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        location.reload();
    })
    .catch(err => {
        showNotification("Error al eliminar producto", "error");
    });
}


function createProduct() {
    const formData = new FormData();

    formData.append("Name", document.getElementById("addName").value);
    formData.append("Description", document.getElementById("addDescription").value);
    formData.append("Price", document.getElementById("addPrice").value);

    const file = document.getElementById("addImage").files[0];
    if (file) formData.append("image", file);

    fetch(`${API_URL}/Products`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        })
    .then(res => {
        if (!res.ok) {
            throw new Error("Error al crear producto");
        }
        return res.text();
    })
    .then(data => {
        showNotification("Producto agregado correctamente");

    setTimeout(() => {
        location.reload();
    }, 1000);
})
    .catch(err => {
        showNotification("Hubo un problema al guardar el producto", "error");
    });
}

function showNotification(message, type = "success") {
    const notif = document.getElementById("notification");

    notif.innerText = message;

    // colores según tipo
    if (type === "error") {
        notif.style.backgroundColor = "#dc3545";
    } else {
        notif.style.backgroundColor = "#28a745";
    }

    notif.classList.add("show");

    setTimeout(() => {
        notif.classList.remove("show");
    }, 2500);
}