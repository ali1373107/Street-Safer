import { getFirebaseApp } from "../firebaseHelper";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate } from "../../store/authSlice";
import { getUserData } from "./userActions";
export const signUp = (fullName, email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);
      const userData = await createUser(fullName, email, uid);
      dispatch(authenticate({ token: accessToken, userData }));
      saveToDataStorage(accessToken, uid, expiryDate);
    } catch (error) {
      console.log("error message in authaction ", error);

      const errorCode = error.errorCode;
      let message = "Somthing went wrong";
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "wrong email or password";
      }
      if (errorCode === "auth/email-already-in-use") {
        message = "Email already in use";
      }
      throw new error(message);
    }
  };
};
//implementing sign in

export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);
      const userData = await getUserData(uid);
      dispatch(authenticate({ token: accessToken, userData }));
      saveToDataStorage(accessToken, uid, expiryDate);
    } catch (error) {
      console.log("error message in authaction ", error);

      const errorCode = error.errorCode;
      let message = "Somthing went wrong";
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "wrong email or password";
      }
      if (errorCode === "auth/invalid-credential") {
        message = "Please check your email and password ";
      }
      throw new error(message);
    }
  };
};

const createUser = async (fullName, email, userId) => {
  const userData = {
    fullName,
    email,
    userId,
    signUpData: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveToDataStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
