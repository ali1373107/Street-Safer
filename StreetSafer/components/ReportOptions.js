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

      <TouchableOpacity onPress={() => toggleOption("false_information")}>
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.false_information && styles.checked,
            ]}
          />
          <Text style={styles.label}>False Information</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleOption("scam_or_fraud")}>
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.scam_or_fraud && styles.checked,
            ]}
          />
          <Text style={styles.label}>Scam or Fraud</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleOption("hate_speech_or_Symbole")}>
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.hate_speech_or_Symbole && styles.checked,
            ]}
          />
          <Text style={styles.label}>Hate Speech or Symbols</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleOption("Sharing_Image_or_Details_of_Others")}
      >
        <View style={styles.option}>
          <View
            style={[
              styles.checkbox,
              selectedOptions.Sharing_Image_or_Details_of_Others &&
                styles.checked,
            ]}
          />
          <Text style={styles.label}>Sharing Image or Details of Others</Text>
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
