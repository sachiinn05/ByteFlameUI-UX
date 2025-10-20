// import { createSlice } from "@reduxjs/toolkit";

// const connectionSlice = createSlice({
//   name: "connections",
//   initialState: null,   // ✅ array not null
//   reducers: {
//     addConnections: (state, action) => {
         
//       return action.payload; // replace old with new data
//     },
//    removeConnection: () => {
      
//       return null;
//     },
//   }
// });

// export const { addConnections, removeConnection } = connectionSlice.actions;
// export default connectionSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [], // ✅ should always be an array
  reducers: {
    addConnections: (state, action) => {
      return action.payload || []; // replace state with latest data
    },
    removeConnections: () => {
      return []; // reset to empty list
    },
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
