"use client";
import {
  addProductToCart,
  removeProductToCart,
} from "@/store/slices/cartSlice";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { useDispatch } from "react-redux";
const AddToCard = ({ quantity, setQuantity, productId, productVariantId }) => {
  const dispatch = useDispatch();

  const handleAddToCardClick = (actionType) => {
    const productData = {
      productId: productId,
      variantId: productVariantId, // We always dispatch a quantity of 1 for the click action
      quantity: 1,
    };

    if (actionType === "add") {
      setQuantity((prev) => prev + 1); // Dispatch productData instead of existingProduct
      dispatch(addProductToCart(productData));
    } else {
      // This check should probably prevent decrement if quantity is 1 in the store,
      // but for now we follow the local state check:
      if (quantity !== 1) {
        setQuantity((prev) => prev - 1); // Dispatch productData instead of existingProduct
        dispatch(removeProductToCart(productData));
      }
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4">
      <button
        type="button"
        className="h-full w-10 justify-center items-center "
        onClick={(e) => {
          // <-- Change here
          e.stopPropagation(); // <-- Crucial: Stop event bubbling
          handleAddToCardClick("remove");
        }}
      >
        <FiMinus />
      </button>
      <span>{quantity}</span>
      <button
        type="button"
        className="h-full w-10 justify-center items-center "
        onClick={(e) => {
          // <-- Change here
          e.stopPropagation(); // <-- Crucial: Stop event bubbling
          handleAddToCardClick("add");
        }}
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default AddToCard;
