import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { ADD_EMPLOYEE_TITLE, ADDRESS_CONSTANT, JOINIG_DATE_CONSTANT, LEAVING_DATE_CONSTANT, MANAGE_EMPLOYEE_CONSTANT, MOBILE_CONSTANT, NAME_CONSTANT, NUMBER_KEYPAD, REPORTING_MANAGER_CONSTANT, ROLE_CONSTANT, UPDATE_EMPLOYEE_TITLE } from '../constants/ManageEmployeeConstant';
import ScreenDimensions from '../../../utils/DimensionUtils';
import CustomTextInput from '../../../common/CustomTextInput';
import CustomDropdown from '../../../common/CustomDropdown';
import CustomDatePicker from '../../../common/CustomDatePicker';
import useEmployeeRole from '../hooks/useEmployeeRole';
import useAdminRoleLists from '../hooks/useAdminRoleLists';
import useSupervisorRoleLists from '../hooks/useSupervisorRoleLists';
import { useSaveEmployee } from '../hooks/useSaveEmployee';
import { ROLES, SMALL_LOADER } from '../../../constants/MainConstant';
import { SUBMIT_BUTTON_TEXT } from '../../LoginScreen/constants/LoginConstant';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { formatDate } from '../../../utils/formatDateUtils';

const { screenWidth, screenHeight } = ScreenDimensions;
const ManageEmployeeForm = () => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const { employeeRole } = useEmployeeRole();
  const { adminList } = useAdminRoleLists();
  const { saveEmployee, isLoading } = useSaveEmployee();
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      [NAME_CONSTANT.NAME]: '',
      [MOBILE_CONSTANT.NAME]: '',
      [ROLE_CONSTANT.NAME]: '',
      [REPORTING_MANAGER_CONSTANT.NAME]: '',
      [JOINIG_DATE_CONSTANT.NAME]: '',
      [LEAVING_DATE_CONSTANT.NAME]: '',
      [ADDRESS_CONSTANT.NAME]: '',
    }
  });

  const route = useRoute();
  const { mode, employee } = route.params || {};

  const [selectedRoleName, setSelectedRoleName] = React.useState('');
  const[employeeData, setEmployeeData] = useState({})
  const { supervisorList, refetchSupervisorList } = useSupervisorRoleLists();
  const selectedRoleId = useWatch({
    control,
    name: ROLE_CONSTANT.NAME,
  });
  // console.log('===ManageEmployeeForm======employeeData>>>>>>',employeeData);
  // console.log('===ManageEmployeeForm======supervisorList>>>>>>',supervisorList);
  

  const roleOptions = employeeRole?.map(role => ({
    label: role.rolename, 
    value: role.roleid,
  }));

  const adminListOptions = adminList?.map(a => ({ label: a.rolename, value: a.roleid }));
  const supervisorListOptions = supervisorList?.map(s => ({ label: s.rolename, value: s.roleid }));

  const filteredAdminList = adminListOptions?.filter(
  (admin) => admin.value === employeeData?.empid
);

  // console.log('===ManageEmployeeForm======filteredAdminList>>>>>>',filteredAdminList);

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useEffect(() => {
    if (
      mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && 
      employee &&
      employeeRole?.length
    ) {
      // Match by role name, not roleid
      const matchedRole = employeeRole?.find(role => role.rolename === employee.rolename);
      const roleId = matchedRole?.roleid;

      // Reset the form with correct roleId
      reset({
        [NAME_CONSTANT.NAME]: employee?.empname || '',
        [MOBILE_CONSTANT.NAME]: employee?.mobileno || '',
        [ROLE_CONSTANT.NAME]: roleId || '',
        [REPORTING_MANAGER_CONSTANT.NAME]: (() => {
          const matchFromSupervisorList = supervisorList?.find(s => s.rolename === employee?.repomanager);
          const matchFromAdminList = adminList?.find(a => a.rolename === employee?.repomanager);
          return matchFromSupervisorList?.roleid || matchFromAdminList?.roleid || '';
        })(),
        [JOINIG_DATE_CONSTANT.NAME]:  formatDate(employee?.joiningdate)  || '',
        [LEAVING_DATE_CONSTANT.NAME]: formatDate(employee?.leavingdate) || '',
        [ADDRESS_CONSTANT.NAME]: employee?.address || '',
      });

      // Set role name for conditional rendering
      setSelectedRoleName(employee.role);
    }
  }, [mode, employee, employeeRole, reset]);




  useEffect(() => {
    const selectedRole = employeeRole?.find(role => role.roleid === selectedRoleId);
    if (selectedRole) {
      setSelectedRoleName(selectedRole.rolename);
    }
  }, [selectedRoleId, employeeRole]);

  useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid) {
        refetchSupervisorList({empid: employeeData?.empid});
      }
    }, [employeeData?.empid])
  );

  const onSubmit = (data) => {
    const saveData = {
      empid: '',
      empname: data?.name,
      mobile: data?.mobile,  
      role: data?.role,
      repomanager: data?.reportingManager,
      joiningdate: data?.joiningDate,
      leavingdate: data?.leavingDate,
      address: data?.address,
      photo: ' ',
      adminId: employeeData?.empid
    }
     if (mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && employee?.empid) {
      saveData.empid = employee?.empid;
    }
    console.log('==onSubmit====ManageEmployeeForm==>saveData>>>>',saveData);
    const response = saveEmployee(saveData);
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
        <Text style={styles.title}>{mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE ? t(UPDATE_EMPLOYEE_TITLE) : t(ADD_EMPLOYEE_TITLE)}</Text>
      </View>
      <View style={styles.secondHalf}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
        <Controller
          control={control}
          name={NAME_CONSTANT.NAME}
          rules={{
            required: t(NAME_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(NAME_CONSTANT.PLACEHOLDER)}
              label={t(NAME_CONSTANT.LABEL)}
              maxLength={60}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />  
        <Controller
          control={control}
          name={MOBILE_CONSTANT.NAME}
          rules={{
            required: t(MOBILE_CONSTANT.REQUIRED_ERROR),
            pattern: {
              value: MOBILE_CONSTANT.PATTERN_1,
              message: t(MOBILE_CONSTANT.PATTERN_ERROR),
            },
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(MOBILE_CONSTANT.PLACEHOLDER)}
              label={t(MOBILE_CONSTANT.LABEL)}
              maxLength={10}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              keyboardType={NUMBER_KEYPAD}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={ROLE_CONSTANT.NAME}
          rules={{ required: t(ROLE_CONSTANT.REQUIRED_ERROR) }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CustomDropdown
              label={t(ROLE_CONSTANT.LABEL)}
              value={value}
              onChange={onChange}
              options={roleOptions}
              error={error?.message}
              placeholder={t(ROLE_CONSTANT.PLACEHOLDER)}
            />
          )}
        />
        {(selectedRoleName === ROLES.EMPLOYEE || selectedRoleName === ROLES.SUPERVISOR) && (
          <Controller
            control={control}
            name={REPORTING_MANAGER_CONSTANT.NAME}
            rules={{ required: t(REPORTING_MANAGER_CONSTANT.REQUIRED_ERROR) }}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              const options =
                selectedRoleName === ROLES.EMPLOYEE
                  ? supervisorListOptions
                  : selectedRoleName === ROLES.SUPERVISOR
                  ? filteredAdminList
                  : [];

              return (
                <CustomDropdown
                  label={t(REPORTING_MANAGER_CONSTANT.LABEL)}
                  value={value}
                  onChange={onChange}
                  options={options}
                  error={error?.message}
                  placeholder={t(REPORTING_MANAGER_CONSTANT.PLACEHOLDER)}
                />
              );
            }}
          />
        )}

        <Controller
          control={control}
          name={JOINIG_DATE_CONSTANT.NAME}
          rules={{ required: t(JOINIG_DATE_CONSTANT.REQUIRED_ERROR) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDatePicker
              label={t(JOINIG_DATE_CONSTANT.LABEL)}
              value={value}
              onChange={onChange}
              error={error?.message}
              minimumDate={new Date()}
              placeholder={t(JOINIG_DATE_CONSTANT.PLACEHOLDER)}
            />
          )}
        />
        {mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && (
          <Controller
          control={control}
          name={LEAVING_DATE_CONSTANT.NAME}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDatePicker
              label={t(LEAVING_DATE_CONSTANT.LABEL)}
              value={value}
              onChange={onChange}
              error={error?.message}
              placeholder={t(LEAVING_DATE_CONSTANT.PLACEHOLDER)}
            />
          )}
        />
        )}
        <Controller
          control={control}
          name={ADDRESS_CONSTANT.NAME}
          rules={{
            required: t(ADDRESS_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(ADDRESS_CONSTANT.PLACEHOLDER)}
              label={t(ADDRESS_CONSTANT.LABEL)}
              maxLength={250}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />
        </KeyboardAwareScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={SMALL_LOADER} color={Colors.white}/>
            ) : (
              <Text style={styles.submitText}>{t(SUBMIT_BUTTON_TEXT)}</Text>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageEmployeeForm;

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
});