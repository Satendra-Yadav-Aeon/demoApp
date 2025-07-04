import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import Colors from '../assets/colors/colors';

const GeofenceMap = () => {
  const route = useRoute();
  const {
    checkinLat,
    checkinLong,
    checkoutLat,
    checkoutLong,
  } = route.params;

  const checkinLocation = {
    latitude: parseFloat(checkinLat),
    longitude: parseFloat(checkinLong),
  };

  const checkoutLocation = {
    latitude: parseFloat(checkoutLat),
    longitude: parseFloat(checkoutLong),
  };

  // console.log('=====GeofenceMap=>>>>checkinLat>>checkinLong>>>',checkinLat, checkinLong);
  // console.log('=====GeofenceMap=>>>>checkoutLat>>checkinLong>>>',checkoutLat, checkoutLong);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...checkinLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Check-in marker */}
        <Marker
          coordinate={checkinLocation}
          title="Check-In Location"
          pinColor="green"
        />

        {/* Check-out marker */}
        <Marker
          coordinate={checkoutLocation}
          title="Check-Out Location"
          pinColor="blue"
        />
      </MapView>
    </View>
  );
};

export default GeofenceMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    flex: 1,
  },
});
