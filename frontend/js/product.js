document.addEventListener(
    "DOMContentLoaded",
    loadProduct
);


async function loadProduct() {

    const container =
        document.getElementById(
            "product-detail"
        );


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        showError(
            container,
            "Product ID is missing."
        );

        return;
    }


    try {

        const product =
            await getProduct(productId);


        renderProduct(
            product,
            container
        );


    } catch (error) {

        showError(
            container,
            error.message
        );
    }
}


function renderProduct(
    product,
    container
) {

    const imageUrl =
        product.image_url
            ? `${API_BASE_URL}${product.image_url}`
            : null;


    const image =
        imageUrl
            ? `
                <img
                    src="${imageUrl}"
                    alt="${escapeHtml(
                        product.name
                    )}"
                >
            `
            : `
                <div class="product-detail-placeholder">
                    N
                </div>
            `;


    container.innerHTML = `
        <div class="product-detail-image">

            ${image}

        </div>


        <div class="product-detail-content">

            <span class="section-label">
                ${escapeHtml(
                    product.category.name
                )}
            </span>


            <h1>
                ${escapeHtml(
                    product.name
                )}
            </h1>


            <div class="product-detail-price">
                $${Number(
                    product.price
                ).toFixed(2)}
            </div>


            <p class="product-detail-description">

                ${escapeHtml(
                    product.description ||
                    "No description available."
                )}

            </p>


            <div class="product-detail-meta">

                <div>

                    <span>
                        Category
                    </span>

                    <strong>
                        ${escapeHtml(
                            product.category.name
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Product ID
                    </span>

                    <strong>
                        #${product.id}
                    </strong>

                </div>

            </div>


            <div class="product-detail-actions">

                <button
                    class="btn btn-primary"
                    id="add-to-cart"
                >
                    Add to cart
                </button>

            </div>

        </div>
    `;


    document
    .getElementById("add-to-cart")
    .addEventListener(
        "click",
        () => {

            addToCart(product);

            const button =
                document.getElementById(
                    "add-to-cart"
                );

            button.textContent = "Added to cart";

            setTimeout(() => {
                button.textContent =
                    "Add to cart";
            }, 1500);
        }
    );
}


function showError(
    container,
    message
) {

    container.innerHTML = `
        <div class="loading">
            ${escapeHtml(message)}
        </div>
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