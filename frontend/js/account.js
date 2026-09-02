document.addEventListener(
    "DOMContentLoaded",
    loadAccount
);


async function loadAccount() {

    const container =
        document.getElementById(
            "account-content"
        );

    const ordersSection =
        document.getElementById(
            "orders-section"
        );


    if (!isAuthenticated()) {

        if (ordersSection) {
            ordersSection.style.display = "none";
        }


        container.innerHTML = `
            <div class="account-message">

                <h2>
                    You are not logged in
                </h2>

                <p>
                    Login to view your account.
                </p>

                <a
                    href="login.html"
                    class="btn btn-primary"
                >
                    Login
                </a>

            </div>
        `;

        return;
    }


    try {

        const user =
            await getCurrentUser();


        if (ordersSection) {
            ordersSection.style.display = "block";
        }


        container.innerHTML = `
            <div class="account-info">

                <div class="account-field">

                    <span>
                        Username
                    </span>

                    <strong>
                        ${escapeHtml(
                            user.username
                        )}
                    </strong>

                </div>


                <div class="account-field">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${escapeHtml(
                            user.email
                        )}
                    </strong>

                </div>


                <div class="account-field">

                    <span>
                        Member since
                    </span>

                    <strong>
                        ${formatDate(
                            user.created_at
                        )}
                    </strong>

                </div>

            </div>


            <div class="account-actions">

                <button
                    type="button"
                    id="logout-button"
                    class="btn btn-secondary"
                >
                    Logout
                </button>

            </div>
        `;


        const logoutButton =
            document.getElementById(
                "logout-button"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );
        }


        await loadOrders();


    } catch (error) {

        console.error(
            "Account loading error:",
            error
        );


        if (ordersSection) {
            ordersSection.style.display = "none";
        }


        container.innerHTML = `
            <div class="account-message">

                <h2>
                    Session expired
                </h2>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

                <a
                    href="login.html"
                    class="btn btn-primary"
                >
                    Login again
                </a>

            </div>
        `;
    }
}


async function loadOrders() {

    const container =
        document.getElementById(
            "orders-content"
        );


    if (!container) {
        return;
    }


    try {

        const orders =
            await getUserOrders();


        if (!orders || !orders.length) {

            container.innerHTML = `
                <div class="orders-empty">

                    <h3>
                        No orders yet
                    </h3>

                    <p>
                        Your orders
                        will appear here.
                    </p>

                    <a
                        href="catalog.html"
                        class="btn btn-primary"
                    >
                        Start shopping
                    </a>

                </div>
            `;

            return;
        }


        container.innerHTML =
    orders
        .map(
            (order, index) =>
                renderOrder(order, index + 1)
        )
        .join("");


    } catch (error) {

        console.error(
            "Orders loading error:",
            error
        );


        container.innerHTML = `
            <div class="orders-empty">

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>
        `;
    }
}


function renderOrder(order, orderNumber) {

    return `
        <article class="order-history-card">

            <div class="order-history-top">

                <div>

                    <span class="order-number">
                        Order #${orderNumber}
                    </span>

                    <span class="order-date">
                        ${formatDate(
                            order.created_at
                        )}
                    </span>

                </div>

                <span class="order-status">
                    ${escapeHtml(
                        order.status
                    )}
                </span>

            </div>

            <div class="order-history-bottom">

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

            <a
                href="order.html?id=${order.id}"
                class="order-view-link"
            >
                View order →
            </a>

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