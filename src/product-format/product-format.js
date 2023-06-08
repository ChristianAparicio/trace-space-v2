import '../global.scss'
import { db, storage } from "../firebase.js"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'




//registro
let uploadButton = document.getElementById("uploadButton")
uploadButton.addEventListener("click", (e) => { upload() })


async function upload() {
    let Name = document.getElementById('Name').value;
    let Collection = document.getElementById('Collection').value;
    let ProductType = document.getElementById('ProductType').value;
    let year = document.getElementById('year').value;
    let Author = document.getElementById('Author').value;
    let Description = document.getElementById('Description').value;

    let mainImage = document.getElementById('img1').files[0]
    let img1= await subirImagen(mainImage)

    let detailImage = document.getElementById('img2').files[0]
    let img2 = await subirImagen(detailImage)

    let secondDetailImage = document.getElementById('img3').files[0]
    let img3 = await subirImagen(secondDetailImage)
    
    

    // Validate input fields

    //if (validate_field(full_name) == false || validate_field(favourite_song) == false || validate_field(milk_before_cereal) == false) {
    //alert('One or More Extra Fields is Outta Line!!')
    //return
    //}


    try {
        const collectionRef = collection(db, "products")
        const { docs } = await getDocs(collectionRef);

        console.log(docs);

        await addDoc(collection(db, 'products'), {
            Name: Name,
            Collection: Collection,
            ProductType: ProductType,
            year: year,
            Author: Author,
            Description: Description,
            img1:img1,
           img2:img2,
            img3:img3,
            id: docs.length + 1
        })


    } catch (e) {
        console.log(e);
    }

}

async function subirImagen(file) {
    try {
        const image = await subirImagenReferencia(file);
        return getDownloadURL(ref(storage, image.ref.fullPath))
    } catch (error) {
        console.log(e);
    }
}

async function subirImagenReferencia(file) {
    try {
        const storageRef = ref(storage, `products/images/${file.name}`);
        return await uploadBytes(storageRef, file);

    } catch (error) {
        console.log(error);
    }
}