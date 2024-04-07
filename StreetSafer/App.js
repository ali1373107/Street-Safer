import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./screens/WelcomeScreen";
import AddPothole from "./screens/AddPothole";
import ProfileScreen from "./screens/ProfileScreen";
import PotholesOnMap from "./screens/PotholesOnMap";
import { Ionicons } from "@expo/vector-icons";
import DangerousPothole from "./screens/DangerousPotholes";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { COLORS, images, FONTS, SIZES } from "./constants";
import LogoutScreen from "./screens/LogoutScreen";
import { getUserData } from "./utils/actions/userActions";
import ManageUserScreen from "./screens/ManageUserScreen";
import ListOfPotholes from "./screens/ListOfPotholes";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "firebase/database";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Entypo";

const TabNav = ({ loggedIn }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="ListOfPotholes" component={ListOfPotholes} />
      <Tab.Screen name="AddPothole" component={AddPothole} />
      <Tab.Screen
        name="Logout"
        component={loggedIn ? PotholesOnMap : LogoutScreen}
      />
    </Tab.Navigator>
  );
};
const StackNav = ({ loggedIn }) => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
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
      <Stack.Screen name="PotholesOnMap" component={PotholesOnMap} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ListOfPotholes" component={ListOfPotholes} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

const DrawerNav = ({ loggedIn }) => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.white,
        drawerActiveTintColor: COLORS.background,
        drawerActiveBackgroundColor: COLORS.gray,
        drawerStyle: { backgroundColor: COLORS.primary },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Menu" component={StackNav} />
      <Drawer.Screen name="DangerousPotholes" component={DangerousPothole} />
      <Drawer.Screen name="Tabs" component={TabNav} />

      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="ManageUserScreen" component={ManageUserScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem("userData");
        if (userDataJSON !== null) {
          const userData = JSON.parse(userDataJSON);
          const userid = userData.userId;
          setLoggedIn(true);
          return userid;
        } else {
          setLoggedIn(false);
          console.log("User data not found in AsyncStorage");
          return null;
        }
      } catch (error) {
        console.error("Error getting user data from AsyncStorage:", error);
        return null;
      }
    };
    getUserIdFromStorage();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <DrawerNav loggedIn={loggedIn} />
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
///////
