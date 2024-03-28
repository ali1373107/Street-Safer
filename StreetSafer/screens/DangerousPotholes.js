import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";

export default function App() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  /**
   *
   */
  const takePhoto = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        console.log("Image URI", uri);
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
    }
  };

  // permission check
  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text>Permission Not Granted - {permission?.status}</Text>
        <StatusBar style="auto" />
        <Button title="Request Permission" onPress={requestPermission}></Button>
      </View>
    );
  }

  // main UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Working With Firebase and Image Picker</Text>
        <StatusBar style="auto" />
        <Button title="Take Picture" onPress={takePhoto}></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
