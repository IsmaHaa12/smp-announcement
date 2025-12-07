// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlLE3MlO47vKypP76jAx2NULDA_M1UCiA",
  authDomain: "smpn2-ayah.firebaseapp.com",
  projectId: "smpn2-ayah",
  storageBucket: "smpn2-ayah.firebasestorage.app",
  messagingSenderId: "362325575338",
  appId: "1:362325575338:web:a4aabcb07e45a3ac5572d3",
  measurementId: "G-Y6N7RDPW84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);