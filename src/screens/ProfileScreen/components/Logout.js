import { Text, StyleSheet, TouchableOpacity, Alert, View } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Colors from '../../../assets/colors/colors'
import ScreenDimensions from '../../../utils/DimensionUtils'
import { removeAsyncItem } from '../../../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import { logoutSuccess } from '../../LoginScreen/redux/loginAction'
import { LOGOUT_CONSTANT } from '../constants/ProfileConstant'

const {screenWidth, screenHeight} = ScreenDimensions
const Logout = () => {
  const dispatch = useDispatch(); 
  const { t } = useTranslation();

  const handleLogout = () => {
  Alert.alert(
    t(LOGOUT_CONSTANT.CONFIRM_LABEL),
    t(LOGOUT_CONSTANT.LOGOUT_LABEL),
    [
      {
        text: t(LOGOUT_CONSTANT.CANCEL_TEXT),
        style: LOGOUT_CONSTANT.CANCEL_STYLE
      },
      {
        text: t(LOGOUT_CONSTANT.YES_TEXT),
        onPress: () => confirmLogout()
      }
    ],
    { cancelable: true }
  );
};

const confirmLogout = async () => {
  try {
    await removeAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    dispatch(logoutSuccess());
  } catch (err) {
    // console.error('===Logout===>>failed>>>>>', err);
  }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t(LOGOUT_CONSTANT.LOG_OUT_TEXT)}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Logout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    width: screenWidth*0.4,
    height: screenHeight* 0.06,
    position: 'absolute',
    bottom: 20,
    backgroundColor: Colors.red,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7

  },
  logoutText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white
  }
})