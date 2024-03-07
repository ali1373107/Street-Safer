// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo7jMROkoUjyfkOflA5fpxnw8FbJFL47c",
  authDomain: "fir-project-83a18.firebaseapp.com",
  databaseURL: "https://fir-project-83a18-default-rtdb.firebaseio.com",
  projectId: "fir-project-83a18",
  storageBucket: "fir-project-83a18.appspot.com",
  messagingSenderId: "498723320127",
  appId: "1:498723320127:web:b062d0fb4c1a49d5c3e38a",
  measurementId: "G-NRCWBCE6YE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
