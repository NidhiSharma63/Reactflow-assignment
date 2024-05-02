import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterDataValues: {},
};

const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    setFilterDataValue: (state, action) => {
      const { id, value } = action.payload;
      state.filterDataValues[id] = value;
    },
    clearFilterDataValues: (state) => {
      state.filterDataValues = {};
    },
  },
});

export const { setFilterDataValue, clearFilterDataValues } = appDataSlice.actions;

// add a function to access store

export const getAppData = (state) => state.appData;

export default appDataSlice.reducer;
