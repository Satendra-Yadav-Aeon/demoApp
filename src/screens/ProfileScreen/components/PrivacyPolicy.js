import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';

const PrivacyPolicy = () => {
  const privacyPolicy =
      Platform.OS === 'android'
        ? { uri: 'file:///android_asset/attendrixPrivacyPolicy.html' } // Android
        : require('../../../assets/html/attendrixPrivacyPolicy.html'); // iOS
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={privacyPolicy}
      />
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.white,
    borderColor: Colors.bgColor,
    borderWidth: 10
  },
});