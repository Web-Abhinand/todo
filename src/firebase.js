// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBrm7O3az7E2ModvyuQhHcWZ9jpKLnyXDA",
  authDomain: "myapp-7be90.firebaseapp.com",
  databaseURL: "https://myapp-7be90.firebaseio.com",
  projectId: "myapp-7be90",
  storageBucket: "myapp-7be90.appspot.com",
  messagingSenderId: "918462303644",
  appId: "1:918462303644:web:2289673a8070d1164d0c59",
  measurementId: "G-83C8H51YNJ"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

