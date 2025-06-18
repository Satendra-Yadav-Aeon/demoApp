import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import ScreenDimensions from '../../../utils/DimensionUtils'
import Colors from '../../../assets/colors/colors';
import { CATEGORY_TITLE } from '../constants/DashboardConstant';
import MyImages from '../../../utils/MyImages';
import { ROLES } from '../../../constants/MainConstant';

const { screenHeight, screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.40;
const cardHeight = screenHeight * 0.15;

const getCategoriesByRole = (role) => {
  switch (role) {
    case 'admin':
      return [
        { id: '1', title: 'Attendance', screen: 'AdminAttendance', icon: MyImages.attendance },
        { id: '2', title: 'Reports', screen: 'Report', icon: MyImages.report },
        { id: '3', title: 'Employees', screen: 'ManageEmployees', icon: MyImages.employee },
      ];
    case 'supervisor':
      return [
        { id: '1', title: 'Mark Attendance', screen: 'SupervisorAttendance', icon: MyImages.attendance },
        { id: '2', title: 'Reports', screen: 'Report', icon: MyImages.report },
      ];  
    case 'employee':
      return [
        { id: '1', title: 'My Attendance', screen: 'EmployeeAttendance', icon: MyImages.attendance },
        { id: '2', title: 'My Task', screen: 'EmployeeTask', icon: MyImages.task },
      ];
    default:
      return [];
  }
}

const EmployeeCategory = ({ role }) => {
  const navigation = useNavigation()
  const categories = getCategoriesByRole(role);
  
  const renderItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item?.screen)}>
      <Image source={item?.icon} style={styles.icon}/>
      <Text style={styles.cardText}>{item?.title}</Text>
    </TouchableOpacity>
  );
  };


  return (
    <View style={[styles.container, (role === ROLES.EMPLOYEE || role === ROLES.SUPERVISOR) && { top: screenHeight * 0.15 }]}>
      <Text style={styles.title}>{CATEGORY_TITLE}</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  )
}

export default EmployeeCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.02,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 10
  },
  flatListContent: {
    gap: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
    marginTop: 10,
    width: '100%',
    textAlign: 'center'
  },
  icon: {
    width: 60, 
    height: 60, 
  },
})