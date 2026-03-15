// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. Add the Firestore SDK
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxJliGvvcGS6r4VaZBqsMW4zfNlCS8d0k",
  authDomain: "rbsk-225ae.firebaseapp.com",
  projectId: "rbsk-225ae",
  storageBucket: "rbsk-225ae.firebasestorage.app",
  messagingSenderId: "907287829805",
  appId: "1:907287829805:web:f2618ef69b63633b3347a4",
  measurementId: "G-N4R0DCJJVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Initialize Firestore and EXPORT 'db' so App.js can find it
export const db = getFirestore(app);