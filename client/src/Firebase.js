// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: "AIzaSyBTWcqrujcA4dfmseh7zxEL7aIZwyN4ktM",
  authDomain: "real-estate-bab75.firebaseapp.com",
  projectId: "real-estate-bab75",
  storageBucket: "real-estate-bab75.appspot.com",
  messagingSenderId: "101669800745",
  appId: "1:101669800745:web:f94ed334254e545df24538",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
