import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getAllUsers, getUserById } from "../utils/actions/userActions";
import Button from "../components/Button";
import Input from "../components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "./UserContext";
import { getAuth, deleteUser } from "firebase/auth";

import { COLORS, FONTS } from "../constants";
import { getDatabase, ref, remove } from "firebase/database";

const ManageUserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  const handleDelete = async (userId) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `users/${userId}`));
      const auth = getAuth();
      await deleteUser(auth.currentUser);
      setUsers(users.filter((user1) => user1.id !== userId));
      Alert.alert("Success", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user. Please try again.");
    }
  };

  const handleSearchByEmail = () => {
    if (email.trim() === "" || email.trim().toLowerCase() === "all") {
      getAllUsers(setUsers);
      Alert.alert("All Users Retrieved ");
    } else {
      const lowercaseEmail = email.trim().toLowerCase();
      const user1 = users.find(
        (user1) => user1.email.toLowerCase() === lowercaseEmail
      );
      Alert.alert("User Retrieved");

      if (user1) {
        setUsers([user1]);
      } else {
        Alert.alert("No user found with the given email");
      }
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        if (user !== null) {
          const userid = user.userId;
          console.log("useridsy", userid);
          console.log("user", user);
          setIsAdmin(user.isAdmin);
          if (user.isAdmin == true) {
            await getAllUsers(setUsers);

            setEmail("");
          } else {
            await getUserById(user.userId, setUsers);
            setUsers([user]);
          }
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error getting user data", error);
        return null;
      }
    };

    getUser();
  }, [user]);
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
          {
            borderColor:
              item.userId === user.userId ? "lightgreen" : COLORS.white,
          },
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

        <View style={styles.container}>
          <Button
            style={styles.button}
            title="Delete account"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </View>
    </View>
  );
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
