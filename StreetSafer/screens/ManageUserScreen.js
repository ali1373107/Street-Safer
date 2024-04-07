import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import {
  getAllUsers,
  updateUser,
  getUserById,
  getUserByEmail,
} from "../utils/actions/userActions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, images, FONTS, SIZES } from "../constants";
import { getDatabase, ref, remove } from "firebase/database";
import { getUserData } from "../utils/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageUserScreen = () => {
  const [users, setUsers] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    fullName: "",
    emails: "",
    isAdmin: false,
  });
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  const handleDelete = async (userId) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `users/${userId}`));
      setUsers(users.filter((user) => user.id !== userId));
      Alert.alert("Success", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user. Please try again.");
    }
  };
  const handleEdit = async () => {
    console.log("editData", editData);
    try {
      await updateUser(editData);
      setEditMode(false);
      Alert.alert("Success", "User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user. Please try again.");
    }
  };
  const handleSearchByEmail = async () => {
    if (email.trim() === "" || email.trim().toLowerCase() === "all") {
      // If email input is empty, display all potholes
      getAllUsers(setUsers);
    } else {
      const users = await getUserByEmail(email.trim().toLowerCase(), setUsers);
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
          console.log("user", user);
          setIsAdmin(user.isAdmin);
          if (user.isAdmin) {
            getAllUsers(setUsers);
            setEmail("");
          } else {
            const user = await getUserById(userid);
            console.log("user1", user);
            setUsers([user]);
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

    // Fetch potholes data when the component mounts

    getUserIdFromStorage();
  }, []);
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);

    if (!isNaN(dateObject.getTime())) {
      const formattedDate = `${dateObject.getDate()}/${
        dateObject.getMonth() + 1
      }/${dateObject.getFullYear()}`;
      return formattedDate;
    } else {
      return "Invalid Date";
    }
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
          Name: {item.fullName}
        </Text>
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          User Email address: {item.email}
        </Text>
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          Date joined: {formatDate(item.signUpData)}
        </Text>

        <Text style={{ ...FONTS.h2, color: COLORS.white }}>
          Status:
          {item.isAdmin ? "Admin" : "User"}
        </Text>

        {editMode && editData.id === item.id ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editData.fullName}
              onChangeText={(text) =>
                setEditData({ ...editData, fullName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editData.email}
              onChangeText={(text) => setEditData({ ...editData, email: text })}
            />
            <Button title="Save" onPress={handleEdit} />
          </View>
        ) : (
          <View style={styles.container}>
            <Button
              style={styles.button}
              title="Delete"
              onPress={() => handleDelete(item.id)}
            />
            <Button
              style={styles.button}
              title="Edit"
              onPress={() => {
                setEditMode(true);
                setEditData({ ...item, email: "" });
              }}
            />
          </View>
        )}
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
            value={email}
            placeholder="Search by email"
            color={COLORS.primary}
          />
          <Button title="Search" onPress={handleSearchByEmail} />
        </View>
      )}
      <View>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
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
    marginTop: -20,
  },
});

export default ManageUserScreen;
//frameprocessor
