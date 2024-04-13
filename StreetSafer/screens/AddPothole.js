import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Input from "../components/Input";
import Button from "../components/Button";
import { COLORS, SIZES, FONTS } from "../constants";
import { createPothole } from "../utils/actions/potholeAction";
import * as ImagePicker from "expo-image-picker";
import { storeImageToStorage } from "../utils/firebaseHelper";
import Map from "../components/Map";
import axios from "axios";
import { useUser } from "./UserContext";

const AddPothole = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streetName, setStreetName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [dangerLevel, setDangerLevel] = useState("Not Dangerous");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState("");
  const { user } = useUser();
  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.text}>No data available</Text>
        <Text style={styles.text}>Login requred! </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ ...FONTS.h3, color: COLORS.primary }}>
            Go To Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
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
        Alert.alert("Image taken successfully");
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
    }
  };
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const { address } = response.data;
      const { postcode, road } = address;
      setPostcode(postcode || "Not Available");
      setStreetName(road || "Not Available");
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const name = image.split("/").pop();
      const status = "Reported";
      const update = "Pending Review";

      await createPothole(
        streetName,
        postcode,
        latitude,
        longitude,
        dangerLevel,
        description,
        name,
        status,
        update,
        user.userId,
        user.email
      );
      await storeImageToStorage(image, name);
      Alert.alert("Pothole created successfully");

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
    fetchAddress(lat, lon);
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
        <ScrollView style={{ flex: 2 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Input
              id="streetName"
              placeholder="Street Name"
              value={streetName}
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
              color={COLORS.white}
            />
            <Input
              id="postcode"
              style={styles.input}
              value={postcode}
              placeholder="Postcode"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
              color={COLORS.white}
            />

            <Input
              id="description"
              placeholder="Description"
              placeholderTextColor={COLORS.gray}
              onInputChanged={inputChangedHandler}
              color={COLORS.white}
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
