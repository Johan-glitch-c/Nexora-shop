const API_BASE_URL = "http://127.0.0.1:8000";








async function apiRequest(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        }
    );


    if (!response.ok) {
        let errorMessage = "Something went wrong";

        try {
            const error = await response.json();
            errorMessage = error.detail || errorMessage;
        } catch {
            // Response doesn't contain JSON.
        }

        throw new Error(errorMessage);
    }


    if (response.status === 204) {
        return null;
    }


    return response.json();
}


async function getCategories() {
    return apiRequest("/api/category/");
}


async function getProducts() {
    return apiRequest("/api/product/");
}


async function getProduct(productId) {
    return apiRequest(`/api/product/${productId}`);
}


async function getProductsByCategory(categoryId) {
    return apiRequest(
        `/api/product/category/?category_id=${categoryId}`
    );
}