import { StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Routes from './src/navigations/Routes';
import { ANDROID_PLATFORM, MAP_CONSTANT } from './src/constants/MainConstant';


const App = () => {
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === ANDROID_PLATFORM) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(MAP_CONSTANT.LOCATION_PERMISSSION_DENIED)
          return;
        }
      }

      try {
        Geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            await AsyncStorage.setItem('userLat', latitude.toString());
            await AsyncStorage.setItem('userLong', longitude.toString());
          },
          error => {
            console.error('Geolocation error:', error);
          },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
        );
      } catch (err) {
        console.error('Unexpected geolocation error:', err);
      }
    };

    requestPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Routes/>
      <Toast/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

export default App