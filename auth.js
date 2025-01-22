// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Sidebar Toggle Functionality
const toggleBtn = document.getElementById("toggle-btn");
const sidebarMenu = document.getElementById("sidebar-menu");

toggleBtn.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
    sidebarMenu.classList.toggle("active");
    document.querySelector(".dashboard-content").classList.toggle("sidebar-active");
});

// Login Function
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            localStorage.setItem('userID', user.uid);
            window.location = "dashboard.html";
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
});

// Signup Function
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            window.location = "index.html";
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
});

// Fetching User Data for Dashboard
window.onload = function() {
    const userID = localStorage.getItem('userID');
    if (userID) {
        const userRef = ref(database, 'users/' + userID);
        get(userRef).then(snapshot => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                document.getElementById("user-name").textContent = user.name;
                document.getElementById("user-email").textContent = user.email;
                document.getElementById("user-age").textContent = user.age;
                document.getElementById("user-phone").textContent = user.phone;
                document.getElementById("user-allergies").textContent = user.allergies;
                document.getElementById("user-photo").src = user.photoURL;
            }
        }).catch(error => {
            console.error("Error fetching user data:", error);
        });
    }
};

// Sign out functionality
document.getElementById("signout").addEventListener("click", () => {
    signOut(auth).then(() => {
        localStorage.removeItem('userID');
        window.location = "index.html";
    }).catch(error => {
        alert("Error: " + error.message);
    });
});
