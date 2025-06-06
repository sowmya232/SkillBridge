
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkjn-U-A_NxBlAVxZlhTo5o1eF58508HI",
  authDomain: "login-signup-first.firebaseapp.com",
  projectId: "login-signup-first",
  storageBucket: "login-signup-first.firebasestorage.app",
  messagingSenderId: "773877056619",
  appId: "1:773877056619:web:09a4c33232d9ed10bbdd2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

