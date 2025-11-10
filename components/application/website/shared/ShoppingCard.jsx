"use client";

import { RiShoppingBag4Line } from "react-icons/ri";
import { useSelector } from "react-redux";

const ShoppingCard = () => {
  const count = useSelector((state) => state.cartStore.count);
  return (
    <div className="flex relative">
      <RiShoppingBag4Line className="text-2xl" />
      <div className="w-5 h-5 flex justify-center items-center rounded-full bg-red-300 absolute -top-2 left-4 text-[12px] font-bold">
        <span>{count}</span>
      </div>
    </div>
  );
};

export default ShoppingCard;
