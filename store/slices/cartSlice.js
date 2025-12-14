import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  count: 0,
  products: [],
  selectedVariant: {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const payload = action.payload;
      const existingProduct = state.products.find(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId
      );
      if (existingProduct) {
        existingProduct.quantity += payload.quantity;
      } else {
        state.products.push(payload);
      }
      state.count += payload.quantity;
    },

    addVariant: (state, action) => {
      state.selectedVariant = action.payload;
    },

    removeProductToCart: (state, action) => {
      const payload = action.payload;

      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId
      );

      // If product not found, do nothing
      if (productIndex === -1) {
        return;
      }

      const productToRemove = state.products[productIndex];

      if (productToRemove.quantity === payload.quantity) {
        state.count = Math.max(0, state.count - productToRemove.quantity);
        state.products.splice(productIndex, 1);
      } else {
        if (productToRemove.quantity <= 0) {
          // state.count = Math.max(0, state.count - productToRemove.quantity);
          state.products.splice(productIndex, 1);
        }

        productToRemove.quantity -= 1;
        // Decrement the total cart count by one
        state.count = Math.max(0, state.count - 1);
      }
    },

    clearCart: (state, action) => {
      state.products = [];
      state.count = 0;
    },

    updateInitialState: (state, action) => {
      state.products = action.payload.products;
      state.count = action.payload.count;
    },
  },
});

export const {
  addProductToCart,
  removeProductToCart,
  addVariant,
  clearCart,
  updateInitialState,
} = cartSlice.actions;
export default cartSlice.reducer;
