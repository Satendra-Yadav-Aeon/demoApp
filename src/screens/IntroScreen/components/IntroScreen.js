import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../constants/MainConstant';
import { requestLocationPermission } from '../../../utils/requestLocationPermission';

const IntroScreen = () => {
  const navigation = useNavigation();

  const handleVideoEnd = async () => {
    // Ask for location permission
    await requestLocationPermission();
    // Navigate to login screen
    navigation.replace(SCREENS.LOGIN);
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../../../assets/video/Attendrix_Final_Logo.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        onEnd={handleVideoEnd}
        ignoreSilentSwitch="ignore"
        controls={false}
        fullscreen={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  backgroundVideo: { 
    flex: 1 
  },
});

export default IntroScreen;
