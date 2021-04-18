import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle } from 'react-native-maps'
import { Dimensions, StyleSheet, Text, View, Image, Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import SearchBar from "react-native-dynamic-search-bar";
import { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { loadAsync } from 'expo-font';
import { TextInput } from 'react-native-gesture-handler';

export default function TabThreeScreen() {

  const APIKEY = "&key=AIzaSyDB55FXd-X4iV-8NJn2h3U1peb_PSYKybE"
  const intialRegion = {
    latitude: 43.78682513036524, 
    longitude: -79.2276669708375,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025
  }
  const state = {
    coordinates: [
      { name: '1', latitude: 43.78682513036, longitude: -79.2276669708 }
    ]
  }
  const circ = { latitude: 43.78682513036, longitude: -79.2276669708 }
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [currentPosition, setCurrentPosition] = useState(intialRegion)
  const [circleCenter, setCircleCenter] = useState(circ)
  const [markerSource, setMarkerSource] = useState(state.coordinates)
  const [searchVal, setSearchVal] = useState("")

  React.useEffect(() =>{
    search()
  }, [])
  async function search(){
    let temp = searchVal.split(" ")
    let value = temp.join("%20")
    value = value.substring(0, value.length-3)
    let URL = "https://maps.googleapis.com/maps/api/geocode/json?address="+ value + APIKEY
    const addResponse = await fetch(URL)
    if(addResponse.ok){
      let data = await addResponse.json()
      const sort = await data.results

      let searchCoords = {
        latitude: sort[0]["geometry"]["location"]["lat"],
        longitude: sort[0]["geometry"]["location"]["lng"],
        latitudeDelta: 0.025,
        longitudeDelta: 0.025
      }

      setCurrentPosition(searchCoords)
      const circle = { latitude: sort[0]["geometry"]["location"]["lat"], longitude: sort[0]["geometry"]["location"]["lng"] }
      setCircleCenter(circle)
      
      try{
        const markerURL =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${searchCoords.latitude},${searchCoords.longitude}&radius=2500&keyword=parking` +
        APIKEY;
        const response2 = await fetch(markerURL);
        if (response2.ok) {
          const markerData = await response2.json();
          const sortable = await markerData.results;
          let smarkers = [
            { name: "1", latitude: 43.78682513036, longitude: -79.2276669708 },
          ];
          for (var i = 0; i < sortable.length; i++) {
            
            let temp = {name: `${sortable[i]["name"]} ${i}`, latitude: sortable[i]["geometry"]["location"]["lat"], longitude: sortable[i]["geometry"]["location"]["lng"]}

            smarkers[i] = temp         
          }
          setMarkerSource(smarkers);
        }
      } catch(error){
        console.log(error)
      }

    }
    
  }

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
        latitudeDelta: 0.030,
        longitudeDelta: 0.030
      }
      setCurrentPosition(intialRegion)
      
      const circle2 = { latitude: location.coords.latitude, longitude: location.coords.longitude }
      setCircleCenter(circle2)
      
      const markerURL2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=2000&keyword=parking`+APIKEY
      
      const response = await fetch(markerURL2)
      
      if(response.ok){
        const data2 = await response.json()
        const sort2 = await data2.results
        const markers = [{ name: '1', latitude: 43.78682513036, longitude: -79.2276669708 }]

        for(var i=0; i<sort2.length; i++)
        {
            let temp = {name:`${sort2[i]["name"]}`, latitude: sort2[i]["geometry"]["location"]["lat"], longitude: sort2[i]["geometry"]["location"]["lng"]}
            markers[i] = temp
        }
        
        setMarkerSource(markers)
      }

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
      <View>
      <SearchBar placeholder="Enter Address" clearButtonMode={'never'}
        onChangeText={(text) => setSearchVal(text)} dataDetectorTypes={'address'}
        onClearPress={(text) => {text="", Keyboard.dismiss} } style={styles.search} onSubmitEditing={search}
        autoCompleteType={'street-address'} returnKeyType={'search'}
        onSearchPress={Keyboard.dismiss} autoCorrect={false}/>
      <MapView style={styles.mapStyle} loadingEnabled={true}
            provider={PROVIDER_GOOGLE} rotateEnabled={true} 
            showsUserLocation={true} showsMyLocationButton={true}
            region={currentPosition} zoomControlEnabled={true} zoomTapEnabled={true}>

              <Circle 
              center={circleCenter} 
              radius={1000} fillColor={'rgba(100, 100, 200, 0.3)'}/>

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
                {
                  markerSource.map(marker => (
                    <Marker
                    key={marker.name} coordinate={{latitude:marker.latitude, longitude: marker.longitude}}
                    title={marker.name}
                    >
                      <Callout onPress={shoeWelcomeMessage}>
                        <Ionicons name='car-outline' size={25} />
                        <Text>{marker.name.substring(0,marker.name.length-2)}</Text>
                      </Callout>

                    </Marker>
                  ))
                }
      </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle:{
    flex:1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    margin:1,
    padding:1
  },
  search:{
    height: Dimensions.get("window").height/11,
    margin:0,
    padding:0
  }
});
