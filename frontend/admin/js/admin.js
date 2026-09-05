document.addEventListener(
    "DOMContentLoaded",
    checkAdmin
);


async function checkAdmin() {

    if (!isAuthenticated()) {
        window.location.href =
            "../login.html";

        return;
    }


    try {

        const user =
            await getCurrentUser();


        if (user.role !== "admin") {

            alert(
                "Admin access required"
            );

            window.location.href =
                "../index.html";

            return;
        }


        document.body.classList.add(
            "admin-authorized"
        );

    } catch (error) {

        removeToken();

        window.location.href =
            "../login.html";
    }
}