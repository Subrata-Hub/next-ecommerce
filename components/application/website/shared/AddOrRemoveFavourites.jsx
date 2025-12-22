"use client";
import { showToast } from "@/lib/showToast";
import { cn } from "@/lib/utils";
import { setLoginPopup } from "@/store/slices/authSlice";
import {
  addToFavourites,
  removeFromFavourites,
} from "@/store/slices/favouriteSlice";
import axios from "axios";
import React from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const getLocalUserPublicId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("publicUserId");
  }
  return null;
};

const AddOrRemoveFavourites = ({ product, className }) => {
  const dispatch = useDispatch();

  const publicUserId = getLocalUserPublicId();

  const favouriteProducts = useSelector(
    (store) => store.favouriteStore.favouriteProducts
  );

  const publicgUser = useSelector((store) => store.favouriteStore.publicUserId);

  const isFavourite = favouriteProducts?.some(
    (prod) => prod?._id === product._id && publicgUser === publicUserId
  );
  const handleFavourite = async () => {
    if (!publicUserId) {
      dispatch(setLoginPopup(true));
    } else {
      const favouriteProduct = {
        publicUserId: publicUserId,
        product: product,
      };
      if (!isFavourite) {
        // setIsFavourite(true);

        dispatch(addToFavourites(favouriteProduct));

        try {
          const response = await axios.post(`/api/favourites/addToFavourite`, {
            publicUserId: publicUserId,
            productId: product._id,
          });

          console.log(response.data);

          if (response.data.success) {
            showToast("success", "Addes to favourites");
          }
        } catch (error) {
          console.log("Added Failed", error);
          // Remove from Redux if API fails (Rollback)
          dispatch(removeFromFavourites(favouriteProduct));
        }
      } else {
        // setIsFavourite(false);

        dispatch(removeFromFavourites(favouriteProduct));

        try {
          const response = await axios.delete(
            `/api/favourites/removeFromFavourite/${product._id}`
          );

          console.log(response.data);

          if (response.data.success) {
            showToast("success", "Remove from favourites");
          }
        } catch (error) {
          console.log("Remove failed", error);
          // Re-add to Redux if API fails (Rollback)
          dispatch(addToFavourites(favouriteProduct));
        }
      }
    }
  };
  return (
    <div
      className="w-8 h-8 rounded-full bg-white/90 shadow-sm z-10 flex justify-center items-center cursor-pointer hover:text-red-500"
      onClick={handleFavourite}
    >
      {isFavourite ? (
        <MdFavorite className={cn("text-red-500", className)} />
      ) : (
        <MdFavoriteBorder className={cn("", className)} />
      )}
      {/*  */}
    </div>
  );
};

export default AddOrRemoveFavourites;
