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
    <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-white p-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fast and Easy Payments */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
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
      <div className="ml-8">
        <Image src={cakeImage} alt="Princess Cake" className="w-64 h-[200px]" />
      </div>
    </div>
  );
};

export default FeatureSection;
