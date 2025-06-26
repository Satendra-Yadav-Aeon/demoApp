import { all } from "redux-saga/effects";
import loginSaga from "../screens/LoginScreen/redux/loginSaga";

export default function* rootSaga() {
  yield all([loginSaga()]);
}