// "use client";
// import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./shared/Card";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import slugify from "slugify";
// import useFetch from "@/hooks/useFetch";

const TendingProduct = async () => {
  // const { data: getAllProducts } = useFetch("/api/category/list/Tranding");
  const { data: getAllProducts } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/tranding`
  );

  console.log(getAllProducts);

  return (
    <div className="px-4 md:px-40 pt-10 md:pt-28">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-3xl font-bold">What's Trending</h2>
          <p>
            Explore our most popular and trending cakes, fresh from the oven!
          </p>
        </div>
        <div>
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
      <div className="mt-8  flex flex-wrap gap-4">
        {!getAllProducts.success && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getAllProducts?.data?.map((prods) => (
          <Card key={prods._id} product={prods} />
        ))}
      </div>
    </div>
  );
};

export default TendingProduct;
