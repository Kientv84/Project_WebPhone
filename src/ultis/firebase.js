// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMbOMyDQ-iXIfIiijVuyNrPo35CjeQhOM",
    authDomain: "webphone-a6249.firebaseapp.com",
    projectId: "webphone-a6249",
    storageBucket: "webphone-a6249.appspot.com",
    messagingSenderId: "411928616840",
    appId: "1:411928616840:web:a7a09ad1601951fb05a43d",
    measurementId: "G-07QX7D2L18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
export { storage, analytics };
