import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDistance } from 'geolib';
import Colors from '../assets/colors/colors';

const GeofenceMap = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    checkinLat,
    checkinLong,
    checkoutLat,
    checkoutLong,
    geofenceLat,
    geofenceLong
  } = route.params;

  const isValidLatLng = (lat, lng) =>
    lat !== undefined &&
    lng !== undefined &&
    lat !== null &&
    lng !== null &&
    !isNaN(parseFloat(lat)) &&
    !isNaN(parseFloat(lng));

  const parseCoordinate = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const checkinLocation = {
    latitude: parseCoordinate(checkinLat),
    longitude: parseCoordinate(checkinLong),
  };

  const hasCheckout = isValidLatLng(checkoutLat, checkoutLong);

  const checkoutLocation = hasCheckout
    ? {
        latitude: parseCoordinate(checkoutLat),
        longitude: parseCoordinate(checkoutLong),
      }
    : null;

  const hasGeofence = isValidLatLng(geofenceLat, geofenceLong);

  const geofenceLocation = hasGeofence
    ? {
        latitude: parseCoordinate(geofenceLat),
        longitude: parseCoordinate(geofenceLong),
      }
    : null;

  const checkinToGeofenceKm = hasGeofence
    ? getDistance(checkinLocation, geofenceLocation) / 1000
    : 0;

  const checkoutToGeofenceKm =
    hasCheckout && hasGeofence
      ? getDistance(checkoutLocation, geofenceLocation) / 1000
      : 0;

  const midPoint = (loc1, loc2) => {
    if (!loc1 || !loc2 || !loc1.latitude || !loc2.latitude || !loc1.longitude || !loc2.longitude) {
      return null;
    }
    return {
      latitude: (loc1.latitude + loc2.latitude) / 2,
      longitude: (loc1.longitude + loc2.longitude) / 2,
    };
  };

  const initialRegion = {
    latitude: checkinLocation.latitude || 0,
    longitude: checkinLocation.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialRegion}>
        {/* Check-in marker */}
        <Marker coordinate={checkinLocation} title="Check-In Location" pinColor="green" />

        {/* Check-out marker */}
        {hasCheckout && (
          <Marker coordinate={checkoutLocation} title="Check-Out Location" pinColor="blue" />
        )}

        {/* Geofence-related elements */}
        {hasGeofence && (
          <>
            {/* Geofence circle */}
            <Circle
              center={geofenceLocation}
              radius={50}
              strokeWidth={2}
              strokeColor="rgba(255, 204, 0, 0.8)"
              fillColor="rgba(255, 255, 0, 0.3)"
            />

            {/* Geofence marker */}
            <Marker coordinate={geofenceLocation} title="Geofence Location" pinColor="red" />

            {/* Red line from Check-in to Geofence */}
            <Polyline
              coordinates={[checkinLocation, geofenceLocation]}
              strokeColor="red"
              strokeWidth={2}
              lineDashPattern={[5, 5]}
            />

            {/* Red line from Check-out to Geofence */}
            {hasCheckout && (
              <Polyline
                coordinates={[checkoutLocation, geofenceLocation]}
                strokeColor="red"
                strokeWidth={2}
                lineDashPattern={[5, 5]}
              />
            )}

            {/* Distance labels */}
            {midPoint(checkinLocation, geofenceLocation) && (
              <Marker coordinate={midPoint(checkinLocation, geofenceLocation)}>
                <View style={styles.distanceLabel}>
                  <Text style={styles.distanceText} adjustsFontSizeToFit={true}>
                    {checkinToGeofenceKm.toFixed(2)} km
                  </Text>
                </View>
              </Marker>
            )}

            {hasCheckout && midPoint(checkoutLocation, geofenceLocation) && (
              <Marker coordinate={midPoint(checkoutLocation, geofenceLocation)}>
                <View style={styles.distanceLabel}>
                  <Text style={styles.distanceText} adjustsFontSizeToFit={true}>
                    {checkoutToGeofenceKm.toFixed(2)} km
                  </Text>
                </View>
              </Marker>
            )}
          </>
        )}
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: Colors.red_1,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 24,
  },
});
