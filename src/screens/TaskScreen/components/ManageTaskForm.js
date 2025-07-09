import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next'
import ScreenDimensions from '../../../utils/DimensionUtils';
import { ADD_TASK_TITLE, END_DATE_CONSTANT, START_DATE_CONSTANT, TASK_DESCRIPTION_CONSTANT, TASK_NAME_CONSTANT, TASK_PHOTO_CONSTANT, UPDATE_TASK_TITLE } from '../constants/EmployeeTaskConstant';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { MANAGE_EMPLOYEE_CONSTANT } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import MyImages from '../../../utils/MyImages';
import { DATE_TIME_MODE, SCREENS, SMALL_LOADER } from '../../../constants/MainConstant';
import Colors from '../../../assets/colors/colors';
import { SUBMIT_BUTTON_TEXT } from '../../LoginScreen/constants/LoginConstant';
import CustomTextInput from '../../../common/CustomTextInput';
import CustomDatePicker from '../../../common/CustomDatePicker';
import { useSaveTaskAPI } from '../hooks/useSaveTaskAPI';
import imageNameUtils from '../../../utils/imageNameUtils';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';

const { screenWidth, screenHeight } = ScreenDimensions;
const ManageTaskForm = () => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const route = useRoute();
  const { mode, task, attendanceSelf, employee} = route.params || {};
  const { saveTask, isLoading } = useSaveTaskAPI();
  const[employeeData, setEmployeeData] = useState({})
  const isTaskCompleted = task?.taskStatus === '2';
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      [TASK_NAME_CONSTANT.NAME]: '',
      [TASK_DESCRIPTION_CONSTANT.NAME]: '',
      [START_DATE_CONSTANT.NAME]: '',
      [END_DATE_CONSTANT.NAME]: '',
      [TASK_PHOTO_CONSTANT.NAME]: '',
    }
  });

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      const loadTaskImage = async () => {
        if (!employeeData?.empid) return;

        const key = `${ASYNC_CONSTANT.TASK_IMGAE}_${task?.taskId}`;
        const capturedUri = await getAsyncItem(key);
        // console.log('====ManageTaskForm===>>capturedUri>>>>>>', capturedUri);
        if (mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE) {
          if (task?.imageName) {
            const backendUri = `${BaseConfigUrl.BASE_TASK_IMAGE_URL}${task?.empId}/${task?.imageName}`;
            setValue(TASK_PHOTO_CONSTANT.NAME, backendUri);
          } else if (capturedUri) {
            setValue(TASK_PHOTO_CONSTANT.NAME, capturedUri);
          } else {
            setValue(TASK_PHOTO_CONSTANT.NAME, '');
          }
        } else if (mode === MANAGE_EMPLOYEE_CONSTANT.ADD_MODE) {
          if (capturedUri) {
            setValue(TASK_PHOTO_CONSTANT.NAME, capturedUri);
          } else {
            setValue(TASK_PHOTO_CONSTANT.NAME, '');
          }
        }
      };

      loadTaskImage();
    }, [employeeData, mode, task?.imageName])
);

  // console.log('===ManageTaskForm======employeeData>>>>>>',employeeData);
  // console.log('====ManageTaskForm====>task>>>>',task);
  // console.log('====ManageTaskForm====>isTaskCompleted>>>>',isTaskCompleted);

  useEffect(() => {
    if (
      mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && 
      task
    ) {
      // Reset the form with correct roleId
      reset({
        [TASK_NAME_CONSTANT.NAME]: task?.taskName || '',
        [TASK_DESCRIPTION_CONSTANT.NAME]: task?.taskDesc || '',
        [START_DATE_CONSTANT.NAME]: task?.startDatetime || '',
        [END_DATE_CONSTANT.NAME]:  task?.endDatetime  || '',
        [TASK_PHOTO_CONSTANT.NAME]:  task?.imageName  || '',
      });
    }
  }, [mode, task, reset]);

  const onSubmit = (data) => {
    // console.log('==onSubmit====ManageTaskForm==>data>>>>',data);
    const empId = attendanceSelf ? employeeData?.empid : employee?.userId;
    const roleId = attendanceSelf ? employeeData?.role : employee?.roleId;
    const photoUri = data?.photo || '';
    const photoName = data?.photo ? imageNameUtils(employeeData?.empid) : '';
    const saveData = {
      taskId: task?.taskId || 0,
      empId: task?.empId || empId,
      roleId: roleId,
      taskName: data?.title,  
      taskDesc: data?.description,
      startDatetime: data?.startDate,
      endDatetime: data?.endDate || '',
      imgfile: photoUri,
      imageName: photoName,
      taskStatus: data?.endDate ? 2 : 1,
      taskMode: attendanceSelf ? 1 : 2,
      assignBy: attendanceSelf ? 'Self' : employeeData?.empid
    }
    // console.log('==onSubmit====ManageTaskForm==>saveData>>>>',saveData);
    const response = saveTask(saveData);
    if(response){
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE ? t(UPDATE_TASK_TITLE) : t(ADD_TASK_TITLE)}</Text>
      </View>
      <View style={styles.secondHalf}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
        <Controller
          control={control}
          name={TASK_NAME_CONSTANT.NAME}
          rules={{
            required: t(TASK_NAME_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(TASK_NAME_CONSTANT.PLACEHOLDER)}
              label={t(TASK_NAME_CONSTANT.LABEL)}
              maxLength={60}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
              disabled={isTaskCompleted}
            />
          )}
        />
        <Controller
          control={control}
          name={TASK_DESCRIPTION_CONSTANT.NAME}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(TASK_DESCRIPTION_CONSTANT.PLACEHOLDER)}
              label={t(TASK_DESCRIPTION_CONSTANT.LABEL)}
              maxLength={300}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
              disabled={isTaskCompleted}
            />
          )}
        />
        <Controller
          control={control}
          name={START_DATE_CONSTANT.NAME}
          rules={{ required: t(START_DATE_CONSTANT.REQUIRED_ERROR) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDatePicker
              label={t(START_DATE_CONSTANT.LABEL)}
              value={value}
              onChange={onChange}
              error={error?.message}
              minimumDate={new Date()}
              placeholder={t(START_DATE_CONSTANT.PLACEHOLDER)}
              mode={DATE_TIME_MODE}
              disabled={isTaskCompleted}
            />
          )}
        />
        {mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && (
          <Controller
          control={control}
          name={END_DATE_CONSTANT.NAME}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDatePicker
              label={t(END_DATE_CONSTANT.LABEL)}
              value={value}
              onChange={onChange}
              error={error?.message}
              placeholder={t(END_DATE_CONSTANT.PLACEHOLDER)}
              mode={DATE_TIME_MODE}
              disabled={isTaskCompleted}
            />
          )}
        />
        )}
        {mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && (
          <Controller
            control={control}
            name={TASK_PHOTO_CONSTANT.NAME}
            render={({ field: { onChange, value } }) => (
              <View style={styles.photoFieldContainer}>
                <Text style={styles.inputLabel}>{t(TASK_PHOTO_CONSTANT.LABEL)}</Text>
                
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(SCREENS.CAPTURE_IMAGE, {
                      task,
                      mode: 'task_mode',
                    });
                  }}
                  style={styles.imagePickerContainer}
                  disabled={isTaskCompleted}
                >
                  {value ? (
                    <Image source={{ uri: value }} style={styles.previewImage} />
                  ) : (
                    <Text style={styles.imagePickerPlaceholder}>
                      {t(TASK_PHOTO_CONSTANT.PLACEHOLDER)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        </KeyboardAwareScrollView>
        {!isTaskCompleted && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={SMALL_LOADER} color={Colors.white}/>
            ) : (
              <Text style={styles.submitText}>{t(SUBMIT_BUTTON_TEXT)}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ManageTaskForm;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Colors.red,
  },
  firstHalf: {
    flex:1,
    backgroundColor: Colors.red,
    justifyContent: 'center',
  },
  secondHalf: {
    flex:5,
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderColor: Colors.bgColor,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
    marginLeft: 10,
  },  
  scrollContainer: {
    marginTop: 20,
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 17
  },
  input: {
    height: 50,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  submitButton: {
    width: screenWidth * 0.90,
    backgroundColor: Colors.red,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 20
  },
  submitText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputText: {
    borderWidth:1,
    width: screenWidth * 0.90,
    margin: 20,
    padding:10,
    height: screenHeight * 0.06,
    borderRadius:4,
    fontSize: 18,
    color: Colors.black
  },
  errorText: {
    color: Colors.red,
    marginLeft: 20,
    marginBottom:10
  },
  photoFieldContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 18, 
    color: Colors.black,
    marginBottom: 4, 
    fontWeight: 'bold'
  },

  imagePickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    backgroundColor: Colors.bgColor,
  },

  imagePickerPlaceholder: {
    color: Colors.grey,
    fontSize: 16,
  },

  previewImage: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.25,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});