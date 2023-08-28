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

        document.getElementById('inner').innerHTML = `
        <a href=""  onclick='logout()'>logout</a>`

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

        const q = query(collection(db, "Signup-Data"), where("email", "==", user.email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().fname);
            let name = doc.data().fname

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                document.getElementById('name-user').innerHTML = `
                <h2 class="fw-bold">All From ${docSnap.data().name1} </h2>`
                document.getElementById('root').innerHTML += `
            <div class="container mt-5">
            <div class="row">
            <div class="col-lg-10 blog">
           <div class="img d-flex">
               <img src="${docSnap.data().img}" alt="">
               <div class="text">
                   <h5 class="fw-bold">${docSnap.data().title}</h5>
                   <p>${docSnap.data().name1} <span>${docSnap.data().date}</span></p>
                   </div>
                   </div>
                   <p class="mt-3 line">${docSnap.data().desc}</p>
                   </div>
                   </div>
                   </div>`

                document.getElementById('post-add').innerHTML = `
                   <p class='fw-bold mt-3'>${user.email}</p>
                   <h3 class='fw-bold'>${docSnap.data().name1}</h3>
                   <img class='mb-4' src="${docSnap.data().img}" alt="">`

            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    } else {
        location.href = '../index.html'
    }
});

// singout function
function logout() {
    signOut(auth).then(() => {
        alert('singout successfully');
        location.href = '../index.html'
    }).catch((error) => {
        // An error happened.
    });
}
window.logout = logout



