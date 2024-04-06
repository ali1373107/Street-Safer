import {
  child,
  get,
  getDatabase,
  ref,
  onValue,
  off,
  update,
} from "firebase/database";
import { getFirebaseApp, database } from "../firebaseHelper";
// retriving user information based of user id
export const getUserData = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.val();
  } catch (error) {
    console.error("Error getting user data", error);
  }
};

//retriving all users
export const getAllUsers = async (setUsers) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const usersRef = child(dbRef, "users");
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
