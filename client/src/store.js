import { configureStore } from "@reduxjs/toolkit";
import appDataReducer from "./redux/AppSlice";

const store = configureStore({
  reducer: {
    appData: appDataReducer,
  },
});

export default store;
