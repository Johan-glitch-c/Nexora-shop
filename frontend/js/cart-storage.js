const CART_KEY = "nexora_cart";


function getCart() {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
        return [];
    }

    try {
        return JSON.parse(cart);
    } catch {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


function addToCart(product) {
    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();
}


function removeFromCart(productId) {
    const cart = getCart();

    const updatedCart = cart.filter(
        item => item.id !== productId
    );

    saveCart(updatedCart);

    updateCartCount();
}


function updateQuantity(productId, quantity) {
    const cart = getCart();

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    product.quantity = quantity;

    saveCart(cart);

    updateCartCount();
}


function clearCart() {
    localStorage.removeItem(CART_KEY);

    updateCartCount();
}


function getCartTotal() {
    const cart = getCart();

    return cart.reduce(
        (total, product) => {
            return total + (
                product.price * product.quantity
            );
        },
        0
    );
}


function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce(
        (total, product) => {
            return total + product.quantity;
        },
        0
    );


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {
            element.textContent = count;
        });
}


document.addEventListener(
    "DOMContentLoaded",
    updateCartCount
);