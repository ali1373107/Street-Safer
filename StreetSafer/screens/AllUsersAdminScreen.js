import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { getAllUsers, updateUser } from "../utils/actions/userActions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import { COLORS, images, FONTS, SIZES } from "../constants";
import { getDatabase, ref, remove } from "firebase/database";
const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    fullName: "",
    email: "",
    isAdmin: false,
  });

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
  useEffect(() => {
    const unsubscribeFunc = getAllUsers(setUsers);
    setUnsubscribe(() => unsubscribeFunc);

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
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
      <View style={styles.item}>
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
    <FlatList
      data={users}
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

export default ListOfUsers;
//frameprocessor
