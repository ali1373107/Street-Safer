import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import Button from "../components/Button";
import React, { useState } from "react";
import { COLORS, images, FONTS, SIZES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "./UserContext";

const LogoutScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logOut } = useUser();
  const handleLogout = async () => {
    setIsLoading(true);

    const auth = getAuth();
    try {
      await signOut(auth);

      await AsyncStorage.removeItem("userData");
      logOut();
      
      navigation.navigate("Map");

      // Show success message
      Alert.alert("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      // Show error message
      Alert.alert("Error", "Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{ width: 100, height: 100, marginLeft: -22, marginBottom: 6 }}
        />
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>Logout</Text>
        <Text style={{ ...FONTS.body2, color: COLORS.gray }}>
          Are you sure you want to logout?
        </Text>
        <View style={StyleSheet.bottomContainer}>
          <Text style={{ ...FONTS.body3, color: COLORS.white }}>Or Go to </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Map")}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              Potholes On The Map
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 22 }}>
          <Button
            title="LOGOUT"
            onPress={handleLogout}
            isLoading={isLoading}
            style={{ width: SIZES.width - 32, marginVertical: 8 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
});

export default LogoutScreen;
