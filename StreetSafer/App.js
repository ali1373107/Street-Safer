import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./screens/WelcomeScreen";
import PotholesListScreen from "./screens/PotholesListScreen";
import AddPothole from "./screens/AddPothole";
import ProfileScreen from "./screens/ProfileScreen";
import PotholesOnMap from "./screens/PotholesOnMap";
import { Ionicons } from "@expo/vector-icons";
import DangerousPothole from "./screens/DangerousPotholes";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { COLORS, images, FONTS, SIZES } from "./constants";

const Drawer = createDrawerNavigator();

const Splash = () => (
  <View style={styles.splashContainer}>
    <Image
      source={require("./assets/images/splash.png")}
      resizeMode="contain"
      style={styles.splashImage}
    />
  </View>
);
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulated 3 seconds of loading time
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.white,
            drawerActiveTintColor: COLORS.background,
            drawerActiveBackgroundColor: COLORS.gray,
            drawerStyle: { backgroundColor: COLORS.primary },
          }}
        >
          <Drawer.Screen
            name="PotholesOnMap"
            component={PotholesOnMap}
            options={{
              drawerLabel: "Potholes On Map Screen",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
          />

          <Drawer.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              drawerLabel: "Profile Screen",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
          />

          <Drawer.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              drawerLabel: "Welcome Screen",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Potholes List"
            component={PotholesListScreen}
            options={{
              drawerLabel: "Potholes List",

              drawerIcon: ({ color, size }) => (
                <Ionicons name="list" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="AddPothole"
            component={AddPothole}
            options={{
              drawerLabel: "Add Pothole Screen",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="add" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="DangerousPotholes "
            component={DangerousPothole}
            options={{
              drawerLabel: "Dangerous Potholes Screen ",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="alert-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Login"
            component={Login}
            options={{
              drawerLabel: "LOGIN",
              drawerIcon: ({ color, size }) => (
                <Ionicons color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Signup"
            component={Signup}
            options={{
              drawerLabel: "SIGNUP",
              drawerIcon: ({ color, size }) => (
                <Ionicons color={color} size={size} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  splashImage: {
    width: 500,
    height: 500,
  },
});
