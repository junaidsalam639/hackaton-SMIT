import { auth } from "./firebase.mjs";
import { collection, addDoc, getDocs, doc, query, where } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

document.getElementById("btn").addEventListener("click", () => {
  let email = document.getElementById("email").value
  let password = document.getElementById("pass").value
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      if (password == '' || email == '') {
        Swal.fire({
          icon: 'error',
          title: 'please fill this form',
          text: 'Something went wrong!',
        })
      } else {
        alert('login successfully');
        window.location.href = "./css/dashboard.html"
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(error);
    });
})