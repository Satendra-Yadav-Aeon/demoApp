import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../utils/DimensionUtils';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import MyImages from '../utils/MyImages';
import Colors from '../assets/colors/colors';
import { setAsyncItem } from '../utils/AsyncStorage';
import { CAMERA_CONSTANT, SET_EMPLOYEE_ATTENDANCE } from '../screens/AttendanceScreen/constants/AttendanceConstant';
import { requestCameraPermission } from '../utils/CameraPermission';

const { screenHeight, screenWidth } = ScreenDimensions;

const CaptureImageComponent = () => {
  const navigation = useNavigation();
  const {t} = useTranslation()
  const route = useRoute();
  const { employeeData, mode, task } = route.params || {};
  const [imageUri, setImageUri] = useState(null);

  const handleCameraLaunch = async () => {
    const permission = await requestCameraPermission(t);
    if (!permission) {
      Alert.alert(t(SET_EMPLOYEE_ATTENDANCE.CAMERA_PERMISSION_REQUIRED));
      return;
    }
    captureAndStoreData();
  };

  const captureAndStoreData = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        Alert.alert(t(CAMERA_CONSTANT.CANCEL_LABEL), t(CAMERA_CONSTANT.CANCEL_MSG));
        return;
      }

      if (response.errorCode) {
        Alert.alert(t(CAMERA_CONSTANT.CAMERA_ERROR), response.errorMessage || t(CAMERA_CONSTANT.UNKNOWN_ERROR_MSG));
        return;
      }

      let imageUri =
          response.assets && response.assets.length > 0
            ? response.assets[0].uri
            : null;
      if (!imageUri) {
        Alert.alert(t(CAMERA_CONSTANT.ERROR_TEXT), t(CAMERA_CONSTANT.ERROR_MSG));
        return;
      }

      try {
        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          800,
          600,
          'JPEG',
          80,
          0
        );

        // console.log("Setting imageUri:", resizedImage.uri);
        setImageUri(resizedImage.uri);
        const key =
              mode === 'task_mode'
                ? `${ASYNC_CONSTANT.TASK_IMGAE}_${task?.taskId}`
                : `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`;

            await setAsyncItem(key, resizedImage.uri);
      } catch (error) {
        // console.log('====launchCamera===>>>error>>>',error);
      }
    });
  };

  useEffect(() => {
    handleCameraLaunch();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCameraLaunch()}>
          <Image source={MyImages.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      </View>
    </View>
  );
};

export default CaptureImageComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    flex: 2,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  preview: {
    width: screenWidth * 0.65,
    height: screenHeight * 0.45,
    borderRadius: 8,
    marginVertical: 8,
    marginBottom: 30,
    marginTop: screenHeight * 0.20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  captureIcon: {
    height: 80,
    width: 80,
    backgroundColor: Colors.red,
    borderRadius: 40,
    borderColor: Colors.white,
    borderWidth: 3,
    position: 'absolute',
    bottom: 30,
  },
  goBackIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.red,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.red,
  }
});
