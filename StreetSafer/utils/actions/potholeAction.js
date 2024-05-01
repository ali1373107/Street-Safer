import { getFirebaseApp } from "../firebaseHelper";
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
    const potholesRef = ref(db, "potholes");
    const newPotholeRef = push(potholesRef);
    const potholeId = newPotholeRef.key;

    await set(newPotholeRef, pothole);

    return { ...pothole, id: potholeId };
  } catch (error) {
    console.error("Error creating pothole:", error);
    throw error;
  }
};
export const getDangerousPotholes = (dangerLevel = "Dangerous", callback) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);

    const potholesRef = ref(db, "potholes");
    const dangerpotholesQuery = query(
      potholesRef,
      orderByChild("dangerLevel"),
      equalTo(dangerLevel)
    );

    onValue(dangerpotholesQuery, (snapshot) => {
      const DangerousPotholes = [];
      snapshot.forEach((childSnapshot) => {
        const pothole = childSnapshot.val();
        DangerousPotholes.push({ id: childSnapshot.key, ...pothole });
      });

      callback(DangerousPotholes);
    });
  } catch (error) {
    console.error("Error retrieving potholes:", error);
    throw error;
  }
};
export const getPotholes = async (setPotholes) => {
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
    const reportsRef = ref(db, `reports`);
    const newReportRef = push(reportsRef);
    const reportId = newReportRef.key;

    await set(newReportRef, report);

    return { ...report, id: reportId };
  } catch (error) {
    console.error("Error creating pothole:", error);
    throw error;
  }
};
export const fetchPotholesById = async (userId, setPotholes) => {
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
export const fetchPotholesByEmail = async (email, setPotholes) => {
  const db = getDatabase();
  const potholesRef = ref(db, "potholes");
  const potholesQuery = query(
    potholesRef,
    orderByChild("email"),
    equalTo(email.toLowerCase())
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
export const getPotholesByPostcode = async (streetName, setPotholes) => {
  const app = getFirebaseApp();
  const db = getDatabase(app);
  const potholesRef = ref(db, "potholes");

  const potholesQuery = query(
    potholesRef,
    orderByChild("streetName"),
    equalTo(streetName)
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

  return () => off(potholesRef, listener);
};
