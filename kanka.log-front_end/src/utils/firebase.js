// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import {getFirestore } from '@firebase/firestore'





// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY || 'AIzaSyAtz35RI5X4QD2XHMmBQrrJgbxqOAB5b28',
    authDomain: process.env.REACT_APP_AUTH_DOMAIN || 'kankalog-72ff6.firebaseapp.com',
    projectId: process.env.REACT_APP_PROJECT_ID || 'kankalog-72ff6',
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET || 'kankalog-72ff6.appspot.com',
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || '227652470641',
    appId: process.env.REACT_APP_APP_ID || '1:227652470641:web:0316409b065aa18d01d8d0',
    measurementId: process.env.REACT_APP_MEASUREMENT_ID || 'G-CGY7FBP1JS'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();


export const database = getFirestore(app)