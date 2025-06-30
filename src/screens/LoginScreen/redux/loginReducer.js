import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./loginTypes";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
  error: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, isLoading: false, user: action.payload, isLoggedIn: true, };
    case LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case LOGOUT_SUCCESS:
    return { ...state, user: null, isLoading: false, isLoggedIn: false, };
    default:
      return state;
  }
};

export default loginReducer;