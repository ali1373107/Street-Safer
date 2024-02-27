import { View, Text, Button, StyleSheet } from 'react-native';

function PotholesOnMap() {

  return (
    <View style={styles.rootContainer}>
      <Text>
        This is the <Text style={styles.highlight}>"Display potholes on the map "</Text> screen!
      </Text>
   
    </View>
  );
}

export default PotholesOnMap;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#eb1064',
  },
});