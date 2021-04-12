import * as React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Dimensions, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle} loadingEnabled={true}
            initialRegion={{
              latitude: 43.78682513036524,
              longitude: -79.2276669708375,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0021
            }}>
 
      </MapView>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle:{
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
