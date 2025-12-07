import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBanner = () => {
  return (
    <div className=" w-full  h-[140px]  md:h-[150px] relative">
      <Image
        src="https://res.cloudinary.com/duvvksw0w/image/upload/v1761267165/ecommerce/Frame-1597884148_wtmrvr.webp"
        alt="category-banner"
        width={1980}
        height={150}
        className="w-full h-full object-center object-cover"
      />
      <div className="absolute top-[30%] left-[45%] z-10">
        <h1 className="text-4xl font-bold">Cart</h1>
        <div className="text-sm">
          <ul className="flex gap-2 mt-2">
            <li>
              <Link href={WEBSITE_HOME} className="font-bold ">
                Home
              </Link>
            </li>
            <li>
              <span className="me-1">/</span>

              <span>cart</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartBanner;
