console.log("PRODUCTS.JS LOADED");


let productCategories = [];



document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("PRODUCTS DOM LOADED");

        initProductEvents();

        await loadProductCategories();

        await loadProductsAdmin();

    }
);

/* =========================================================
   INITIALIZATION
========================================================= */

function initProductEvents() {
    const addProductButton =
        document.getElementById("add-product-button");

    const productForm =
        document.getElementById("product-form");

    const closeModalButton =
        document.getElementById("close-modal");

    const cancelProductButton =
        document.getElementById("cancel-product");


    if (addProductButton) {
        addProductButton.addEventListener(
            "click",
            openCreateModal
        );
    }


    if (productForm) {
        productForm.addEventListener(
            "submit",
            saveProduct
        );
    }


    if (closeModalButton) {
        closeModalButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelProductButton) {
        cancelProductButton.addEventListener(
            "click",
            closeModal
        );
    }
}


/* =========================================================
   LOAD CATEGORIES FOR PRODUCT FORM
========================================================= */

async function loadProductCategories() {

    const select =
        document.getElementById(
            "product-category"
        );


    if (!select) {

        console.error(
            "PRODUCT CATEGORY SELECT NOT FOUND"
        );

        return;
    }


    try {

        console.log(
            "LOADING PRODUCT CATEGORIES"
        );


        const response =
            await getCategories();


        console.log(
            "PRODUCT CATEGORIES RESPONSE:",
            response
        );


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


        productCategories =
            categories;


        /*
         * Keep placeholder.
         */

        select.innerHTML = `
            <option
                value=""
                selected
                disabled
            >
                Select category
            </option>
        `;


        /*
         * Add categories.
         */

        categories.forEach(category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(category.id);


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        });


        console.log(
            "PRODUCT CATEGORIES LOADED:",
            productCategories
        );


    } catch (error) {

        console.error(
            "LOAD PRODUCT CATEGORIES ERROR:",
            error
        );


        select.innerHTML = `
            <option
                value=""
                selected
                disabled
            >
                Failed to load categories
            </option>
        `;

    }

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProductsAdmin() {
    console.log("LOAD PRODUCTS ADMIN START");

    const container =
        document.getElementById("products-list");

    if (!container) {
        console.error("PRODUCTS LIST CONTAINER NOT FOUND");
        return;
    }

    try {
        console.log("CALLING GET PRODUCTS");

        const response =
            await getProducts();

        console.log(
            "GET PRODUCTS RESPONSE:",
            response
        );

        const products =
            Array.isArray(response)
                ? response
                : response?.product
                    ?? response?.products
                    ?? [];

        console.log(
            "PRODUCTS ARRAY:",
            products
        );

        if (!Array.isArray(products) || !products.length) {
            container.innerHTML = `
                <div class="admin-empty">
                    No products found.
                </div>
            `;

            return;
        }

        container.innerHTML =
            products
                .map(renderProductRow)
                .join("");

        attachProductEvents();

    } catch (error) {
        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );

        container.innerHTML = `
            <div class="admin-error">
                ${escapeHtml(
                    error?.message ||
                    "Failed to load products."
                )}
            </div>
        `;
    }
}


/* =========================================================
   RENDER PRODUCT
========================================================= */

