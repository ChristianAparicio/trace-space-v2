<<<<<<< HEAD
$('.owl-carousel').owlCarousel({
    autoplay: true,
    center: true,
    loop: true,
    nav: true,
  });
=======
import './global.scss'
import { getProdcuts } from './firebase.js'

console.log('this is the homepage')

let products = []
await retrieveProducts()
renderProducts()


async function retrieveProducts() {
    products = await getProdcuts()
}

function renderProducts() {
    const container = document.querySelector('#products-container')

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
>>>>>>> 8d872d96178a2a7ac897b1aeb199edd9cfdae29e
