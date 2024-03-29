import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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
