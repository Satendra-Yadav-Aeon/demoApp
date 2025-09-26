import { PermissionsAndroid, Platform, Alert, Linking, BackHandler } from 'react-native';
import { CAMERA_BASED_CONSTANT } from '../constants/MainConstant';

export const requestCameraPermission = async (t) => {
  let granted;

  if (Platform.OS === 'android') {
    // Check if already granted
    const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (alreadyGranted) {
      granted = PermissionsAndroid.RESULTS.GRANTED;
    } else {
      granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // User chose "Don't ask again"
        Alert.alert(
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1),
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_1_MSG),
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Exit App', onPress: () => BackHandler.exitApp() }
          ],
          { cancelable: false }
        );
      } else {
        // User denied but not permanently
        Alert.alert(
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_2),
          t(CAMERA_BASED_CONSTANT.CAMERA_LABEL_2_MSG),
          [
            { text: 'Try Again', onPress: () => requestCameraPermission(t) },
            { text: 'Exit App', onPress: () => BackHandler.exitApp() }
          ],
          { cancelable: false }
        );
      }
      return false;
    }
  } else {
    // iOS (handled by system dialog automatically)
    granted = true;
  }

  return true;
};
