import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null,   // ✅ array not null
  reducers: {
    addConnections: (state, action) => {
         console.log("Dispatched addConnections:", action.payload)
      return action.payload; // replace old with new data
    },
   removeConnection: () => {
      console.log("Dispatched removeConnection");
      return null;
    },
  }
});

export const { addConnections, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
