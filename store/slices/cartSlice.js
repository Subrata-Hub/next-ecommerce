import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  count: 0,
  products: [],
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

    removeProductToCart: (state, action) => {
      const payload = action.payload;

      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId
      );

      if (productIndex !== -1) {
        const productToRemove = state.products[productIndex]; // Decrement quantity
        productToRemove.quantity -= 1; // Assuming you remove one item at a time // If quantity drops to zero, remove the product entirely from the array

        if (productToRemove.quantity <= 0) {
          state.products.splice(productIndex, 1);
        } // Decrement the total count

        state.count = Math.max(0, state.count - 1);
      }
    },
    clearCart: (state, action) => {
      state.products = [];
      state.count = 0;
    },
  },
});

export const { addProductToCart, removeProductToCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
