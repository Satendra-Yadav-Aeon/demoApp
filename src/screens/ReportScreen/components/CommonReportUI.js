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
  Platform,
} from 'react-native';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors';
import { isArrayLength } from '../../../utils/ValidationUtils';
import MyImages from '../../../utils/MyImages';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { IOS_PLATFORM, LARGE_LOADER } from '../../../constants/MainConstant';
import { REPORT_CONSTANT } from '../constants/ReportConstant';



const {screenWidth, screenHeight} = ScreenDimensions
const CommonReportUI = ({reportData, headers, columnWidths, title, reportFileName, isLoading}) => {
  const {t} = useTranslation();

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
      return Alert.alert(t('ERROR'), t('NO_DATA_MSG'))
    }
    try {
      // Prepare data
      let dataToExport = []
      if (reportData?.[0]?.task){
        dataToExport = reportData?.map((row, index) => ({
          [t('SR_NO')]: index + 1,
          [t('EMPLOYEE_NAME')]: row.name,
          [t('ROLE')]: row.role,
          [t('TASK')]: row.task,
          [t('DESCRIPTION')]: row.description,
          [t('START_DATE')]: row.startdate,
          [t('END_DATE')]: row.enddate,
          [t('STATUS')]: row.status,
          [t('MARKED_BY')]: row.assignBy,
        }));
      }else{
        dataToExport = reportData?.map((row, index) => ({
          [t('SR_NO')]: index + 1,
          [t('EMPLOYEE_NAME')]: row.name,
          [t('ROLE')]: row.role,
          [t('CHECK_IN')]: row.checkin,
          [t('CHECK_OUT')]: row.checkout,
          [t('TOTAL_HOURS')]: row.total_hrs,
          [t('MARKED_BY')]: row.attendanceby,
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
      const filePath =
      Platform.OS === IOS_PLATFORM
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;
      
      // Write file
      await RNFS.writeFile(filePath, wbout, 'base64');

      if (Platform.OS === IOS_PLATFORM) {
      // Share file via iOS share sheet
      await Share.open({
        url: `file://${filePath}`,
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        failOnCancel: false,
      });
    } else {
      Alert.alert(t('SUCCESS'), t('SUCCESS_MSGS'));
    }
    } catch (error) {
      Alert.alert(t('ERROR'), t('ERROR_MSGS'));
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
    <View style={styles.exportContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={downloadExcel}>
          <Text style={styles.buttonText} adjustsFontSizeToFit={true}>{t(REPORT_CONSTANT.EXPORT)}</Text>
        </TouchableOpacity>
      </View>
          {isArrayLength(reportData) ? (
            <ScrollView horizontal>
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
             </ScrollView>
          ) : (
            renderEmptyData()
          )}
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
  exportContainer: {
    flex: 1, 
    marginTop: 30
  },
  buttonContainer: {
    alignItems: 'flex-end'
  },
  button: {
    backgroundColor: Colors.red,
    padding: 10,
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
    marginTop: 10,
    minHeight: screenHeight* 0.5
  },
  noDataIcon: {
    height: 100,
    width: 100,
  }
});

