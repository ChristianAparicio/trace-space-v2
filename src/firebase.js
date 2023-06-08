import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import dbData from "./db.json";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCegClXUXpAVwG0p3iCYkYS2fpK0Pd36gM",
    authDomain: "logintracespace.firebaseapp.com",
    databaseURL: "https://logintracespace-default-rtdb.firebaseio.com",
    projectId: "logintracespace",
    storageBucket: "logintracespace.appspot.com",
    messagingSenderId: "1009166054959",
    appId: "1:1009166054959:web:224bfc3d961d419132f8da"
};

// Initialize Firebase, Firestore, Storage, Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Create the product collection and add products from the JSON file
export async function createProductCollection() {
  try {
    const collectionRef = collection(db, "products");

    for (const product of dbData.products) {
      await addDoc(collectionRef, product);
    }

    console.log("Product collection created successfully");
  } catch (error) {
    console.error("Error creating product collection: ", error);
  }
}

// Call the function to create the collection and add products

onAuthStateChanged(auth, (user) => {
  console.log('hubo un cambio en auth');
  if (user) {
    // const uid = user.uid;
    // userValidation(true, user.email)
  } else {
    // userValidation(false)
  }
});

export async function getProducts() {
  const allProducts = [];

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    allProducts.push({ ...doc.data(), id: doc.id });
  });

  return allProducts;
}

export async function addProduct(product) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addProducts(products) {
  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
    }
    console.log("products added");
  } catch (error) {
    console.error("error adding products", error);
  }
}

export async function addProductWithId(product, id, file) {
  try {
    const imageUrl = await uploadFile(file.name, file, 'products');

    await setDoc(doc(db, "products", id), { ...product, url: imageUrl });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function uploadFile(name, file, folder) {
  const taskImgRef = ref(storage, `${folder}/${name}`);

  try {
    await uploadBytes(taskImgRef, file);
    const url = await getDownloadURL(taskImgRef);
    return url;
  } catch (error) {
    console.log("error creando imagen ->", error);
  }
}

export async function createUser(email, password, username, file) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Signed in
    const user = userCredential.user;
    // console.log("usuario creado con ->", user.uid);

    /// subir imagen
    const imageUrl = await uploadFile(file.name, file, 'users');

    /// crear registro en BD
    await addUserToDB({ username, imageUrl, email }, user.uid);

    return { status: true, info: user.uid };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return { status: false, info: errorMessage };
  }
}

export async function logInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { status: true, info: user.uid };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return { status: false, info: errorMessage };
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

export async function addUserToDB(userData, uid) {
  console.log('userData ---->', userData);
  console.log('uid ---->', uid);
  try {
    const docRef = await setDoc(doc(db, "users", uid), userData);

    console.log(docRef);

    console.log("User written with ID: ", uid);
  } catch (e) {
    console.error("Error adding user: ", e);
  }
}

export {
  app,
  db,
  auth,
  storage
};
