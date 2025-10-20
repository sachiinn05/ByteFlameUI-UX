// import { configureStore} from "@reduxjs/toolkit";
// import userReducer from "./userSlice"
// import feedReducer from "./feedSlice"
// import connectionReducre from"./connectionSlice"
// const appStore=configureStore({
//     reducer:{
//         user:userReducer,
//         feed:feedReducer,
//         connection:connectionReducre,
//     },
// })
// export default appStore;
import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./connectionSlice";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer, // ✅ fixed (plural)
    requests: requestReducer,
  },
});

export default appStore;

