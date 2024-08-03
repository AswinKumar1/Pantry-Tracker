// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAr2Cj1Ma2WZtli6goIncybWV7ST5IZt1c",
  authDomain: "pantrytracker-3fb7d.firebaseapp.com",
  databaseURL: "https://pantrytracker-3fb7d-default-rtdb.firebaseio.com",
  projectId: "pantrytracker-3fb7d",
  storageBucket: "pantrytracker-3fb7d.appspot.com",
  messagingSenderId: "899904646288",
  appId: "1:899904646288:web:b636b8f45854c247defc15",
  measurementId: "G-SSB7WYG8Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
