import React, { useState } from 'react';
import { View, StyleSheet, Image, RefreshControl } from 'react-native';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import Colors from '../../../assets/colors/colors';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';


const DayAttendance = () => {
  const { dayData, refreshData } = useAttendance();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (e) {
      console.error('Refresh failed:', e);
    } finally {
      setRefreshing(false);
    }
  };
  

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      {isArrayLength(dayData) ? (
        <RenderEmployeeAttendanceData 
          data={dayData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } 
        />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
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

export default DayAttendance;