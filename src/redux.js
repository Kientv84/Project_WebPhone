import rootReducer from "./store/reducer/rootReducer";
import { createStore, applyMiddleware } from "redux";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";

const reduxConfig = () => {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);
  return { store, persistor };
};

export default reduxConfig;
