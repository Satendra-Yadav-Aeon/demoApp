import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import Colors from '../../../assets/colors/colors';

const ChangePassword = () => {
  const route = useRoute();
  const { employeeData } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text>ChangePassword</Text>
    </View>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.bgColor
	}
})