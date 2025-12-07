import CategoryBanner from "@/components/application/website/CategoryBanner";
import CategoryProductListing from "@/components/application/website/CategoryProductListing";
import axios from "axios";
import React from "react";

const page = async ({ params }) => {
  const { slug } = await params;

  let getCategoryData = null;

  // const { data: getCategoryData } = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get-category/${slug}`
  // );

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get-category/${slug}`
    );
    getCategoryData = response.data;
  } catch (error) {}

  if (!getCategoryData || !getCategoryData.data) {
    return (
      <div className="flex justify-center items-center py-10 h-[400px]">
        <h1 className="text-4xl font-semibold">Category not found</h1>
      </div>
    );
  }

  return (
    <div>
      <CategoryBanner categoryData={getCategoryData?.data} />
      {/* <CategoryBanner props={breadCrumbData} /> */}
      <CategoryProductListing categoryData={getCategoryData?.data} />
    </div>
  );
};

export default page;
