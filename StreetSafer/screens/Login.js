import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Button as RNButton,
} from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import { COLORS, images, FONTS, SIZES } from "../constants";
import Input from "../components/Input";
import Button from "../components/Button";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import { signIn } from "../utils/actions/authAction";
import { getUserByEmail } from "../utils/actions/userActions";
import { useDispatch } from "react-redux";
import { useUser } from "./UserContext";
import { getFirebaseApp } from "../utils/firebaseHelper";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const isTestMode = true;
const initalState = {
  inputValues: {
    email: isTestMode ? "example@gmail.com" : "",
    password: isTestMode ? "*******" : "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};
const Login = ({ navigation }) => {
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initalState);
  const dispatch = useDispatch();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const inputChangedHandeler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );
  const authHandeler = async () => {
    try {
      setIsLoading(true);
      const email = formState.inputValues.email;
      console.log("email", email);
      await handleSearchByEmail(email);
      signIn(formState.inputValues.email, formState.inputValues.password);
      setError(null);
      Alert.alert("Login Successfully", "Successfully signed in ");
      setIsLoading(false);
      navigation.navigate("Map");
      if (typeof fetchUser === "function") {
        await fetchUser();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Login Failed", "Invalid email or password");
      } else {
        setError(error.message);
        Alert.alert("Error", "An error occurred during login");
      }
    }
  };
  const handleForgotPassword = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      setIsLoading(false);
      setShowForgotPasswordModal(false);
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email to reset your password."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setIsLoading(false);
      setError("Failed to send password reset email. Please try again.");
    }
  };
  const handleSearchByEmail = async (email) => {
    const lowercaseEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(lowercaseEmail);
    if (user) {
      setUser(user); // Update the users state with the found user
    } else {
      Alert.alert("No user found with the given email");
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
        <Text style={{ ...FONTS.h2, color: COLORS.white }}>Login</Text>
        <Text style={{ ...FONTS.body2, color: COLORS.gray }}>
          Sign in now for free and report potholes to help maintain roads safe.
        </Text>
        <View style={{ marginVertical: 22 }}>
          <Input
            id="email"
            color={COLORS.white}
            placeholder="Email Address"
            placeholderTextColor={COLORS.gray}
            errorText={formState.inputValidities["email"]}
            onInputChanged={inputChangedHandeler}
          />
          <Input
            id="password"
            color={COLORS.white}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            errorText={formState.inputValidities["password"]}
            onInputChanged={inputChangedHandeler}
            secureTextEntry
          />
          <Button
            title="LOGIN"
            onPress={authHandeler}
            isLoading={isLoading}
            style={{ width: SIZES.width - 32, marginVertical: 8 }}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={showForgotPasswordModal}
            onRequestClose={() => setShowForgotPasswordModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={{ ...FONTS.h2, color: COLORS.white }}>
                  Forgot Password
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.gray}
                  value={forgotPasswordEmail}
                  onChangeText={(text) => setForgotPasswordEmail(text)}
                />
                <RNButton
                  title="Send Reset Email"
                  onPress={handleForgotPassword}
                />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowForgotPasswordModal(false)}
                >
                  <Text style={{ ...FONTS.body3, color: COLORS.white }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={() => setShowForgotPasswordModal(true)}>
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
          <View style={StyleSheet.bottomContainer}>
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={{ ...FONTS.h3, color: COLORS.white }}>SIGNUP</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: COLORS.white,
  },
});
export default Login;
