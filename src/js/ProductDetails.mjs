import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product.
        // findProductById will return a promise! use await or .then() to process it 
        // the product details are needed before rendering the HTML
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // NOTE: inside addToCart(), "this" still refers to the class instance, not the button that was clicked.
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addToCartHandler.bind(this));
    }

    // add to cart button event handler
    async addToCartHandler(e) {
        const productId = e.target.dataset.id;
        if (!productId) return;
        const product = await this.dataSource.findProductById(productId);
        this.addProductToCart(product);
        //alert(`${product.NameWithoutBrand} added to cart!`);
    }

    // grab ls contents or make empty array ; cart expects ls to contain array
    addProductToCart(product) {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(product);
        setLocalStorage("so-cart", cartItems);
    }

    // generate or populate HTML to display product details
    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.NameWithoutBrand;
    document.querySelector("h3").textContent = product.Brand.Name;

    const productImage = document.querySelector(".product__image");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;

    document.querySelector(".product__price").textContent = product.FinalPrice;
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}
