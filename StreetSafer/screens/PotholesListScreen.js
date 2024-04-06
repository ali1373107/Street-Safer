import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, Alert } from "react-native";
//import { getPotholesByUserId } from "../utils/actions/potholeAction";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import { COLORS, images, FONTS, SIZES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "../utils/actions/userActions";

import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  remove,
  set,
  get,
} from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
const ListOfPotholes = () => {
  const [potholes, setPotholes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const handleDelete = async (potholeId) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `potholes/${potholeId}`));
      setPotholes(potholes.filter((pothole) => pothole.id !== potholeId));
      Alert.alert("Success", "Pothole deleted successfully");
    } catch (error) {
      console.error("Error deleting pothole:", error);
      Alert.alert("Error", "Failed to delete pothole. Please try again.");
    }
  };
  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        // Retrieve userData from AsyncStorage
        const userDataJSON = await AsyncStorage.getItem("userData");

        // If userData exists, parse it and extract userId
        if (userDataJSON !== null) {
          const userData = JSON.parse(userDataJSON);
          const userid = userData.userId;
          setUserId(userid);
          return userid;
        } else {
          console.log("User data not found in AsyncStorage");
          return null;
        }
      } catch (error) {
        console.error("Error getting user data from AsyncStorage:", error);
        return null;
      }
    };
    const fetchPotholes = async () => {
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

    const getUserStatus = async () => {
      try {
        console.log("userId", userId);
        const status = await getUserData(userId);
        if (status !== null) {
          console.log("status", status);
          setIsAdmin(status.isAdmin);
          return status;
        } else {
          console.log("User status not found");
          return null;
        }
      } catch (error) {
        console.error("Error getting user status:", error);
        return null;
      }
    };
    // Fetch potholes data when the component mounts

    if (userId) {
      fetchPotholes(userId);
      getUserStatus(userId);
    } else {
      getUserIdFromStorage();
    }
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: COLORS.primary }}>
      <View style={styles.item}>
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          Street Name: {item.streetName}
        </Text>
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          Postcode: {item.postcode}
        </Text>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.white,
          }}
        >
          DangerLevel:
          {item.dangerLevel}
        </Text>
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          Description:{" "}
          {item.description ? item.description : "No description provided"}
        </Text>
        <View style={styles.container}>
          <Button
            style={styles.button}
            title="Delete"
            onPress={() => handleDelete(item.id)}
          />
          <Button style={styles.button} title="Edit" />
        </View>
      </View>
    </View>
  );
  const handeleAdminButton = () => {
    //print is admin
    console.log("Admin");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View>
        {isAdmin && (
          <View>
            <Button title="All Potholes" onPress={handeleAdminButton} />
          </View>
        )}
        <FlatList
          data={potholes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  item: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 20,
    borderColor: COLORS.white,
    borderWidth: 3,
    padding: 20,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginHorizontal: 30,
  },
});

export default ListOfPotholes;
//frameprocessor
