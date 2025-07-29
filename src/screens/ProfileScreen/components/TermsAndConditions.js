import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../../assets/colors/colors';

const TermsAndConditions = () => {
  const termsConditions =
    Platform.OS === 'android'
      ? { uri: 'file:///android_asset/attendrixTermsConditions.html' } // Android
      : require('../../../assets/html/attendrixTermsConditions.html'); // iOS
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={termsConditions}
      />
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderColor: Colors.bgColor,
    borderWidth: 10
  },
});