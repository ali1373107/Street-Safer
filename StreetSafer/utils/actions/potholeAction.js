import { getFirebaseApp } from "../firebaseHelper";
///
import {
  getDatabase,
  ref,
  set,
  equalTo,
  orderByChild,
  query,
  onValue,
  get,
  off,
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
  status,
  update,
  userId,
  email
) => {
  const pothole = {
    streetName,
    postcode,
    latitude,
    longitude,
    dangerLevel,
    description,
    imageUrl,
    status,
    update,
    userId,
    email,
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
export const getDangerousPotholes = (dangerLevel = "Dangerous", callback) => {
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

    // Listen for potholes matching the query
    onValue(dangerpotholesQuery, (snapshot) => {
      // Convert snapshot to an array of potholes
      const DangerousPotholes = [];
      snapshot.forEach((childSnapshot) => {
        const pothole = childSnapshot.val();
        DangerousPotholes.push({ id: childSnapshot.key, ...pothole });
      });

      // Call the callback function with the updated potholes
      callback(DangerousPotholes);
    });
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving potholes:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
export const getPotholes = (setPotholes) => {
  const app = getFirebaseApp();
  const db = getDatabase(app);
  const potholesRef = ref(db, "potholes");

  const listener = onValue(potholesRef, (snapshot) => {
    const potholesData = snapshot.val();
    if (potholesData) {
      const potholesArray = Object.entries(potholesData).map(
        ([key, value]) => ({ id: key, ...value })
      );
      setPotholes(potholesArray);
    } else {
      setPotholes([]);
    }
  });

  return () => off(potholesRef, listener);
};

export const reportExistingPothole = async (
  potholeId,
  comment,
  userId,
  selectedOptions,
  reciveUpdate,
  email
) => {
  const report = {
    potholeId,
    comment,
    userId,
    selectedOptions,
    reciveUpdate,

    email,
  };
  const app = getFirebaseApp();
  const db = getDatabase(app);
  try {
    // Push the pothole data to generate a unique ID
    const reportsRef = ref(db, `reports`);
    const newReportRef = push(reportsRef);
    const reportId = newReportRef.key;

    // Set the pothole data under the unique ID
    await set(newReportRef, report);

    // Return the pothole data along with the generated ID
    return { ...report, id: reportId };
  } catch (error) {
    // Handle any errors
    console.error("Error creating pothole:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
export const fetchPotholesById = (userId, setPotholes) => {
  const db = getDatabase();
  const potholesRef = ref(db, "potholes");
  const potholesQuery = query(
    potholesRef,
    orderByChild("userId"),
    equalTo(userId)
  );
  const listener = onValue(potholesQuery, (snapshot) => {
    const potholesData = snapshot.val();
    if (potholesData) {
      const potholesArray = Object.entries(potholesData).map(
        ([key, value]) => ({ id: key, ...value })
      );
      setPotholes(potholesArray);
    } else {
      setPotholes([]);
    }
  });

  return () => {
    listener();
  };
};
export const fetchPotholesByEmail = (email, setPotholes) => {
  const db = getDatabase();
  const potholesRef = ref(db, "potholes");
  const potholesQuery = query(
    potholesRef,
    orderByChild("email"),
    equalTo(email.toLowerCase())
  );

  // Attach an event listener to retrieve data
  const listener = onValue(potholesQuery, (snapshot) => {
    const potholesData = snapshot.val();
    if (potholesData) {
      const potholesArray = Object.entries(potholesData).map(
        ([key, value]) => ({ id: key, ...value })
      );
      setPotholes(potholesArray);
    } else {
      setPotholes([]);
    }
  });

  // Return a function to detach the event listener
  return () => {
    listener();
  };
};

///https://reactnative.dev/docs/pressable
