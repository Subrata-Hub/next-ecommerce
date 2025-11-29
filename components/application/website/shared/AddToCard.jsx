"use client";
import { getLocalCartId, setLocalCartId } from "@/lib/helperFunction";
import { showToast } from "@/lib/showToast";
import {
  addProductToCart,
  removeProductToCart,
} from "@/store/slices/cartSlice";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const AddToCard = ({
  quantity,
  setQuantity,
  productId,
  productVariantId,
  setUpdateLoading,
  updateLoading,
  isDiffLoading = false,
}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authStore.auth);

  const handleAddToCardClick = async (actionType) => {
    let currentCartId = getLocalCartId();
    const userId = auth !== null ? auth._id : auth;

    // 1. Determine quantity to send (+1 or -1)
    const quantityToSend = actionType === "add" ? 1 : -1;

    const productData = {
      productId: productId,
      variantId: productVariantId,
      quantity: quantityToSend, // This is +1 or -1
      cartId: currentCartId ? currentCartId : null,
      userId: userId,
    };

    // --- Start: Optimistic UI & Redux Update ---
    if (actionType === "add") {
      setQuantity((prev) => prev + 1);
      dispatch(addProductToCart({ ...productData, quantity: 1 }));
    } else {
      if (quantity > 0) {
        setQuantity((prev) => prev - 1);
        dispatch(removeProductToCart({ ...productData, quantity: 1 }));
      } else {
        return; // Don't proceed if local quantity is 0
      }
    }
    // --- End: Optimistic UI & Redux Update ---

    try {
      setUpdateLoading(true);
      // 2. API Call (Consolidated)
      const { data: response } = await axios.post(
        "/api/cart/addToCart",
        productData
      );

      // setUpdateLoading(false);

      if (!response.success) {
        // If API fails, throw error for catch block
        throw new Error(response.message);
        // setUpdateLoading(false);
      }

      // 3. SAVE CART ID (Crucial for new guest carts)
      if (response.data && response.data.cartId) {
        setLocalCartId(response.data.cartId);
      }
      setUpdateLoading(false);

      showToast("success", response.message || "Cart updated successfully");
    } catch (error) {
      console.error(error);
      // setUpdateLoading(false);
      showToast("error", error.message || "Failed to update cart");

      // 4. Rollback State if API fails
      // Note: We use the opposite action to revert the optimistic update

      if (actionType === "add") {
        setQuantity((prev) => prev - 1);
        dispatch(removeProductToCart({ ...productData, quantity: 1 }));
      } else if (quantity > 0) {
        setQuantity((prev) => prev + 1);
        dispatch(addProductToCart({ ...productData, quantity: 1 }));
      }
    } finally {
      setUpdateLoading(false); // ADDED: Guaranteed loading cleanup
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4">
      <button
        type="button"
        className="h-full w-10 justify-center items-center mr-3"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCardClick("remove");
        }}
        disabled={updateLoading}
      >
        {updateLoading && isDiffLoading ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <FiMinus />
        )}
      </button>
      <span className="flex-1 text-center font-medium">{quantity}</span>
      <button
        type="button"
        className="h-full w-10 justify-center items-center ml-4"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCardClick("add");
        }}
        disabled={updateLoading}
      >
        {updateLoading && isDiffLoading ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <FiPlus className="" />
        )}
      </button>
    </div>
  );
};

export default AddToCard;
