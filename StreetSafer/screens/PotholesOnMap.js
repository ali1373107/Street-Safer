import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Button from "../components/Button";
import {
  getPotholes,
  reportExistingPothole,
} from "../utils/actions/potholeAction";
import { COLORS } from "../constants";
import ReportOptions from "../components/ReportOptions";
import PotholeImage from "../components/PotholeImage";
import * as Location from "expo-location";
import { requestForegroundPermissionsAsync } from "expo-location";
import AllUsersAdminScreen from "./ManageUserScreen";

function PotholesOnMap() {
  const [potholes, setPotholes] = useState([]);
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [reportText, setReportText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [email, setEmail] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    const unsubscribe = getPotholes(setPotholes);
    return () => unsubscribe();
  }, []);
  const handleReportSubmit = async () => {
    try {
      const report = await reportExistingPothole(
        selectedPothole.id,
        reportText,
        selectedPothole.userId,
        selectedOptions,
        receiveUpdates,
        email
      );
      console.log(`Report submitted: ${report}`);
      setSelectedPothole(null);
      setEmail("");
      setReportText("");
      setSelectedOptions([]);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  const handleOptionSelection = (options) => {
    setSelectedOptions(options);
  };
  const getMarkerColor = (dangerLevel) => {
    switch (dangerLevel) {
      case "Dangerous":
        return COLORS.red;
      case "Likely Dangerous":
        return COLORS.orange;
      case "Not Dangerous":
        return COLORS.yellow;
      default:
        return COLORS.black;
    }
  };
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
          setPermissionGranted(true);
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setPermissionGranted(true);
        }
      }
    };

    requestLocationPermission();
  }, []);
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      const { coords } = await Location.getCurrentPositionAsync({});
      setLat(coords.latitude);
      setLon(coords.longitude);
    };

    if (permissionGranted && !lat && !lon) {
      fetchCurrentLocation();
    }
  }, [permissionGranted, lat, lon]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {!permissionGranted && (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Location Permission not granted or denied
              </Text>
            </View>
          )}
          {permissionGranted && lat && lon && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: lat, // Initial map latitude
                longitude: lon, // Initial map longitude
                latitudeDelta: 0.0922, // Delta for latitude
                longitudeDelta: 0.0421, // Delta for longitude
              }}
            >
              {potholes.map((pothole, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: pothole.latitude, // Pothole latitude
                    longitude: pothole.longitude, // Pothole longitude
                  }}
                  title={`Pothole ${index + 1}: ${pothole.dangerLevel}: ${
                    pothole.description
                  }`}
                  pinColor={getMarkerColor(pothole.dangerLevel)}
                  onPress={() => setSelectedPothole(pothole)}
                />
              ))}
            </MapView>
          )}
          {selectedPothole && (
            <View style={styles.container2}>
              <View>
                <TouchableOpacity onPress={() => setSelectedPothole(null)}>
                  <Text style={styles.cancelButton}>X</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.permissionText}>
                Upload an image of the pothole
              </Text>
              <PotholeImage selectedPothole={selectedPothole} />
              <View style={styles.header}>
                <Text style={styles.title}>Report existing Pothole</Text>
              </View>
              <ReportOptions handleOptionSelection={handleOptionSelection} />
              <View>
                <Text>Would you like to get updates for this pothole?</Text>
                <View style={styles.container1}>
                  <Button
                    title="Yes"
                    style={styles.button}
                    onPress={() => setReceiveUpdates(true)}
                  />
                  <Button
                    title="No"
                    style={styles.button}
                    onPress={() => setReceiveUpdates(false)}
                  />
                </View>
              </View>
              {receiveUpdates && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email to get updated on the report"
                  value={email}
                  onChangeText={setEmail}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter your report here"
                value={reportText}
                onChangeText={setReportText}
              />

              <Button
                title="Submit"
                onPress={handleReportSubmit}
                color={COLORS.w}
              />
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PotholesOnMap;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelButton: {
    fontSize: 20,
    color: "gray",
    marginLeft: 1,
    position: "absolute",
    marginTop: -20,
  },
  container2: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginHorizontal: 30,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
