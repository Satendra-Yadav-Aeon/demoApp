import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { EMPLOYEE_TASK_CONSTANT } from '../constants/EmployeeTaskConstant';
import Colors from '../../../assets/colors/colors';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';
import CustomImageViewerModal from '../../../common/CustomImageViewerModal';
import { useDeleteTaskAPI } from '../hooks/useDeleteTaskAPI';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const ManageTaskCard = ({ task, onEdit, employee }) => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const { deleteTask } = useDeleteTaskAPI()
  const[taskImageUri, setTaskImageUri] = useState()
  const [taskImageModalVisible, setTaskImageModalVisible] = useState(false);
  const isTaskCompleted = task?.taskStatus === '2';

  useEffect(() => {
    if (task?.imageName) {
      setTaskImageUri(`${BaseConfigUrl.BASE_TASK_IMAGE_URL}${task?.empId}/${task?.imageName}`);
    }
  },[task])

  const handleDeleteMethod = (task) => {
    const deleteData = {
      taskId: task?.taskId,
      empId: task?.empId,
      taskStatus: '3'
    }
    // console.log('===handleDeleteMethod==>>deleteData>>>', deleteData)
    const response = deleteTask(deleteData);
    if(response){
      navigation.goBack();
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {taskImageUri ? (
          <TouchableOpacity onPress={() => setTaskImageModalVisible(true)}>
            <Image source={{ uri: taskImageUri }} style={styles.roundImage} />
          </TouchableOpacity>
        ) : (
          <Image source={MyImages.noPhoto} style={styles.profileIcon} />
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
        <Text style={styles.dataText}>{task?.taskStatusName}</Text>
      </View>
      <View style={styles.deleteRow}>
        {!employee?.admnId && !isTaskCompleted &&(
          <TouchableOpacity onPress={() => handleDeleteMethod(task)}>
            <Image source={MyImages.delete} style={styles.deleteIcon}/>
          </TouchableOpacity>
        )}
      </View>
      <CustomImageViewerModal
        visible={taskImageModalVisible}
        onClose={() => setTaskImageModalVisible(false)}
        imageUri={taskImageUri}
      />
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
  deleteRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginRight: 5,
    padding: 5,
  },
  deleteIcon: {
    height: 35,
    width: 35,
    tintColor: Colors.red_1
  }
});