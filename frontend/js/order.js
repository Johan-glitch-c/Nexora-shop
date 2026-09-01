document.addEventListener(
    "DOMContentLoaded",
    loadOrder
);


async function loadOrder() {

    const container =
        document.getElementById(
            "order-content"
        );


    if (!isAuthenticated()) {

        window.location.href =
            "login.html";

        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const orderId =
        params.get("id");


    if (!orderId) {

        container.innerHTML = `
            <div class="order-error">

                <h2>
                    Order not found
                </h2>

                <p>
                    Order ID is missing.
                </p>

                <a
                    href="account.html"
                    class="btn btn-primary"
                >
                    My account
                </a>

            </div>
        `;

        return;
    }


    try {

        const order =
            await getOrder(orderId);


        const items =
            await Promise.all(
                order.items.map(
                    async item => {

                        const product =
                            await getProduct(
                                item.product_id
                            );

                        return {
                            ...item,
                            product: product,
                        };
                    }
                )
            );


        renderOrder(
            order,
            items,
            container
        );


    } catch (error) {

        console.error(
            "Failed to load order:",
            error
        );


        container.innerHTML = `
            <div class="order-error">

                <h2>
                    Unable to load order
                </h2>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

                <a
                    href="account.html"
                    class="btn btn-primary"
                >
                    My account
                </a>

            </div>
        `;
    }
}

function renderOrder(
    order,
    items,
    container
) {

    container.innerHTML = `
        <div class="order-header">

            <div>

                <span class="section-label">
                    ORDER
                </span>

                <h1>
                    Order #${order.id}
                </h1>

                <p class="order-date">
                    ${formatDate(
                        order.created_at
                    )}
                </p>

            </div>


            <span class="order-status">
                ${escapeHtml(
                    order.status
                )}
            </span>

        </div>


        <div class="order-layout">

            <div class="order-items">

                <div class="order-section-heading">

                    <span class="section-label">
                        ITEMS
                    </span>

                    <h2>
                        Your order
                    </h2>

                </div>


                ${items
                    .map(
                        renderOrderItem
                    )
                    .join("")}

            </div>


            <aside class="order-summary">

                <div class="summary-card">

                    <span class="section-label">
                        ORDER SUMMARY
                    </span>

                    <h2>
                        Summary
                    </h2>


                    <div class="summary-row">

                        <span>
                            Items
                        </span>

                        <span>
                            ${items.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    item.quantity,
                                0
                            )}
                        </span>

                    </div>


                    <div class="summary-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            $${Number(
                                order.total_price
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <div class="order-shipping">

                        <span>
                            Shipping address
                        </span>

                        <strong>
                            ${escapeHtml(
                                order.shipping_address
                            )}
                        </strong>

                    </div>

                </div>

            </aside>

        </div>


        <div class="order-actions">

            <a
                href="account.html"
                class="btn btn-secondary"
            >
                My orders
            </a>


            <a
                href="catalog.html"
                class="btn btn-primary"
            >
                Continue shopping
            </a>

        </div>
    `;
}

function renderOrderItem(item) {

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
                <div class="order-item-placeholder">
                    N
                </div>
            `;


    const itemTotal =
        Number(item.price) *
        item.quantity;


    return `
        <article
            class="order-item"
        >

            <div class="order-item-image">
                ${image}
            </div>


            <div class="order-item-info">

                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>

                <span>
                    $${Number(
                        item.price
                    ).toFixed(2)}
                    ×
                    ${item.quantity}
                </span>

            </div>


            <strong class="order-item-total">

                $${itemTotal.toFixed(2)}

            </strong>

        </article>
    `;
}

function formatDate(dateString) {

    return new Date(
        dateString
    ).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}


function escapeHtml(value) {

    return String(value)
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