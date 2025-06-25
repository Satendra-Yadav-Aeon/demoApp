import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages';
import { CHECK_IN_LABEL, CHECK_OUT_LABEL, NO_TIME } from '../constants/DashboardConstant';
import { AM_TIME_LABEL, PM_TIME_LABEL, SCREENS } from '../../../constants/MainConstant';
import ScreenDimensions from '../../../utils/DimensionUtils';

const { screenWidth, screenHeight } = ScreenDimensions;

const EmployeeShowAttendance = () => {
  const navigation = useNavigation()
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [checkInList, setCheckInList] = useState([]);
  const [checkOutList, setCheckOutList] = useState([]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? PM_TIME_LABEL : AM_TIME_LABEL;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleCheckPress = () => {
    navigation.navigate(SCREENS.SET_EMPLOYEE_ATTENDANCE,{isCheckIn: isCheckIn})
    const time = getCurrentTime();

    if (isCheckIn) {
      setCheckInList(prev => [...prev, time]);
    } else {
      setCheckOutList(prev => [...prev, time]);
    }

    setIsCheckIn(!isCheckIn);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
         {/* Check In Section */}
        <View style={styles.checkSection}>
          <View style={styles.checkInContainer}>
          <Image source={MyImages.checkIn} style={styles.checkIcons} />
          <Text style={styles.labelText}>{CHECK_IN_LABEL}</Text>
          </View>
          <Text style={styles.timeText}>
            {checkInList?.length > 0 ? checkInList[checkInList.length - 1] : NO_TIME}
          </Text>
        </View>

        {/* Check Out Section */}
        <View style={styles.checkSection}>
          <View style={styles.checkOutContainer}>
          <Image source={MyImages.checkOut} style={styles.checkIcons} />
          <Text style={styles.labelText}>{CHECK_OUT_LABEL}</Text>
          </View>
          <Text style={styles.timeText}>
            {checkOutList?.length > 0 ? checkOutList[checkOutList.length - 1] : NO_TIME}
          </Text>
        </View>
         {/* Center Button */}
        <TouchableOpacity style={styles.checkButtonContainer} onPress={handleCheckPress}>
          <Text style={styles.buttonText}>{isCheckIn ? CHECK_IN_LABEL : CHECK_OUT_LABEL}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EmployeeShowAttendance

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: screenHeight * 0.25,
    width: screenWidth,
    alignItems: 'center',
    zIndex: 10,
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.3,
    backgroundColor: Colors.bgColor,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      android: {
        elevation: 15,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  checkInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 10
  },
  checkIcons: {
    width: 40, 
    height: 40,
    tintColor: Colors.grey
  },
  checkSection: {
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'space-between',    
    width: '100%',
  },

  labelText: {
    fontSize: 18,
    color: Colors.black,
  },

  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    alignSelf: 'center',
  },
  checkButtonContainer: {
    backgroundColor: Colors.red,
    width: '100%',
    height: screenHeight * 0.05,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 22,
  }
});
