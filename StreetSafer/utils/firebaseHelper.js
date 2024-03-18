import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistance } from "firebase/auth";
import { ReactNativeAsyncStorage } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

let firebaseApp;
export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyBo7jMROkoUjyfkOflA5fpxnw8FbJFL47c",
    authDomain: "fir-project-83a18.firebaseapp.com",
    databaseURL: "https://fir-project-83a18-default-rtdb.firebaseio.com",
    projectId: "fir-project-83a18",
    storageBucket: "fir-project-83a18.appspot.com",
    messagingSenderId: "498723320127",
    appId: "1:498723320127:web:e2f8dc46376421f2c3e38a",
    measurementId: "G-CBD1RZXCTR",
  };
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  firebaseApp = app;
  return app;
};
