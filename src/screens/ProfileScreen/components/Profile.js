import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import Logout from './Logout'
import ProfileCard from './ProfileCard'
import Colors from '../../../assets/colors/colors'

const Profile = () => {
  const route = useRoute();
  const { employee } = route.params || {};
  return (
    <View style={styles.container}>
      <ProfileCard employee={employee}/>
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