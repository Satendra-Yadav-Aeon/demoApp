import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { CAMERA_CONSTANT, GEOFENCE_CONSTANT, SET_EMPLOYEE_ATTENDANCE } from '../constants/AttendanceConstant';
import { getAsyncItem, setAsyncItem } from '../../../utils/AsyncStorage';
import { CHECK_IN_LABEL, CHECK_OUT_LABEL } from '../../DashboardScreen/constants/DashboardConstant';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import imageNameUtils from '../../../utils/imageNameUtils';
import { useMarkAttendanceAPI } from '../hooks/useMarkAttendanceAPI';

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
  const [geofenceLocation] = useState({
    latitude: 18.56680248689369,  // Example: Castle Cooperative Housing Society
    longitude: 73.92150312423335,
  });

  const route = useRoute();
  const { isCheckIn, attendanceSelf, employee, employeeDetails } = route?.params || {};

  // console.log('===SetEmployeeAttendance==>>employeeDetails>>>>',employeeDetails);
  // console.log('===SetEmployeeAttendance==>>employee>>>>',employee);
  
  // const [geofenceLocation] = useState({
  //   latitude: employee ? employee?.geofenceLatitude : employeeDetails?.geofenceLatitude,
  //   longitude: employee ? employee?.geofenceLongitude : employeeDetails?.geofenceLongitude,
  // });

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
      Alert.alert(SET_EMPLOYEE_ATTENDANCE.DENIED_LOCATION);
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
        Alert.alert(CAMERA_CONSTANT.CANCEL_LABEL, CAMERA_CONSTANT.CANCEL_MSG);
        return;
      }

      if (response.errorCode) {
        Alert.alert(CAMERA_CONSTANT.CAMERA_ERROR, response.errorMessage || CAMERA_CONSTANT.UNKNOWN_ERROR_MSG);
        return;
      }

      const photoUri = response.assets?.[0]?.uri;
      if (!photoUri) {
        Alert.alert(CAMERA_CONSTANT.ERROR_TEXT, CAMERA_CONSTANT.ERROR_MSG);
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
      Alert.alert(SET_EMPLOYEE_ATTENDANCE.LOCATION_NOT_FOUND);
      return;
    }
    if (!cameraPermission) {
      Alert.alert(SET_EMPLOYEE_ATTENDANCE.CAMERA_PERMISSION_REQUIRED);
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

  const handleMarkAttendacne = async () => {
    if (!lat || !long || !imageUri) {
      Alert.alert(CAMERA_CONSTANT.ERROR_TEXT, CAMERA_CONSTANT.ERROR_MSG_1);
      return;
    }

    const distance = getDistanceInMeters(lat, long, geofenceLocation.latitude, geofenceLocation.longitude);
    const isWithinGeofence = distance <= 50;

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

      // console.log('====handleMarkAttendacne======markAttendanceData>>>>>>>>>',markAttendanceData);

      const response = await markAttendance(markAttendanceData);
      if (response) {
        const checkInKey = `${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${empId}`;
        const dateKey = `${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${empId}`;
        const today = moment().format('YYYY-MM-DD');

        const oldValue = await getAsyncItem(checkInKey);
        const newValue = oldValue !== 'true';

        await setAsyncItem(checkInKey, newValue.toString());
        await setAsyncItem(dateKey, today);

        route.params?.onSuccess?.();
        navigation.goBack();
      }
    };

    if (isWithinGeofence) {
      proceedWithMarking(true);
    } else {
        Alert.alert(
          GEOFENCE_CONSTANT.LABEL,
          GEOFENCE_CONSTANT.MSG,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => proceedWithMarking(false) }
          ]
        );
      }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCameraLaunch()}>
          <Image source={MyImages.goBack} style={styles.goForwardIcon} />
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
  goForwardIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.red,
    transform: [{ rotate: '180deg' }],
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
  }
});