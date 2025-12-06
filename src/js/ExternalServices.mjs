const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {
  constructor(category = null) {
    this.category = category;
  }

  async getData() {
    if (!this.category) throw new Error("No category provided!");
    const response = await fetch(`${baseURL}products/search/${this.category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // or just 'data' if API returns the single product object
  }

  async checkout(orderData) {
    // create options object for POST
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    };

    // send POST request , return parsed JSON
    const response = await fetch(`${baseURL}checkout/`, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  // takes a form element and returns an object where the key is the "name" of the form input.
  static formDataToJSON(formElement) {
    const formData = new FormData(formElement),
      convertedJSON = {};

    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }
}
