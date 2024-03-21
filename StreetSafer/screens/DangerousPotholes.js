import { View, Text, Button, StyleSheet } from "react-native";

function DangerousPothole() {
  return (
    <View style={styles.rootContainer}>
      <Text>
        This is the{" "}
        <Text style={styles.highlight}>"List of dangerous Potholes"</Text>{" "}
        screen!
      </Text>
    </View>
  );
}

export default DangerousPothole;

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
