// "use client";
// import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./shared/Card";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import slugify from "slugify";
import { cacheLife, cacheTag } from "next/cache";
// import useFetch from "@/hooks/useFetch";

const getCachedTendingProduct = async () => {
  "use cache: remote";
  cacheTag(`tending-product`);
  cacheLife({ expire: 3600 * 24 }); // 24 hour
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/tranding`
    );
    const getTendingProducts = response.data;

    return getTendingProducts;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Tranding Product not found.`);
    } else {
      console.error("Error fetching Tranding Product :", error.message);
      return { success: false };
    }
  }
};

const TendingProduct = async () => {
  let getTendingProducts = null;

  getTendingProducts = getCachedTendingProduct();

  // try {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/tranding`
  //   );
  //   getAllProducts = response.data;
  // } catch (error) {
  //   // If it's a 404 error, we just ignore it and let categoryData remain null
  //   // If it's another error (like 500), you might want to log it
  //   if (error.response && error.response.status === 404) {
  //     console.warn(`Tranding Product not found.`);
  //   } else {
  //     console.error("Error fetching Tranding Product :", error.message);
  //   }
  // }

  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-10 md:pt-28">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center justify-center md:items-start gap-y-4">
          <h2 className="text-3xl font-bold">What's Trending</h2>
          <p className="text-center">
            Explore our most popular and trending cakes, fresh from the oven!
          </p>
        </div>
        <div className="hidden md:flex">
          <Link href={WEBSITE_CATEGORY(slugify("tranding").toLowerCase())}>
            <button
              type="button"
              className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer"
            >
              Shop Now
            </button>
          </Link>
        </div>
      </div>
      {/* <div className="mt-8  flex flex-wrap gap-4">
        {!getAllProducts.success && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getAllProducts?.data?.map((prods) => (
          <Card key={prods._id} product={prods} />
        ))}
      </div> */}
      <div className="mt-8 grid  lg:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-3 md:gap-6">
        {(!getTendingProducts || !getTendingProducts?.data) && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getTendingProducts?.data?.map((prods) => (
          <Card key={prods._id} product={prods} />
        ))}
      </div>

      <div className="flex justify-center items-center md:hidden mt-8">
        <Link href={WEBSITE_CATEGORY(slugify("tranding").toLowerCase())}>
          <button
            type="button"
            className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer"
          >
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TendingProduct;
