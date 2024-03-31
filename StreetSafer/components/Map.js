import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { requestForegroundPermissionsAsync } from "expo-location";

const Map = ({ onLocationSelect }) => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [markerLocation, setMarkerLocation] = useState(null);

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
      onLocationSelect(coords.latitude, coords.longitude);
    };

    if (permissionGranted && !lat && !lon) {
      fetchCurrentLocation();
    }
  }, [permissionGranted, lat, lon, onLocationSelect]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerLocation(coordinate);
    onLocationSelect(coordinate.latitude, coordinate.longitude);
  };

  return (
    <View style={styles.container}>
      {!permissionGranted && (
        <Text style={styles.permissionText}>
          Location Permission not granted or denied
        </Text>
      )}
      {permissionGranted && lat && lon && (
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markerLocation && <Marker coordinate={markerLocation} />}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Map;
