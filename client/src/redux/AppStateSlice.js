import { createSlice } from "@reduxjs/toolkit";
/**
 * interface
 */

const initialState = {
  work_flows_ids: [],
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    saveWorkFlowsIds: (state, action) => {
      console.log(action.payload, "payload");
      state.work_flows_ids = action.payload;
    },
  },
});

export const { saveWorkFlowsIds } = appStateSlice.actions;
export const appDataInStore = (state) => state.appState;
export default appStateSlice.reducer;
