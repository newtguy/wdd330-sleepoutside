import { getLocalStorage } from "./utils.mjs";

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
}
