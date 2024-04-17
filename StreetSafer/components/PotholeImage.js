import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { COLORS } from "../constants";

const PotholeImage = ({ selectedPothole }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageName = selectedPothole.imageUrl;
        const storage = getStorage();
        const imageRef = ref(storage, `images/${imageName}`);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    };

    if (selectedPothole) {
      fetchImage();
    }
  }, [selectedPothole]);

  return (
    <View style={styles.container}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
});

export default PotholeImage;
