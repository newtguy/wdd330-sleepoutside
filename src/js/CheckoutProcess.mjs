import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const Service = new ExternalServices();

// takes the items currently stored in the cart (localstorage) and 
// returns them in a simplified form.
export function packageItems(items) {
    // convert the list of products from localStorage to the simpler form required for the checkout process.
    // An Array.map would be perfect for this process.
    return items.map(item => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: item.Quantity || 1
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.items = [];
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.orderTotal = 0;
        this.init();
    }

    init() {
        this.items = getLocalStorage(this.key) || [];
        this.calculateItemSubtotal();
    }

    calculateItemSubtotal() {
        // Sum item price × quantity
        this.subtotal = this.items.reduce((sum, item) => {
            const qty = item.Quantity || 1;
            return sum + item.FinalPrice * qty;
        }, 0);

        // Display subtotal
        const subtotalPriceElement = document.querySelector(`${this.outputSelector} #subtotal`);
        if (subtotalPriceElement) subtotalPriceElement.innerText = `$${this.subtotal.toFixed(2)}`;
    }

    calculateOrderTotals() {
        // Fixed 6% tax
        this.tax = this.subtotal * 0.06;

        // Shipping: $10 first, +$2 every additional item
        const totalItems = this.items.reduce((sum, item) => sum + (item.Quantity || 1), 0);
        this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;

        this.orderTotal = this.subtotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const totalPriceElement = document.querySelector(`${this.outputSelector} #total`);

        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (totalPriceElement) totalPriceElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        // get the form element data by the form name
        const formElement = document.querySelector(form);
        // convert the form data to a JSON order object using the formDataToJSON function
        const order = ExternalServices.formDataToJSON(formElement);
        // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
        const [year, month] = order.expiration.split("-");
        order.expiration = `${month}/${year.slice(-2)}`;
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.items);

        console.log(order);

        try {
            const response = await Service.checkout(order);
            console.log('Checkout response:', response);
            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html")
        } catch (error) {
            removeAllAlerts();
            alertMessage(error.message || "Checkout failed. Please check your info.");
            console.log('Checkout error:', error);
        }
    }
}

