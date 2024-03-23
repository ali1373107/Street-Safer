import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { getPotholesByUserId } from "../utils/actions/potholeAction";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ListOfPotholes = () => {
  const [potholes, setPotholes] = useState([]);
  const [userId, setUserId] = useState(null);

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
      try {
        const currentUserId = await getUserId();
        setUserId(currentUserId);
        const fetchedPotholes = await getPotholesByUserId(currentUserId);
        setPotholes(fetchedPotholes);
      } catch (error) {
        console.error("Error fetching potholes:", error);
      }
    };

    fetchPotholes();
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <Text>
        Street Name: {item.streetName}, Postcode: {item.postcode},DangerLevel:
        {item.dangerLevel}
      </Text>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ListOfPotholes;
