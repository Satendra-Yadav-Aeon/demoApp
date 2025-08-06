import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Colors from '../../../assets/colors/colors';
import { isArrayLength } from '../../../utils/ValidationUtils';
import MyImages from '../../../utils/MyImages';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { LARGE_LOADER } from '../../../constants/MainConstant';
import { REPORT_CONSTANT } from '../constants/ReportConstant';



const {screenWidth} = ScreenDimensions
const CommonReportUI = ({reportData, headers, columnWidths, title, reportFileName, isLoading}) => {

  const renderHeader = () => (
    <View style={[styles.row, styles.header]}>
      {headers?.map((h, index) => (
        <Text
          key={index}
          style={[styles.headerCell, { width: columnWidths[index] }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {h}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item, index }) => {
    if(item?.task){
      return(
         <View style={styles.row}>
        <Text style={[styles.cell, { width: columnWidths[1] }]} numberOfLines={1}>{index + 1}</Text>
        <Text style={[styles.cell, { width: columnWidths[2] }]} numberOfLines={1}>{item.name || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[3] }]} numberOfLines={1}>{item.role || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[4] }]} numberOfLines={1}>{item.task || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[5] }]} numberOfLines={1}>{item.description || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[6] }]} numberOfLines={1}>{item.startdate || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[7] }]} numberOfLines={1}>{item.enddate || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[8] }]} numberOfLines={1}>{item.status || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[9] }]} numberOfLines={1}>{item.assignBy || '--/--'}</Text>
      </View>
      )
    }else{
      return(
         <View style={styles.row}>
        <Text style={[styles.cell, { width: columnWidths[1] }]} numberOfLines={1}>{index + 1}</Text>
        <Text style={[styles.cell, { width: columnWidths[2] }]} numberOfLines={1}>{item.name || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[3] }]} numberOfLines={1}>{item.role || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[4] }]} numberOfLines={1}>{item.checkin || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[5] }]} numberOfLines={1}>{item.checkout || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[6] }]} numberOfLines={1}>{item.total_hrs || '--/--'}</Text>
        <Text style={[styles.cell, { width: columnWidths[7] }]} numberOfLines={1}>{item.attendanceby || '--/--'}</Text>
      </View>
      )
    }
  };


  const downloadExcel = async () => {
    if(!isArrayLength(reportData)){
      return Alert.alert('Error', 'No data Available !')
    }
    try {
      // Prepare data
      let dataToExport = []
      if (reportData?.[0]?.task){
        dataToExport = reportData?.map((row,index) => ({
        'Sr No': index + 1,
        'Employee Name': row.name,
        'Role': row.role,
        'Task': row.task,
        'Description': row.description,
        'Start Date': row.startdate,
        'End Date': row.enddate,
        'Status': row.status,
        'Marked By': row.assignBy,
      }));
      }else{
        dataToExport = reportData?.map((row,index) => ({
        'Sr No': index + 1,
        'Employee Name': row.name,
        'Role': row.role,
        'CheckIn': row.checkin,
        'CheckOut': row.checkout,
        'Total Hrs': row.total_hrs,
        'Marked By': row.attendanceby,
      }));
      }     
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);

      // Write to base64 string
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

      // File path
      const fileName = `${reportFileName}_${Date.now()}.xlsx`;
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      
      // Write file
      await RNFS.writeFile(filePath, wbout, 'base64');

      Alert.alert('Success', 'Excel sheet downloade successfully !')
    } catch (error) {
      Alert.alert('Error', 'Failed to download Excel file.');
    }
  };

   if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
      </View>
    );
  }

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={downloadExcel}>
          <Text style={styles.buttonText} adjustsFontSizeToFit={true}>{REPORT_CONSTANT.EXPORT}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
          {isArrayLength(reportData) ? (
            <View style={{marginTop: 40}}>
              {renderHeader()}
              <FlatList
                data={reportData}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                contentContainerStyle={{ paddingTop: 10 }}
              />
            </View>
          ) : (
            renderEmptyData()
          )}
      </ScrollView>
    </View>
  );
};

export default CommonReportUI;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    backgroundColor: Colors.bgColor,
  },
  header: {
    backgroundColor: Colors.red,
    paddingVertical: 8,
  },
  headerCell: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  cell: {
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#333',
    paddingVertical: 6,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  button: {
    backgroundColor: Colors.red,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth*1
  },
  noDataIcon: {
    height: 100,
    width: 100,
  }
});

