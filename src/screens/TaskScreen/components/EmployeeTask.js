import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LAUNCHING_SOON } from '../../../constants/MainConstant';
import Colors from '../../../assets/colors/colors';

const EmployeeTask = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.launchText}>{t(LAUNCHING_SOON)}</Text>
    </View>
  )
}

export default EmployeeTask

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  launchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black
  }
})