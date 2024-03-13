import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import React from "react";
import { COLORS, FONTS, SIZES } from "../constants";
const Button = (props) => {
  const isLoading = props.isLoading || false;

  return (
    <TouchableOpacity
      style={{ ...styles.btn, ...props.style }}
      onPress={props.onPress}
    >
      <ActivityIndicator />
      <Text></Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: SIZES.padding,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
});
export default Button;
