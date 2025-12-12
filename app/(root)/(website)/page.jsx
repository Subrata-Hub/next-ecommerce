// import Categories from "@/components/application/website/shared/Categories";

import MainSlider from "@/components/application/website/MainSlider";

import React from "react";
import FeaturesProduct from "@/components/application/website/FeaturesProduct";
import TendingProduct from "@/components/application/website/TendingProduct";
import BirthdayProduct from "@/components/application/website/BirthdayProduct";
import CuratedCollections from "@/components/application/website/CuratedCollections";

const page = () => {
  return (
    <div className="w-full">
      <div className="w-full h-[1px] bg-gray-200"></div>

      <MainSlider />
      <TendingProduct />
      <BirthdayProduct />
      <CuratedCollections />
      <FeaturesProduct />
    </div>
  );
};

export default page;
