import { configureStore } from "@reduxjs/toolkit";
import AppStateSlice from "src/redux/AppStateSlice";

const store = configureStore({
  reducer: {
    appState: AppStateSlice,
  },
});

export default store;
