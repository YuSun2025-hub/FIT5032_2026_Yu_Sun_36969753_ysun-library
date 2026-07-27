// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYTLlZHQdXqvoZHbXuWZz1U8CO9hAHREQ",
  authDomain: "yu-sun-36969753-ysun-library.firebaseapp.com",
  projectId: "yu-sun-36969753-ysun-library",
  storageBucket: "yu-sun-36969753-ysun-library.firebasestorage.app",
  messagingSenderId: "1050491641410",
  appId: "1:1050491641410:web:3051a66c5255b55bbc57db"
};
initializeApp(firebaseConfig);
const db = getFirestore();
export default db;