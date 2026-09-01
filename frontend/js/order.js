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
            <div class="loading">
                Order ID is missing.
            </div>
        `;

        return;
    }


    try {

        const order =
            await getOrder(orderId);


        renderOrder(
            order,
            container
        );


    } catch (error) {

        container.innerHTML = `
            <div class="loading">
                ${escapeHtml(
                    error.message
                )}
            </div>
        `;
    }
}


function renderOrder(
    order,
    container
) {

    container.innerHTML = `
        <div class="order-card">

            <span class="section-label">
                ORDER CONFIRMED
            </span>

            <h1>
                Order #${order.id}
            </h1>

            <p class="order-status">
                Status: ${escapeHtml(
                    order.status
                )}
            </p>


            <div class="order-info">

                <div>
                    <span>
                        Shipping address
                    </span>

                    <strong>
                        ${escapeHtml(
                            order.shipping_address
                        )}
                    </strong>
                </div>


                <div>
                    <span>
                        Total
                    </span>

                    <strong>
                        $${Number(
                            order.total_price
                        ).toFixed(2)}
                    </strong>
                </div>

            </div>


            <div class="order-actions">

                <a
                    href="catalog.html"
                    class="btn btn-primary"
                >
                    Continue shopping
                </a>

                <a
                    href="account.html"
                    class="btn btn-secondary"
                >
                    My account
                </a>

            </div>

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