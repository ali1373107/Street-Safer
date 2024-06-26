import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { COLORS, FONTS } from "../constants";
import Input from "../components/Input";
import EditPotholeForm from "../components/EditPotholeForm";
import { useUser } from "./UserContext";

import { fetchPotholesById, getPotholes } from "../utils/actions/potholeAction";

import { getDatabase, ref, remove, set } from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
const ListOfPotholes = ({ navigation }) => {
  const [potholes, setPotholes] = useState([]);
  const [email1, setEmail] = useState("");
  const [editingPotholeId, setEditingPotholeId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useUser();
  const [statusName, setStatusName] = useState("");

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
  const handleSearchByEmail = async () => {
    if (email1.trim() === "" || email1.trim().toLowerCase() === "all") {
      // If email input is empty, display all potholes
      getPotholes(setPotholes);
      Alert.alert("All potholes displayed");
    } else {
      const lowercaseEmail = email1.trim().toLowerCase();

      const filteredPotholes = potholes.filter(
        (pothole) => pothole.email.toLowerCase() === lowercaseEmail
      );
      if (filteredPotholes.length > 0) {
        setPotholes(filteredPotholes);
        setEmail("");
        Alert.alert("Potholes found");
      } else {
        Alert.alert("No Potholes found with the given email");
      }
    }
  };

  const handleFilterByStatus = async () => {
    if (statusName.trim() === "" || statusName.trim().toLowerCase() === "all") {
      // If email input is empty, display all potholes
      getPotholes(setPotholes);
      Alert.alert("All potholes displayed");
    } else {
      const lowercaseStatus = statusName.trim().toLowerCase();

      const filteredPotholes = potholes.filter(
        (pothole) => pothole.status.toLowerCase() === lowercaseStatus
      );
      if (filteredPotholes.length > 0) {
        setPotholes(filteredPotholes);
        setStatusName("");
        Alert.alert("Potholes found");
      } else {
        Alert.alert("No Potholes found with the given Status");
      }
    }
  };
  useEffect(() => {
    const getUserStatus = async () => {
      try {
        if (user !== null) {
          if (user.isAdmin == true) {
            setEmail("");
            await getPotholes(setPotholes);
          } else {
            await fetchPotholesById(user.userId, setPotholes);
          }
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error getting user", error);
        return null;
      }
    };

    getUserStatus();
  }, [user]);

  const handleSaveStatus = async (potholeId, status, update) => {
    try {
      const db = getDatabase();
      await Promise.all([
        set(ref(db, `potholes/${potholeId}/status`), status),
        set(ref(db, `potholes/${potholeId}/update`), update),
      ]);
      Alert.alert("Success", "Pothole status and update updated successfully");
      setEditingPotholeId(null);
    } catch (error) {
      console.error("Error updating pothole status and update:", error);
      Alert.alert(
        "Error",
        "Failed to update pothole status and update. Please try again."
      );
    }
  };
  const onCancel = () => {
    // Set the form state to false to close the form
    setIsFormOpen(false);
    console.log("Cancel button pressed");
  };
  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.text}>No data available</Text>
        <Text style={styles.text}>Login requred! </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ ...FONTS.h3, color: COLORS.primary }}>
            Go To Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: COLORS.primary }}>
      <View
        style={[
          styles.item,
          {
            borderColor:
              item.userId === user.userId ? "lightgreen" : COLORS.white,
          },
        ]}
      >
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
          Status: {item.status}
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
          {user.isAdmin && (
            <>
              {editingPotholeId === item.id && isFormOpen ? (
                <Modal visible={isModalVisible} animationType="slide">
                  <EditPotholeForm
                    onCancel={onCancel}
                    onSave={(status, update) =>
                      handleSaveStatus(item.id, status, update)
                    }
                  />
                </Modal>
              ) : (
                <Button
                  style={styles.button}
                  title="Edit"
                  onPress={() => {
                    setEditingPotholeId(item.id);
                    setIsFormOpen(true);
                    setIsModalVisible(true);
                  }}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {user.isAdmin && (
        <View>
          <View style={styles.input}>
            <Input
              id="email"
              onInputChanged={(id, text) => {
                setEmail(text);
                console.log(`Input ${id} changed: ${text}`);
              }}
              color={"grey"}
              value={email1}
              placeholder="Search by email"
              style={styles.textInput}
            />
            <Button title="Search" onPress={handleSearchByEmail} />
          </View>
          <View style={styles.input}>
            <Input
              id="statusName"
              onInputChanged={(id, text) => {
                setStatusName(text);
                console.log(`Input ${id} changed: ${text}`);
              }}
              style={styles.textInput}
              color={"grey"}
              value={statusName}
              placeholder="Search by Pothole Status"
            />
            <Button title="Search" onPress={handleFilterByStatus} />
          </View>
        </View>
      )}

      <FlatList
        data={potholes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 80,
    paddingLeft: 20,
  },
});

export default ListOfPotholes;
