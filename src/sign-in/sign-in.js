import '../global.scss'
import { logInUser } from '../firebase.js'
import{ app, db, auth,storage}from "../firebase.js"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import {doc,setDoc} from "firebase/firestore"


import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'


async function logIn() {
    const email = document.getElementById('email').value
    const pass = document.getElementById('password').value


    const userCreated = await logInUser(email, pass)
    if (userCreated.status) {
        alert('Sesion iniciada, uid: ' + userCreated.info)
        window.location.href= "../index.html"
    } else {
        alert(userCreated.info)
    }


}


  //registro
  let registerButton = document.getElementById("resgisterButton")
  registerButton.addEventListener("click",(e)=>{register()})

  let loginButton = document.getElementById("loginButton")
  loginButton.addEventListener("click", (e)=>{login()})

  async function register(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let full_name = document.getElementById('full_name').value;

    // let mainImage = document.getElementById('profileimg').files[0]
    // let img1= await subirImagen(mainImage)
 
  

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  //if (validate_field(full_name) == false || validate_field(favourite_song) == false || validate_field(milk_before_cereal) == false) {
    //alert('One or More Extra Fields is Outta Line!!')
    //return
//}


  try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userId = user.uid;

      var user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now(),
        // pic:pic,
      }

      await setDoc(doc(db, "users", userId), user_data);

     
  } catch (e) {
      
      if (e.code === "auth/email-already-in-use") {
          alert("Email is in use");
      }

      if (e.code === "auth/weak-password") {
          alert("Weak mail");
      }
  }

// Move on with Auth
  createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      full_name : full_name,
      last_login : Date.now(),
      // pic:pic,
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })


}

function login () {
    // Get all our input fields
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    signInWithEmailAndPassword(email, password)
    .then(function() {
      
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      console.log("BLABLABLABLABLA");
      // DOne
      alert('User Logged In!!')
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  


  

  function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }

//   async function subirImagen(file) {
//     try {
//         const image = await subirImagenReferencia(file);
//         return getDownloadURL(ref(storage, image.ref.fullPath))
//     } catch (error) {
//       console.log(error);
//     }
// }

// async function subirImagenReferencia(file) {
//   try {
//       const storageRef = ref(storage, `images/profile/${file.name}`);
//       return await uploadBytes(storageRef, file);

//   } catch (error) {
//       console.log(error);
//   }
// }

