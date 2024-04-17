import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import axios from "axios";
import * as Location from "expo-location";
import { getPotholesByPostcode } from "../utils/actions/potholeAction";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function Notification() {
  const [pothole, setPotholes] = useState([]);
  const [postCode, setPostcode] = useState("");

  const scheduleNotificationHandler = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Fetch address
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const { address } = response.data;
    const { postcode } = address || {};
    console.log("postcode", postcode);
    if (postcode) {
      // Set postcode state
      setPostcode(postcode);
    }
  };

  const sendNotification = async () => {
    const body =
      pothole.length > 0
        ? `Pothole detected in your area ${postCode}`
        : `No pothole detected in your area ${postCode}`;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification",
        body: body,
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Notification permissions are required for this feature.");
      }
    };

    requestPermissions();
    scheduleNotificationHandler();
  }, []);

  useEffect(() => {
    if (postCode) {
      const fetchPotholes = async () => {
        getPotholesByPostcode(postCode, setPotholes);
      };

      fetchPotholes();
    }
  }, [postCode]);

  return (
    <View style={styles.viewStyle}>
      <StatusBar style="auto" />
      <View>
        <Text>Clock on below button to recive notification</Text>
        <Text>if there is pothole exist in your area</Text>
        <Button title="Set Notification" onPress={sendNotification} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Notification;
