import React, { useState } from 'react';
import { View, StyleSheet, Image, RefreshControl } from 'react-native';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import MyImages from '../../../utils/MyImages';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';
import { isArrayLength } from '../../../utils/ValidationUtils';
import Colors from '../../../assets/colors/colors';


const MonthAttendance = () => {
  const { monthData, refreshData } = useAttendance();
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
      {isArrayLength(monthData) ? (
        <RenderEmployeeAttendanceData
          data={monthData}
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
    backgroundColor: Colors.bgColor,
    marginBottom: 20
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

export default MonthAttendance;