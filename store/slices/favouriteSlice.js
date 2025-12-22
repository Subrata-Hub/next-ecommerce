import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publicUserId: "",
  favouriteProducts: [],
};

export const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      state.publicUserId = action.payload.publicUserId;

      const productIndex = state.favouriteProducts.findIndex(
        (product) => product._id === action.payload.product._id
      );

      if (productIndex === -1) {
        state.favouriteProducts.push(action.payload.product);
      } else {
        return;
      }
    },

    removeFromFavourites: (state, action) => {
      state.publicUserId = action.payload.publicUserId;

      const productIndex = state.favouriteProducts.findIndex(
        (product) => product._id === action.payload.product._id
      );

      if (productIndex === -1) {
        return;
      }
      state.favouriteProducts.splice(productIndex, 1);
    },

    updateInitialState: (state, action) => {
      state.publicUserId = action.payload.publicUserId;
      state.favouriteProducts = action.payload.favouriteProducts;
    },
  },
});

export const { addToFavourites, removeFromFavourites, updateInitialState } =
  favouriteSlice.actions;
export default favouriteSlice.reducer;
