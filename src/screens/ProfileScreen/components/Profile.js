import { View, StyleSheet } from 'react-native'
import React from 'react'
import Logout from './Logout'

const Profile = () => {
  return (
    <View style={styles.container}>
      <Logout/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})