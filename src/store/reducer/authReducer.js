import actionType from "../action/actionType";

const initState = {
  isLoggedIn: false,
  access_token: null,
};

const authReducer = (state = initState, action) => {
  console.log("Previous State: ", state);
  console.log("Action: ", action);
  switch (action.type) {
    case actionType.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: action.data ? true : false,
        access_token: action.data,
      };
    case actionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        access_token: null,
      };
    default:
      return state;
  }
};

export default authReducer;
