import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle } from 'react-native-maps'
import { Dimensions, StyleSheet, Text, View, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import EditScreenInfo from '../components/EditScreenInfo';
import { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { loadAsync } from 'expo-font';
import { TextInput } from 'react-native-gesture-handler';
// import { Text, View } from '../components/Themed';

export default function TabThreeScreen() {
  
  const intialRegion = {
    latitude: 43.78682513036524, 
    longitude: -79.2276669708375,
    latitudeDelta: 0.026,
    longitudeDelta: 0.026
  }
  const state = {
    coordinates: [
      { name: '1', latitude: 43.795, longitude: -79.237 },
      { name: '2', latitude: 43.78, longitude: -79.237 },
      { name: '3', latitude: 43.78, longitude: -79.22 },
      { name: '4', latitude: 43.795, longitude: -79.22 }
    ]
  }
  const circ = { latitude: 43.795, longitude: -79.237 }
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [currentPosition, setCurrentPosition] = useState(intialRegion)
  const [circleCenter, setCircleCenter] = useState(circ)
  

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      
      const intialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.026,
        longitudeDelta: 0.026
      }
      setCurrentPosition(intialRegion)
      
      const circle = { latitude: location.coords.latitude, longitude: location.coords.longitude }
      setCircleCenter(circle)
      
      state.coordinates
      
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const shoeWelcomeMessage = () =>{
    Alert.alert(
      'Message Title',
      'Message Contents',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        }, 
        {
          text: 'Ok'
        }
      ]
      )
  }

  return (
    <View style={styles.container}>
      <TextInput></TextInput>
      <MapView style={styles.mapStyle} loadingEnabled={true}
            provider={PROVIDER_GOOGLE} rotateEnabled={true} 
            showsUserLocation={true} showsMyLocationButton={true}
            region={currentPosition} zoomControlEnabled={true} zoomTapEnabled={true}>

              <Circle 
              center={circleCenter} 
              radius={500} fillColor={'rgba(100, 100, 200, 0.3)'}/>

              <Marker
                coordinate =  {{latitude: 43.78682513036, longitude: -79.2276669708}}
                title={'Current Location'}>                 
                  <Ionicons name='car-outline' size={45} />

                  <Callout onPress={shoeWelcomeMessage}>
                    <Ionicons name='car-outline' size={35} />
                    <Text>An Interesting Place</Text>
                  </Callout>

                </Marker>
                {
                  state.coordinates.map(marker => (
                    <Marker
                    key={marker.name}
                    coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                    title={marker.name}
                  >
                      <Callout onPress={shoeWelcomeMessage}>
                        <Ionicons name='car-outline' size={25} />
                        <Text>{marker.name}</Text>
                      </Callout>
                  </Marker>
                  ))
                }
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
  },
});
