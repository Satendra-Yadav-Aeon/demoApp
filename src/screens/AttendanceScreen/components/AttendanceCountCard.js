import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useAdminAttendance } from '../context/AdminAttendanceContext';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { DATE_FORMAT_A } from '../../../constants/MainConstant';
import { ATTENDANCE_COUNT_CARD_CONSTANT } from '../constants/AttendanceConstant';

const { screenHeight, screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.25;
const cardHeight = screenHeight * 0.15;

const AttendanceCountCard = () => {
  const {
    totalEmployees,
    presentEmployees,
    absentEmployees,
    selectedDate,
    setSelectedDate,
  } = useAdminAttendance();
  const {t} = useTranslation()

  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (_, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(moment(date).format(DATE_FORMAT_A));
    }
  };

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
            <Text style={styles.cardDataText}>{totalEmployees?.length}</Text>
        </View>
        <View style={styles.card}>
            <Image source={MyImages.presentEmployees} style={styles.icon}/>
            <Text style={styles.cardHeaderText}>{t(ATTENDANCE_COUNT_CARD_CONSTANT.PRESENT)}</Text>
            <Text style={styles.cardDataText}>{presentEmployees?.length}</Text>
        </View>
        <View style={styles.card}>
            <Image source={MyImages.absentEmployees} style={styles.icon}/>
            <Text style={styles.cardHeaderText}>{t(ATTENDANCE_COUNT_CARD_CONSTANT.ABSENT)}</Text>
            <Text style={styles.cardDataText}>{absentEmployees?.length}</Text>
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
    height: cardHeight,
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    margin:10
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
    marginTop: 5,
    fontSize: 16
  },
  cardDataText: {
    color: Colors.red, 
    fontWeight: 'bold', 
    fontSize: 20
  }
});