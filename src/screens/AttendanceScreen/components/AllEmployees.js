import React from 'react';
import { FlatList, View, StyleSheet, Image } from 'react-native';
import { useAdminAttendance } from '../context/AdminAttendanceContext';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import AdminAttendanceCard from './AdminAttendanceCard';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const AllEmployees = () => {
  const { totalEmployees, selectedDates, setSelectedDates } = useAdminAttendance();
  
  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isArrayLength(totalEmployees) ? (
        <FlatList 
          data={totalEmployees} 
          keyExtractor={(item) => item.empId.toString()} 
          renderItem={({ item }) => (
            <AdminAttendanceCard employee={item} selectedDates={selectedDates} />
          )}
      />
      ): (
        renderEmptyData()
      )}
    </View>
  ) 
};

export default AllEmployees;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  card: {
		width: cardWidth,
		padding: 15,
		margin: 10,
		backgroundColor: Colors.white,
		borderRadius: 20,
		elevation: 5,
	},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataIcon: {
    height: 100,
    width: 100,
  }
});