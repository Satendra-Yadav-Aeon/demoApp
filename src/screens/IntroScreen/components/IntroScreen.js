import React, { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { isMockingLocation } from 'react-native-turbo-mock-location-detector';
import { ANDROID_PLATFORM, BLOCK_ALERT_CONSTANT, LARGE_LOADER, SCREENS } from '../../../constants/MainConstant';
import { requestLocationPermission } from '../../../utils/requestLocationPermission';
import Colors from '../../../assets/colors/colors';
import BlockerAlert from '../../../common/BlockerAlert';

const IntroScreen = () => {
  const navigation = useNavigation();
  const [blockType, setBlockType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoEnd = async () => {
    setLoading(true);

    try {
      const granted = await requestLocationPermission();
      if (granted && Platform.OS === ANDROID_PLATFORM) {
        try {
          const { isLocationMocked } = await isMockingLocation();
          if (isLocationMocked) {
            setBlockType(BLOCK_ALERT_CONSTANT.LOCATION_BLOCK);
            setLoading(false);
            return; // stop navigation
          }
        } catch (mockError) {
          // console.error('Error checking mock location:', mockError);
        }
      }

      // All good → go to login
      navigation.replace(SCREENS.LOGIN);
    } catch (err) {
      // console.error('Error in handleVideoEnd:', err);
      navigation.replace(SCREENS.LOGIN); // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
        </View>
      )}

      {blockType ? (
        <BlockerAlert visible={true} type={blockType} />
      ) : (
        <Video
          source={require('../../../assets/video/Attendrix_Final_Logo.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          onEnd={handleVideoEnd}
          ignoreSilentSwitch="ignore"
          controls={false}
          fullscreen={false}
        />
      )}
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
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default IntroScreen;
