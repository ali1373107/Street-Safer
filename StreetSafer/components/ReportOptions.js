import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ReportOptions = ({ handleOptionSelection }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const toggleOption = (option) => {
    setSelectedOption(option === selectedOption ? "" : option);
    handleOptionSelection(option === selectedOption ? "" : option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.legend}>Choose options</Text>

      <TouchableOpacity
        onPress={() =>
          toggleOption("incorrect_location_for_the_pothole_reported")
        }
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOption ===
                "incorrect_location_for_the_pothole_reported" && styles.checked,
            ]}
          />
          <Text style={styles.label}>
            Incorrect location for the pothole reported
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleOption("Sharing_irrelevant_Image")}
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOption === "Sharing_irrelevant_Image" && styles.checked,
            ]}
          />
          <Text style={styles.label}>Sharing irrelevant Image</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleOption("Sharing_Personal_Details_of_Others")}
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOption === "Sharing_Personal_Details_of_Others" &&
                styles.checked,
            ]}
          />
          <Text style={styles.label}>Sharing personal details of others</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  legend: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "blue",
  },
  label: {
    fontSize: 16,
  },
});

export default ReportOptions;
