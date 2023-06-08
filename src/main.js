import './global.scss'
import { getProducts } from './firebase.js'

 console.log('this is the homepage')

 let products = []
 await retrieveProducts()
 renderProducts()


 async function retrieveProducts() {
     products = await getProducts()
 }

 function renderProducts() {
     const container = document.querySelector('#products-container')

     products.forEach((product) => {
         const elem = document.createElement('div')
         elem.className = 'product'
         elem.innerHTML = `
     <h2>${product.Name}</h2>
     <img src="${product.img1}" alt="${'reference Image for '+ product.Name}" />    
     `
         container.append(elem)
     })

}
