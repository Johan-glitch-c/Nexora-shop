document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadCategories(),
        loadProducts(),
    ]);
});


async function loadCategories() {
    const container =
        document.getElementById("categories-list");

    try {
        const categories = await getCategories();

        if (!categories.length) {
            container.innerHTML = `
                <div class="loading">
                    No categories yet.
                </div>
            `;

            return;
        }


        container.innerHTML = categories
            .slice(0, 4)
            .map((category, index) => `
                <a
                    href="catalog.html?category=${category.id}"
                    class="category-card"
                >
                    <span class="category-number">
                        0${index + 1}
                    </span>

                    <h3>
                        ${escapeHtml(category.name)}
                    </h3>
                </a>
            `)
            .join("");

    } catch (error) {
        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


async function loadProducts() {
    const container =
        document.getElementById("products-list");

    try {
        const response = await getProducts();

        const products =
            response.products || [];

        if (!products.length) {
            container.innerHTML = `
                <div class="loading">
                    No products yet.
                </div>
            `;

            return;
        }


        container.innerHTML = products
            .slice(0, 4)
            .map(renderProductCard)
            .join("");

    } catch (error) {
        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function renderProductCard(product) {
    const image = product.image_url
        ? `
            <img
                src="${API_BASE_URL}${product.image_url}"
                alt="${escapeHtml(product.name)}"
            >
        `
        : `
            <span class="product-placeholder">
                N
            </span>
        `;


    return `
        <article class="product-card">

            <div class="product-image">
                ${image}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHtml(product.category.name)}
                </span>

                <h3 class="product-name">
                    ${escapeHtml(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHtml(
                        product.description || ""
                    )}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        $${Number(product.price).toFixed(2)}
                    </span>

                    <a
                        href="#"
                        class="product-link"
                    >
                        View
                    </a>

                </div>

            </div>

        </article>
    `;
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}