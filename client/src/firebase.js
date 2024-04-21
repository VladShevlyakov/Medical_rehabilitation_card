// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "emcr-bdaea.firebaseapp.com",
    projectId: "emcr-bdaea",
    storageBucket: "emcr-bdaea.appspot.com",
    messagingSenderId: "466953547492",
    appId: "1:466953547492:web:acf79b48c45ac8ec5f86f1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
