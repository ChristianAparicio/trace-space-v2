// import getData from "../../json.js";
import { getProducts } from "../../firebase.js";

class CardFilter extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: 'open' });
    this.data = [];
    this.filters = {
      name: '',
      collection: '',
      author: '',
      price: ''
    };
    this.timer = null;
  }

  async connectedCallback() {
    this.data = await getProducts();
    this.render();

    this.addEventListener('click', (event) => {
      if (event.target.id === 'clearFiltersButton') {
        this.filters = {
          name: '',
          collection: '',
          author: '',
          price: ''
        };
        this.render();
      }
    });
  }

  handleFilterChange(event) {
    const { name, value } = event.target;
    const newValue = name === 'price' ? parseInt(value) : value;
    this.filters = { ...this.filters, [name]: newValue };

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.render();
    }, 500);
  }

  render() {
    const filteredData = this.data.filter((product) => {
      const nameFilter = this.filters.name ? this.filters.name.toLowerCase() : '';
      const collectionFilter = this.filters.collection ? this.filters.collection.toLowerCase() : '';
      const authorFilter = this.filters.author ? this.filters.author.toLowerCase() : '';

      const nameMatch = product.Name && product.Name.toLowerCase().includes(nameFilter);
      const collectionMatch = product.Collection && product.Collection.toLowerCase().includes(collectionFilter);
      const authorMatch = product.Author && product.Author.toLowerCase().includes(authorFilter);

      const priceFilter = parseInt(this.filters.price);
      const priceMatch = isNaN(priceFilter) || product.Price <= priceFilter;

      return nameMatch && collectionMatch && authorMatch && priceMatch;
    });

    const options = (data, key) => {
      const values = new Set(data.map((product) => product[key]));
      return [...values].map((value) => {
        return `<option value="${value}">${value}</option>`;
      });
    };

    const filterApplied = this.filters.name || this.filters.collection || this.filters.author || this.filters.price;

    const container = document.createElement('div');
    container.innerHTML = `
      <link rel="stylesheet" href="filterbar.css">
      <div class="container my-4 space-top ">
        <div class="form-group">
          <div class="input-group">
            <input type="text" name="name" id="nameInput" class="form-control seach-bar bg-dark text-white border-0" placeholder="Search by name" value="${this.filters.name}">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">
                <i class="bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="collectionSelect">Collection</label>
              <select name="collection" id="collectionSelect" class="form-control btn btn-dark">
                <option value="">Collection</option>
                ${options(this.data, 'Collection').join('')}
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="authorInput">Author</label>
              <select name="author" id="authorSelect" class="form-control btn btn-dark">
                <option value="">Author</option>
                ${options(this.data, 'Author').join('')}
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="priceInput">Price</label>
              <input type="number" name="price" id="priceInput" class="form-control" placeholder="Price" value="${this.filters.price}">
            </div>
          </div>
          <div class="col-md-4">
            <button class="btn btn-secondary" id="clearFiltersButton">Clear Filters</button>
          </div>
        </div>

        <div class="container">
          <div class="row">
            ${filteredData.map((product) => {
              const price = product.Price !== undefined ? product.Price.toString() : '';
              return `
                <div class="col-md-4">
                  <div class="card">
                    <img src="${product.img1}" alt="${product.Name}" class="card-img-top">
                    <div class="card-body card-hover">
                      <h3 class="card-title">${product.Name}</h3>
                      <p class="card-text">${product.Description}</p>
                      <h5 class="card-price">$${price}</h5>
                      <a href="./detail.html?id=${product.numId}" class="btn btn-primary shop_now" data-id="${product.id}"><i class="bi-cart"></i>Buy Now</a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.innerHTML = '';
    this.appendChild(container);

    this.querySelector('input[name="name"]').addEventListener('input', this.handleFilterChange.bind(this));
    this.querySelector('select[name="collection"]').addEventListener('change', this.handleFilterChange.bind(this));
    this.querySelector('select[name="author"]').addEventListener('change', this.handleFilterChange.bind(this));
    this.querySelector('input[name="price"]').addEventListener('input', this.handleFilterChange.bind(this));
  }
}

customElements.define('card-filter', CardFilter);

// Obtén una referencia al componente card-filter
const cardFilter = document.querySelector('card-filter');

// Agrega un evento click al componente card-filter
cardFilter.addEventListener('click', (event) => {
  // Verifica si el botón "Shop Now" fue el elemento clickeado
  if (event.target.classList.contains('shop_now')) {
    // Obtén el ID del producto desde el atributo data-id del botón
    const productId = event.target.getAttribute('data-id');
    // Utiliza el ID del producto como desees (por ejemplo, redirecciona a la página de detalles del producto)
    console.log(productId);
    // Aquí puedes redireccionar a la página de detalles del producto o realizar alguna otra acción con el ID del producto
  }
});
