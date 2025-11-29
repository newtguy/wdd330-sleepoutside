import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

// DOM elements
const cartElement = document.querySelector(".product-list");
const totalElement = document.querySelector(".cart-total");

// Initialize the cart
const cart = new ShoppingCart(cartElement, "so-cart", totalElement);

// Checkout
const checkoutButton = document.getElementById("checkout-button");

checkoutButton.addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});
