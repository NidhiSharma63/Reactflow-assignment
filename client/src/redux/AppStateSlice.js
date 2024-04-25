import { createSlice } from "@reduxjs/toolkit";
/**
 * interface
 */

const initialState = {
  workFlowsIds: [],
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    saveWorkFlowsIds: (state, action) => {
      state.workFlowsIds = action.payload;
    },
  },
});

export const { userEmail } = appStateSlice.actions;
export const appDataInStore = (state) => state.appState;
export default appStateSlice.reducer;
