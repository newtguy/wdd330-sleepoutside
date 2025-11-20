import { renderListWithTemplate } from "./utils.mjs";

//generate list of product cards in HTML from an array

function productCardTemplate(product) {
    if (product.Id == "989CG" || product.Id == "880RT") {
        return "";
    }
    else {
        return `
    <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">
            <span class="final-price">$${product.FinalPrice}</span>
        </p>
      </a>
    </li>
    `};

    // CAN BE ADDED LATER ABOVE FINAL PRICE IF DISCOUNT WANTS TO BE SHOWN
    // <span class="suggested-price">$${product.SuggestedRetailPrice}</span>
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    //dataSource returns promise, use await to resolve
    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        //     const productCardsHTML = list.map(product => productCardTemplate(product));
        //     const concatHTML = productCardsHTML.join("");
        //     console.log(concatHTML);
        //     this.listElement.insertAdjacentHTML("afterbegin", concatHTML);
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}

