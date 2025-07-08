import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useAdminAttendance } from '../context/AdminAttendanceContext';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { DATE_FORMAT_A } from '../../../constants/MainConstant';
import { ATTENDANCE_COUNT_CARD_CONSTANT } from '../constants/AttendanceConstant';
import useAdminAttendanceCountAPI from '../hooks/useAdminAttendanceCountAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';

const { screenHeight, screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.25;
const cardHeight = screenHeight * 0.15;

const AttendanceCountCard = () => {
  const {
    selectedDates,
    setSelectedDates,
  } = useAdminAttendance();
  const {adminAttendanceCount, refetchAdminAttendanceCount} = useAdminAttendanceCountAPI();
  const {t} = useTranslation()

  const[employeeData, setEmployeeData] = useState({})
  const [selectedDate, setSelectedDate] = useState(moment().format(DATE_FORMAT_A));
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
      fetchAsyncData();
    },[])
  
    const fetchAsyncData = async() => {
      const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      setEmployeeData(data)
    }
  
    useFocusEffect(
      React.useCallback(() => {
        if (employeeData?.empid && selectedDate) {
          refetchAdminAttendanceCount({userId: employeeData?.empid, date: selectedDate});
        }
      }, [employeeData, selectedDate])
    );

  const onDateChange = (_, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(moment(date).format(DATE_FORMAT_A));
      setSelectedDates(moment(date).format(DATE_FORMAT_A));
    }
  };

  // console.log('====AttendanceCountCard==>>selectedDate>>>>', selectedDate);
  // console.log('====AttendanceCountCard==>>employeeData>>>>', employeeData);
  

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.dateContainer} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>{selectedDate}</Text>
            <Image source={MyImages.calendar} style={styles.calendarIcon}/>
        </TouchableOpacity>
        {showPicker && (
            <DateTimePicker
            mode={ATTENDANCE_COUNT_CARD_CONSTANT.DATE_MODE}
            value={moment(selectedDate, DATE_FORMAT_A).toDate()}
            display={ATTENDANCE_COUNT_CARD_CONSTANT.DEFAULT}
            onChange={onDateChange}
            />
        )}
        <View style={styles.cardContainer}>
        <View style={styles.card}>
            <Image source={MyImages.totalEmployees} style={styles.icon}/>
            <Text style={styles.cardHeaderText}>{t(ATTENDANCE_COUNT_CARD_CONSTANT.TOTAL)}</Text>
            <Text style={styles.cardDataText}>{adminAttendanceCount[0]?.totalEmpCnt}</Text>
        </View>
        <View style={styles.card}>
            <Image source={MyImages.presentEmployees} style={styles.icon}/>
            <Text style={styles.cardHeaderText}>{t(ATTENDANCE_COUNT_CARD_CONSTANT.PRESENT)}</Text>
            <Text style={styles.cardDataText}>{adminAttendanceCount[0]?.presentEmpCnt}</Text>
        </View>
        <View style={styles.card}>
            <Image source={MyImages.absentEmployees} style={styles.icon}/>
            <Text style={styles.cardHeaderText}>{t(ATTENDANCE_COUNT_CARD_CONSTANT.ABSENT)}</Text>
            <Text style={styles.cardDataText}>{adminAttendanceCount[0]?.absentEmpCnt}</Text>
        </View>
        </View>
    </View>
  );
};

export default AttendanceCountCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: Colors.bgColor
  }, 
  cardContainer: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },  
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    margin:10,
    padding: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 20,
    gap: 10
  },
  dateText: {
    flex: 0.3,
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: 'bold'
  },
  calendarIcon: {
    height: 40,
    width: 40
  },
  icon: {
    width: 60, 
    height: 60, 
  },
  cardHeaderText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16
  },
  cardDataText: {
    color: Colors.red, 
    fontWeight: 'bold', 
    fontSize: 20
  }
});