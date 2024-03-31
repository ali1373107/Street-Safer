import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Input from "../components/Input";
import Button from "../components/Button";
import { COLORS, SIZES } from "../constants";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createPothole } from "../utils/actions/potholeAction";
import * as ImagePicker from "expo-image-picker";
import { storeImageToStorage } from "../utils/firebaseHelper";
import Map from "../components/Map";
// Function to get the userId of the currently logged-in user
const getUserId = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, return the userId
        resolve(user.uid);
      } else {
        // No user is signed in
        reject("No user signed in");
      }
    });
  });
};
const AddPothole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [streetName, setStreetName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [dangerLevel, setDangerLevel] = useState("Not Dangerous");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState("");
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
        setImage(uri);
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const name = image.split("/").pop();
      const userId = await getUserId();
      await createPothole(
        streetName,
        postcode,
        latitude,
        longitude,
        dangerLevel,
        description,
        name,
        userId
      );

      await storeImageToStorage(image, name);
      console.log("Pothole created successfully");
      // Reset form fields after successful submission
      setStreetName("");
      setPostcode("");
      setLatitude("");
      setLongitude("");
      setDangerLevel("Not Dangerous");
      setDescription("");
    } catch (error) {
      console.error("Error creating pothole:", error);
      // Handle error (e.g., display error message to user)
    } finally {
      setIsLoading(false);
    }
  };
  const inputChangedHandler = (inputId, text) => {
    switch (inputId) {
      case "streetName":
        setStreetName(text);
        break;
      case "postcode":
        setPostcode(text);
        break;
      case "latitude":
        setLatitude(text);
        break;
      case "longitude":
        setLongitude(text);
        break;
      case "description":
        setDescription(text);
        break;
      default:
        break;
    }
  };
  const handleLocationSelect = (lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 2 }}>
        <View style={{ flex: 0.9 }}>
          <Map onLocationSelect={handleLocationSelect} />
        </View>
        <ScrollView style={{ flex: 2 }}>
          <View style={styles.container}>
            <Input
              id="streetName"
              placeholder="Street Name"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
            />
            <Input
              id="postcode"
              style={styles.input}
              placeholder="Postcode"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
            />
            <Input
              id="latitude"
              placeholder="Latitude"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
            />
            <Input
              id="longitude"
              placeholder="Longitude"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
            />
            <Input
              id="description"
              placeholder="Description"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
            />
            <Text style={styles.label}>Danger Level:</Text>
            <Picker
              selectedValue={dangerLevel}
              style={styles.picker}
              onValueChange={(itemValue) => setDangerLevel(itemValue)}
            >
              <Picker.Item
                label="Not Dangerous"
                value="Not Dangerous"
                color={COLORS.white}
              />
              <Picker.Item
                label="Likely Dangerous"
                value="Likely Dangerous"
                color={COLORS.white}
              />
              <Picker.Item
                label="Dangerous"
                value="Dangerous"
                color={COLORS.white}
              />
            </Picker>
            {permission?.status !== ImagePicker.PermissionStatus.GRANTED && (
              <Button
                title="Take Picture"
                onPress={requestPermission}
                style={{ width: SIZES.width - 32, marginVertical: 8 }}
              />
            )}

            {permission?.status === ImagePicker.PermissionStatus.GRANTED && (
              <Button
                title="Take Picture"
                onPress={takePhoto}
                style={{ width: SIZES.width - 32, marginVertical: 8 }}
              />
            )}
            <Button
              title="SUBMIT"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={{ width: SIZES.width - 32, marginVertical: 8 }}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  label: {
    fontSize: 25,
    marginBottom: -40,
    color: COLORS.white,
    textAlign: "center",
    marginTop: 15,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  picker: {
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  container3: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
});

export default AddPothole;
