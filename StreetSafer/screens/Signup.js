import { ScrollView, View, Text, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";
import { COLORS, images, FONTS, SIZES } from "../constants";
import { validateInput } from "../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signUp } from "../utils/actions/authAction";
import React, { useCallback, useReducer, useState, useEffect } from "react";
import { reducer } from "../utils/reducers/formReducers";
import { validate } from "validate.js";

const isTestMode = true;
const initialState = {
  inputValues: {
    fullName: isTestMode ? "" : "",
    email: isTestMode ? "" : "",
    password: isTestMode ? "" : "",
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
  },
};
const Signup = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const inputChangedHandeler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );
  const authHandeletr = async () => {
    try {
      setIsLoading(true);
      const action = signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.password
      );
      console.log("alert:", Alert);
      await dispatch(action);
      Alert.alert("Account Successfully created ", "Account created. ");
      setError(null);
      setIsLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error Message1", error);
      setIsLoading(false);
      setError("error message 2 for creating user ", error.message);
    }
  };
  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{ flrx: 1, backgroundColor: COLORS.background, padding: 16 }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{ width: 100, height: 100, marginLeft: -22, marginBottom: 6 }}
        />
        <Text style={{ ...FONTS.h2, color: COLORS.white }}> Sign Up</Text>
        <Text style={{ ...FONTS.body2, color: COLORS.gray }}>
          Signup now for free and report potholes to help maintain roads safe.
        </Text>
        <View style={{ marginVertical: 22 }}>
          <Input
            id="fullName"
            placeholder="Name"
            onInputChanged={inputChangedHandeler}
            errorText={formState.inputValidities["fullName"]}
            color={COLORS.white}
          />
          <Input
            id="email"
            placeHolder="Email"
            placeHolderTextColor={COLORS.gray}
            errorText={formState.inputValidities["email"]}
            onInputChanged={inputChangedHandeler}
            color={COLORS.white}
          />
          <Input
            id="password"
            placeHolder="Password"
            placeHolderTextColor={COLORS.gray}
            errorText={formState.inputValidities["password"]}
            onInputChanged={inputChangedHandeler}
            color={COLORS.white}
            secureTextEntry
          />
          <Button
            title="SIGNUP"
            style={{ width: SIZES.width - 32, marginVertical: 8 }}
            onPress={authHandeletr}
            isLoading={isLoading}
          />
          <View style={styles.bottomContainer}>
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>
              {" "}
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ ...FONTS.h3, color: COLORS.white }}> Login</Text>
            </TouchableOpacity>
          </View>
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
export default Signup;

/*
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function Privacy() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Notification permissions are required for this feature.");
      }
    };

    requestPermissions();
  }, []);

  const scheduleNotificationHandler = async () => {
    console.log("Notification set");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification",
        body: "Notification body",
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  return (
    <View style={styles.viewStyle}>
      <Button title="set Notification" onPress={scheduleNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

// ... rest of your code
const styles = StyleSheet.create({
  viewStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textStyle: {
    fontSize: 28,
    color: "black",
  },
  headingStyle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
  },
});
export default Privacy;
*/

/*
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
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

function Privacy() {
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
      pothole.length > 0 ? "Pothole detected" : "No pothole detected";
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification",
        body: body,
      },
      trigger: {
        seconds: 10,
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
      <Button title="Set Notification" onPress={sendNotification} />
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

export default Privacy;
*/
