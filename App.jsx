import { StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Alert, Linking} from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { ANDROID_PLATFORM, MAP_CONSTANT } from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';
import './i18n';
import { loadSavedLanguage } from './src/utils/i18nLoader';
import { ASYNC_CONSTANT } from './src/constants/AsyncConstant';


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
        }else {
          Geolocation.requestAuthorization(); // This is required for iOS
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
            if(error.code === 2 && error.message.includes(MAP_CONSTANT.NO_PROVIDER)){
              Alert.alert(
                MAP_CONSTANT.ENABLE_LOCATION,
                MAP_CONSTANT.TURN_ON_LOCATION,
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'Open Settings', onPress: () => Linking.openSettings()}
                ]
              )
            }else{
              // console.error('Geolocation error:', error);
            }
          },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
        );
      } catch (err) {
        // console.error('Unexpected geolocation error:', err);
      }
    };
    // Store version name in AsyncStorage

    const setAppVersion = async() => {
      const version = DeviceInfo.getVersion();
      await setAsyncItem(ASYNC_CONSTANT.APP_VERSION, version)
    }

    requestPermission();
    loadSavedLanguage();
    setAppVersion();  
  }, []);

  useEffect(() => {
    if(Platform.OS === 'android'){
      SplashScreen.hide();
    }
  },[])

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