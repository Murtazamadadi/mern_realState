// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "murtazablog-7f58b.firebaseapp.com",
  projectId: "murtazablog-7f58b",
  storageBucket: "murtazablog-7f58b.appspot.com",
  messagingSenderId: "891073842724",
  appId: "1:891073842724:web:dcba2059fda32be4d392b1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);