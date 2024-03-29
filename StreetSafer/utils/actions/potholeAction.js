import { getStorage, uploadBytes } from "firebase/storage";
import { getFirebaseApp } from "../firebaseHelper";

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
  description,
  imageUrl,
  userId
) => {
  const pothole = {
    streetName,
    postcode,
    latitude,
    longitude,
    dangerLevel,
    description,
    imageUrl,
    userId,
  };
  const app = getFirebaseApp();

  const db = getDatabase(app);
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
    const app = getFirebaseApp();

    const db = getDatabase(app);

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
export const getDangerousPotholes = async (dangerLevel = "Dangerous") => {
  try {
    // Get a reference to the database
    const app = getFirebaseApp();

    const db = getDatabase(app);

    // Create a query to retrieve potholes with matching user ID
    const potholesRef = ref(db, "potholes");
    const dangerpotholesQuery = query(
      potholesRef,
      orderByChild("dangerLevel"),
      equalTo(dangerLevel)
    );

    // Retrieve potholes matching the query
    const snapshot = await get(dangerpotholesQuery);

    // Convert snapshot to an array of potholes

    const DangerousPotholes = [];
    snapshot.forEach((childSnapshot) => {
      const pothole = childSnapshot.val();
      DangerousPotholes.push({ id: childSnapshot.key, ...pothole });
    });

    return DangerousPotholes;
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving potholes:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const storeImageToStorage = async (imageUrl, userId) => {
  try {
    // Get a reference to the storage
    console.log("response", "conole.log ineStoreImageToStorage");

    const app = getFirebaseApp();

    console.log(userId, "userId");
    const storage = getStorage(app);
    console.log("response", "inamshod");

    const storageRef = ref(storage, `images/${userId}`);

    const response = await fetch(imageUrl);
    console.log("response", response);
    const blob = await response.blob();

    const uploadSnapshot = await uploadBytes(storageRef, blob);
    const uploadedFileRef = uploadSnapshot.ref;

    const downloadUrl = await uploadedFileRef.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error("Error storing image to Firebase Storage:", error);
    throw error;
  }
};

///https://reactnative.dev/docs/pressable
