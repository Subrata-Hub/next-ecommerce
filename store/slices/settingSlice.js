import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddressForm: false,
};

export const settingSlice = createSlice({
  name: "settingStore",
  initialState,
  reducers: {
    setShowAddressForm: (state, action) => {
      state.showAddressForm = action.payload;
    },
  },
});

export const { setShowAddressForm } = settingSlice.actions;
export default settingSlice.reducer;
