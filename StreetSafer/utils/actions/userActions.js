import {
  child,
  get,
  getDatabase,
  ref,
  onValue,
  off,
  update,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
export const getUserData = async (userId) => {
  try {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.val();
  } catch (error) {
    console.error("Error getting user data", error);
    throw error;
  }
};

export const getAllUsers = async (setUsers) => {
  const app = getFirebaseApp();
  const db = getDatabase(app);
  const usersRef = ref(db, "users");
  const listener = onValue(usersRef, (snapshot) => {
    const usersData = snapshot.val();
    if (usersData) {
      const usersArray = Object.entries(usersData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setUsers(usersArray);
    } else {
      setUsers([]);
    }
  });

  const cleanup = () => {
    off(usersRef, listener);
  };

  return cleanup;
};
export const getUserByEmail = async (email) => {
  try {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const userQuery = query(
      usersRef,
      orderByChild("email"),
      equalTo(email.toLowerCase())
    );

    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userId = Object.keys(userData)[0];
      const user = { id: userId, ...userData[userId] };
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    Alert.alert("Error", "Failed to fetch user. Please try again.");
    return null;
  }
};
export const getUserById = async (userId, setUsers) => {
  const db = getDatabase();
  const usersRef = ref(db, "users");
  const userQuery = query(usersRef, orderByChild("userId"), equalTo(userId));

  const listener = onValue(userQuery, (snapshot) => {
    const usersData = snapshot.val();
    if (usersData) {
      const usersArray = Object.entries(usersData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setUsers(usersArray);
    } else {
      setUsers([]);
    }
  });

  return () => {
    listener();
  };
};
