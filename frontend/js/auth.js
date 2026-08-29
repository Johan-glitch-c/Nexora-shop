const TOKEN_KEY = "nexora_access_token";


function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}


function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}


function isAuthenticated() {
    return Boolean(getToken());
}


function logout() {
    removeToken();

    window.location.href = "login.html";
}