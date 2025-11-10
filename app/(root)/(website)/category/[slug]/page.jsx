import CategoryBanner from "@/components/application/website/CategoryBanner";
import CategoryProductListing from "@/components/application/website/CategoryProductListing";
import axios from "axios";
import React from "react";

const page = async ({ params }) => {
  const { slug } = await params;
  const { data: getCategoryData } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get-category/${slug}`
  );

  return (
    <div>
      <CategoryBanner categoryData={getCategoryData?.data} />
      {/* <CategoryBanner props={breadCrumbData} /> */}
      <CategoryProductListing categoryData={getCategoryData?.data} />
    </div>
  );
};

export default page;
