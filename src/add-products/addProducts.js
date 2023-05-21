import '../global.scss'
import { getProdcuts, addProduct, addProductWithId, logOut } from '../firebase.js'

let products = []
await retrieveProducts()
renderProducts()

const nameInput = document.getElementById('name-input')
const urlInput = document.getElementById('url-input')
const inputFile = document.getElementById('product-img')
const submitbtn = document.getElementById('submit-btn')
const logOutBtn = document.getElementById('log-out')

submitbtn.addEventListener('click', (e) => uploadProduct(e))
logOutBtn.addEventListener('click', () => logOut())

async function retrieveProducts() {
    products = await getProdcuts()
}

function renderProducts() {
    const container = document.querySelector('#products-container')

    container.innerHTML = ''

    products.forEach((product) => {
        const elem = document.createElement('div')
        elem.className = 'product'
        elem.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.url}" alt="${'reference Image for '+ product.name}" />    
    `
        container.append(elem)
    })
}

async function uploadProduct(e) {
    e.preventDefault()

    const file = inputFile.files[0]

    const newObj = {
        name: nameInput.value,
        /* url: urlInput.value,*/
        date: Date.now()
    }

    const id = newObj.name.toLowerCase().replace(/ /g, '-')

    console.log('will write object ', newObj)

    // await addProduct(newObj)
    await addProductWithId(newObj, id, file)
    await retrieveProducts()
    renderProducts()
}