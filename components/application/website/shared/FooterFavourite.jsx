"use client";
import { updateInitialState } from "@/store/slices/favouriteSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const FooterFavourite = ({ favourites }) => {
  const dispatch = useDispatch();
  //   console.log(favourites);
  const favouriteProducts = useSelector(
    (store) => store.favouriteStore.favouriteProducts
  );

  useEffect(() => {
    if (favourites) {
      localStorage.setItem("publicUserId", favourites.publicUserId);

      dispatch(
        updateInitialState({
          publicUserId: favourites.publicUserId,
          favouriteProducts: favourites.products,
        })
      );
    }
  }, [favourites]);
  return (
    <Link href="/my-account?tab=wishlist">
      <div className="relative ">
        <MdFavoriteBorder className="text-2xl" />

        <div className="absolute bottom-3 left-5 w-5 h-5 rounded-full bg-red-300 z-[50]">
          <div className="flex justify-center items-center text-[12px] font-semibold">
            {" "}
            {favouriteProducts?.length}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FooterFavourite;
