import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
    return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 
        <input type="number" value="${item.Quantity || 1}" min="1" class="qty-input"/>
      </p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item">❌</button>
    </li>`;
}

export default class ShoppingCart {
    constructor(listElement, storageKey = "so-cart") {
        this.listElement = listElement;
        this.storageKey = storageKey;
        this.items = [];
    }

    loadCart() {
        this.items = getLocalStorage(this.storageKey) || [];
    }

    saveCart() {
        setLocalStorage(this.storageKey, this.items);
    }

    init() {
        this.loadCart();
        this.render();
        this.attachListeners();
    }

    render() {
        const htmlItems = this.items.map(cartItemTemplate).join("");
        this.listElement.innerHTML = htmlItems;
    }

    attachListeners() {
        // Remove buttons
        this.listElement.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                const li = event.target.closest(".cart-card");
                const id = li.dataset.id;
                this.removeItem(id);
            });
        });

        // Quantity inputs
        this.listElement.querySelectorAll(".qty-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const li = e.target.closest(".cart-card");
                const id = li.dataset.id;
                const qty = parseInt(e.target.value);
                this.updateQuantity(id, qty);
            });
        });
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.Id !== id);
        this.saveCart();
        this.render();
        this.attachListeners();
    }

    updateQuantity(id, qty) {
        const item = this.items.find(item => item.Id === id);
        if (item) {
            item.Quantity = qty;
            this.saveCart();
            this.render();
            this.attachListeners();
        }
    }
}