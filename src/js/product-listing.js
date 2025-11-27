import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");

const titleElement = document.querySelector("h2");

// Upper first letter
const upperCategory = category.charAt(0).toUpperCase() + category.slice(1);
titleElement.textContent = `Top Products: ${upperCategory}`;

// first create an instance of the ProductData class.
const dataSource = new ProductData(category);
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const productList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
productList.init();
