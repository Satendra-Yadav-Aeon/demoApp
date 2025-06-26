import { combineReducers } from "redux";
import loginReducer from "../screens/LoginScreen/redux/loginReducer";

const rootReducer = combineReducers({
  login: loginReducer
});

export default rootReducer;