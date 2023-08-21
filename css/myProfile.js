import { auth, db, storage } from "../firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


console.log(localStorage.getItem('doc'));
console.log(localStorage.getItem('user'));


onAuthStateChanged(auth, async (user) => {
    if (user) {
        let doc_id = localStorage.getItem('doc')
        let user_id = localStorage.getItem('user')
        const uid = user.uid;

        const q1 = query(collection(db, "Signup-Data"), where("email", "==", user.email));

        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().fname);
            let name = doc.data().fname

            document.getElementById('name').innerHTML = `
            <p class="fw-bold text-light m-3" style="font-size: 18px; font-weight: bold; cursor:pointer;text-transform: capitalize;">${name}</p>`

            document.getElementById('post').innerHTML = `
            <a href='./dashboard.html'>
            <button style="border: 0; outline: 0; background-color: #4834d4; color: #ffffff; font-size: 18px; font-weight: bold; margin-left: 12px; margin-right: 12px;">Post</button>
            </a>
            `
        })
      
            const docRef = doc(db, "Detail-Post", doc_id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

        // ...
    } else {
        // User is signed out
        // ...
    }
});

// singout function
function log(){
    signOut(auth).then(() => {
               alert('singout successfully')
            }).catch((error) => {
                // An error happened.
            });
}
window.log = log



