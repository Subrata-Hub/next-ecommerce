import { FaRegUser } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
// import {
//   USER_DASBOARD,
//   USER_DASBOARD_MANAGE_ADDRESS,
//   USER_DASBOARD_ORDERS,
//   USER_DASBOARD_WISHLIST,
// } from "@/routes/WebsiteRoutes";
export const userPanelSidebarMenu = [
  {
    title: "Profile",
    icon: FaRegUser,
    // url: USER_DASBOARD,
    tab: "profile",
  },
  {
    title: "My Orders",
    icon: CgShoppingBag,
    // url: USER_DASBOARD_ORDERS,
    tab: "orders",
  },
  {
    title: "Wishlist",
    icon: MdFavoriteBorder,
    // url: USER_DASBOARD_WISHLIST,
    tab: "wishlist",
  },
  {
    title: "My Addresses",
    icon: CiLocationOn,
    // url: USER_DASBOARD_MANAGE_ADDRESS,
    tab: "addresses",
  },
];
