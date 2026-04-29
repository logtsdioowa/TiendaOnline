let products = [];
let categories = [];

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
      products = data
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

                    <button class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal"
                       onclick="openEditModal(${product.id})">>
                        Edit
                    </button>

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

function getProductId(product) {
    return product.id || product.Id || product.productId || product.ProductId;
}

function openEditModal(id) {
    console.log("ID recibido:", id);
    console.log("Productos:", products);

    const product = products.find(p => getProductId(p) == id);

    if (!product) {
        showNotification("Producto no encontrado para editar", "error");
        console.error("No se encontró producto con ID:", id);
        return;
    }

    document.getElementById("editId").value = getProductId(product);
    document.getElementById("editName").value = product.Name;
    document.getElementById("editDescription").value = product.Description;
    document.getElementById("editPrice").value = product.Price;
    document.getElementById("editCategory").value = product.CategoryId || "";
}

function setModalInfo(button) {
    selectedId = button.getAttribute("data-id");
}

function loadCategories() {
    fetch(`${API_URL}/Categories`)
        .then(res => res.json())
        .then(data => {
            categories = data;

            const addSelect = document.getElementById("addCategory");
            const editSelect = document.getElementById("editCategory");

            addSelect.innerHTML = `<option value="">Selecciona categoría</option>`;
            editSelect.innerHTML = `<option value="">Selecciona categoría</option>`;

            data.forEach(category => {
                addSelect.innerHTML += `<option value="${category.id}">${category.Name}</option>`;
                editSelect.innerHTML += `<option value="${category.id}">${category.Name}</option>`;
            });
        });
}

loadCategories();
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
    formData.append("Description", document.getElementById("addDescription").value||"");
    formData.append("Price", document.getElementById("addPrice").value);
    formData.append("CategoryId", document.getElementById("addCategory").value);

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
function updateProduct() {
    const id = document.getElementById("editId").value;

    if (!id) {
        showNotification("No se encontró el ID del producto", "error");
        return;
    }

    const formData = new FormData();

    formData.append("Name", document.getElementById("editName").value);
    formData.append("Description", document.getElementById("editDescription").value||"");
    formData.append("Price", document.getElementById("editPrice").value);
    formData.append("CategoryId", document.getElementById("editCategory").value);
    

    const file = document.getElementById("editImage").files[0];
    if (file) formData.append("image", file);

    fetch(`${API_URL}/Products/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al actualizar");
        return res.text();
    })
    .then(() => {
        showNotification("Producto actualizado correctamente");

        setTimeout(() => {
            location.reload();
        }, 1000);
    })
    .catch(() => {
        showNotification("Error al actualizar producto", "error");
    });
}