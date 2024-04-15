import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./screens/WelcomeScreen";
import AddPothole from "./screens/AddPothole";
import ProfileScreen from "./screens/ProfileScreen";
import Privacy from "./screens/Privacy";
import PotholesOnMap from "./screens/PotholesOnMap";
import DangerousPothole from "./screens/DangerousPotholes";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { COLORS } from "./constants";
import LogoutScreen from "./screens/LogoutScreen";
import ManageUserScreen from "./screens/ManageUserScreen";
import ListOfPotholes from "./screens/ListOfPotholes";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Entypo";
import { UserProvider } from "./screens/UserContext";

/// Notifications

const TabNav = ({ loggedIn }) => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerBackButtonMenuEnabled: true,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "bold" },
        headerLeft: () => {
          return (
            <Icon
              name="menu"
              onPress={
                () => navigation.dispatch(DrawerActions.toggleDrawer)
                //navigation.openDrawer()
              }
              size={30}
              color={COLORS.black}
              style={{ marginLeft: 10 }}
            />
          );
        },
      }}
    >
      <Tab.Screen name="ListOfPotholes" component={ListOfPotholes} />
      <Tab.Screen name="AddPothole" component={AddPothole} />

      <Tab.Screen name="ManageUserScreen" component={ManageUserScreen} />
    </Tab.Navigator>
  );
};
const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonMenuEnabled: true,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Map" component={PotholesOnMap} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ListOfPotholes" component={ListOfPotholes} />
      <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Privacy" component={Privacy} />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerRight: () => (
          <Icon
            name="user"
            onPress={() => navigation.navigate("Profile")}
            size={30}
            color={COLORS.black}
            style={{ marginRight: 10 }}
          />
        ),
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.white,
        drawerActiveTintColor: COLORS.background,
        drawerActiveBackgroundColor: COLORS.gray,
        drawerStyle: { backgroundColor: COLORS.primary },
        headerShown: true,
        headerTitle: "",
      }}
    >
      <Drawer.Screen name="Menu" component={StackNav} />
      <Drawer.Screen name="DangerousPotholes" component={DangerousPothole} />
      <Drawer.Screen name="Tabs" component={TabNav} />

      <Drawer.Screen name="about" component={WelcomeScreen} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <NavigationContainer>
          <DrawerNav />
        </NavigationContainer>
      </UserProvider>
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
///////
