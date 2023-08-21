// Define the password regex pattern
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

import { auth, db, storage } from '../firebase.mjs';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

document.getElementById("btn").addEventListener("click", () => {
  let fname = document.getElementById("fname");
  let lname = document.getElementById("lname");
  let rpass = document.getElementById("rpass");
  let password = document.getElementById("pass").value;
  let email = document.getElementById("email").value;
  let file = document.getElementById('file').files[0];

  if (email === '' || password === '' || fname.value === '' || lname.value === '' || rpass.value === '' || file === undefined) {
    Swal.fire({
      icon: 'error',
      title: 'Please fill all fields',
      text: 'All fields are required!',
    });
  }
  else if (password !== rpass.value) {
    Swal.fire({
      icon: 'error',
      title: 'Passwords do not match',
      text: 'Please confirm your password.',
    });
  }
  else if (!passwordPattern.test(password)) {
    Swal.fire({
      icon: 'error',
      title: 'Password requirements not met',
      text: 'Password must have at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.',
    });
  }
  else {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const storageRef = ref(storage, user.uid);

        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!');

          getDownloadURL(ref(storage, user.uid))
            .then(async (url) => {
              console.log(url);
              try {
                const docRef = await addDoc(collection(db, "Signup-Data"), {
                  email: email,
                  password: password,
                  fname: fname.value,
                  lname: lname.value,
                  rpass: rpass.value,
                  url: url,
                });

                Swal.fire({
                  icon: 'success',
                  title: 'Signup Successful',
                  text: 'You have successfully signed up!',
                }).then(() => {
                  location.href = './login.html';
                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error creating user: ", error);
      });
  }
});






