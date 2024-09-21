import appReducer from "./appReducer";
import { combineReducers, applyMiddleware } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authReducer from "./authReducer";

const commonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

const authConfig = {
  ...commonConfig,
  key: "auth",
  whitelist: ["isLoggedin", "access_token"],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: persistReducer(authConfig, authReducer),
});

export default rootReducer;
