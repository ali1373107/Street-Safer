import { getAuth, onAuthStateChanged } from "firebase/auth";

///
import {
  child,
  getDatabase,
  ref,
  set,
  equalTo,
  orderByChild,
  query,
  get,
} from "firebase/database";
import { push } from "firebase/database";

////
export const createPothole = async (
  streetName,
  postcode,
  latitude,
  longitude,
  dangerLevel,
  userId
) => {
  const pothole = {
    streetName,
    postcode,
    latitude,
    longitude,
    dangerLevel,
    userId,
  };
  const db = getDatabase();
  try {
    // Push the pothole data to generate a unique ID
    const potholesRef = ref(db, "potholes");
    const newPotholeRef = push(potholesRef);
    const potholeId = newPotholeRef.key;

    // Set the pothole data under the unique ID
    await set(newPotholeRef, pothole);

    // Return the pothole data along with the generated ID
    return { ...pothole, id: potholeId };
  } catch (error) {
    // Handle any errors
    console.error("Error creating pothole:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
export const getPotholesByUserId = async (userId) => {
  try {
    // Get a reference to the database
    const db = getDatabase();

    // Create a query to retrieve potholes with matching user ID
    const potholesRef = ref(db, "potholes");
    const potholesQuery = query(
      potholesRef,
      orderByChild("userId"),
      equalTo(userId)
    );

    // Retrieve potholes matching the query
    const snapshot = await get(potholesQuery);

    // Convert snapshot to an array of potholes
    const potholes = [];
    snapshot.forEach((childSnapshot) => {
      const pothole = childSnapshot.val();
      potholes.push({ id: childSnapshot.key, ...pothole });
    });

    return potholes;
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving potholes:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
///https://reactnative.dev/docs/pressable
