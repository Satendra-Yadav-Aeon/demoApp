import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import Logout from './Logout'
import ProfileCard from './ProfileCard'
import Colors from '../../../assets/colors/colors'
import VersionInfo from './VersionInfo'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import { getAsyncItem } from '../../../utils/AsyncStorage'
import useGetEmployeeDetailsById from '../../DashboardScreen/hooks/useGetEmployeeDetailsById'
import { BaseConfigUrl } from '../../../env/BaseConfigUrl'

const Profile = () => {
  const route = useRoute();
  const { employee } = route.params || {};
  const { employeeDetails, refetch } = useGetEmployeeDetailsById();
  const[capturedImageUri, setCapturedImageUri] = useState()
  
  useFocusEffect(
    React.useCallback(() => {
      if (employee?.empid) {
        refetch({ empid: employee?.empid });
      }
    }, [employee])
  );

  useFocusEffect(
    React.useCallback(() => {
        const loadProfileImage = async () => {
          // First try using the fetched employeeDetails  
          if (employeeDetails?.photo) {
            setCapturedImageUri(`${BaseConfigUrl.BASE_IMAGE_URL}${employeeDetails.photo}`);
            return;
          }
          // Otherwise, fallback to async stored image
          if(employee?.empid){
            const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employee?.empid}`
            const uri = await getAsyncItem(key);
            if (uri) {
              setCapturedImageUri(uri);
            }
          }
          
        };
        
          loadProfileImage();
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