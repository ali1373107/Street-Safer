import * as Font from "expo-font";

export async function loadFonts() {
  await Font.loadAsync({
    "AlegreyaSans-Black": require("../assets/fonts/AlegreyaSans-Black.ttf"),
    "AlegreyaSans-Bold": require("../assets/fonts/AlegreyaSans-Bold.ttf"),
    "AlegreyaSans-Regular": require("../assets/fonts/AlegreyaSans-Regular.ttf"),
    "AlegreyaSans-Medium": require("../assets/fonts/AlegreyaSans-Medium.ttf"),
    "AlegreyaSans-Light": require("../assets/fonts/AlegreyaSans-Light.ttf"),
  });
}
