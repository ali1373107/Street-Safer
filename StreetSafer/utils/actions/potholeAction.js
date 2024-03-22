import { getAuth, onAuthStateChanged } from "firebase/auth";

///
import { child, getDatabase, ref, push, set } from "firebase/database";
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

///https://reactnative.dev/docs/pressable
