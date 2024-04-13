import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const EditPotholeForm = ({ onSave, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateText, setUpdateText] = useState("");

  const handleSave = () => {
    onSave(selectedStatus, updateText);
    setSelectedStatus("");
    setUpdateText("");
  };
  const handleCancel = () => {
    onCancel();
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.label}>Status:</Text>
        <View style={styles.statusPicker}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === "Reported" && styles.selectedStatus,
            ]}
            onPress={() => setSelectedStatus("Reported")}
          >
            <Text>Reported</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === "In Progress" && styles.selectedStatus,
            ]}
            onPress={() => setSelectedStatus("In Progress")}
          >
            <Text>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === "Done" && styles.selectedStatus,
            ]}
            onPress={() => setSelectedStatus("Done")}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.updateInput}
          value={updateText}
          onChangeText={setUpdateText}
          placeholder="Add update..."
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    margin: 20,
    backgroundColor: COLORS.background,
    padding: 50,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 5,
  },
  statusPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusButton: {
    width: "30%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  selectedStatus: {
    backgroundColor: COLORS.primary,
  },
  updateInput: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
});

export default EditPotholeForm;
