// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOaUNediehSWV0DUpKxhWfqM97fR9GXFM",
  authDomain: "access-adventure.firebaseapp.com",
  projectId: "access-adventure",
  storageBucket: "access-adventure.appspot.com",
  messagingSenderId: "12457190458",
  appId: "1:12457190458:web:699a916d9d0300ccc98103"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

export { auth, db }