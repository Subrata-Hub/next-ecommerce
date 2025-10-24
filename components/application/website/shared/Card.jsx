import { WEBSITE_PRODUCT } from "@/routes/WebsiteRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdFavoriteBorder } from "react-icons/md";
import slugify from "slugify";

const Card = ({ name, mrp, url, sellingPrice }) => {
  return (
    <div className="w-full flex flex-col  h-auto rounded-2xl flex-0">
      <Link href={WEBSITE_PRODUCT(slugify(name).toLowerCase())}>
        <div className="w-[285px] h-[400px] bg-white  border-2 border-gray-100 px-2 pt-2 relative">
          <Image
            src={url}
            alt="pimg"
            width={285}
            height={210}
            className="w-[285px] h-[210px] object-center object-cover rounded-2xl "
          />
          <div className="flex flex-col mt-2">
            <h2 className="mt-3 text-[18px] font-semibold">{name}</h2>
            <span className="mt-4 font-medium">₹ {mrp}</span>
            <button
              type="button"
              className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer mt-6"
            >
              Add to Card
            </button>
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white z-100 flex justify-center items-center">
            <MdFavoriteBorder className="" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
