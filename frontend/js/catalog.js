let allProducts = [];

let selectedCategory = "all";

let searchQuery = "";

let currentSort = "default";


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadCatalogCategories();

        await loadCatalogProducts();

        setupSearch();

        setupSort();

    }
);


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCatalogCategories() {

    const container =
        document.getElementById(
            "category-filters"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await getCategories();


        /*
         * Support different API response shapes.
         */

        const categories =
            Array.isArray(response)
                ? response
                : response?.category
                    ?? response?.categories
                    ?? [];


        if (!Array.isArray(categories)) {

            throw new Error(
                "Invalid categories response."
            );

        }


        container.innerHTML = `
            <button
                type="button"
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
                    type="button"
                    class="filter-btn"
                    data-category="${escapeHtml(category.id)}"
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

                        selectCategory(
                            button.dataset.category
                        );

                    }
                );

            });


        /*
         * Check URL for category.
         *
         * Example:
         * catalog.html?category=2
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const categoryId =
            params.get("category");


        if (categoryId !== null) {

            const button =
                container.querySelector(
                    `[data-category="${CSS.escape(categoryId)}"]`
                );


            if (button) {

                selectCategory(
                    categoryId
                );

            }

        }

    } catch (error) {

        console.error(
            "LOAD CATEGORIES ERROR:",
            error
        );


        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(
                    error?.message ||
                    "Failed to load categories."
                )}
            </div>
        `;

    }

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadCatalogProducts() {

    const container =
        document.getElementById(
            "catalog-products"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await getProducts();


        console.log(
            "CATALOG PRODUCTS RESPONSE:",
            response
        );


        /*
         * Your backend currently uses:
         *
         * {
         *     product: [...],
         *     total: ...
         * }
         *
         * But we also support an array
         * and `products`.
         */

        allProducts =
            Array.isArray(response)
                ? response
                : response?.product
                    ?? response?.products
                    ?? [];


        if (!Array.isArray(allProducts)) {

            allProducts = [];

        }


        console.log(
            "ALL PRODUCTS:",
            allProducts
        );


        renderCatalog();

    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );


        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(
                    error?.message ||
                    "Failed to load products."
                )}
            </div>
        `;

    }

}


/* =========================================================
   CATEGORY
========================================================= */

function selectCategory(categoryId) {

    selectedCategory =
        String(categoryId);


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                selectedCategory
            );

        });


    /*
     * Update URL.
     */

    const url =
        new URL(
            window.location.href
        );


    if (
        selectedCategory === "all"
    ) {

        url.searchParams.delete(
            "category"
        );

    } else {

        url.searchParams.set(
            "category",
            selectedCategory
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );


    renderCatalog();

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "catalog-search"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        event => {

            searchQuery =
                event.target.value
                    .trim()
                    .toLowerCase();


            renderCatalog();

        }
    );

}


/* =========================================================
   SORT
========================================================= */

function setupSort() {

    const select =
        document.getElementById(
            "sort-products"
        );


    if (!select) {

        return;

    }


    select.addEventListener(
        "change",
        event => {

            currentSort =
                event.target.value;


            renderCatalog();

        }
    );

}


/* =========================================================
   FILTER + SEARCH + SORT
========================================================= */

function getFilteredProducts() {

    let products =
        [...allProducts];


    /*
     * Category filter
     */

    if (
        selectedCategory !== "all"
    ) {

        products =
            products.filter(
                product =>
                    String(
                        product.category_id
                    ) ===
                    String(
                        selectedCategory
                    )
            );

    }


    /*
     * Search
     */

    if (searchQuery) {

        products =
            products.filter(
                product => {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    const slug =
                        String(
                            product.slug || ""
                        ).toLowerCase();


                    return (
                        name.includes(searchQuery) ||
                        description.includes(searchQuery) ||
                        slug.includes(searchQuery)
                    );

                }
            );

    }


    /*
     * Sort
     */

    switch (currentSort) {

        case "price-asc":

            products.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

            break;


        case "price-desc":

            products.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

            break;

    }


    return products;

}


/* =========================================================
   RENDER CATALOG
========================================================= */

function renderCatalog() {

    const products =
        getFilteredProducts();


    renderProducts(
        products
    );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(products) {

    const container =
        document.getElementById(
            "catalog-products"
        );


    const count =
        document.getElementById(
            "products-count"
        );


    if (!container) {

        return;

    }


    if (count) {

        count.textContent =
            `${products.length} ${
                products.length === 1
                    ? "product"
                    : "products"
            }`;

    }


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
            .map(
                renderProductCard
            )
            .join("");

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function renderProductCard(product) {

    const image =
        getProductImageUrl(
            product.image_url
        );


    const categoryName =
        product.category?.name ||
        "Uncategorized";


    return `
        <article
            class="product-card"
            data-id="${escapeHtml(product.id)}"
        >

            <div class="product-image">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(
                                    product.name ||
                                    "Product"
                                )}"
                            >
                        `
                        : `
                            <span class="product-placeholder">
                                N
                            </span>
                        `
                }

            </div>


            <div class="product-info">

                <span class="product-category">

                    ${escapeHtml(
                        categoryName
                    )}

                </span>


                <h3 class="product-name">

                    ${escapeHtml(
                        product.name ||
                        "Unnamed product"
                    )}

                </h3>


                <p class="product-description">

                    ${escapeHtml(
                        product.description ||
                        ""
                    )}

                </p>


                <div class="product-bottom">

                    <span class="product-price">

                        $${formatPrice(
                            product.price
                        )}

                    </span>


                    <a
                        href="product.html?id=${encodeURIComponent(
                            product.id
                        )}"
                        class="product-link"
                    >
                        View
                    </a>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   IMAGE URL
========================================================= */

function getProductImageUrl(imageUrl) {

    if (!imageUrl) {

        return null;

    }


    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {

        return imageUrl;

    }


    return `${API_BASE_URL}${imageUrl}`;

}


/* =========================================================
   PRICE
========================================================= */

function formatPrice(price) {

    const number =
        Number(price);


    if (!Number.isFinite(number)) {

        return "0.00";

    }


    return number.toFixed(2);

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}