// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDocA6oKUU79bH4FvFJ9hk9HaMZdhYVvNw",
    authDomain: "imageconvert-8f35a.firebaseapp.com",
    projectId: "imageconvert-8f35a",
    storageBucket: "imageconvert-8f35a.appspot.com",
    messagingSenderId: "165366861992",
    appId: "1:165366861992:web:a4c344ef7b259c3778b29d",
    measurementId: "G-3M42NF6JTB"
};
if (!getApps().length) {
    const app = initializeApp(firebaseConfig);

}
// Initialize Firebase
export const auth = getAuth();

export default firebaseConfig;