import { call, put, takeLatest } from "redux-saga/effects";
import Toast from "react-native-toast-message";
import { LOGIN_REQUEST } from "./loginTypes";
import { loginFailure, loginSuccess } from "./loginAction";
import { loginService } from "../api/loginService";
import { setAsyncItem } from "../../../utils/AsyncStorage";
import { ASYNC_CONSTANT } from "../../../constants/AsyncConstant";
import { TOAST_MESSAGE } from "../../../constants/MainConstant";
import { LOGIN_MESSAGE } from "../constants/LoginConstant";
import i18n from "../../../../i18n";

function* loginWorkerSaga(action) {
  try {
    const response = yield call(loginService, action.payload);
    yield call(setAsyncItem, ASYNC_CONSTANT.LOGIN_DATA, response);

    Toast.show({
      type: TOAST_MESSAGE.SUCCESS,
      text1: i18n.t(LOGIN_MESSAGE.SUCCESS),
      text2: `${i18n.t(LOGIN_MESSAGE.WELCOME)}, ${response?.username}!`,  
    });
    yield put(loginSuccess(response));
  } catch (error) {
    Toast.show({
      type: TOAST_MESSAGE.ERROR,
      text1: i18n.t(LOGIN_MESSAGE.ERROR),
    });
    yield put(loginFailure(error.response?.data?.message || i18n.t(LOGIN_MESSAGE.ERROR)));
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginWorkerSaga);
}