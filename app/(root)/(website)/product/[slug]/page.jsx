import CoreInfo from "@/components/application/website/CoreInfo";
import ProductDetails from "@/components/application/website/ProductDetails";
import ProductReview from "@/components/application/website/ProductReview";
import SimilarProducts from "@/components/application/website/SimilarProducts";
import axios from "axios";
import { cacheLife, cacheTag } from "next/cache";
import React from "react";

const getCachedProductDetails = async (slug) => {
  "use cache: remote";
  cacheTag(`product-details-${slug}`);
  cacheLife({ expire: 3600 }); // 1 hour

  try {
    // This runs on the server. Next.js will cache the RESULT of this function.
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
    );
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false }; // Return a fallback structure to prevent crashes
  }
};

const page = async ({ params }) => {
  const { slug } = await params;

  // const { data: productData } = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
  // );

  const productData = await getCachedProductDetails(slug);

  if (!productData.success) {
    return (
      <div className="flex justify-center items-center py-10 h-[400px]">
        <h1 className="text-4xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const product = productData?.data?.product?.[0];

  if (!product)
    return (
      <div className="flex justify-center items-center">
        <Loadings />
      </div>
    );

  return (
    <div className="px-2 md:px-4 lg:px-12 xl:px-15 2xl:px-40 relative">
      <ProductDetails product={product} />
      <CoreInfo />
      <SimilarProducts product={product} />

      <ProductReview productId={product._id} />
    </div>
  );
};

export default page;
