"use client";
import axios from "axios";
import React from "react";
import Card from "./shared/Card";
import useFetch from "@/hooks/useFetch";

const SimilarProducts = ({ product }) => {
  // const { data: getFeaturedProduct } = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product`
  // );
  // mt-8  flex flex-wrap gap-4
  // grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2

  console.log(product);

  const searchParams = new URLSearchParams({
    // page: pageParam,
    // limit: 10,
    mrp: product.variants?.[0].mrp,

    weight: product.variants?.[0].weight.join(","),
    flavour: product.variants?.[0].flavour.join(","),
    cream: product.variants?.[0].cream.join(","),
    dietary: product.variants?.[0].dietary.join(","),

    // sort: sorting,
  }).toString();

  // const { data: getProducts } = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/recommendation/?${searchParams}`
  // );

  const { data: getSimilarProducts } = useFetch(
    `/api/product/recommendation/?${searchParams}`
  );

  console.log(getSimilarProducts);

  return (
    <div className=" pl-8">
      <div className="flex flex-col gap-y-4 justify-center items-center">
        <h2 className="text-3xl font-bold">You May Also Like</h2>
        <p className="text-gray-500">
          Discover our handpicked featured products - quality, style, and value!
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {getSimilarProducts?.data?.map((prods) => (
          <Card key={prods._id} product={prods} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
