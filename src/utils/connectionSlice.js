import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null,   // ✅ array not null
  reducers: {
    addConnections: (state, action) => {
         
      return action.payload; // replace old with new data
    },
   removeConnection: () => {
      
      return null;
    },
  }
});

export const { addConnections, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
