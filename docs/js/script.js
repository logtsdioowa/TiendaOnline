let products = [];
let currentIndex = 0;

const loader = document.getElementById("loader");

// ================= SCROLL =================
function Escrolear() {
    let lastScroll = 0;
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll) {
            header.classList.add("header-hidden");
            footer.classList.add("footer-hidden");
        } else {
            header.classList.remove("header-hidden");
            footer.classList.remove("footer-hidden");
        }

        lastScroll = currentScroll;
    });
}

Escrolear();

// ================= LOAD DATA =================
window.addEventListener("load", async () => {

    try {
        const response = await fetch(`${API_URL}/Products`);

        if (!response.ok) {
            throw new Error("No autorizado o error en API");
        }

        const data = await response.json();

        const container = document.getElementById("productsContainer");
        products = data;

        data.forEach((product, index) => {
            const card = `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card" onclick="openModal(${index})">
                        <h5>${product.Name}</h5>

                        
                            <class="card-img-top">

                        <div class="card-body">
                            <img src="${API_BASE_URL}${product.Url}"
                            <p>${product.Description}</p>
                            <p><strong>$${product.Price}</strong></p>
                        </div>

                    </div>
                </div>
            `;

            container.insertAdjacentHTML("beforeend", card);
        });

    } catch (error) {
        console.error(error);
    } finally {

        //  UN SOLO CONTROL DEL LOADER
        if (loader) {
            loader.style.opacity = "0";
            loader.style.transition = "opacity 0.4s ease";

            setTimeout(() => {
                loader.style.display = "none";
            }, 400);
        }
    }
});

// ================= MODAL =================
function openModal(index) {
    currentIndex = index;
    showProduct();

    const modal = new bootstrap.Modal(
        document.getElementById('productModal')
    );
    modal.show();
}

function showProduct() {
    const product = products[currentIndex];

    document.getElementById("modalTitle").innerText = product.Name;
    document.getElementById("modalDescription").innerText = product.Description;
    document.getElementById("modalPrice").innerText = "$" + product.Price;

   const imageUrl = product.Url && product.Url.trim() !== ""
        ? `${API_BASE_URL}${product.Url}`
        : "https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand-thumbnail.png";

    document.getElementById("modalImage").src = imageUrl;
}


// ================= NAV =================
function nextProduct() {
    currentIndex = (currentIndex + 1) % products.length;
    showProduct();
}

function prevProduct() {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    showProduct();
}