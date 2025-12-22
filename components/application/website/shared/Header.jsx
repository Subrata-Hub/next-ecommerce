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
import Favourite from "./Favourite";

const Header = async () => {
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

  // console.log(user?.[0]?.favourites);

  const auth = {
    _id: user?._id,
    name: user?.name,
    role: "user",
  };
  return (
    <div className="fixed top-0 left-0 md:relative w-full h-[70px] md:h-[100px] bg-white z-50 px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 flex items-center justify-between gap-2 md:gap-4 border-b border-gray-100 shadow-sm">
      <Logo />
      <Searchbar />
      <Inquire />
      <div className="hidden md:flex justify-between items-center gap-8 ">
        <ShoppingCard cart={user !== null && user?.[0]?.cart} />

        <Favourite favourites={user?.[0]?.favourites?.[0]} />

        <Profile auth={auth} />
      </div>
      {/* <span className="md:hidden">
        <RxDragHandleHorizontal />
      </span> */}
      <MobileCategories />
    </div>
  );
};

export default Header;
