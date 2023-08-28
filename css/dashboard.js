import { auth, db, storage } from "../firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc , onSnapshot} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";



onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
        console.log(user.email);

        document.getElementById('inner').innerHTML = `
        <a href="" id='logout' onclick='logout()'>logout</a>`

        const uid = user.uid;
        document.getElementById('public-post').addEventListener('click', async () => {
            console.log('hello world');

            let name1 = document.getElementById('name1');
            let desc = document.getElementById('description');
            let title = document.getElementById('title');
            let img = document.getElementById('image').files[0];

            if (desc.value == '' || title.value == '' || name1.value == '' || img === undefined) {
                alert('please fill the input');

            }
            else if (title.value.length >= 5 && title.value.length <= 50 && desc.value.length >= 100 && desc.value.length <= 3000) {
                const storageRef = ref(storage, user.uid);

                // 'file' comes from the Blob or File API
                uploadBytes(storageRef, img).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    getDownloadURL(ref(storage, user.uid))
                        .then(async (url) => {
                            console.log(url);
                            let date = new Date().toDateString()
                            let date1 = new Date().toTimeString()
                            let concat = date + "  " + " " + date1.slice(0, 8)
                            console.log(concat);
                            console.log(user.email);
                            try {
                                const docRef = await addDoc(collection(db, "Detail-Post"), {
                                    desc: desc.value,
                                    title: title.value,
                                    name1 : name1.value,
                                    img: url,
                                    date: concat,
                                    email : user.email
                                });
                                Swal.fire({
                                    text: 'Post Added Successful',
                                    icon: 'success',
                                    confirmButtonText: 'OK'
                                }).then(() => {
                                    location.reload()
                                });
                                console.log("Document written with ID: ", docRef.id)


                            } catch (e) {
                                console.error("Error adding document: ", e);
                            }
                        })
                        .catch((error) => {
                            // Handle any errors
                        });

                });

            }
            else {
                Swal.fire({
                    text: 'Post Title should be b/w 5 to 50 character and description should be b/w 100 to 3000 characters',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        })

        async function post() {
            const q1 = query(collection(db, "Signup-Data"), where("email", "==", user.email));

            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach(async (doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                let name = doc.data().fname
                let email = doc.data().email

                document.getElementById('name').innerHTML = `
                <p id='loca1' class="fw-bold text-light m-3" style="font-size: 18px; font-weight: bold; cursor: pointer;text-transform: capitalize;">${name}</p>`

                document.getElementById('post').innerHTML = `
                <button id='loca2' style="border: 0; outline: 0; background-color: #4834d4; color: #ffffff; font-size: 18px; font-weight: bold; margin-left: 12px; margin-right: 12px;">Post</button>`

                document.getElementById('loca1').addEventListener('click', () => {
                    location.href = './profile.html'
                })

                document.getElementById('loca2').addEventListener('click', () => {
                    location.href = './dashboard.html'
                })

                const q = query(collection(db, "Detail-Post"),where("email","==", user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(user.email);
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());

                    document.getElementById('root').innerHTML += `
                <div class="container mt-5">
                <div class="row">
                <div class="col-lg-10 blog">
               <div class="img d-flex">
                   <img src="${doc.data().img}" alt="">
                   <div class="text">
                       <h5 class="fw-bold">${doc.data().title}</h5>
                       <p>${doc.data().name1} <span>${doc.data().date}</span></p>
                   </div>
                   </div>
               <p class="mt-3 line">${doc.data().desc}</p>
               <div class="btn d-flex">
                   <button type="button" class="btn  mt-4 mb-3 " style="color: #4834d4; font-weight: 600;" id="public-post" onclick='edit("${doc.id}")' data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                   <button type="button" class="btn mt-4 mb-3 " style="color: #4834d4; font-weight: 600;" id="public-post" onclick='dele("${doc.id}")'>Delete</button>
               </div>
              </div>
            </div>
            </div>`
                });
            });
        }
        post()
        window.post = post
        // ...



        async function edit(e) {
            console.log(e);
            const docRef = doc(db, "Detail-Post", e);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                let title1 = document.getElementById('title1').value = docSnap.data().title;
                let desc1 = document.getElementById('desc1').value = docSnap.data().desc;
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
            document.getElementById('btn-change').addEventListener('click', async () => {

                console.log(e);
                const washingtonRef = doc(db, "Detail-Post", e);

                // Set the "capital" field of the city 'DC'
                await updateDoc(washingtonRef, {
                    desc: desc1.value,
                    title: title1.value,

                }).then(() => {
                    alert('edit euccessfully');
                })
                location.reload()
            })
        }

        window.edit = edit



        async function dele(e) {
            console.log(e);
            await deleteDoc(doc(db, "Detail-Post", e)).then(() => {
                alert('delete successfully')
                location.reload()
            })
        }

        window.dele = dele

    } else {
        location.href = '../index.html'
    }
});

function logout() {
    signOut(auth).then(() => {
        alert('singout successfully')
        location.href = './../index.html'
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
}
window.logout = logout



