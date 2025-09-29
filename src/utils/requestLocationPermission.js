import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { setAsyncItem } from './AsyncStorage';
import { ANDROID_PLATFORM, LOCATION_BASED_CONSTANT, MAP_CONSTANT } from '../constants/MainConstant';

export const requestLocationPermission = async (t) => {
  let granted;
  if (Platform.OS === ANDROID_PLATFORM) {
    // ANDROID FLOW
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

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_1),
          t(LOCATION_BASED_CONSTANT.LABEL_1_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_2),
          t(LOCATION_BASED_CONSTANT.LABEL_2_MSG),
          [
            { text: 'Try Again', onPress: () => requestLocationPermission(t) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
      return false;
    }
  } else {
    // iOS FLOW
    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (status === RESULTS.GRANTED) {
      granted = 'ios_auto';
    } else if (status === RESULTS.DENIED) {
      const reqStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (reqStatus === RESULTS.GRANTED) {
        granted = 'ios_auto';
      } else {
        Alert.alert(
          t(LOCATION_BASED_CONSTANT.LABEL_1),
          t(LOCATION_BASED_CONSTANT.LABEL_1_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return false;
      }
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert(
        t(LOCATION_BASED_CONSTANT.LABEL_2),
        t(LOCATION_BASED_CONSTANT.LABEL_2_MSG),
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return false;
    }
  }

  // === Common part: Fetch actual location ===
  try {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await setAsyncItem(ASYNC_CONSTANT.USER_LAT, latitude);
        await setAsyncItem(ASYNC_CONSTANT.USER_LONG, longitude);
      },
      (error) => {
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
      {
        enableHighAccuracy: true,   // Required for iOS
        timeout: 20000,
        maximumAge: 10000,
      }
    );
  } catch (err) {
    // console.error('Unexpected geolocation error:', err);
  }
  return granted;
};
