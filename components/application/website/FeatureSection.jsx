import Image from "next/image";
import React from "react";
import { IoMdCash } from "react-icons/io";
import {
  MdOutlineWorkspacePremium,
  MdOutlineLocalShipping,
} from "react-icons/md";
import cakeImage from "@/public/assets/images/cake1.png";

const FeatureSection = () => {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-white p-2 md:p-6  lg:p-0 md:mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {/* Fast and Easy Payments */}
        <div className=" bg-white p-6  rounded-xl shadow-md flex items-start space-x-4 ">
          <div className="bg-purple-100 p-3 rounded-full">
            <IoMdCash className="text-3xl text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">
              Fast and Easy Payments
            </h3>
            <p className="text-gray-600 text-sm">Safest payment</p>
          </div>
        </div>

        {/* Premium Quality & Pocket-Friendly */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <MdOutlineWorkspacePremium className="text-3xl text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">
              Premium Quality & Pocket-Friendly
            </h3>
            <p className="text-gray-600 text-sm">Luxury you can trust</p>
          </div>
        </div>

        {/* Efficient Delivery */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <MdOutlineLocalShipping className="text-3xl text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">
              Efficient Delivery
            </h3>
            <p className="text-gray-600 text-sm">
              Seamless and reliable delivery
            </p>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="hidden md:flex lg:hidden xl:flex xl:ml-8">
        <Image
          src="https://res.cloudinary.com/duvvksw0w/image/upload/v1761648073/ecommerce/WhatsApp_Image_2025-10-27_at_10.35.04_PM_nl0jxs.webp"
          width={256}
          height={200}
          alt="Princess Cake"
          className="w-64 h-[200px]"
        />
      </div>
    </div>
  );
};

export default FeatureSection;
