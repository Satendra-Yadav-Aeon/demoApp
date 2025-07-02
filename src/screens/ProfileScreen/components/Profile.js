import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import Logout from './Logout'
import ProfileCard from './ProfileCard'
import Colors from '../../../assets/colors/colors'
import VersionInfo from './VersionInfo'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import { getAsyncItem } from '../../../utils/AsyncStorage'

const Profile = () => {
  const route = useRoute();
  const { employee } = route.params || {};
  const[capturedImageUri, setCapturedImageUri] = useState()

  useFocusEffect(
  React.useCallback(() => {
      const loadProfileImage = async () => {
        const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employee?.empid}`
        const uri = await getAsyncItem(key);
        if (uri) {
          setCapturedImageUri(uri);
        }
      };
      if (employee?.empid) {
        loadProfileImage();
      }
    }, [employee])
  );

  return (
    <View style={styles.container}>
      <ProfileCard employee={employee} capturedImageUri={capturedImageUri}/>
      <VersionInfo/>
      <Logout/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  }
})