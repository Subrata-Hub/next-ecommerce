import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    cacheResults: (state, action) => {
      state = Object.assign(state, action.payload);
    },

    clearStore: (state, action) => {
      return {};
    },
  },
});

export const { cacheResults, clearStore } = searchSlice.actions;

export default searchSlice.reducer;
