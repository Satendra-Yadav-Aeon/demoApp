import React, { useState } from 'react';
import { View, StyleSheet, Image, RefreshControl } from 'react-native';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';
import Colors from '../../../assets/colors/colors';
import { isArrayLength } from '../../../utils/ValidationUtils';
import MyImages from '../../../utils/MyImages';


const WeekAttendance = () => {
  const { weekData, refreshData } = useAttendance();
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
      {isArrayLength(weekData) ? (
        <RenderEmployeeAttendanceData
          data={weekData}
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

export default WeekAttendance;