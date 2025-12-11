import Logo from "./Logo";
import Searchbar from "./Searchbar";
import Inquire from "./Inquire";
import { RiShoppingBag4Line } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import ShoppingCard from "./ShoppingCard";
import Profile from "../Profile";
import { RxDragHandleHorizontal } from "react-icons/rx";
import MobileCategories from "./MobileCategories";
import axios from "axios";
import { cookies } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";
// export const dynamic = "force-dynamic";
const getCachedUser = async () => {
  "use cache: private";
  cacheTag("user");
  cacheLife({ stale: 60 });

  const cookieStore = await cookies();
  let getUser = null;
  try {
    // const cookieStore = await cookies();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
      {
        // 👈 3. Manually forward the cookies to the API
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

    if (response.data.success) {
      getUser = response?.data?.data;
    }
  } catch (error) {
    // ✅ FIX: Ignore the expected "prerender" error during build
    if (error.message.includes("prerender")) {
      getUser = null; // Treat as guest during build
    } else if (error.response && error.response.status === 403) {
      // user is just not logged in, do nothing
    } else {
      console.error("Error fetching user:", error.message);
    }
  }
  return getUser;
};

const Header = async () => {
  // let user = null;

  const user = await getCachedUser();
  // try {
  //   const cookieStore = await cookies();
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
  //     {
  //       // 👈 3. Manually forward the cookies to the API
  //       headers: {
  //         Cookie: cookieStore.toString(),
  //       },
  //     }
  //   );
  //   if (response.data.success) {
  //     user = response?.data?.data;
  //   }
  // } catch (error) {
  //   // ✅ FIX: Ignore the expected "prerender" error during build
  //   if (error.message.includes("prerender")) {
  //     user = null; // Treat as guest during build
  //   } else if (error.response && error.response.status === 403) {
  //     // user is just not logged in, do nothing
  //   } else {
  //     console.error("Error fetching user:", error.message);
  //   }

  //   // if (!user) return;
  // }

  // console.log(user);
  console.log(user);
  return (
    // <div className="px-4 py-2 md:px-40 flex   items-center md:justify-between gap-2 md:gap-4">
    //   <Logo />
    //   <Searchbar />
    //   <Inquire />
    //   <div className="hidden md:flex justify-between items-center gap-8 ">
    //     <ShoppingCard />

    //     <MdFavoriteBorder className="text-2xl" />

    //     <Profile />
    //   </div>
    //   {/* <span className="md:hidden">
    //     <RxDragHandleHorizontal />
    //   </span> */}
    //   <MobileCategories />
    // </div>

    <div className="fixed top-0 left-0 md:relative w-full h-[70px] md:h-[100px] bg-white z-50 px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 flex items-center justify-between gap-2 md:gap-4 border-b border-gray-100 shadow-sm">
      <Logo />
      <Searchbar />
      <Inquire />
      <div className="hidden md:flex justify-between items-center gap-8 ">
        <ShoppingCard />

        <MdFavoriteBorder className="text-2xl" />

        <Profile />
      </div>
      {/* <span className="md:hidden">
        <RxDragHandleHorizontal />
      </span> */}
      <MobileCategories />
    </div>
  );
};

export default Header;

// import Logo from "./Logo";
// import Searchbar from "./Searchbar";
// import Inquire from "./Inquire";
// import { MdFavoriteBorder } from "react-icons/md";
// import ShoppingCard from "./ShoppingCard";
// import Profile from "../Profile";
// import MobileCategories from "./MobileCategories";

// const Header = () => {
//   return (
//     // CHANGED: Removed "fixed top-0 left-0 md:relative".
//     // Kept "w-full" and dimensions.
//     <div className="w-full h-[70px] md:h-[100px] bg-white px-4 md:px-40 flex items-center justify-between gap-2 md:gap-4 border-b border-gray-100 shadow-sm transition-all duration-300">
//       <Logo />
//       <Searchbar />
//       <Inquire />
//       <div className="hidden md:flex justify-between items-center gap-8 ">
//         <ShoppingCard />
//         <MdFavoriteBorder className="text-2xl" />
//         <Profile />
//       </div>
//       <MobileCategories />
//     </div>
//   );
// };

// export default Header;
