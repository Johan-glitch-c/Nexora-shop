document.addEventListener(
    "DOMContentLoaded",
    loadAccount
);


async function loadAccount() {

    const container =
        document.getElementById(
            "account-content"
        );


    if (!isAuthenticated()) {

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
                    id="logout-button"
                    class="btn btn-secondary"
                >
                    Logout
                </button>

            </div>
        `;


        document
            .getElementById("logout-button")
            .addEventListener(
                "click",
                logout
            );


    } catch (error) {

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


function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}