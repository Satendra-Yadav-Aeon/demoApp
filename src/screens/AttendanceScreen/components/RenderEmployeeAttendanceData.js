import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors'
import ScreenDimensions from '../../../utils/DimensionUtils';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';
import { ELLIPSIZE_MODE } from '../../../constants/MainConstant';
import { formatDate } from '../../../utils/formatDateUtils';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const RenderEmployeeAttendanceData = ({data, refreshControl}) => {
  const {t} = useTranslation()

	const renderDayAttendace = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.DAY)}</Text>
          <Text style={styles.dataText}>{formatDate(item?.date)}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_IN)}</Text>
          <Text style={styles.dataText}>{item?.inTime}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_OUT)}</Text>
          <Text style={styles.dataText}>{item?.outTime}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.TOTAL_HOUR)}</Text>
          <Text style={styles.dataText}>{item?.totalHours}</Text>
        </View>
        {/* <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.LOCATION)}</Text>
          <Text style={styles.dataText} numberOfLines={2} ellipsizeMode={ELLIPSIZE_MODE}>{item?.location}</Text>
        </View> */}
        <View style={styles.flex1}></View>
      </View>
    </View>
  );
};

  return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderDayAttendace}
        refreshControl={refreshControl}
      />
    );
}

export default RenderEmployeeAttendanceData

const styles = StyleSheet.create({
	card: {
		width: cardWidth,
		padding: 15,
		margin: 10,
		backgroundColor: Colors.white,
		borderRadius: 20,
		elevation: 5,
	},
	row: {
    flexDirection: 'row',
    width: '100%',
    flex:1,
    marginLeft: 15,
    marginBottom: 10
  },
  flex1: {
    flex: 1,
    paddingHorizontal: 5,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.grey,
    marginBottom: 4,
  },
  dataText: {
    fontSize: 17  ,
    fontWeight: 'bold',
    color: Colors.black,
  },
})