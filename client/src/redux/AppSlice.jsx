import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterDataValues: {},
  isOnEditMode: false,
  workflowId: null,
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
    setIsOnEditMode: (state, action) => {
      state.isOnEditMode = action.payload;
    },
    setWorkflowId: (state, action) => {
      state.workflowId = action.payload;
    },
  },
});

export const { setFilterDataValue, clearFilterDataValues, setIsOnEditMode, setWorkflowId } = appDataSlice.actions;

// add a function to access store

export const getAppData = (state) => state.appData;

export default appDataSlice.reducer;
