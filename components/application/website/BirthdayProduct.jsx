// "use client";
// import useFetch from "@/hooks/useFetch";

import React from "react";
import Card from "./shared/Card";
import axios from "axios";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import slugify from "slugify";
// import Link from "next/link";

const BirthdayProduct = async () => {
  //   const { data: getBirthdayProducts } = useFetch("/api/category/list/birthday");
  const { data: getBirthdayProducts } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list/birthday`
  );
  return (
    // <div className="px-4 md:px-40  md:pt-24">
    //   <div className="flex flex-col gap-y-4 justify-center items-center">
    //     <h2 className="text-3xl font-bold">Birthday Cakes</h2>
    //     <div className="text-gray-400">
    //       Celebrate your special day with our delightful birthday cakes,
    //       customized just for you!
    //     </div>
    //     <div className="mt-4 flex flex-wrap gap-4">
    //       {getBirthdayProducts?.data?.map((prods) => (
    //         <Card
    //           key={prods._id}
    //           name={prods.name}
    //           mrp={prods.mrp}
    //           url={prods.media?.[0]}
    //           sellingPrice={prods.sellingPrice}
    //         />
    //       ))}
    //     </div>
    //     <div className="mt-4">
    //       <button
    //         type="button"
    //         className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer"
    //       >
    //         Shop Now
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="px-4 md:px-40 pt-10 md:pt-28">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-3xl font-bold">Birthday Cakes</h2>
          <p>
            Celebrate your special day with our delightful birthday cakes,
            customized just for you!
          </p>
        </div>
        <div>
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
      <div className="mt-8  flex flex-wrap gap-4">
        {!getBirthdayProducts.success && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getBirthdayProducts?.data?.map((prods) => (
          <Card
            key={prods._id}
            name={prods.name}
            mrp={prods.mrp}
            url={prods.media?.[0].secure_url}
            sellingPrice={prods.sellingPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default BirthdayProduct;
