import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";
import { COLORS, images, FONTS, SIZES } from "../constants";
import { useCallback } from "react";
import { validateInput } from "../utils/actions/formActions";
import { useState } from "react";

const Signup = () => {
  const inputChangedHandeler = useCallback((id, value) => {
    console.log(id, value);
  });
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
            placeHolderTextColor={COLORS.gray}
          />
          <Input
            id="email"
            placeHolder="Email"
            placeHolderTextColor={COLORS.gray}
            errorText={formState.inputValidities["email"]}
            onInputChanged={inputChangedHandeler}
          />
          <Input
            id="password"
            placeHolder="Password"
            placeHolderTextColor={COLORS.gray}
            errorText={formState.inputValidities["password"]}
          />
          <Button
            title="SIGNUP"
            style={{ width: SIZES.width - 32, marginVertical: 8 }}
          />
          <View style={styles.bottomContainer}>
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>
              {" "}
              Already have an account?
            </Text>
            <TouchableOpacity>
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
