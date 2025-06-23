import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as turf from '@turf/turf';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Colors from '../assets/colors/colors';
import { MAP_CONSTANT } from '../constants/MainConstant';


const GeofenceMap = () => {
  const [locationInput, setLocationInput] = useState('');
  const [adminLocation, setAdminLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoRadius, setGeoRadius] = useState(200);

  const handleSetLocation = () => {
    const simulatedLatLng = {
      latitude: 18.568692126418927, 
      longitude: 73.9083889241604,
    };

    setAdminLocation(simulatedLatLng);
    checkUserInsideGeofence(simulatedLatLng);
  };

  const checkUserInsideGeofence = async (center) => {
    // const userLat = parseFloat(await AsyncStorage.getItem('userLat'));
    // const userLong = parseFloat(await AsyncStorage.getItem('userLong'));

    const fixedLocation = {
      latitude: 18.5986921,
      longitude: 73.9383889,
    };

    const userLat = parseFloat(fixedLocation?.latitude);
    const userLong = parseFloat(fixedLocation?.longitude);

    if (!userLat || !userLong) {
      Alert.alert(MAP_CONSTANT.LOCATION_NOT_AVAILABLE);
      return;
    }

    const userPoint = turf.point([userLong, userLat]);
    const centerPoint = turf.point([center.longitude, center.latitude]);
    const circle = turf.circle(centerPoint, geoRadius / 1000, {
      steps: 64,
      units: 'kilometers',
    });

    const isInside = turf.booleanPointInPolygon(userPoint, circle);

    if (isInside) {
      Alert.alert(MAP_CONSTANT.INSIDE_GEOFENCE);
    } else {
      Alert.alert(MAP_CONSTANT.OUTSIDE_GEOFENCE);
    }

    setUserLocation({
      latitude: userLat,
      longitude: userLong,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={MAP_CONSTANT.PLACEHOLDER}
        value={locationInput}
        onChangeText={setLocationInput}
        style={styles.input}
        placeholderTextColor={Colors.black}
      />
      <TouchableOpacity style={styles.setLocationButton} onPress={handleSetLocation}>
        <Text style={styles.setLocationText}>{MAP_CONSTANT.SET_LOCATION}</Text>
      </TouchableOpacity>
        {adminLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            ...adminLocation,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={adminLocation} title={MAP_CONSTANT.WORKING_LOCATION} />
          <Marker coordinate={userLocation} title={MAP_CONSTANT.USER_LOCATION} />
          <Circle
            center={adminLocation}
            radius={geoRadius}
            strokeWidth={2}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.2)"
          />
        </MapView>
      )}
    </View>
  );
};

export default GeofenceMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: Colors.grey,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 8,
  },
  map: {
    flex: 1,
  },
  setLocationButton: {
    backgroundColor: Colors.red,
    margin: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  setLocationText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
