import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

// DOM elements
const cartEl = document.querySelector(".product-list");
const totalEl = document.querySelector(".cart-total");

// Initialize the cart
const cart = new ShoppingCart(cartEl, "so-cart", totalEl);
cart.init();
