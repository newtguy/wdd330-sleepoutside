import { loadHeaderFooter, removeAllAlerts, alertMessage } from "./utils.mjs";
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

    const myForm = document.forms[0];
    const isValid = myForm.checkValidity();

    myForm.reportValidity();

    if (!isValid) {
      removeAllAlerts();
      showInvalidFieldAlerts(myForm);
      return;
    }

    await order.checkout(".checkout-form");
  });

function showInvalidFieldAlerts(form) {
  const invalidFields = Array.from(form.querySelectorAll(":invalid"));

  invalidFields.forEach((field) => {
    switch (field.name) {
      case "zip":
        alertMessage("Invalid Zip Code");
        break;
      case "cardNumber":
        alertMessage("Invalid Card Number");
        break;
      case "expiration":
        alertMessage("Invalid Expiration Date");
        break;
      case "code":
        alertMessage("Invalid Security Code");
        break;
      case "fname":
        alertMessage("First Name is required");
        break;
      case "lname":
        alertMessage("Last Name is required");
        break;
      case "street":
        alertMessage("Invalid Street Address");
        break;
      case "city":
        alertMessage("Invalid City");
        break;
      case "state":
        alertMessage("Invalid State, please enter 2 letter identifier");
        break;
      default:
        alertMessage("Please correct invalid fields.");
    }
  });
}
