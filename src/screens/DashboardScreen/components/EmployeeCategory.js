import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../../../utils/DimensionUtils'
import Colors from '../../../assets/colors/colors';
import { CATEGORY_TITLE, CATERGORY_CONSTANT } from '../constants/DashboardConstant';
import MyImages from '../../../utils/MyImages';
import { ROLES, SCREENS } from '../../../constants/MainConstant';

const { screenHeight, screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.35;

const EmployeeCategory = ({ role }) => {
  const navigation = useNavigation()
  const {t} = useTranslation()

  const getCategoriesByRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { id: '1', title: t(CATERGORY_CONSTANT.ATTENDANCE), screen: SCREENS.ADMIN_ATTENDANCE, icon: MyImages.attendance },
          { id: '2', title: t(CATERGORY_CONSTANT.REPORTS), screen: SCREENS.REPORT, icon: MyImages.report },
          { id: '3', title: t(CATERGORY_CONSTANT.EMPLOYEES), screen: SCREENS.MANAGE_EMPLOYEE, icon: MyImages.employee },
          { id: '3', title: t(CATERGORY_CONSTANT.EMPLOYEE_TASK), screen: SCREENS.ADMIN_TASK, icon: MyImages.task },
        ];
      case ROLES.SUPERVISOR:
        return [
          { id: '1', title: t(CATERGORY_CONSTANT.MARK_ATTENDANCE), screen: SCREENS.SUPERVISOR_ATTENDANCE, icon: MyImages.attendance },
          { id: '2', title: t(CATERGORY_CONSTANT.REPORTS), screen: SCREENS.REPORT, icon: MyImages.report },
        ];  
      case ROLES.EMPLOYEE:
        return [
          { id: '1', title: t(CATERGORY_CONSTANT.MY_ATTENDANCE), screen: SCREENS.EMPLOYEE_ATTENDANCE, icon: MyImages.attendance },
          { id: '2', title: t(CATERGORY_CONSTANT.MY_TASK), screen: SCREENS.EMPLOYEE_TASK, icon: MyImages.task },
        ];
      default:
        return [];
    }
  }

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
      <Text style={styles.title}>{t(CATEGORY_TITLE)}</Text>
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
    paddingTop: screenHeight * 0.03,
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
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    margin: 10,
    padding: 5
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