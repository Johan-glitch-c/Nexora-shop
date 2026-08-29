document.addEventListener(
    "DOMContentLoaded",
    updateAuthLink
);


async function updateAuthLink() {

    const authLink =
        document.getElementById(
            "auth-link"
        );


    if (!authLink) {
        return;
    }


    if (!isAuthenticated()) {

        authLink.textContent =
            "Login";

        authLink.href =
            "login.html";

        return;
    }


    authLink.textContent =
        "Account";

    authLink.href =
        "account.html";
}