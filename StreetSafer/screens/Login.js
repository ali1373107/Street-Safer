import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
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
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      await dispatch(action);
      setError(null);
      Alert.alert("Login Successfully", "Successfully signed in ");
      setIsLoading(false);
      navigation.navigate("PotholesOnMap");
      if (typeof fetchUser === "function") {
        await fetchUser();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
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
});
export default Login;
