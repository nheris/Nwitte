// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7YB1hFjCODkTVFj-eaZyfKQVarbT5IlA",
  authDomain: "nwitter-8063e.firebaseapp.com",
  projectId: "nwitter-8063e",
  storageBucket: "nwitter-8063e.appspot.com",
  messagingSenderId: "750281863749",
  appId: "1:750281863749:web:2a5efa72bd01368065292c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Authentication
export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);