import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./screens/WelcomeScreen";
import PotholesListScreen from "./screens/PotholesListScreen";
import AddPothole from "./screens/AddPothole";
import ProfileScreen from "./screens/ProfileScreen";
import PotholesOnMap from "./screens/PotholesOnMap";
import { Ionicons } from "@expo/vector-icons";
import DangerousPothole from "./screens/DangerousPotholes";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#3c0a6b" },
          headerTintColor: "white",
          drawerActiveTintColor: "#3c0a6b",
          drawerActiveBackgroundColor: "#f0e1ff",
          drawerStyle: { backgroundColor: "#cccccc" },
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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
//app.js


