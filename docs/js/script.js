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
        container.innerHTML = "";

        const groupedProducts = {};

        data.forEach((product, index) => {
            const categoryName = product.CategoryName || "Sin categoría";

            if (!groupedProducts[categoryName]) {
                groupedProducts[categoryName] = [];
            }

            groupedProducts[categoryName].push({
                ...product,
                originalIndex: index
            });
        });

        Object.keys(groupedProducts).forEach(categoryName => {
            const categoryId = categoryName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "");

            const section = `
                <section class="category-section mb-5">
                    <h2 class="category-title">${categoryName}</h2>
                    <div class="row" id="category-${categoryId}"></div>
                </section>
            `;

            container.insertAdjacentHTML("beforeend", section);

            const categoryContainer = document.getElementById(`category-${categoryId}`);

            groupedProducts[categoryName].forEach(product => {
                const imageUrl = product.Url && product.Url.trim() !== ""
                    ? `${API_BASE_URL}${product.Url}`
                    : "https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand-thumbnail.png";

                const card = `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card" onclick="openModal(${product.originalIndex})">
                            <img src="${imageUrl}"
                                 onerror="this.src='https://e7.pngegg.com/pngimages/829/733/png-clipart-logo-brand-product-trademark-font-not-found-logo-brand-thumbnail.png'"
                                 class="card-img-top">

                            <div class="card-body">
                                <h5>${product.Name}</h5>
                                <p>${product.Description || ""}</p>
                                <p><strong>$${product.Price}</strong></p>
                            </div>
                        </div>
                    </div>
                `;

                categoryContainer.insertAdjacentHTML("beforeend", card);
            });
        });

    } catch (error) {
        console.error(error);
    } finally {
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
        document.getElementById("productModal")
    );

    modal.show();
}

function showProduct() {
    const product = products[currentIndex];

    document.getElementById("modalTitle").innerText = product.Name;
    document.getElementById("modalDescription").innerText = product.Description || "";
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