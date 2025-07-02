import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { PROFILE_CONSTANT } from '../constants/ProfileConstant';
import { SCREENS } from '../../../constants/MainConstant';

const { screenWidth, screenHeight } = ScreenDimensions

const cardWidth = screenWidth * 0.95;
const cardHeight = screenHeight * 0.25

const ProfileCard = ({employee, capturedImageUri}) => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.UPDATE_PROFILE,{employeeData: employee})}>
          <Image source={MyImages.edit} style={styles.editIcon}/>
        </TouchableOpacity>

        <View style={styles.profileRow}>
          <TouchableOpacity style={styles.profileContainer}>
            {capturedImageUri ? (
              <Image source={{uri: capturedImageUri}} style={styles.profileIcon} />
            ) : (
              <Image source={MyImages.profile} style={styles.profileIcon} />
            )}
          </TouchableOpacity>

          <View style={styles.nameRoleContainer}>
            <Text style={styles.employeeName}>{employee?.empname}</Text>
            <Text style={styles.employeeRole}>{employee?.rolename}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: Colors.white}]}>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate(SCREENS.CHANGE_PASSWORD, {employeeData: employee})}>
          <Text style={styles.optionText}>{t(PROFILE_CONSTANT.CHANGE_PASSWORD)}</Text>
          <Image source={MyImages.rightArrow} style={styles.rightArrowIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate(SCREENS.TERMS_CONDITIONS)}>
          <Text style={styles.optionText}>{t(PROFILE_CONSTANT.TERMS_CONDITIONS)}</Text>
          <Image source={MyImages.rightArrow} style={styles.rightArrowIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate(SCREENS.PRIVACY_POLICY)}>
          <Text style={styles.optionText}>{t(PROFILE_CONSTANT.PRIVACY_POLICY)}</Text>
          <Image source={MyImages.rightArrow} style={styles.rightArrowIcon}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    flex: 5,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    padding: 15,
    margin: 10,
    backgroundColor: Colors.red,
    borderRadius: 20,
    elevation: 5,
    marginTop: 40,
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
  },
  profileContainer: {
    backgroundColor: Colors.white,
    width: screenWidth * 0.25,
    height: screenHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: screenWidth * 0.125,
    overflow: 'hidden',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameRoleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  employeeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  employeeRole: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 4,
  },
  editIcon: {
    position: 'absolute',
    right: 5,
    height: 30,
    width: 30,
    tintColor: Colors.white,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    margin: 5,
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey
  },
  rightArrowIcon: {
    height: 20,
    width: 20
  },
  optionText: {
    fontSize: 18,
  }
});