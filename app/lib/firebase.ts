import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbYN-B1l2WqdXbGTKMmClvSWseIqK6UW0",
  authDomain: "studyflow-6d202.firebaseapp.com",
  projectId: "studyflow-6d202",
  storageBucket: "studyflow-6d202.firebasestorage.app",
  messagingSenderId: "197942683006",
  appId: "1:197942683006:web:7d5d2d62dda982a210ff2f",
  measurementId: "G-K13KSKXFNW",
};

// Evita inicializar várias vezes no Next
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Auth
export const auth = getAuth(app);

// Firestore (BANCO DE DADOS)
export const db = getFirestore(app);
