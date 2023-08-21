import { auth } from "./firebase.mjs";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";


document.getElementById("btn").addEventListener("click", () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("pass").value;

  if (password === '' || email === '') {
    Swal.fire({
      icon: 'error',
      title: 'Please fill this form',
      text: 'All fields are required!',
    });
  } else {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed in
        const user = userCredential.user;
        
        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          text: 'You have successfully logged in!',
        }).then(() => {
          window.location.href = "./css/dashboard.html";
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Invalid email or password. your singup is first',
        });
      });
  }
});
