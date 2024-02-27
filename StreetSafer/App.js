import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomeScreen from './screens/WelcomeScreen';
import PotholesListScreen from './screens/PotholesListScreen';
import AddPothole from './screens/AddPothole';
import ProfileScreen from './screens/ProfileScreen';
import PotholesOnMap from './screens/PotholesOnMap';
import {Ionicons} from '@expo/vector-icons'
import DangerousPothole from './screens/DangerousPotholes';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      
      <Drawer.Navigator screenOptions={{
        headerStyle: { backgroundColor: '#3c0a6b'},
        headerTintColor: 'white',
        drawerActiveTintColor: '#3c0a6b',
        drawerActiveBackgroundColor:'#f0e1ff',
        drawerStyle: { backgroundColor: '#cccccc'},
      }}>
        <Drawer.Screen name="Profile"  component={ProfileScreen} option={{
          drawerLabel: 'Profile Screen'
        }}
        
        />
        
        <Drawer.Screen name="Welcome" component={WelcomeScreen} options={{
          drawerLabel: 'Welcome Screen',
         
        }} />
        <Drawer.Screen name="User" component={PotholesListScreen}
        options={{
          drawerLabel: 'User Screen',
        
        }}  />
        <Drawer.Screen name="AddPothole"  component={AddPothole} option={{
          drawerLabel: 'Add Pothole Screen'
        }}
        
        />
        <Drawer.Screen name="DangerousPotholes "  component={DangerousPothole} option={{drawerLabel:"Dangerous Potholes Screen "
        }}/>

        <Drawer.Screen name="PotholesOnMap"  component={PotholesOnMap} option={{
            drawerLabel: 'Potholes On Map Screen'
          }}
        
        />
        
        </Drawer.Navigator>
        
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});