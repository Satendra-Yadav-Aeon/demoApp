import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { CAMERA_BASED_CONSTANT } from '../constants/MainConstant';

export const requestCameraPermission = async (t) => {
  if (Platform.OS === 'android') {
    const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    let granted;
    if (alreadyGranted) {
      granted = PermissionsAndroid.RESULTS.GRANTED;
    } else {
      granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1),
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_2),
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_2_MSG),
          [
            { text: 'Try Again', onPress: () => requestCameraPermission(t) },
            { text: "Cancel", style: "cancel" }
          ],
          { cancelable: false }
        );
      }
      return false;
    }
    return true;
  } else {
    // iOS logic
    const status = await check(PERMISSIONS.IOS.CAMERA);
    
    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      // First time → system dialog
      const reqStatus = await request(PERMISSIONS.IOS.CAMERA);
      return reqStatus === RESULTS.GRANTED;
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1),
        t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1_MSG),
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" }
        ],
        { cancelable: false }
      );
      return false;
    }

    return false;
  }
};
