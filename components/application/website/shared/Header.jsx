import Logo from "./Logo";
import Searchbar from "./Searchbar";
import Inquire from "./Inquire";

import MobileCategories from "./MobileCategories";

import dynamic from "next/dynamic";
// import UserMenu from "./UserMenu";

const UserMenu = dynamic(() => import("./UserMenu"));

const Header = async () => {
  return (
    <div className="fixed top-0 left-0 md:relative w-full h-[70px] md:h-[100px] bg-white z-50 px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 flex justify-between items-center  gap-2 md:gap-10 2xl:gap-[80px] border-b border-gray-100 shadow-sm">
      <Logo />
      <Searchbar />
      <Inquire />
      <UserMenu />

      <MobileCategories />
    </div>
  );
};

export default Header;
