import React from "react";
import { IoHome } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { CgShoppingBag } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import Profile from "../Profile";
import ShoppingCard from "./ShoppingCard";
import Link from "next/link";
import {
  WEBSITE_CART,
  WEBSITE_HOME,
  WEBSITE_MOBILE_CATEGORIES,
} from "@/routes/WebsiteRoutes";
import { RiShoppingBag4Line } from "react-icons/ri";
import FooterShoppingCart from "./FooterShoppingCart";

const FooterNavbar = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-[70px] bg-white border-t border-gray-200 z-[5000] flex px-10 justify-between items-center py-4">
      <Link href={WEBSITE_HOME}>
        <IoHome className="text-2xl" />
      </Link>

      <Link href={WEBSITE_MOBILE_CATEGORIES}>
        <BiSolidCategory className="text-2xl" />
      </Link>

      {/* <ShoppingCard /> */}
      <FooterShoppingCart />

      <MdFavoriteBorder className="text-2xl" />

      <Profile />
    </div>
  );
};

export default FooterNavbar;
