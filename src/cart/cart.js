import { getProducts, addPayment } from "../firebase.js";

class Cartspace extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.totalPrice = 0;
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this.handleRemoveButtonClick.bind(this));
    this.addEventListener('click', this.handleAcceptPaymentClick.bind(this));
  }

  async addProduct(product) {
    const products = await getProducts(); // Fetch all products from Firebase
    const matchedProduct = products.find((p) => p.id === product.id);
    if (matchedProduct) {
      const productWithImage = { ...product, img1: matchedProduct.img1 }; // Update the product with the image URL
      this.items.push(productWithImage);
      this.calculateTotalPrice(); // Recalculate the total price
      this.render();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.items.reduce((total, product) => {
      const price = parseFloat(product.Price);
      return isNaN(price) ? total : total + price;
    }, 0);
  }

  handleRemoveButtonClick(event) {
    if (event.target.classList.contains('remove-button')) {
      const productId = event.target.dataset.id;
      this.removeItemFromCart(productId);
    }
  }

  removeItemFromCart(productId) {
    this.items = this.items.filter((product) => product.id !== productId);
    this.calculateTotalPrice(); // Recalculate the total price
    this.render();

    // Get the products stored in the localStorage
    const storedProducts = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Filter the products to remove the one with matching ID
    const updatedProducts = storedProducts.filter((product) => product.id !== productId);

    // Save the updated products to the localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedProducts));
  }

  handleAcceptPaymentClick(event) {
    if (event.target.classList.contains('accept-payment-button')) {
      if (this.items.length > 0) {
        const paymentData = {
          items: this.items,
          totalPrice: this.totalPrice,
        };

        // Send payment data to Firebase
        addPayment(paymentData);

        // Show payment success popup
        alert('Payment successful');

        // Clear the cart
        this.items = [];
        this.totalPrice = 0;
        this.render();
      }
    }
  }

  async render() {
    const products = await getProducts(); // Fetch all products from Firebase

    const cartItems = this.items
      .map((product) => {
        const matchedProduct = products.find((p) => p.id === product.id);
        if (matchedProduct) {
          return `
            <div class="card cart-item">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <img src="${product.img1}" alt="${product.Name}" class="img-fluid item-image">
                  </div>
                  <div class="col-md-9">
                    <h4 class="card-title item-name">${product.Name}</h4>
                    <p class="card-text item-price">${product.Description}</p>
                    <p class="card-text item-price">$${product.Price}</p>
                    <button class="btn btn-danger remove-button" data-id="${product.id}">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      })
      .join('');

    this.innerHTML = `
      <style>
        /* Cart styles */
        .card-body {
          background-color: white;
        }
        .cart-item {
          margin-bottom: 10px;
        }
        .item-image {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
        }
        .item-name {
          margin-bottom: 5px;
          font-size: 18px;
          font-weight: bold;
        }
        .item-price {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .remove-button {
          float: right;
        }
        .total-price {
          margin-top: 20px;
          font-size: 20px;
          font-weight: bold;
        }
        .accept-payment-button {
          margin-top: 10px;
        }
      </style>
      <div class="cart">
        <h2>Cart</h2>
        ${cartItems}
        <div class="total-price text-white">Total: $${this.totalPrice}</div>
        <button class="btn btn-success accept-payment-button" ${
          this.items.length > 0 ? '' : 'disabled'
        }>Accept Payment</button>
      </div>
    `;
  }
}

customElements.define('cart-space', Cartspace);

document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartSpace = document.querySelector('cart-space');
  cartItems.forEach((product) => {
    cartSpace.addProduct(product);
  });
});
