import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
//import { getPotholesByUserId } from "../utils/actions/potholeAction";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import { COLORS, images, FONTS, SIZES } from "../constants";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
} from "firebase/database";
const ListOfPotholes = () => {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    // Function to retrieve the current user's ID
    const getUserId = () => {
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, return the userId
            resolve(user.uid);
          } else {
            // No user is signed in
            reject("No user signed in");
          }
        });
      });
    };

    // Fetch potholes data when the component mounts
    const fetchPotholes = async () => {
      const userId = await getUserId();

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
        // Unsubscribe from real-time updates when the component unmounts
        off(listener);
      };
    };

    fetchPotholes();
  }, []);

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
          <Button style={styles.button} title="Delete" />
          <Button style={styles.button} title="Edit" />
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={potholes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
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
