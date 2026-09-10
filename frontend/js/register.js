document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "register-form"
            );

        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            register
        );

    }
);


async function register(event) {

    event.preventDefault();


    const errorElement =
        document.getElementById(
            "register-error"
        );


    if (errorElement) {
        errorElement.textContent = "";
    }


    const username =
        document
            .getElementById("username")
            ?.value
            .trim();


    const email =
        document
            .getElementById("email")
            ?.value
            .trim();


    const password =
        document
            .getElementById("password")
            ?.value;


    if (!username) {

        showRegisterError(
            errorElement,
            "Username is required."
        );

        return;
    }


    if (!email) {

        showRegisterError(
            errorElement,
            "Email is required."
        );

        return;
    }


    if (!password) {

        showRegisterError(
            errorElement,
            "Password is required."
        );

        return;
    }


    if (password.length < 8) {

        showRegisterError(
            errorElement,
            "Password must be at least 8 characters."
        );

        return;
    }


    try {

        await registerUser({
            username,
            email,
            password
        });


        window.location.href =
            "login.html";

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );


        showRegisterError(
            errorElement,
            error?.message ||
            "Registration failed."
        );

    }

}


function showRegisterError(
    element,
    message
) {

    if (element) {
        element.textContent = message;
    }

}