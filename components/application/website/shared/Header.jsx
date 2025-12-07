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

const Header = () => {
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
