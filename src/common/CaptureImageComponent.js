import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { useNavigation, useRoute } from '@react-navigation/native'
import ScreenDimensions from '../utils/DimensionUtils';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import MyImages from '../utils/MyImages';
import Colors from '../assets/colors/colors';
import { setAsyncItem } from '../utils/AsyncStorage';

const { screenHeight, screenWidth } = ScreenDimensions;

const CaptureImageComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { employeeData, mode } = route.params || {};
  const [imageUri, setImageUri] = useState(null);

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, async (response) => {
      console.log('Camera response:', response);

      if (response.didCancel) {
        Alert.alert('Camera Cancelled', 'You cancelled taking the photo.');
      } else if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'An error occurred while opening the camera.');
      } else {
        let imageUri =
          response.assets && response.assets.length > 0
            ? response.assets[0].uri
            : null;

        if (imageUri) {
          // console.log('===launchCamera===>>imageUri>>>',imageUri);
          
          try {
            const resizedImage = await ImageResizer.createResizedImage(
              imageUri,
              800,
              600,
              'JPEG',
              80,
              0
            );

            setImageUri(resizedImage.uri);
            // const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`;
            const key =
              mode === 'task_mode'
                ? `${ASYNC_CONSTANT.TASK_IMGAE}_${employeeData?.empid}`
                : `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`;

            await setAsyncItem(key, resizedImage.uri);

            // Give some time to ensure image is saved
            // setTimeout(() => {
            //   navigation.goBack();
            // }, 300);
          } catch (err) {
            console.error('Error resizing image:', err);
            Alert.alert('Resize Error', 'Failed to compress the image.');
          }
        } else {
          Alert.alert('Image Error', 'No image URI found.');
        }
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
          <Image source={MyImages.goBack} style={styles.goForwardIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        {/* <TouchableOpacity onPress={handleCameraLaunch} style={styles.captureIcon} /> */}
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
  goForwardIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.red,
    transform: [{ rotate: '180deg' }],
  }
});
