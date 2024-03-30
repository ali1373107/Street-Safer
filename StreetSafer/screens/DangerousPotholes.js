import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getDangerousPotholes } from "../utils/actions/potholeAction";
import { COLORS, FONTS } from "../constants";

const ListOfDangerousPotholes = () => {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDangerousPotholes = async () => {
      try {
        await getDangerousPotholes("Dangerous", (fetchedPotholes) => {
          setPotholes(fetchedPotholes);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching potholes:", error);
        setLoading(false);
      }
    };
    fetchDangerousPotholes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>Street Name: {item.streetName}</Text>
      <Text style={styles.text}>Postcode: {item.postcode}</Text>
      <Text style={styles.text}>Danger Level: {item.dangerLevel}</Text>
      <Text style={styles.text}>
        Description:{" "}
        {item.description ? item.description : "No description provided"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (potholes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No dangerous potholes found.</Text>
      </View>
    );
  }

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
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: COLORS.background,
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  text: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  noDataText: {
    ...FONTS.body2,
    color: COLORS.white,
  },
});

export default ListOfDangerousPotholes;
