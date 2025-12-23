import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddressForm: false,
  refetchUser: false,
};

export const settingSlice = createSlice({
  name: "settingStore",
  initialState,
  reducers: {
    setShowAddressForm: (state, action) => {
      state.showAddressForm = action.payload;
    },

    setRefetchUser: (state, action) => {
      state.refetchUser = action.payload;
    },
  },
});

export const { setShowAddressForm, setRefetchUser } = settingSlice.actions;
export default settingSlice.reducer;
