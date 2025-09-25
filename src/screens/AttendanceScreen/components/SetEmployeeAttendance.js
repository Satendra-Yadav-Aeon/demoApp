import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import { useTranslation } from 'react-i18next';
import BackgroundService from 'react-native-background-actions';
import { isMockingLocation } from 'react-native-turbo-mock-location-detector'
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { CAMERA_CONSTANT, GEOFENCE_CONSTANT, MOCK_LOCATION_CONSTANT, MOCK_TIME_CONSTANT, SET_EMPLOYEE_ATTENDANCE } from '../constants/AttendanceConstant';
import { getAsyncItem, setAsyncItem } from '../../../utils/AsyncStorage';
import { CHECK_IN_LABEL, CHECK_OUT_LABEL } from '../../DashboardScreen/constants/DashboardConstant';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import imageNameUtils from '../../../utils/imageNameUtils';
import { useMarkAttendanceAPI } from '../hooks/useMarkAttendanceAPI';
import { useSaveBackgroundLocation } from '../../DashboardScreen/hooks/useSaveBackgroundLocation';
import { isDeviceTimeTampered } from '../../../utils/trustedTime';
import { LARGE_LOADER } from '../../../constants/MainConstant';

const { screenHeight, screenWidth } = ScreenDimensions;

const SetEmployeeAttendance = () => {
  const navigation = useNavigation();
  const {t} = useTranslation()
  const {markAttendance, isLoading} = useMarkAttendanceAPI()
  const [cameraPermission, setCameraPermission] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const[employeeData, setEmployeeData] = useState({})
  const [geofenceLocation, setGeofenceLocation] = useState(null);
  const [hasGeofence, setHasGeofence] = useState(false);
  const [loading, setLoading] = useState(false);
  const {saveBackgroundLocation} = useSaveBackgroundLocation()


  const route = useRoute();
  const { isCheckIn, attendanceSelf, employee, employeeDetails } = route?.params || {};
  const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

  useEffect(() => {
    const lat = employee ? employee?.geofenceLatitude : employeeDetails?.geofenceLatitude;
    const long = employee ? employee?.geofenceLongitude : employeeDetails?.geofenceLongitude;

    const parsedLat = parseFloat(lat);
    const parsedLong = parseFloat(long);

    const isValid = !isNaN(parsedLat) && !isNaN(parsedLong);

    if (isValid) {
      setGeofenceLocation({
        latitude: parsedLat,
        longitude: parsedLong,
      });
      setHasGeofence(true);
    } else {
      setGeofenceLocation(null);
      setHasGeofence(false);
    }
  }, []);

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useEffect(() => {
    const fetchLocation = async () => {
      const userLat = parseFloat(await getAsyncItem(ASYNC_CONSTANT.USER_LAT)) || null;
      const userLong = parseFloat(await getAsyncItem(ASYNC_CONSTANT.USER_LONG)) || null;
      setLat(userLat);
      setLong(userLong);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if(lat && long){
      handleCameraLaunch();
    }
  }, [lat, long]);

  const captureAndStoreData = async () => {
    if (!lat || !long) {
      Alert.alert(t(SET_EMPLOYEE_ATTENDANCE.DENIED_LOCATION));
      return;
    }

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

      const photoUri = response.assets?.[0]?.uri;
      if (!photoUri) {
        Alert.alert(t(CAMERA_CONSTANT.ERROR_TEXT), t(CAMERA_CONSTANT.ERROR_MSG));
        return;
      }

      try {
        const now = moment();
        const compressedImage = await ImageResizer.createResizedImage(
          photoUri,
          800,
          600,
          'JPEG',
          80,
          0
        );

        setImageUri(compressedImage.uri);
        await setAsyncItem(ASYNC_CONSTANT.MARK_ATTENDANCE_IMAGE, compressedImage.uri);
      } catch (error) {
        // console.log('====launchCamera===>>>error>>>',error);
      }
    });
  };

  const handleCameraLaunch = () => {
    if (!lat || !long) {
      Alert.alert(t(SET_EMPLOYEE_ATTENDANCE.LOCATION_NOT_FOUND));
      return;
    }
    if (!cameraPermission) {
      Alert.alert(t(SET_EMPLOYEE_ATTENDANCE.CAMERA_PERMISSION_REQUIRED));
      return;
    }
    captureAndStoreData();
  };

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2); 
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    const saveBackgroundData = {
      empid: employeeData?.empid,
      currentlat: String(lat),
      currentlong: String(long)
    }
    
    // console.log('===veryIntensiveTask=>>saveBackgroundData>>',saveBackgroundData);
    
      // Example of an infinite loop task
      const { delay } = taskDataArguments;
      await new Promise( async (resolve) => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
              console.log(i);
              await saveBackgroundLocation(saveBackgroundData);
              await sleep(delay);
          }
      });
  };


  const options = {
      taskName: 'Example',
      taskTitle: 'Attendrix Background Location',
      taskDesc: 'Attendrix background location Service enabled',
      taskIcon: {
          name: 'screen',
          type: 'drawable',
          package: 'com.aeon.attendrix'
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
          delay: 3600000,
      },
  };

  const handleMarkAttendacne = async () => {
    try {
      // Start loader instantly
      setLoading(true);

      // Run both checks in parallel
      const [timeTampered, mockResult] = await Promise.all([
        isDeviceTimeTampered(),
        isMockingLocation().catch(() => ({ isLocationMocked: false })) // fail-safe
      ]);

      // Stop loader BEFORE showing any alert so alert shows instantly
      if (timeTampered) {
        setLoading(false);
        Alert.alert(
          t(MOCK_TIME_CONSTANT.LABEL),
          t(MOCK_TIME_CONSTANT.MSG),
          [{ text: 'OK' }],
          { cancelable: false }
        );
        return;
      }

      if (mockResult?.isLocationMocked) {
        setLoading(false);
        Alert.alert(
          t(MOCK_LOCATION_CONSTANT.LABEL),
          t(MOCK_LOCATION_CONSTANT.MSG),
          [{ text: 'OK' }],
          { cancelable: false }
        );
        return;
      }

      // Basic validations
      if (!lat || !long || !imageUri) {
        setLoading(false);
        Alert.alert(
          t(CAMERA_CONSTANT.ERROR_TEXT),
          t(CAMERA_CONSTANT.ERROR_MSG_1)
        );
        return;
      }

      // Geofence check
      let isWithinGeofence = false;
      if (hasGeofence && geofenceLocation) {
        const distance = getDistanceInMeters(
          lat,
          long,
          geofenceLocation.latitude,
          geofenceLocation.longitude
        );
        isWithinGeofence = distance <= 50;
      }

      const proceedWithMarking = async (withinGeofenceFlag) => {
        const empId = attendanceSelf ? employeeData?.empid : employee?.userId;
        const photoName = imageNameUtils(empId);

        const markAttendanceData = {
          empId,
          status: 1,
          checkDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
          latitude: lat,
          longitude: long,
          imgfile: imageUri,
          imageName: photoName,
          inOut: isCheckIn ? 1 : 2,
          attendanceMode: attendanceSelf ? 1 : 2,
          attendenceBy: attendanceSelf ? 'Self' : employeeData?.empid,
          withinGeofence: withinGeofenceFlag ? 1 : 0,
        };

        const response = await markAttendance(markAttendanceData);
        if (response) {
          const checkInKey = `${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${empId}`;
          const dateKey = `${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${empId}`;
          const today = moment().format('YYYY-MM-DD');

          const oldValue = await getAsyncItem(checkInKey);
          const newValue = oldValue !== 'true';

          await setAsyncItem(checkInKey, newValue.toString());
          await setAsyncItem(dateKey, today);

          // Control background service
          if (attendanceSelf === true) {
            const isRunning = BackgroundService.isRunning();
            if (isCheckIn && !isRunning) {
              await BackgroundService.start(veryIntensiveTask, options);
              await BackgroundService.updateNotification({
                taskDesc: 'Attendrix background location running...',
              });
            } else if (!isCheckIn && isRunning) {
              await BackgroundService.stop();
            }
          }

          route.params?.onSuccess?.();
          navigation.goBack();
        }
      };

      // Stop loader before possible alert prompts
      setLoading(false);

      // Geofence decisions
      if (!hasGeofence) {
        proceedWithMarking(true);
      } else if (isWithinGeofence) {
        proceedWithMarking(true);
      } else {
        Alert.alert(
          t(GEOFENCE_CONSTANT.LABEL),
          t(GEOFENCE_CONSTANT.MSG),
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => proceedWithMarking(false) }
          ]
        );
      }
    } catch (err) {
      setLoading(false);
      console.error('Error in handleMarkAttendacne:', err);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
        </View>
      )}
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
        <TouchableOpacity style={styles.checkButtonContainer} onPress={handleMarkAttendacne} disabled={isLoading}>
          <Text style={styles.buttonText}>{isCheckIn ? t(CHECK_IN_LABEL) : t(CHECK_OUT_LABEL)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetEmployeeAttendance;

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
    marginTop: 20
  },
  flipIcon: {
    height: 50,
    width: 50,
    tintColor: Colors.red,
  },
  captureIcon: {
    height: 80,
    width: 80,
    backgroundColor: Colors.red,
    borderRadius: 40,
    borderColor: Colors.white,
    borderWidth: 3,
    position: 'absolute',
    bottom: 30
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
  },
  checkButtonContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: Colors.red,
    width: '50%',
    height: screenHeight * 0.05,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 22,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  }
});