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

import { useUser } from "./UserContext";
const ProfileScreen = ({ navigation }) => {
  //const [user, setUser] = useState([]);
  const { user } = useUser();

  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.text}>No user data available</Text>
      </SafeAreaView>
    );
  }
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
