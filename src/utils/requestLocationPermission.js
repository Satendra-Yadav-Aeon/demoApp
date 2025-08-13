import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { ANDROID_PLATFORM, MAP_CONSTANT } from '../constants/MainConstant';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { setAsyncItem } from './AsyncStorage';

export const requestLocationPermission = async () => {
  let granted;
  if (Platform.OS === ANDROID_PLATFORM) {
      granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    // console.log('===requestLocationPermission====>granted>>>>', granted);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(MAP_CONSTANT.LOCATION_PERMISSSION_DENIED);
      return;
    }
    return granted;
  }else{
    // iOS always "granted" after requestAuthorization if user allows it
    Geolocation.requestAuthorization();
    granted = 'ios_auto';
  }


  try {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        await setAsyncItem(ASYNC_CONSTANT.USER_LAT, latitude);
        await setAsyncItem(ASYNC_CONSTANT.USER_LONG, longitude);
      },
      error => {
        if (error.code === 2 && error.message.includes(MAP_CONSTANT.NO_PROVIDER)) {
          Alert.alert(
            MAP_CONSTANT.ENABLE_LOCATION,
            MAP_CONSTANT.TURN_ON_LOCATION,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  } catch (err) {
    // console.error('Unexpected geolocation error:', err);
  }
};
