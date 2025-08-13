// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9YpDlMVlzAzhsOterC8IYuETWWVNUvFc",
  authDomain: "psychic-glider-453312-k0.firebaseapp.com",
  projectId: "psychic-glider-453312-k0",
  storageBucket: "psychic-glider-453312-k0.appspot.com",
  messagingSenderId: "318494311599",
  appId: "1:318494311599:web:1e862a3f03d818b592805a",
  measurementId: "G-LM2PXWDHFZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
