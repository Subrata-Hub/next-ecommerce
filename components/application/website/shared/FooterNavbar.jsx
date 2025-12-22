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
import FooterFavourite from "./FooterFavourite";
import { cookies } from "next/headers";
import axios from "axios";

const FooterNavbar = async () => {
  let user = null;

  // const user = await getCachedUser();
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("access_token");
    const token = tokenCookie?.value; // This is the actual JWT string

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
        {
          // 👈 3. Manually forward the cookies to the API
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        user = response?.data?.data;
      }
    }
  } catch (error) {
    // ✅ FIX: Ignore the expected "prerender" error during build
    if (error.message.includes("prerender")) {
      user = null; // Treat as guest during build
    } else if (error.response && error.response.status === 403) {
      // user is just not logged in, do nothing
    } else {
      console.error("Error fetching user:", error.message);
    }

    // if (!user) return;
  }

  const auth = {
    _id: user?._id,
    name: user?.name,
    role: "user",
  };
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-[70px] bg-white border-t border-gray-200 z-[5000] flex px-8 justify-between items-center py-4">
      <Link href={WEBSITE_HOME}>
        <IoHome className="text-2xl" />
      </Link>

      <Link href={WEBSITE_MOBILE_CATEGORIES}>
        <BiSolidCategory className="text-2xl" />
      </Link>

      {/* <ShoppingCard /> */}
      <FooterShoppingCart cart={user !== null && user?.[0]?.cart} />

      <FooterFavourite favourites={user?.[0]?.favourites?.[0]} />

      <Profile auth={auth} />
    </div>
  );
};

export default FooterNavbar;
