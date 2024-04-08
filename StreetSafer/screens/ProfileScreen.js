import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, images, FONTS, SIZES } from "../constants";
import { getUserData } from "../utils/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        // Retrieve userData from AsyncStorage
        const userDataJSON = await AsyncStorage.getItem("userData");

        // If userData exists, parse it and extract userId
        if (userDataJSON !== null) {
          const userData = JSON.parse(userDataJSON);
          const userid = userData.userId;
          console.log("useridsy", userid);
          const user = await getUserData(userid);
          console.log("user", user);
          setUser(user);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.item}>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/User.png")}
            resizeMode="cover"
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        </View>
        <View style={styles.TextView}>
          <Text style={styles.text}>Name: {user.fullName}</Text>
          <Text style={styles.text}>User Email address: {user.email}</Text>
          <Text style={styles.text}>
            Date joined: {formatDate(user.signUpData)}
          </Text>
          <Text style={styles.text}>
            Status:
            {user.isAdmin ? "Admin" : user.isAdmin === false ? "User" : ""}
          </Text>
        </View>
        <View style={styles.buttonView}>
          <Button
            color={COLORS.primary}
            title="Loghout"
            onPress={() => navigation.navigate("LogoutScreen")}
          />
        </View>
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
    backgroundColor: COLORS.gray,
    marginTop: 20,
    borderColor: COLORS.white,
    borderRadius: 50,

    borderWidth: 3,
    padding: 20,
    marginBottom: 80,
  },

  text: {
    ...FONTS.h2,
    color: COLORS.background,
    margin: 10,
    marginTop: 10,
    borderRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.black,
  },
  TextView: {
    marginTop: 30,
    backgroundColor: "lightgrey",
    padding: 20,
    borderRadius: 12,
  },
  buttonView: {
    marginTop: 30,
    backgroundColor: "lightgrey",
    padding: 20,
    borderRadius: 12,
  },
});

export default ProfileScreen;
//frameprocessor
