import React from "react";
import Card from "./shared/Card";
import axios from "axios";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import slugify from "slugify";
import { cacheLife, cacheTag } from "next/cache";
import { getProductsByCategorySlug } from "@/app/actions/getProductsByCategorySlug";

const getCachedBrithdayProduct = async (birthday) => {
  "use cache: remote";
  cacheTag(`brithday-product`);
  cacheLife({ expire: 3600 * 24 }); // 24 hour
  try {
    // const response = await axios.get(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/birthday`
    // );
    const response = await getProductsByCategorySlug(birthday);
    const getBirthdayProducts = response;

    return getBirthdayProducts;
  } catch (error) {
    // if (error.response && error.response.status === 404) {
    //   console.warn(`birthday product not found.`);
    // } else {
    //   console.error("Error fetching birthday products:", error.message);
    //   return { success: false };
    // }
    console.error("Error fetching birthday products:", error.message);
    return { success: false, data: [] };
  }
};

const BirthdayProduct = async () => {
  // let getBirthdayProducts = null;

  const getBirthdayProducts = await getCachedBrithdayProduct("birthday");

  // try {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/birthday`
  //   );
  //   getBirthdayProducts = response.data;
  // } catch (error) {
  //   if (error.response && error.response.status === 404) {
  //     console.warn(`birthday product not found.`);
  //   } else {
  //     console.error("Error fetching birthday products:", error.message);
  //   }
  // }

  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-10 md:pt-28">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center justify-center md:items-start gap-y-4">
          <h2 className="text-3xl font-bold">Birthday Cakes</h2>
          <p>
            Celebrate your special day with our delightful birthday cakes,
            customized just for you!
          </p>
        </div>
        <div className="hidden md:flex">
          <Link href={WEBSITE_CATEGORY(slugify("birthday").toLowerCase())}>
            <button
              type="button"
              className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer"
            >
              Shop Now
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-8  grid  lg:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-3 md:gap-6">
        {(!getBirthdayProducts || !getBirthdayProducts.data) && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getBirthdayProducts?.data?.map((prods) => (
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

export default BirthdayProduct;
