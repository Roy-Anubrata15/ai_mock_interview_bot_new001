// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg5S9AxUQ9evGyRJ--hvEMNOz4I2uHKv4",
  authDomain: "constant-autumn-453107-p2.firebaseapp.com",
  projectId: "constant-autumn-453107-p2",
  storageBucket: "constant-autumn-453107-p2.firebasestorage.app",
  messagingSenderId: "317478034416",
  appId: "1:317478034416:web:412e97a56276ddd7549b35",
  measurementId: "G-NRQQGGGTXB"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
