import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import Colors from '../assets/colors/colors';
import { TAB_SCREENS } from '../constants/MainConstant';
import DayAttendance from '../screens/AttendanceScreen/components/DayAttendance';
import WeekAttendance from '../screens/AttendanceScreen/components/WeekAttendance';
import MonthAttendance from '../screens/AttendanceScreen/components/MonthAttendance';

const Tab = createMaterialTopTabNavigator();

const EmployeeAttendanceTopTab = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,
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
      }}
    >
      <Tab.Screen name={TAB_SCREENS.DAY_ATTENDANCE} component={DayAttendance} />
      <Tab.Screen name={TAB_SCREENS.WEEK_ATTENDANCE} component={WeekAttendance} />
      <Tab.Screen name={TAB_SCREENS.MONTH_ATTENDANCE} component={MonthAttendance} />
    </Tab.Navigator>
  );
};

export default EmployeeAttendanceTopTab;