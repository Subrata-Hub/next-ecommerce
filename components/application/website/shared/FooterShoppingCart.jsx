"use client";
import { WEBSITE_CART } from "@/routes/WebsiteRoutes";
import Link from "next/link";
import React from "react";
import { RiShoppingBag4Line } from "react-icons/ri";
import { useSelector } from "react-redux";

const FooterShoppingCart = () => {
  const cartStore = useSelector((state) => state.cartStore);
  const count = cartStore.count;
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
