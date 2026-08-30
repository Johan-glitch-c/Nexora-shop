document.addEventListener(
    "DOMContentLoaded",
    updateHeader
);


async function updateHeader() {

    const authLink =
        document.getElementById("auth-link");


    if (authLink) {

        if (isAuthenticated()) {

            authLink.textContent = "Account";
            authLink.href = "account.html";

        } else {

            authLink.textContent = "Login";
            authLink.href = "login.html";
        }
    }


    await updateCartCount();
}


async function updateCartCount() {

    const cartCountElements =
        document.querySelectorAll(".cart-count");


    if (!cartCountElements.length) {
        return;
    }


    if (!isAuthenticated()) {

        cartCountElements.forEach(
            element => {
                element.textContent = "0";
            }
        );

        return;
    }


    try {

        const cart = await getCart();


        const count =
            (cart.items || []).reduce(
                (total, item) => {

                    return total + item.quantity;

                },
                0
            );


        cartCountElements.forEach(
            element => {
                element.textContent = count;
            }
        );


    } catch (error) {

        console.error(
            "Failed to load cart count:",
            error
        );

        cartCountElements.forEach(
            element => {
                element.textContent = "0";
            }
        );
    }
}