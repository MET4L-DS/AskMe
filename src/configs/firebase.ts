// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGmLmYMDlYglb6EtT4eJMC-8fOWdzilK4",
    authDomain: "askme-d382a.firebaseapp.com",
    projectId: "askme-d382a",
    storageBucket: "askme-d382a.appspot.com",
    messagingSenderId: "794584369305",
    appId: "1:794584369305:web:e9c65a08213ba5a84bd008",
    measurementId: "G-BY600B7892",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
