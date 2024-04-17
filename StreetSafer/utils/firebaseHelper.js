import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

let firebaseApp;
export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyA8CXy5FHeymhm3G1y6AZvfIznGVa7lzMQ",
    authDomain: "streetsaver-681d8.firebaseapp.com",
    projectId: "streetsaver-681d8",
    storageBucket: "streetsaver-681d8.appspot.com",
    messagingSenderId: "7679468605",
    appId: "1:7679468605:web:9c3af4e2b547588536b654",
    measurementId: "G-7C5LBSQNPY",
  };
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  firebaseApp = app;

  return app;
};
export const storeImageToStorage = async (uri, name) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${name}`);
    const fetchResponse = await fetch(uri);

    const theBlob = await fetchResponse.blob();

    const uploadTask = uploadBytesResumable(storageRef, theBlob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  } catch (error) {
    console.error("Error storing image to Firebase Storage:", error);
    throw error;
  }
};
