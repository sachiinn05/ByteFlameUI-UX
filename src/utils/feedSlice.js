import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  page: 0,
  hasMore: true,
  total: 0,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeed: (state, action) => {
      const { data, page, hasMore, total } = action.payload;
      state.users = data;
      state.page = page;
      state.hasMore = hasMore;
      state.total = total;
    },
    appendFeed: (state, action) => {
      const { data, page, hasMore, total } = action.payload;
      const existing = new Set(state.users.map((u) => u._id));
      state.users.push(...data.filter((u) => !existing.has(u._id)));
      state.page = page;
      state.hasMore = hasMore;
      state.total = total;
    },
    removeFromFeedUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    resetFeed: () => initialState,
  },
});

export const { setFeed, appendFeed, removeFromFeedUser, resetFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
