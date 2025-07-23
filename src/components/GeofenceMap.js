import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { getDistance } from 'geolib';
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

  const geofenceLocation = {
    latitude:  18.56680248689369,
    longitude: 73.92150312423335
  }

  // Calculate distance in km
  const checkinToGeofenceKm = getDistance(checkinLocation, geofenceLocation) / 1000;
  const checkoutToGeofenceKm = getDistance(checkoutLocation, geofenceLocation) / 1000;

  // Midpoints for placing distance markers
  const midPoint = (loc1, loc2) => ({
    latitude: (loc1.latitude + loc2.latitude) / 2,
    longitude: (loc1.longitude + loc2.longitude) / 2,
  });
   
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

        {/* Geofence circle */}
        <Circle
          center={geofenceLocation}
          radius={50}
          strokeWidth={2}
          strokeColor="rgba(255, 204, 0, 0.8)"
          fillColor="rgba(255, 255, 0, 0.3)"
        />

        {/* Marker inside geofence */}
        <Marker
          coordinate={geofenceLocation}
          title="Geofence Location"
          pinColor="red"
        />

        {/* Red line from Check-in to Geofence */}
        <Polyline
          coordinates={[checkinLocation, geofenceLocation]}
          strokeColor="red"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />

        {/* Red line from Check-out to Geofence */} 
        <Polyline
          coordinates={[checkoutLocation, geofenceLocation]}
          strokeColor="red"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
        <Marker coordinate={midPoint(checkinLocation, geofenceLocation)}>
          <View style={styles.distanceLabel}>
            <Text style={styles.distanceText}>{checkinToGeofenceKm.toFixed(2)} km</Text>
          </View>
        </Marker>

        <Marker coordinate={midPoint(checkoutLocation, geofenceLocation)}>
          <View style={styles.distanceLabel}>
            <Text style={styles.distanceText}>{checkoutToGeofenceKm.toFixed(2)} km</Text>
          </View>
        </Marker>
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
  distanceLabel: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 6,
    borderColor: Colors.grey,
    borderWidth: 1,
    elevation: 3,
  },
  distanceText: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: 'bold',
  },
});
