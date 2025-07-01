import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';

const TermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={MyImages.termsConditions}
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