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

const { screenWidth, screenHeight } = ScreenDimensions;

const EmployeeShowAttendance = ({checkIn, checkOut}) => {
  const navigation = useNavigation()
  const {t} = useTranslation();
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [empId, setEmpId] = useState('');

  useEffect(() => {
    const loadState = async () => {
      const userData = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      const id = userData?.empid;
      setEmpId(id);
      const stored = await getAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${id}`);
      
      if (stored === null) {
      // First-time user or no data stored yet → default to Check In
      setIsCheckIn(true);
      } else {
        setIsCheckIn(stored === 'true');
      }
    };
    loadState();
  }, []);

  const handleCheckPress = () => {
    navigation.navigate(SCREENS.SET_EMPLOYEE_ATTENDANCE, {
      isCheckIn,
      attendanceSelf: true,
      onSuccess: async () => {
        const newState = !isCheckIn;
        setIsCheckIn(newState);
        await setAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${empId}`, newState.toString());
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
