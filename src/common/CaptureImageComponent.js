import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import ScreenDimensions from '../utils/DimensionUtils';
import { SET_EMPLOYEE_ATTENDANCE } from '../screens/AttendanceScreen/constants/AttendanceConstant';
import MyImages from '../utils/MyImages';
import Colors from '../assets/colors/colors';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { setAsyncItem } from '../utils/AsyncStorage';

const {screenHeight,screenWidth} = ScreenDimensions;

const CaptureImageComponent = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { employeeData } = route.params || {};
  const [cameraPermission, setCameraPermission] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const device = useCameraDevice(SET_EMPLOYEE_ATTENDANCE.FRONT_CAMERA)

  useEffect(() => {
    const requestPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === SET_EMPLOYEE_ATTENDANCE.GRANTED_STATUS) {
        setCameraPermission(true)
      }else{
        Alert.alert(SET_EMPLOYEE_ATTENDANCE.DENIED_CAMERA_PERMISSION);
      }
    };

    requestPermissions();
  }, []);

  // console.log('======CaptureImageComponent=====+>employeeData>>>>>>>',employeeData, employeeData?.empid);
  
  const captureAndStoreData = async () => {
    if (!cameraRef.current) return Alert.alert(SET_EMPLOYEE_ATTENDANCE.CAMERA_NOT_READY);
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: SET_EMPLOYEE_ATTENDANCE.FLASH_OFF,
      });
      const photoPath = `file://${photo.path}`;
      // Compress the image to 80% quality
      const compressedImage = await ImageResizer.createResizedImage(
        photoPath,
        800, // width (adjustable)
        600, // height (adjustable)
        'JPEG',
        80, // quality in percentage
        0,  // rotation
        undefined,
        false,
        { mode: 'contain' }
      );
      setImageUri(compressedImage.uri);
      const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`
      await setAsyncItem(key, compressedImage.uri)

      // console.log('Compressed Image URI:', compressedImage.uri, compressedImage.size);
      
    } catch (error) {
        // console.log('===captureAndStoreData===error>>>>>',error);
    }
  };

  const handleCheckPress = () => {
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
      </View>      
      <View style={styles.controls}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        <TouchableOpacity onPress={handleCheckPress} style={styles.captureIcon}/>
      </View>
    </View>
  );
};

export default CaptureImageComponent;

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