function renderProductRow(product) {

    const imageUrl =
        getProductImageUrl(
            product.image_url
        );

    return `
        <article
            class="admin-product-row"
            data-id="${escapeHtml(product.id)}"
        >

            <div class="admin-product-main">

                <div class="admin-product-image">

                    ${
                        imageUrl
                            ? `
                                <img
                                    src="${escapeHtml(imageUrl)}"
                                    alt="${escapeHtml(
                                        product.name ||
                                        "Product"
                                    )}"
                                >
                            `
                            : `
                                <div class="admin-product-no-image">
                                    N
                                </div>
                            `
                    }

                </div>


                <div class="admin-product-info">

                    <h3>
                        ${escapeHtml(
                            product.name ||
                            "Unnamed product"
                        )}
                    </h3>

                    <span>
                        ID: ${escapeHtml(product.id)}
                    </span>

                </div>

            </div>


            <div class="admin-product-category">

                ${
                    product.category
                        ? escapeHtml(
                            product.category.name ||
                            "No category"
                        )
                        : "No category"
                }

            </div>


            <div class="admin-product-price">

                $${formatPrice(product.price)}

            </div>


            <div class="admin-product-actions">

                <button
                    type="button"
                    class="admin-edit-button"
                    data-id="${escapeHtml(product.id)}"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="admin-delete-button"
                    data-id="${escapeHtml(product.id)}"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   PRODUCT EVENTS
========================================================= */

function attachProductEvents() {

    document
        .querySelectorAll(".admin-edit-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    /*
                     * ID = 0 is also valid.
                     */

                    if (
                        !Number.isInteger(id) ||
                        id < 0
                    ) {
                        console.error(
                            "INVALID PRODUCT ID:",
                            button.dataset.id
                        );

                        return;
                    }

                    editProduct(id);
                }
            );
        });


    document
        .querySelectorAll(".admin-delete-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    /*
                     * ID = 0 is also valid.
                     */

                    if (
                        !Number.isInteger(id) ||
                        id < 0
                    ) {
                        console.error(
                            "INVALID PRODUCT ID:",
                            button.dataset.id
                        );

                        return;
                    }

                    deleteProductAdmin(id);
                }
            );
        });
}


/* =========================================================
   CREATE PRODUCT
========================================================= */

function openCreateModal() {

    const form =
        document.getElementById(
            "product-form"
        );


    if (!form) {

        console.error(
            "PRODUCT FORM NOT FOUND"
        );

        return;
    }


    form.reset();


    const productId =
        document.getElementById(
            "product-id"
        );


    if (productId) {

        productId.value = "";

    }


    const categorySelect =
        document.getElementById(
            "product-category"
        );


    if (categorySelect) {

        categorySelect.value = "";

    }


    const modalLabel =
        document.getElementById(
            "modal-label"
        );


    if (modalLabel) {

        modalLabel.textContent =
            "NEW PRODUCT";

    }


    const modalTitle =
        document.getElementById(
            "modal-title"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Add product";

    }


    const errorElement =
        document.getElementById(
            "product-form-error"
        );


    if (errorElement) {

        errorElement.textContent = "";

    }


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   EDIT PRODUCT
========================================================= */

async function editProduct(productId) {

    try {

        console.log(
            "EDIT PRODUCT:",
            productId
        );

        const product =
            await getProduct(productId);

        console.log(
            "PRODUCT TO EDIT:",
            product
        );


        if (!product) {
            throw new Error(
                "Product not found."
            );
        }


        const productIdInput =
            document.getElementById(
                "product-id"
            );

        const productName =
            document.getElementById(
                "product-name"
            );

        const productSlug =
            document.getElementById(
                "product-slug"
            );

        const productDescription =
            document.getElementById(
                "product-description"
            );

        const productPrice =
            document.getElementById(
                "product-price"
            );

        const productCategory =
            document.getElementById(
                "product-category"
            );

        const productImage =
            document.getElementById(
                "product-image"
            );


        if (productIdInput) {
            productIdInput.value =
                product.id;
        }


        if (productName) {
            productName.value =
                product.name || "";
        }


        if (productSlug) {
            productSlug.value =
                product.slug || "";
        }


        if (productDescription) {
            productDescription.value =
                product.description || "";
        }


        if (productPrice) {
            productPrice.value =
                product.price ?? "";
        }


        if (productCategory) {
            productCategory.value =
                String(product.category_id ?? "");
        }


        if (productImage) {
            productImage.value =
                product.image_url || "";
        }


        const modalLabel =
            document.getElementById(
                "modal-label"
            );

        if (modalLabel) {
            modalLabel.textContent =
                "EDIT PRODUCT";
        }


        const modalTitle =
            document.getElementById(
                "modal-title"
            );

        if (modalTitle) {
            modalTitle.textContent =
                "Edit product";
        }


        const modal =
            document.getElementById(
                "product-modal"
            );

        if (modal) {
            modal.classList.remove(
                "hidden"
            );
        }

    } catch (error) {

        console.error(
            "EDIT PRODUCT ERROR:",
            error
        );

        alert(
            error?.message ||
            "Failed to load product."
        );
    }
}


/* =========================================================
   SAVE PRODUCT
========================================================= */

async function saveProduct(event) {

    event.preventDefault();

    console.log(
        "SAVE PRODUCT START"
    );


    const errorElement =
        document.getElementById(
            "product-form-error"
        );

    if (errorElement) {
        errorElement.textContent = "";
    }


    const productId =
        document.getElementById(
            "product-id"
        )?.value.trim();


    const name =
        document.getElementById(
            "product-name"
        )?.value.trim();


    const slug =
        document.getElementById(
            "product-slug"
        )?.value.trim();


    const description =
        document.getElementById(
            "product-description"
        )?.value.trim();


    const priceValue =
        document.getElementById(
            "product-price"
        )?.value;


    const categoryValue =
        document.getElementById(
            "product-category"
        )?.value.trim();


    const imageUrl =
        document.getElementById(
            "product-image"
        )?.value.trim();


    const price =
        Number(priceValue);


    const categoryId =
        Number(categoryValue);


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {
        showFormError(
            errorElement,
            "Product name is required."
        );

        return;
    }


    if (!slug) {
        showFormError(
            errorElement,
            "Product slug is required."
        );

        return;
    }


    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {
        showFormError(
            errorElement,
            "Price must be greater than 0."
        );

        return;
    }


    /*
     * IMPORTANT:
     *
     * category ID 0 IS VALID.
     *
     * We only reject an empty value
     * or a value that isn't an integer.
     */

    if (
        categoryValue === "" ||
        categoryValue === null ||
        categoryValue === undefined ||
        !Number.isInteger(categoryId)
    ) {
        showFormError(
            errorElement,
            "Please select a category."
        );

        return;
    }


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const productData = {

        name,

        slug,

        description:
            description || null,

        price,

        category_id:
            categoryId,

        image_url:
            imageUrl || null,
    };


    console.log(
        "PRODUCT DATA:",
        productData
    );


    /* =====================================================
       SAVE
    ===================================================== */

    try {

        /*
         * UPDATE
         */

        if (
            productId !== "" &&
            productId !== null &&
            productId !== undefined
        ) {

            const id =
                Number(productId);


            if (
                !Number.isInteger(id) ||
                id < 0
            ) {
                throw new Error(
                    "Invalid product ID."
                );
            }


            console.log(
                "UPDATING PRODUCT:",
                id
            );


            await updateProduct(
                id,
                {
                    id,
                    ...productData,
                }
            );

        }

        /*
         * CREATE
         */

        else {

            console.log(
                "CREATING PRODUCT"
            );


            await createProduct(
                productData
            );
        }


        /*
         * Close modal
         */

        closeModal();


        /*
         * Reload products
         */

        await loadProductsAdmin();


    } catch (error) {

        console.error(
            "SAVE PRODUCT ERROR:",
            error
        );


        showFormError(
            errorElement,
            error?.message ||
            "Failed to save product."
        );
    }
}


/* =========================================================
   DELETE PRODUCT
========================================================= */

async function deleteProductAdmin(productId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    try {

        console.log(
            "DELETE PRODUCT:",
            productId
        );


        await deleteProduct(
            productId
        );


        await loadProductsAdmin();


    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );


        alert(
            error?.message ||
            "Failed to delete product."
        );
    }
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "hidden"
    );
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


    if (
        typeof API_BASE_URL ===
        "undefined"
    ) {
        console.error(
            "API_BASE_URL IS NOT DEFINED"
        );

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
   FORM ERROR
========================================================= */

function showFormError(
    errorElement,
    message
) {

    if (errorElement) {
        errorElement.textContent =
            message;
    }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
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