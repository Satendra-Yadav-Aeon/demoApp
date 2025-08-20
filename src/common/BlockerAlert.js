import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image, BackHandler, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ANDROID_PLATFORM, BLOCK_ALERT_CONSTANT, SLIDE_ANIMATION } from '../constants/MainConstant';
import Colors from '../assets/colors/colors';
import { INTERNET_CONSTANT, MOCK_LOCATION_CONSTANT, MOCK_TIME_CONSTANT } from '../screens/AttendanceScreen/constants/AttendanceConstant';

const BlockerAlert = ({ visible, type }) => {
  const {t} = useTranslation();
  useEffect(() => {
    let backHandlerSubscription;

    if (Platform.OS === ANDROID_PLATFORM) {
      backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (visible && tampered) return true; // Block back button
        return false;
      });
    }

    return () => {
      if (backHandlerSubscription) {
        backHandlerSubscription.remove(); //correct way now
      }
    };
  }, [visible]);


  const getAlertContent = () => {
    switch (type) {
      case BLOCK_ALERT_CONSTANT.TIME_BLOCK:
        return {
          icon: require('../assets/images/clock.png'),
          message:
            t(MOCK_TIME_CONSTANT.MSG)
        };
      case BLOCK_ALERT_CONSTANT.INTERNET_BLOCK:
        return {
          icon: require('../assets/images/internet.png'),
          message: t(INTERNET_CONSTANT.MSG)
        };
      case BLOCK_ALERT_CONSTANT.LOCATION_BLOCK:
        return {
          icon: require('../assets/images/location.png'),
          message:
            t(MOCK_LOCATION_CONSTANT.MSG)
        };
      default:
        return {
          icon: require('../assets/images/information.png'),
          message: BLOCK_ALERT_CONSTANT.DEFAULT_MSG,
        };
    }
  };

  const { icon, message } = getAlertContent();

  return (
    <Modal animationType={SLIDE_ANIMATION} transparent={true} visible={visible} onRequestClose={() => {}}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <Image source={icon} style={styles.image}/>
          <Text style={styles.alertText}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  alertBox: {
    width: '100%',
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: Colors.black,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default BlockerAlert;