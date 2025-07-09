import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { EMPLOYEE_TASK_CONSTANT } from '../constants/EmployeeTaskConstant';
import { formatDate } from '../../../utils/formatDateUtils';
import Colors from '../../../assets/colors/colors';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const ManageTaskCard = ({ task, onEdit, employee }) => {
  const {t} = useTranslation()
  const[taskImageUri, setTaskImageUri] = useState()

  useEffect(() => {
    if (task?.imageName) {
      setTaskImageUri(`${BaseConfigUrl.BASE_TASK_IMAGE_URL}${task?.empId}/${task?.imageName}`);
    }
  },[task])

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {taskImageUri ? (
          <Image source={{uri: taskImageUri}} style={styles.roundImage}/>
        ): (
          <Image source={MyImages.noPhoto} style={styles.profileIcon}/>
        )}
        {!employee?.admnId && (
          <TouchableOpacity onPress={() => onEdit(task)}>
            <Image source={MyImages.edit} style={styles.editIcon}/>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(EMPLOYEE_TASK_CONSTANT.TITLE)}</Text>
        <Text style={styles.dataText}>{task?.taskName}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(EMPLOYEE_TASK_CONSTANT.DESCRIPTION)}</Text>
        <Text style={styles.dataText}>{task?.taskDesc}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(EMPLOYEE_TASK_CONSTANT.START_DATE)}</Text>
        <Text style={styles.dataText}>{task?.startDatetime}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(EMPLOYEE_TASK_CONSTANT.END_DATE)}</Text>
        <Text style={styles.dataText}>{task?.endDatetime}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(EMPLOYEE_TASK_CONSTANT.STATUS)}</Text>
        <Text style={styles.dataText}>{task?.taskStatus}</Text>
      </View>
    </View>
  );
};

export default ManageTaskCard;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 0.5,
    flexWrap: 'wrap',
  },
  dataRow: {
    flexDirection: 'row',
  },
  editIcon: {
    height: 40,
    width: 40,
    tintColor: Colors.grey
  },
  headerText: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '700',
    width: '35%'
  },
  dataText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '700',
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  profileIcon: {
    height: 50,
    width: 50,
  },
});