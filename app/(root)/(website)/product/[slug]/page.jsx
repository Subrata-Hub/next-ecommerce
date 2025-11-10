import ProductDetails from "@/components/application/website/ProductDetails";
import axios from "axios";
import React from "react";

const page = async ({ params }) => {
  const { slug } = await params;

  const { data: productData } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
  );

  console.log(productData);

  if (!productData.success) {
    return (
      <div className="flex justify-center items-center py-10 h-[400px]">
        <h1 className="text-4xl font-semibold">Product not found</h1>
      </div>
    );
  }

  console.log(productData);

  return <ProductDetails product={productData?.data?.product?.[0]} />;
};

export default page;
