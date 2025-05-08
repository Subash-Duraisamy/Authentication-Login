// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your new Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6wiSlEnqS9EHKHb_4EW1tSEJL5zjOCXA",
  authDomain: "todo-6fd64.firebaseapp.com",
  projectId: "todo-6fd64",
  storageBucket: "todo-6fd64.appspot.com",
  messagingSenderId: "100606784421",
  appId: "1:100606784421:web:ab76466bfce309faadee4c",
  measurementId: "G-TQ8W47LXXB"
};

// Initialize Firebase only if it's not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
