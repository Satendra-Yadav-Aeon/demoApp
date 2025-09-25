import { PermissionsAndroid, Platform, Alert, Linking, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { ANDROID_PLATFORM, LOCATION_BASED_CONSTANT, MAP_CONSTANT } from '../constants/MainConstant';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { setAsyncItem } from './AsyncStorage';

export const requestLocationPermission = async (t) => {
  let granted;
  if (Platform.OS === ANDROID_PLATFORM) {
    // First check if permission already granted
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (alreadyGranted) {
      granted = PermissionsAndroid.RESULTS.GRANTED;
    } else {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
    // console.log('===requestLocationPermission====>granted>>>>', granted);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // User chose "Don't ask again"
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_1),
          t(LOCATION_BASED_CONSTANT.LABEL_1_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Exit App', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
      } else {
        // User denied but didn't tick "Don't ask again"
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_2),
          t(LOCATION_BASED_CONSTANT.LABEL_2_MSG),
          [
            { text: 'Try Again', onPress: () => requestLocationPermission() },
            { text: 'Exit App', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
      }
      return;
    }
  } else{
    // iOS
    Geolocation.requestAuthorization('whenInUse').then(auth => {
      if (auth === 'denied' || auth === 'restricted') {
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_3),
          t(LOCATION_BASED_CONSTANT.LABEL_3_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Exit App', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
      }
    });

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
  return granted;
};
