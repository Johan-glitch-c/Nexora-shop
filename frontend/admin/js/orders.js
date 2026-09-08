console.log("ORDERS.JS LOADED");


let currentOrderId = null;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log("ORDERS DOM LOADED");

        initOrderEvents();
        loadOrdersAdmin();

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

function initOrderEvents() {

    const closeButton =
        document.getElementById(
            "close-order-modal"
        );

    const cancelButton =
        document.getElementById(
            "cancel-order"
        );

    const saveStatusButton =
        document.getElementById(
            "save-order-status"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeOrderModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeOrderModal
        );

    }


    if (saveStatusButton) {

        saveStatusButton.addEventListener(
            "click",
            updateOrderStatusAdmin
        );

    }

}


/* =========================================================
   LOAD ORDERS
========================================================= */

async function loadOrdersAdmin() {

    console.log(
        "LOAD ORDERS ADMIN START"
    );


    const container =
        document.getElementById(
            "orders-list"
        );


    if (!container) {

        console.error(
            "ORDERS LIST CONTAINER NOT FOUND"
        );

        return;
    }


    try {

        console.log(
            "CALLING GET ADMIN ORDERS"
        );


        const response =
            await getAdminOrders();


        console.log(
            "GET ADMIN ORDERS RESPONSE:",
            response
        );


        const orders =
            Array.isArray(response)
                ? response
                : response?.orders
                    ?? response?.items
                    ?? [];


        console.log(
            "ORDERS ARRAY:",
            orders
        );


        if (
            !Array.isArray(orders) ||
            !orders.length
        ) {

            container.innerHTML = `
                <div class="admin-empty">
                    No orders found.
                </div>
            `;

            return;
        }


        container.innerHTML =
            orders
                .map(renderOrderRow)
                .join("");


        attachOrderEvents();

    } catch (error) {

        console.error(
            "LOAD ORDERS ERROR:",
            error
        );


        container.innerHTML = `
            <div class="admin-error">
                ${escapeHtml(
                    error?.message ||
                    "Failed to load orders."
                )}
            </div>
        `;

    }

}


/* =========================================================
   RENDER ORDER
========================================================= */

function renderOrderRow(order) {

    const date =
        order.created_at
            ? new Date(
                order.created_at
            ).toLocaleString()
            : "Unknown";


    const status =
        order.status || "pending";


    return `
        <article
            class="admin-product-row"
            data-id="${escapeHtml(order.id)}"
        >

            <div class="admin-product-main">

                <div class="admin-product-image">

                    <div class="admin-product-no-image">
                        #
                    </div>

                </div>


                <div class="admin-product-info">

                    <h3>
                        Order #${escapeHtml(order.id)}
                    </h3>

                    <span>
                        User ID:
                        ${escapeHtml(order.user_id)}
                    </span>

                </div>

            </div>


            <div class="admin-product-category">

                ${escapeHtml(status)}

            </div>


            <div class="admin-product-price">

                $${formatPrice(order.total_price)}

            </div>


            <div class="admin-product-actions">

                <button
                    type="button"
                    class="admin-edit-button"
                    data-id="${escapeHtml(order.id)}"
                >
                    View
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   ORDER EVENTS
========================================================= */

function attachOrderEvents() {

    document
        .querySelectorAll(
            ".admin-edit-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const orderId =
                        Number(
                            button.dataset.id
                        );


                    if (
                        !Number.isInteger(orderId) ||
                        orderId < 0
                    ) {

                        console.error(
                            "INVALID ORDER ID:",
                            button.dataset.id
                        );

                        return;
                    }


                    openOrderModal(
                        orderId
                    );

                }
            );

        });

}


/* =========================================================
   OPEN ORDER
========================================================= */

async function openOrderModal(orderId) {

    console.log(
        "OPEN ORDER:",
        orderId
    );


    try {

        const order =
            await getAdminOrder(
                orderId
            );


        console.log(
            "ORDER DETAILS:",
            order
        );


        currentOrderId =
            order.id;


        const title =
            document.getElementById(
                "order-modal-title"
            );


        if (title) {

            title.textContent =
                `Order #${order.id}`;

        }


        const label =
            document.getElementById(
                "order-modal-label"
            );


        if (label) {

            label.textContent =
                `ORDER #${order.id}`;

        }


        const status =
            document.getElementById(
                "order-status"
            );


        if (status) {

            status.value =
                order.status || "pending";

        }


        renderOrderDetails(
            order
        );


        const modal =
            document.getElementById(
                "order-modal"
            );


        if (modal) {

            modal.classList.remove(
                "hidden"
            );

        }

    } catch (error) {

        console.error(
            "OPEN ORDER ERROR:",
            error
        );


        alert(
            error?.message ||
            "Failed to load order."
        );

    }

}


/* =========================================================
   RENDER ORDER DETAILS
========================================================= */

function renderOrderDetails(order) {

    const container =
        document.getElementById(
            "order-details"
        );


    if (!container) {

        return;
    }


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const itemsHtml =
        items.length
            ? items
                .map(item => {

                    const itemTotal =
                        Number(item.price || 0) *
                        Number(item.quantity || 0);


                    return `
                        <div class="admin-order-item">

                            <div>

                                <strong>
                                    Product #${escapeHtml(
                                        item.product_id
                                    )}
                                </strong>

                                <div>
                                    Quantity:
                                    ${escapeHtml(
                                        item.quantity
                                    )}
                                </div>

                            </div>

                            <div>

                                $${formatPrice(
                                    itemTotal
                                )}

                            </div>

                        </div>
                    `;

                })
                .join("")
            : `
                <div class="admin-empty">
                    No items in this order.
                </div>
            `;


    container.innerHTML = `

        <div class="admin-order-details">

            <div class="admin-order-info">

                <p>
                    <strong>Order ID:</strong>
                    ${escapeHtml(order.id)}
                </p>

                <p>
                    <strong>User ID:</strong>
                    ${escapeHtml(order.user_id)}
                </p>

                <p>
                    <strong>Total:</strong>
                    $${formatPrice(order.total_price)}
                </p>

                <p>
                    <strong>Shipping address:</strong>
                    ${escapeHtml(
                        order.shipping_address ||
                        "Not provided"
                    )}
                </p>

                <p>
                    <strong>Created:</strong>
                    ${escapeHtml(
                        order.created_at
                            ? new Date(
                                order.created_at
                            ).toLocaleString()
                            : "Unknown"
                    )}
                </p>

            </div>


            <h3>
                Items
            </h3>


            <div class="admin-order-items">

                ${itemsHtml}

            </div>

        </div>

    `;

}


/* =========================================================
   UPDATE STATUS
========================================================= */

async function updateOrderStatusAdmin() {

    if (
        currentOrderId === null ||
        currentOrderId === undefined
    ) {

        return;
    }


    const statusElement =
        document.getElementById(
            "order-status"
        );


    const errorElement =
        document.getElementById(
            "order-form-error"
        );


    if (!statusElement) {

        return;
    }


    const status =
        statusElement.value;


    if (errorElement) {

        errorElement.textContent = "";

    }


    const allowedStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
    ];


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        showFormError(
            errorElement,
            "Invalid order status."
        );

        return;
    }


    try {

        console.log(
            "UPDATING ORDER STATUS:",
            currentOrderId,
            status
        );


        await updateAdminOrderStatus(
            currentOrderId,
            status
        );


        closeOrderModal();


        await loadOrdersAdmin();

    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );


        showFormError(
            errorElement,
            error?.message ||
            "Failed to update order status."
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeOrderModal() {

    const modal =
        document.getElementById(
            "order-modal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    currentOrderId = null;

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