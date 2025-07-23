import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages';
import { CHECK_IN_LABEL, CHECK_OUT_LABEL} from '../constants/DashboardConstant';
import { SCREENS } from '../../../constants/MainConstant';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { getAsyncItem, setAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { getTodayFormatted } from '../../../utils/DateUtils';

const { screenWidth, screenHeight } = ScreenDimensions;

const EmployeeShowAttendance = ({checkIn, checkOut, employeeDetails}) => {
  const navigation = useNavigation()
  const {t} = useTranslation();
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [empId, setEmpId] = useState('');

  useEffect(() => {
    const loadState = async () => {
      const userData = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      const id = userData?.empid;
      setEmpId(id);

      const checkInKey = `${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${id}`;
      const dateKey = `${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${id}`;

      const storedCheckIn = await getAsyncItem(checkInKey);
      const storedDate = await getAsyncItem(dateKey);

      const today = getTodayFormatted();

      if (storedDate !== today) {
        // Reset to checkIn if it's a new day
        await setAsyncItem(checkInKey, 'true');
        await setAsyncItem(dateKey, today);
        setIsCheckIn(true);
      } else {
        setIsCheckIn(storedCheckIn === 'true');
      }
    };
    loadState();
  }, []);

  const handleCheckPress = () => {
    navigation.navigate(SCREENS.SET_EMPLOYEE_ATTENDANCE, {
      isCheckIn,
      attendanceSelf: true,
      employeeDetails,
      onSuccess: async () => {
        const newState = !isCheckIn;
        setIsCheckIn(newState);
        const today = getTodayFormatted();
        await setAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${empId}`, newState.toString());
        await setAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${empId}`, today);
      }
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
         {/* Check In Section */}
        <View style={styles.checkSection}>
          <View style={styles.checkInContainer}>
          <Image source={MyImages.checkIn} style={styles.checkIcons} />
          <Text style={styles.labelText}>{t(CHECK_IN_LABEL)}</Text>
          </View>
          <Text style={styles.timeText}>
            {checkIn}
          </Text>
        </View>

        {/* Check Out Section */}
        <View style={styles.checkSection}>
          <View style={styles.checkOutContainer}>
          <Image source={MyImages.checkOut} style={styles.checkIcons} />
          <Text style={styles.labelText}>{t(CHECK_OUT_LABEL)}</Text>
          </View>
          <Text style={styles.timeText}>
            {checkOut}
          </Text>
        </View>
         {/* Center Button */}
        <TouchableOpacity style={styles.checkButtonContainer} onPress={handleCheckPress}>
          <Text style={styles.buttonText}>{isCheckIn ? t(CHECK_IN_LABEL) : t(CHECK_OUT_LABEL)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EmployeeShowAttendance

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: screenHeight * 0.28,
    width: screenWidth,
    alignItems: 'center',
    zIndex: 10,
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.25,
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
  checkInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcons: {
    width: 30, 
    height: 30,
    tintColor: Colors.grey,
    marginRight: 8,
  },
  checkSection: {
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'space-between',    
    width: '100%',
    marginVertical: 8,
  },

  labelText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },

  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'right',
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
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 22,
  }
});
