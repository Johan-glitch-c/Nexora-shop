let allProducts = [];


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadCatalogCategories();

        await loadCatalogProducts();

        setupSort();
    }
);


async function loadCatalogCategories() {

    const container =
        document.getElementById("category-filters");


    try {

        const categories =
            await getCategories();


        container.innerHTML = `
            <button
                class="filter-btn active"
                data-category="all"
            >
                All products
            </button>
        `;


        categories.forEach(category => {

            container.insertAdjacentHTML(
                "beforeend",
                `
                <button
                    class="filter-btn"
                    data-category="${category.id}"
                >
                    ${escapeHtml(category.name)}
                </button>
                `
            );

        });


        container
            .querySelectorAll(".filter-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        selectCategory(button);
                    }
                );

            });


    } catch (error) {

        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


async function loadCatalogProducts() {

    try {

        const response =
            await getProducts();

        allProducts =
            response.products || [];


        renderProducts(allProducts);


        const params =
            new URLSearchParams(
                window.location.search
            );


        const categoryId =
            params.get("category");


        if (categoryId) {

            const button =
                document.querySelector(
                    `[data-category="${categoryId}"]`
                );


            if (button) {
                await selectCategory(button);
            }
        }


    } catch (error) {

        document.getElementById(
            "catalog-products"
        ).innerHTML = `
            <div class="loading">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


async function selectCategory(button) {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(item => {
        item.classList.remove("active");
    });


    button.classList.add("active");


    const categoryId =
        button.dataset.category;


    try {

        if (categoryId === "all") {

            renderProducts(allProducts);

            return;
        }


        const response =
            await getProductsByCategory(
                categoryId
            );


        renderProducts(
            response.products || []
        );

    } catch (error) {

        document.getElementById(
            "catalog-products"
        ).innerHTML = `
            <div class="loading">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function renderProducts(products) {

    const container =
        document.getElementById(
            "catalog-products"
        );


    const count =
        document.getElementById(
            "products-count"
        );


    count.textContent =
        `${products.length} products`;


    if (!products.length) {

        container.innerHTML = `
            <div class="loading">
                No products found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        products
            .map(renderProductCard)
            .join("");
}


function renderProductCard(product) {

    const image = product.image_url
        ? `
            <img
                src="${API_BASE_URL}${product.image_url}"
                alt="${escapeHtml(
                    product.name
                )}"
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
                    ${escapeHtml(
                        product.category.name
                    )}
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
                        $${Number(
                            product.price
                        ).toFixed(2)}
                    </span>

<a
    href="product.html?id=${product.id}"
    class="product-link"
>
    View
</a>

                </div>

            </div>

        </article>
    `;
}


function setupSort() {

    const select =
        document.getElementById(
            "sort-products"
        );


    select.addEventListener(
        "change",
        () => {

            let products =
                [...allProducts];


            switch (select.value) {

                case "price-asc":

                    products.sort(
                        (a, b) =>
                            a.price - b.price
                    );

                    break;


                case "price-desc":

                    products.sort(
                        (a, b) =>
                            b.price - a.price
                    );

                    break;

            }


            renderProducts(products);
        }
    );
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}