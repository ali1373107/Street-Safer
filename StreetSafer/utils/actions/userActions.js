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
import { getFirebaseApp, database } from "../firebaseHelper";
// retriving user information based of user id
export const getUserData = async (userId) => {
  try {
    const db = getDatabase(); // Ensure getDatabase returns the correct database instance
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.val();
  } catch (error) {
    console.error("Error getting user data", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

//retriving all users
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
    // Unsubscribe from real-time updates
    off(usersRef, listener);
  };

  return cleanup;
};
export const updateUser = async (userData) => {
  const app = getFirebaseApp();
  const db = getDatabase(app);
  try {
    // Assuming your database structure has a 'users' collection
    const userRef = child(db, `users/${userData.id}`);
    console.log("userData", userData);

    // Update the user data in the database
    await update(userRef, userData);

    // Return the updated user data (optional)
    return userData;
  } catch (error) {
    // Handle errors appropriately
    throw error;
  }
};
export const getUserByEmail = (email, setUser) => {
  const db = getDatabase();
  const usersRef = ref(db, "users");
  const userQuery = query(
    usersRef,
    orderByChild("email").equalTo(email.toLowerCase())
  );
  const listener = onValue(userQuery, (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      // Since there should be only one user with the given email, get the first entry
      const usersArray = Object.entries(userData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setUser(usersArray);
    } else {
      setUser([]); // No user found with the given email
    }
  });
  return () => {
    listener();
  };
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
