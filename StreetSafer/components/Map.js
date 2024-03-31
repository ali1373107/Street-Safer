import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Map = ({ onLocationSelect }) => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLat(coordinate.latitude);
    setLon(coordinate.longitude);
    onLocationSelect(coordinate.latitude, coordinate.longitude);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: lat || 50.78825,
          longitude: lon || -1.43,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {lat && lon && (
          <Marker coordinate={{ latitude: lat, longitude: lon }} />
        )}
      </MapView>
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
});

export default Map;
