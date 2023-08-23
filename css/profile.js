import { auth, db, storage } from "../firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { collection, doc, addDoc, query, where, getDocs, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";





onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
        console.log(user.email);
        const uid = user.uid;

        document.getElementById('inner').innerHTML = `
        <a href="" id="log" onclick='log()'>logout</a>`

        console.log(user.email);
        const q1 = query(collection(db, "Signup-Data"), where("email", "==", user.email));

        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let name = doc.data().fname

            document.getElementById('name').innerHTML = `
                <p class="fw-bold text-light m-3" style="font-size: 18px; font-weight: bold;text-transform: capitalize;">${name}</p>`

            document.getElementById('post').innerHTML = `
                <a href='./dashboard.html'>
                <button style="border: 0; outline: 0; background-color: #4834d4; color: #ffffff; font-size: 18px; font-weight: bold; margin-left: 12px; margin-right: 12px;">Post</button>
                </a>
                `

            document.getElementById('rep').innerHTML = `
            <div class='d-flex align-items-end' onclick='Img("${user.uid}")'>
            <img id="userImage" src="${doc.data().url}" alt=""  data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pen-to-square" style='cursor:pointer;' data-bs-toggle="modal" data-bs-target="#exampleModal"></i></div>
            <h5 class="mt-3" id="inza" style="text-transform: capitalize;">${name}</h5>
            <h5>Password</h5>
                `


            let password = doc.data().password;
            console.log(password);

            document.getElementById('change').innerHTML = `
                <input type="password" id="old"  maxlength="8" placeholder="Old password"><br>
                <input type="password" id="New"  maxlength="8" placeholder="New password"><br>
                <input type="password" id="Repeat" maxlength="8" placeholder="Repeat password"><br>
                <button id="Update" onclick='update("${doc.id}")'>Update password</button>`

        })


        // update password code 
        async function update(e) {
            console.log(e);
        
            let old = document.getElementById('old');
            let New = document.getElementById('New');
            let Repeat = document.getElementById('Repeat');
        
            const docRef = doc(db, "Signup-Data", e);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
        
                let password = docSnap.data().password;
        
                if (old.value === '' || New.value === '' || Repeat.value === '') {
                    alert('Please fill in all the fields');
                } else {
                    if (password === old.value) {
                        if (New.value === Repeat.value) {
                            // Password validation regex
                            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                            
                            if (passwordRegex.test(New.value)) {
                                const washingtonRef = doc(db, "Signup-Data", e);
                                console.log(New.value);
                                
                                // Set the "password" field to the new password
                                await updateDoc(washingtonRef, {
                                    password: New.value,
                                }).then(() => {
                                    console.log('Passwords match');
                                    alert('Update successful');
                                    location.reload();
                                });
                            } else {
                                alert('Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.');
                            }
                        } else {
                            alert('New password and Repeat password do not match');
                        }
                    } else {
                        console.log('Incorrect old password');
                        alert('Incorrect old password');
                    }
                }
            }
        }
        
        

        window.update = update;
        // ...
    } else {
        location.href = '../index.html'
    }
});


// singout function
function log(){
    signOut(auth).then(() => {
               alert('singout successfully')
               location.href = './../index.html'
            }).catch((error) => {
                // An error happened.
            });
}
window.log = log



// image update code

function Img(e) {
    console.log(e);
    document.getElementById('btn-change').addEventListener('click', () => {
        let file = document.getElementById('file1').files;
        const storageRef = ref(storage, e);

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, file[0]).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            alert('Update Image successfully')
            location.reload()
        })
    })
}

window.Img = Img













