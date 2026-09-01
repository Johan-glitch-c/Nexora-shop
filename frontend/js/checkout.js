document.addEventListener(
    "DOMContentLoaded",
    initCheckout
);


async function initCheckout() {

    if (!isAuthenticated()) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const cart =
            await getCart();


        if (!cart.items || !cart.items.length) {

            window.location.href =
                "cart.html";

            return;
        }


    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );

        window.location.href =
            "cart.html";
    }
}


const form =
    document.getElementById(
        "checkout-form"
    );


const errorElement =
    document.getElementById(
        "checkout-error"
    );


const submitButton =
    document.getElementById(
        "place-order"
    );


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        errorElement.textContent = "";


        const shippingAddress =
            document.getElementById(
                "shipping-address"
            ).value.trim();


        if (!shippingAddress) {

            errorElement.textContent =
                "Shipping address is required.";

            return;
        }


        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Creating order...";


            const order =
                await createOrder(
                    shippingAddress
                );


            window.location.href =
                `order.html?id=${order.id}`;


        } catch (error) {

            errorElement.textContent =
                error.message;

            submitButton.disabled = false;

            submitButton.textContent =
                "Place order";
        }

    }
);