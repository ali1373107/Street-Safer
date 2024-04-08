import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import { COLORS, images, FONTS, SIZES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "../utils/actions/userActions";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import EditPotholeForm from "../components/EditPotholeForm";

import {
  fetchPotholesById,
  getPotholes,
  fetchPotholesByEmail,
} from "../utils/actions/potholeAction";

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
const ListOfPotholes = ({ navigation }) => {
  const [potholes, setPotholes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [editingPotholeId, setEditingPotholeId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    if (email.trim() === "" || email.trim().toLowerCase() === "all") {
      // If email input is empty, display all potholes
      getPotholes(setPotholes);
      Alert.alert("All potholes displayed");
    } else {
      const lowercaseEmail = email.trim().toLowerCase();

      const pothole = potholes.find(
        (pothole) => pothole.email.toLowerCase() === lowercaseEmail
      );
      if (pothole) {
        setPotholes([pothole]);
        setEmail("");
        Alert.alert("Pothole found");
      } else {
        Alert.alert("No Pothole found with the given email");
      }
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
          const user = await getUserData(userid);
          setIsAdmin(user.isAdmin);
          if (user.isAdmin) {
            getPotholes(setPotholes);
            setEmail("");
          } else {
            fetchPotholesById(userid, setPotholes);
          }
        } else {
          console.log("User data not found in AsyncStorage");
          return null;
        }
      } catch (error) {
        console.error("Error getting user data from AsyncStorage:", error);
        return null;
      }
    };

    getUserIdFromStorage();
  }, []);

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

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: COLORS.primary }}>
      <View
        style={[
          styles.item,
          { borderColor: item.userId === userId ? "lightgreen" : COLORS.white },
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
          {isAdmin && (
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
      {isAdmin && (
        <View style={styles.input}>
          <Input
            id="email"
            onInputChanged={(id, text) => {
              setEmail(text);
              console.log(`Input ${id} changed: ${text}`);
            }}
            color={"grey"}
            value={email}
            placeholder="Search by email"
          />
          <Button title="Search" onPress={handleSearchByEmail} />
        </View>
      )}
      <View>
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
  input: {
    backgroundColor: COLORS.white,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    marginTop: -70,
  },
});

export default ListOfPotholes;
//frameprocessor
