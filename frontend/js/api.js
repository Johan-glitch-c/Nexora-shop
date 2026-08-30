const API_BASE_URL = "http://127.0.0.1:8000";


async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };


    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );


    if (!response.ok) {

        let errorMessage =
            "Something went wrong";

        try {

            const error =
                await response.json();

            errorMessage =
                error.detail || errorMessage;

        } catch {
            // Response isn't JSON.
        }


        if (response.status === 401) {
            removeToken();
        }


        throw new Error(errorMessage);
    }


    if (response.status === 204) {
        return null;
    }


    return response.json();
}


// =========================
// CATEGORY
// =========================

async function getCategories() {
    return apiRequest(
        "/api/category/"
    );
}


// =========================
// PRODUCTS
// =========================

async function getProducts() {
    return apiRequest(
        "/api/product/"
    );
}


async function getProduct(productId) {
    return apiRequest(
        `/api/product/${productId}`
    );
}


async function getProductsByCategory(categoryId) {
    return apiRequest(
        `/api/product/category/?category_id=${categoryId}`
    );
}


// =========================
// AUTH
// =========================

async function registerUser(userData) {

    return apiRequest(
        "/api/users/",
        {
            method: "POST",

            body: JSON.stringify(
                userData
            ),
        }
    );
}


async function loginUser(userData) {

    return apiRequest(
        "/api/users/login",
        {
            method: "POST",

            body: JSON.stringify(
                userData
            ),
        }
    );
}


async function getCurrentUser() {

    return apiRequest(
        "/api/users/me"
    );
}


// =========================
// CART
// =========================

async function getCart() {
    return apiRequest(
        "/api/cart/"
    );
}


async function addCartItem(
    productId,
    quantity = 1
) {

    return apiRequest(
        "/api/cart/items",
        {
            method: "POST",

            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
            }),
        }
    );
}


async function updateCartItem(
    itemId,
    quantity
) {

    return apiRequest(
        `/api/cart/items/${itemId}`,
        {
            method: "PUT",

            body: JSON.stringify({
                quantity: quantity,
            }),
        }
    );
}


async function deleteCartItem(
    itemId
) {

    return apiRequest(
        `/api/cart/items/${itemId}`,
        {
            method: "DELETE",
        }
    );
}


async function clearCart() {

    return apiRequest(
        "/api/cart/",
        {
            method: "DELETE",
        }
    );
}