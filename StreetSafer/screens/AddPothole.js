import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Input from "../components/Input";
import Button from "../components/Button";
import { COLORS, images, FONTS, SIZES } from "../constants";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createPothole } from "../utils/actions/potholeAction";
import { set } from "firebase/database";

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      await createPothole(
        streetName,
        postcode,
        latitude,
        longitude,
        dangerLevel,
        description,
        userId
      );
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Street Name"
        value={streetName}
        onChangeText={setStreetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Postcode"
        value={postcode}
        onChangeText={setPostcode}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Danger Level:</Text>
      <Picker
        selectedValue={dangerLevel}
        style={styles.picker}
        onValueChange={(itemValue) => setDangerLevel(itemValue)}
      >
        <Picker.Item label="Not Dangerous" value="Not Dangerous" />
        <Picker.Item label="Likely Dangerous" value="Likely Dangerous" />
        <Picker.Item label="Dangerous" value="Dangerous" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Descriptio "
        value={postcode}
        onChangeText={setPostcode}
      />
      <Button
        title="SUBMIT"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={{ width: SIZES.width - 32, marginVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
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
});

export default AddPothole;
