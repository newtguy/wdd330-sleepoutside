import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".order-summary");

// When zip code is entered, calculate order totals (tax, shipping, total)
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("change", () => {
    order.calculateOrderTotals();
  });
}

document
  .querySelector(".checkout-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    await order.checkout(".checkout-form");
  });
