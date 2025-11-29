import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,

  loginPopup: false,
  postLoginRedirect: null,
};

export const authSlice = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
    },
    logout: (state, action) => {
      state.auth = null;
    },
    setLoginPopup: (state, action) => {
      state.loginPopup = action.payload;
    },
    setPostLoginRedirect: (state, action) => {
      state.postLoginRedirect = action.payload;
    },
  },
});

export const { login, logout, setLoginPopup, setPostLoginRedirect } =
  authSlice.actions;
export default authSlice.reducer;
