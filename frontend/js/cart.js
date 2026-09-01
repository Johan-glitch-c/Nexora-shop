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

        const cart =
            await getCart();


        if (!cart.items || !cart.items.length) {

            renderEmptyCart();

            return;
        }


        const items =
            await Promise.all(
                cart.items.map(
                    async item => {

                        const product =
                            await getProduct(
                                item.product_id
                            );

                        return {
                            id: item.id,
                            quantity: item.quantity,
                            product: product,
                        };
                    }
                )
            );


        renderCart(
            items
        );


    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );


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


function renderCart(items) {

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
            .map(
                renderCartItem
            )
            .join("");


    const total =
        items.reduce(
            (
                sum,
                item
            ) => {

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


    const totalQuantity =
        items.reduce(
            (
                sum,
                item
            ) => {

                return sum +
                    item.quantity;

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
                    ${totalQuantity}
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


    attachCartEvents(
        items
    );
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


    const itemTotal =
        Number(product.price) *
        item.quantity;


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

                $${itemTotal.toFixed(2)}

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


function attachCartEvents(items) {

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


                    if (
                        currentQuantity <= 1
                    ) {

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

                window.location.href =
                    "checkout.html";
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
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}