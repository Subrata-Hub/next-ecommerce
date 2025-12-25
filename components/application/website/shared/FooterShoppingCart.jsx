"use client";
import { WEBSITE_CART } from "@/routes/WebsiteRoutes";
import { updateInitialState } from "@/store/slices/cartSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { RiShoppingBag4Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const FooterShoppingCart = ({ cart }) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const count = cartStore.count;

  useEffect(() => {
    if (cart) {
      dispatch(
        updateInitialState({
          products: cart?.cartItems,
          count: cart?.totalItem,
        })
      );
      localStorage.setItem("cartId", cart?._id);
    }
  }, [cart]);
  return (
    <div>
      <Link href={WEBSITE_CART}>
        <div className="flex relative">
          <RiShoppingBag4Line className="text-2xl" />
          <div className="w-5 h-5 flex justify-center items-center rounded-full bg-red-300 absolute -top-2 left-4 text-[12px] font-bold ">
            <span>{count}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FooterShoppingCart;
