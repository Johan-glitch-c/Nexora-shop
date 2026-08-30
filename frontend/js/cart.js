document.addEventListener(
    "DOMContentLoaded",
    renderCart
);


function renderCart() {

    const itemsContainer =
        document.getElementById(
            "cart-items"
        );

    const summaryContainer =
        document.getElementById(
            "cart-summary"
        );


    const cart = getCart();


    if (!cart.length) {

        itemsContainer.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products to get started.
                </p>

                <a
                    href="catalog.html"
                    class="btn btn-primary"
                >
                    Browse products
                </a>

            </div>
        `;

        summaryContainer.innerHTML = "";

        return;
    }


    itemsContainer.innerHTML =
        cart
            .map(renderCartItem)
            .join("");


    const total =
        getCartTotal();


    summaryContainer.innerHTML = `
        <div class="summary-card">

            <span class="section-label">
                ORDER SUMMARY
            </span>

            <h2>
                Summary
            </h2>


            <div class="summary-row">

                <span>
                    Products
                </span>

                <span>
                    ${cart.length}
                </span>

            </div>


            <div class="summary-row">

                <span>
                    Total
                </span>

                <strong>
                    $${total.toFixed(2)}
                </strong>

            </div>


            <button
                class="btn btn-primary checkout-btn"
                id="checkout-button"
            >
                Checkout
            </button>


            <button
                class="clear-cart"
                id="clear-cart"
            >
                Clear cart
            </button>

        </div>
    `;


    attachCartEvents();
}


function renderCartItem(product) {

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
                <div class="cart-placeholder">
                    N
                </div>
            `;


    return `
        <article
            class="cart-item"
            data-id="${product.id}"
        >

            <div class="cart-item-image">
                ${image}
            </div>


            <div class="cart-item-info">

                <span class="product-category">
                    Product #${product.id}
                </span>

                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>

                <strong class="cart-item-price">
                    $${product.price.toFixed(2)}
                </strong>

            </div>


            <div class="quantity-control">

                <button
                    class="quantity-btn decrease"
                    data-id="${product.id}"
                >
                    −
                </button>

                <span>
                    ${product.quantity}
                </span>

                <button
                    class="quantity-btn increase"
                    data-id="${product.id}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">
                $${(
                    product.price *
                    product.quantity
                ).toFixed(2)}
            </div>


            <button
                class="remove-btn"
                data-id="${product.id}"
            >
                Remove
            </button>

        </article>
    `;
}


function attachCartEvents() {

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    const product =
                        getCart().find(
                            item =>
                                item.id === id
                        );

                    if (!product) {
                        return;
                    }

                    updateQuantity(
                        id,
                        product.quantity + 1
                    );

                    renderCart();
                }
            );
        });


    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    const product =
                        getCart().find(
                            item =>
                                item.id === id
                        );

                    if (!product) {
                        return;
                    }

                    updateQuantity(
                        id,
                        product.quantity - 1
                    );

                    renderCart();
                }
            );
        });


    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    removeFromCart(id);

                    renderCart();
                }
            );
        });


    const clearButton =
        document.getElementById(
            "clear-cart"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                clearCart();

                renderCart();
            }
        );

    }


    const checkoutButton =
        document.getElementById(
            "checkout-button"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                alert(
                    "Checkout will be available soon."
                );
            }
        );

    }
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.addEventListener(
    "DOMContentLoaded",
    loadCart
);


async function loadCart() {

    const itemsContainer =
        document.getElementById(
            "cart-items"
        );

    const summaryContainer =
        document.getElementById(
            "cart-summary"
        );


    if (!isAuthenticated()) {

        itemsContainer.innerHTML = `
            <div class="empty-cart">

                <h2>
                    Please login
                </h2>

                <p>
                    You need to login to view your cart.
                </p>

                <a
                    href="login.html"
                    class="btn btn-primary"
                >
                    Login
                </a>

            </div>
        `;

        summaryContainer.innerHTML = "";

        return;
    }


    try {

        const cart = await getCart();


        if (!cart.items || !cart.items.length) {

            renderEmptyCart();

            return;
        }


        const products =
            await Promise.all(
                cart.items.map(
                    async item => {

                        const product =
                            await getProduct(
                                item.product_id
                            );

                        return {
                            ...item,
                            product,
                        };
                    }
                )
            );


        renderCart(
            products,
            cart
        );


    } catch (error) {

        itemsContainer.innerHTML = `
            <div class="loading">
                ${escapeHtml(
                    error.message
                )}
            </div>
        `;

        summaryContainer.innerHTML = "";
    }
}

