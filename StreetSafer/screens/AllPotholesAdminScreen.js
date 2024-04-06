import { View, Text, StyleSheet } from "react-native";

function AllPotholesAdminScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text>
        This is the{" "}
        <Text style={styles.highlight}>
          "Admin screen for managing all potholes"
        </Text>{" "}
        screen!
      </Text>
    </View>
  );
}

export default AllPotholesAdminScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  highlight: {
    fontWeight: "bold",
    color: "#eb1064",
  },
});
