import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
    const quantity = item.Quantity || 1;
    const lineTotal = (item.FinalPrice * quantity).toFixed(2);

    return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">quantity:
        <input type="number" value="${quantity}" min="1" class="quantity-input"/>
      </p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item">❌</button>
    </li>`;
}

export default class ShoppingCart {
    constructor(listElement, storageKey = "so-cart", totalElement = null) {
        this.listElement = listElement;
        this.storageKey = storageKey;
        this.items = [];
        this.totalElement = totalElement;
        this.init();
    }

    init() {
        this.loadCart();
        this.render();
        this.attachListeners();
    }

    loadCart() {
        this.items = getLocalStorage(this.storageKey) || [];
    }

    saveCart() {
        setLocalStorage(this.storageKey, this.items);
    }

    calculateTotal() {
        let total = 0;
        this.items.forEach(item => {
            const quantity = item.Quantity || 1;
            total += item.FinalPrice * quantity;
        });
        return total;
    }

    render() {
        // Render cart items
        this.listElement.innerHTML = this.items.map(cartItemTemplate).join("");

        // Render total
        if (this.totalElement) {
            const total = this.calculateTotal().toFixed(2);
            this.totalElement.textContent = `Total: $${total}`;
        }
    }

    attachListeners() {
        // Remove button event delegation
        this.listElement.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-item")) {
                const li = event.target.closest(".cart-card");
                const id = li.dataset.id;
                this.removeItem(id);
            }
        });

        // Use event delegation for quantity inputs
        this.listElement.addEventListener("change", (event) => {
            if (event.target.classList.contains("quantity-input")) {
                const li = event.target.closest(".cart-card");
                const id = li.dataset.id;
                const quantity = parseInt(event.target.value) || 1;
                this.updateQuantity(id, quantity);
            }
        });
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.Id !== id);
        this.saveCart();
        this.render();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.Id === id);
        if (item) {
            item.Quantity = quantity;
            this.saveCart();
            this.render();
        }
    }
}
