import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MyImages from '../../../utils/MyImages'
import { EMPLOYEE_CONSTANT, FROM_DATE_CONSTANT, REPORT_CONSTANT, TO_DATE_CONSTANT } from '../constants/ReportConstant'
import Colors from '../../../assets/colors/colors'
import CustomDropdown from '../../../common/CustomDropdown'
import CustomDatePicker from '../../../common/CustomDatePicker'
import CommonReportUI from './CommonReportUI'
import { useAttendanceReport } from '../hooks/useAttendanceReport'
import { getAsyncItem } from '../../../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import useGetAllEmployee from '../../EmployeeScreen/hooks/useGetAllEmployee'
import useGetSupervisorsEmployeeAPI from '../../AttendanceScreen/hooks/useGetSupervisorsEmployeeAPI'
import { ROLES } from '../../../constants/MainConstant'
import { isArrayLength } from '../../../utils/ValidationUtils'

const AttendanceReport = () => {
  const navigation = useNavigation();
  const {t} = useTranslation()
  const {attendanceData, fetchAttendanceReport, isLoading} = useAttendanceReport()
  const[oepnFilter, setOpenFilter] = useState(false)
  const arrowButton = oepnFilter ? MyImages.upArrow : MyImages.downArrow
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const {manageEmployeeData, refetch} = useGetAllEmployee()
  const {supervisorsEmployeeList, refetchSupervisorEmployeeList} = useGetSupervisorsEmployeeAPI();
  const[employeeData, setEmployeeData] = useState({})

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      if(employeeData?.rolename === ROLES.SUPERVISOR){
        refetchSupervisorEmployeeList({userId: employeeData?.empid});
      }else{
        refetch({admnId: employeeData?.empid});
      }
    }, [employeeData])
  );

  let employeeOptions = []
  if(isArrayLength(manageEmployeeData)){
    employeeOptions = manageEmployeeData?.map(emp => ({
      label: emp?.empname,
      value: emp?.empid
    }))
  }

  if(isArrayLength(supervisorsEmployeeList)){
    employeeOptions = supervisorsEmployeeList?.map(emp => ({
      label: emp?.name,
      value: emp?.userId
    }))
  }

   const headers = [
    t('SR_NO'),
    t('EMPLOYEE_NAME'),
    t('ROLE'),
    t('CHECK_IN'),
    t('CHECK_OUT'),
    t('TOTAL_HOURS'),
    t('MARKED_BY')
  ];

  const columnWidths = [150, 150, 150, 150, 150, 150, 150]

  const handleClearFilters = () => {
    reset({
      employee: '',
      status: '',
      fromDate: '',
      toDate: ''
    })
  }

  const onSubmit = async(data) => {
    const requestData = {
      empid: data?.employee ? data?.employee : null,
      fromdate: data?.fromDate,
      todate: data?.toDate
    }
    setOpenFilter(false)
    // console.log('==AttendanceReport===onSubmit>>>requestData>>',requestData);
    await fetchAttendanceReport(requestData)
  }
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.heading}>{t(REPORT_CONSTANT.ATTENDANCE_REPORT)}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.filterBox}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setOpenFilter(!oepnFilter)}>
          <Text style={styles.fliterTxt} adjustsFontSizeToFit={true}>{t(REPORT_CONSTANT.FILTERS)}</Text>
          <Image source={arrowButton} style={styles.downArrowIcon}/>
        </TouchableOpacity>
        {oepnFilter && (
          <View style={styles.filterContainer}>
            <Controller
              control={control}
              name={EMPLOYEE_CONSTANT.NAME}
              render={({ field: { value, onChange } }) => (
                <CustomDropdown
                  label={t(EMPLOYEE_CONSTANT.LABEL)}
                  value={value}
                  onChange={onChange}
                  options={employeeOptions}
                  placeholder={t(EMPLOYEE_CONSTANT.PLACEHOLDER)}
                  labelStyle={styles.labelStyle}
                />
              )}
            />
            <Controller
              control={control}
              name={FROM_DATE_CONSTANT.NAME}
              rules={{ required: t(FROM_DATE_CONSTANT.REQUIRED_ERROR) }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomDatePicker
                  label={t(FROM_DATE_CONSTANT.LABEL)}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  placeholder={t(FROM_DATE_CONSTANT.PLACEHOLDER)}
                  labelStyle={styles.labelStyle}
                />
              )}
            />
            <Controller
              control={control}
              name={TO_DATE_CONSTANT.NAME}
              rules={{ required: t(TO_DATE_CONSTANT.REQUIRED_ERROR) }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomDatePicker
                  label={t(TO_DATE_CONSTANT.LABEL)}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  placeholder={t(TO_DATE_CONSTANT.PLACEHOLDER)}
                  labelStyle={styles.labelStyle}
                />
              )}
            />
          <View style={styles.filterOptionBtn}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
              <Text style={styles.clearTxt} adjustsFontSizeToFit={true}>{t(REPORT_CONSTANT.CLEAR)}</Text>
            </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.submitTxt} adjustsFontSizeToFit={true}>{t(REPORT_CONSTANT.SUBMIT)}</Text>
            </TouchableOpacity>
          </View>
          </View>
        )}
        </View>
        <CommonReportUI 
          reportData={attendanceData} 
          headers={headers} 
          columnWidths={columnWidths} 
          Title='Attendance Report' 
          reportFileName='Attendance_Report'
          isLoading={isLoading}
        />
      </View>
    </View>
  )
}

export default AttendanceReport

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  headingContainer: {
    marginTop: 30 
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.red,
    marginLeft: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  bodyContainer: {
    flex: 1,
    marginTop: 10
  },
  filterBox: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: Colors.red,
  },
  filterBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fliterTxt: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.black,
    fontWeight: '500',
  },
  downArrowIcon: {
    width: 25,
    height: 25,
    tintColor: Colors.red,
  },
  filterOptionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  clearBtn: {
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: Colors.white,
    padding: 6,
    borderColor: Colors.red,
    margin: 10
  },
  clearTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: Colors.red,
  },
  submitBtn: {
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: Colors.red,
    padding: 6,
    borderColor: Colors.red,
    margin: 10
  },
  submitTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: Colors.white,
  },
  labelStyle: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  }
})  