import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ReportOptions = ({ handleOptionSelection }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const toggleOption = (option) => {
    const updatedOptions = {
      ...selectedOptions,
      [option]: !selectedOptions[option],
    };
    setSelectedOptions(updatedOptions);

    const selectedOptionsArray = Object.keys(updatedOptions).filter(
      (key) => updatedOptions[key]
    );
    handleOptionSelection(selectedOptionsArray);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.legend}>Choose options</Text>

      <TouchableOpacity
        onPress={() =>
          toggleOption("incorrect location for the pothole reported")
        }
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.incorrect_location_reported_for_pothole &&
                styles.checked,
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
              selectedOptions.Sharing_irrelevant_Image && styles.checked,
            ]}
          />
          <Text style={styles.label}>Sharing irrelevant Image</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleOption("Sharing Personal Details of Others")}
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.Sharing_personal_Details_of_Others &&
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
