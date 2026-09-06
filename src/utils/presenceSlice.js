import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
  name: "presence",
  initialState: {
    onlineUserIds: [],
    unreadByUserId: {},
    typingByUserId: {},
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUserIds = action.payload || [];
    },
    setUserOnline: (state, action) => {
      const id = String(action.payload);
      if (!state.onlineUserIds.includes(id)) state.onlineUserIds.push(id);
    },
    setUserOffline: (state, action) => {
      const id = String(action.payload);
      state.onlineUserIds = state.onlineUserIds.filter((uid) => uid !== id);
    },
    setUnread: (state, action) => {
      const { fromUserId, unreadCount } = action.payload;
      state.unreadByUserId[String(fromUserId)] = unreadCount;
    },
    setUnreadBulk: (state, action) => {
      state.unreadByUserId = { ...state.unreadByUserId, ...action.payload };
    },
    setTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingByUserId[String(userId)] = Boolean(isTyping);
    },
    clearPresence: () => ({
      onlineUserIds: [],
      unreadByUserId: {},
      typingByUserId: {},
    }),
  },
});

export const {
  setOnlineUsers,
  setUserOnline,
  setUserOffline,
  setUnread,
  setUnreadBulk,
  setTyping,
  clearPresence,
} = presenceSlice.actions;

export default presenceSlice.reducer;