function renderCart(
    items,
    cart
) {

    const itemsContainer =
        document.getElementById(
            "cart-items"
        );

    const summaryContainer =
        document.getElementById(
            "cart-summary"
        );


    itemsContainer.innerHTML =
        items
            .map(renderCartItem)
            .join("");


    const total =
        items.reduce(
            (sum, item) => {

                return sum +
                    (
                        Number(
                            item.product.price
                        ) *
                        item.quantity
                    );

            },
            0
        );


    summaryContainer.innerHTML = `
        <div class="summary-card">

            <span class="section-label">
                ORDER SUMMARY
            </span>

            <h2>
                Summary
            </h2>

            <div class="summary-row">
                <span>
                    Products
                </span>

                <span>
                    ${items.length}
                </span>
            </div>

            <div class="summary-row">
                <span>
                    Total
                </span>

                <strong>
                    $${total.toFixed(2)}
                </strong>
            </div>

            <button
                class="btn btn-primary checkout-btn"
                id="checkout-button"
            >
                Checkout
            </button>

            <button
                class="clear-cart"
                id="clear-cart"
            >
                Clear cart
            </button>

        </div>
    `;


    attachCartEvents();
}

function renderCartItem(item) {

    const product =
        item.product;


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
                <div class="cart-placeholder">
                    N
                </div>
            `;


    return `
        <article
            class="cart-item"
            data-id="${item.id}"
        >

            <div class="cart-item-image">
                ${image}
            </div>


            <div class="cart-item-info">

                <span class="product-category">
                    Product #${product.id}
                </span>

                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>

                <strong class="cart-item-price">
                    $${Number(
                        product.price
                    ).toFixed(2)}
                </strong>

            </div>


            <div class="quantity-control">

                <button
                    class="quantity-btn decrease"
                    data-id="${item.id}"
                    data-quantity="${item.quantity}"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    class="quantity-btn increase"
                    data-id="${item.id}"
                    data-quantity="${item.quantity}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                $${(
                    Number(product.price) *
                    item.quantity
                ).toFixed(2)}

            </div>


            <button
                class="remove-btn"
                data-id="${item.id}"
            >
                Remove
            </button>

        </article>
    `;
}


function attachCartEvents() {

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.id
                        );

                    const currentQuantity =
                        Number(
                            button.dataset.quantity
                        );


                    try {

                        await updateCartItem(
                            itemId,
                            currentQuantity + 1
                        );

                        await loadCart();

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            );
        });


    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.id
                        );

                    const currentQuantity =
                        Number(
                            button.dataset.quantity
                        );


                    if (currentQuantity <= 1) {

                        return;
                    }


                    try {

                        await updateCartItem(
                            itemId,
                            currentQuantity - 1
                        );

                        await loadCart();

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            );
        });


    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.id
                        );


                    try {

                        await deleteCartItem(
                            itemId
                        );

                        await loadCart();

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            );
        });


    const clearButton =
        document.getElementById(
            "clear-cart"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            async () => {

                try {

                    await clearCart();

                    await loadCart();

                } catch (error) {

                    alert(
                        error.message
                    );
                }
            }
        );
    }


    const checkoutButton =
        document.getElementById(
            "checkout-button"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                alert(
                    "Checkout will be available soon."
                );

            }
        );
    }
}


function renderEmptyCart() {

    const itemsContainer =
        document.getElementById(
            "cart-items"
        );

    const summaryContainer =
        document.getElementById(
            "cart-summary"
        );


    itemsContainer.innerHTML = `
        <div class="empty-cart">

            <div class="empty-cart-icon">
                🛒
            </div>

            <h2>
                Your cart is empty
            </h2>

            <p>
                Add some products to get started.
            </p>

            <a
                href="catalog.html"
                class="btn btn-primary"
            >
                Browse products
            </a>

        </div>
    `;


    summaryContainer.innerHTML = "";
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}