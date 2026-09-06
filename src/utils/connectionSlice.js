
import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [], // ✅ should always be an array
  reducers: {
    addConnections: (state, action) => {
      return action.payload || [];
    },
    removeConnection: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },
    removeConnections: () => {
      return [];
    },
  },
});

export const { addConnections, removeConnection, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
