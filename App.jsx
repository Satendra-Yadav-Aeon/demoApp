import { StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Alert, View } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { ANDROID_PLATFORM, MAP_CONSTANT } from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';


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
            await setAsyncItem('userLat', latitude);
            await setAsyncItem('userLong', longitude);
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
      <Provider store={store}>
        <Routes/>
        <Toast/>
      </Provider> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

export default App