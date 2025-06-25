import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { SET_EMPLOYEE_ATTENDANCE } from '../constants/AttendanceConstant';
import { DATE_FORMAT_A, TIME_FORMAT_A, TOAST_MESSAGE } from '../../../constants/MainConstant';

const {screenHeight,screenWidth} = ScreenDimensions;

const SetEmployeeAttendance = () => {
  const navigation = useNavigation()
  const [cameraPermission, setCameraPermission] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [checkTime, setCheckTime] = useState('');
  const [date, setDate] = useState('');
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const route = useRoute();
  const {isCheckIn} = route?.params || {}
  const cameraRef = useRef(null);
  
  const frontCamera = useCameraDevice(SET_EMPLOYEE_ATTENDANCE.FRONT_CAMERA);
  const backCamera = useCameraDevice(SET_EMPLOYEE_ATTENDANCE.BACK_CAMERA);
  const device = isFrontCamera ? frontCamera : backCamera;

  useEffect(() => {
    const requestPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === SET_EMPLOYEE_ATTENDANCE.GRANTED_STATUS) {
        setCameraPermission(true)
      }else{
        Alert.alert(SET_EMPLOYEE_ATTENDANCE.DENIED_CAMERA_PERMISSION);
      }
    };

    // Get stored location
    const fetchLocation = async () => {
      const userLat = parseFloat(await AsyncStorage.getItem('userLat'));
      const userLong = parseFloat(await AsyncStorage.getItem('userLong'));  
      setLat(userLat);
      setLong(userLong);
    };

    requestPermissions();
    fetchLocation();
  }, []);

  const captureAndStoreData = async () => {
    if (!lat || !long) return Alert.alert(SET_EMPLOYEE_ATTENDANCE.DENIED_LOCATION);
    if (!cameraRef.current) return Alert.alert(SET_EMPLOYEE_ATTENDANCE.CAMERA_NOT_READY);
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: SET_EMPLOYEE_ATTENDANCE.FLASH_OFF,
      });
      const now = moment();
      setImageUri(`file://${photo.path}`);
      setCheckTime(now.format(TIME_FORMAT_A));
      setDate(now.format(DATE_FORMAT_A));

      // console.log('Captured Image URI:', `file://${photo.path}`);
      // console.log('Location:', lat, long);
      // console.log(isCheckIn ? 'Check In Time:' : 'Check Out Time:', now.format('HH:mm:ss'));
      // console.log('Date:', now.format('YYYY-MM-DD'));
      Toast.show({
        type: TOAST_MESSAGE.SUCCESS,
        text1: isCheckIn ? SET_EMPLOYEE_ATTENDANCE.CHECK_IN_SUCCESS : SET_EMPLOYEE_ATTENDANCE.CHECK_OUT_SUCCESS,
        text2: now.format(TIME_FORMAT_A),
      })
    } catch (error) {
      Toast.show({
      type: TOAST_MESSAGE.ERROR,
      text1: SET_EMPLOYEE_ATTENDANCE.FAILED_IMAGE,
    });
    }
  };

  const handleCheckPress = () => {
    if (!lat && !long) {
      Alert.alert(SET_EMPLOYEE_ATTENDANCE.LOCATION_NOT_FOUND);
      return;
    }
    if (!cameraPermission) {
      Alert.alert(SET_EMPLOYEE_ATTENDANCE.CAMERA_PERMISSION_REQUIRED);
      return;
    }
    captureAndStoreData();
  };

  if (!device) return <View style={styles.loader}><Text style={styles.loaderText}>{SET_EMPLOYEE_ATTENDANCE.LOADING_CAMERA}</Text></View>;

  return (
    <View style={styles.container}>
      {device && (
        <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
      />
      )}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFrontCamera(prev => !prev)}>
          <Image source={MyImages.flip} style={styles.flipIcon}/>
        </TouchableOpacity>
      </View>      
      <View style={styles.controls}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        <TouchableOpacity onPress={handleCheckPress} style={styles.captureIcon}/>
      </View>
    </View>
  );
};

export default SetEmployeeAttendance;

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  controls: { 
    flex: 2, 
    padding: 16, 
    alignItems: 'center', 
    justifyContent: 'space-around',
  },  
  preview: { 
    width: screenWidth * 0.6, 
    height: screenHeight * 0.3, 
    borderRadius: 8, 
    marginVertical: 8,
    marginBottom: 30,
    marginTop: screenHeight * 0.35
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
  loader: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 18,
    fontWeight: 'bold'
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
  }
});