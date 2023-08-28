import { auth, db, storage } from "./firebase.mjs";
import { onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


let myEmail;
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user.uid);
        console.log(user.email);
        const uid = user.uid;
        myEmail = user.email

        document.getElementById('inner').innerHTML = `
        <a href="" id="log" onclick='log()'>logout</a>`

        async function post() {

            console.log(user.email);
            const q1 = query(collection(db, "Signup-Data"), where("email", "==", user.email));

            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach(async (doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data().fname);
                let name = doc.data().fname

                document.getElementById('name').innerHTML = `
                <p class="fw-bold text-light m-3" style="font-size: 18px; font-weight: bold;cursor:pointer;text-transform: capitalize;">${name}</p>`

                document.getElementById('post').innerHTML = `
                <a href='./css/dashboard.html'>
                <button style="border: 0; outline: 0; background-color: #4834d4; color: #ffffff; font-size: 18px; font-weight: bold; margin-left: 12px; margin-right: 12px;">Post</button>
                </a>
                `

            });

        }
        post()
        window.post = post
        
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



const q = query(collection(db, "Detail-Post"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  document.getElementById('root').innerHTML += `
  <div class="container mt-5">
  <div class="row">
  <div class="col-lg-10 blog">
 <div class="img d-flex">
 <img src="${doc.data().img}" alt="" onclick='card("${doc.id}")'>
     <div class="text">
         <h5 class="fw-bold">${doc.data().title}</h5>
         <p>${doc.data().name1} <span>${doc.data().date}</span></p>
     </div>
     </div>
 <p class="mt-3 line">${doc.data().desc}</p>
</div>
</div>
</div>`
});

// card function
console.log(myEmail);
if(myEmail){
    function card(docId, user) {
        console.log("Document ID:", docId);
        console.log("User:", user);
        localStorage.setItem('doc' , docId)
        localStorage.setItem('user' , user)
        location.href = './css/myProfile.html'
    }
    
    window.card = card
}else if(!myEmail){   
    function card(e){
        console.log(e);
        location.href = './login.html'
    }
    
    window.card = card
}



//good morning afternoon code 

let day = document.getElementById("good");

function getGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    console.log(currentHour);
    let greeting;

    if (currentHour < 12) {
        greeting = 'Good morning !';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon !';
    } else {
        greeting = 'Good evening !';
    }

    return greeting;
}

const greeting = getGreeting();
day.innerHTML = greeting + "😎"



