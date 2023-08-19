 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
 import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
 import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
 import { getStorage } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

   // Your web app's Firebase configuration
   const firebaseConfig = {
    apiKey: "AIzaSyChWHfLRrWVag9r4aQKMk735eu4fEIV8fI",
    authDomain: "hackathon-smit-d7eb0.firebaseapp.com",
    projectId: "hackathon-smit-d7eb0",
    storageBucket: "hackathon-smit-d7eb0.appspot.com",
    messagingSenderId: "937656495772",
    appId: "1:937656495772:web:3ffcd01633dbeb77878759"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);