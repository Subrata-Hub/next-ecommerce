import Logo from "./Logo";
import Searchbar from "./Searchbar";
import Inquire from "./Inquire";
import { RiShoppingBag4Line } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

const Header = () => {
  return (
    <div className="px-4 md:px-40 flex justify-between items-center gap-4">
      <Logo />
      <Searchbar />
      <Inquire />
      <div className="flex justify-between items-center gap-8 ">
        <RiShoppingBag4Line className="text-2xl" />
        <MdFavoriteBorder className="text-2xl" />
        <FaRegUser className="text-2xl" />
      </div>
    </div>
  );
};

export default Header;
