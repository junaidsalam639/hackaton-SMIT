import { auth, db , storage } from '../firebase.mjs'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


document.getElementById("btn").addEventListener("click", () => {
  console.log("faiz");
  let fname = document.getElementById("fname")
  let lname = document.getElementById("lname")
  let rpass = document.getElementById("rpass")
  let password = document.getElementById("pass").value
  let email = document.getElementById("email").value
  let file = document.getElementById('file').files[0];

  if (email == '' || password == '' || fname.value == '' || lname.value == '' || rpass.value == '' || file.value == '') {
    Swal.fire({
      icon: 'error',
      title: 'please fill this form',
      text: 'Something went wrong!',
    })
  }
  else if (password == rpass.value) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        const storageRef = ref(storage, user.uid);

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!');

          getDownloadURL(ref(storage, user.uid))
            .then(async(url) => {
              console.log(url);
              try {
                const docRef = await addDoc(collection(db, "Sinup-Data"), {
                  email: email,
                  password: password,
                  fname: fname.value,
                  lname: lname.value,
                  rpass: rpass.value,
                  url : url,
                });
                console.log("Document written with ID: ", docRef.id);
                setTimeout(() => {
                  Swal.fire({
                    icon: 'success',
                    title: 'singup successfully',
                    text: 'Something went wrong!',
                  }).then(() => {
                    location.href = './login.html'
                  })
                }, 1000);
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            })
            .catch((error) => {
              // Handle any errors
            });
        });
      }
      )
  }
  else {
    Swal.fire({
      icon: 'success',
      title: 'Please Confirm your Password',
      text: 'Something went wrong!',
    })
  }

})




