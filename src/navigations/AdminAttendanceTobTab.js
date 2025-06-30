import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TAB_SCREENS } from '../constants/MainConstant';
import AllEmployees from '../screens/AttendanceScreen/components/AllEmployees';
import PresentEmployees from '../screens/AttendanceScreen/components/PresentEmployees';
import AbsentEmployees from '../screens/AttendanceScreen/components/AbsentEmployees';
import Colors from '../assets/colors/colors';

const Tab = createMaterialTopTabNavigator();

const AdminAttendanceTopTab = () => {
  const {t} = useTranslation()
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.bgColor,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
        tabBarItemStyle: {
          borderRadius: 20,  
          margin: 5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.red,
          height: '100%',
          borderRadius: 20,
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,
          borderBottomStartRadius: 30,
          borderBottomEndRadius: 30,
          borderWidth: 2,
          borderColor: Colors.bgColor
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.black,
        swipeEnabled: false,
      }}
    >
      <Tab.Screen name={t(TAB_SCREENS.ALL_EMPLOYEES)} component={AllEmployees} />
      <Tab.Screen name={t(TAB_SCREENS.PRESENT_EMPLOYEES)} component={PresentEmployees} />
      <Tab.Screen name={t(TAB_SCREENS.ABSENT_EMPLOYEES)} component={AbsentEmployees} />
    </Tab.Navigator>
  );
};

export default AdminAttendanceTopTab;