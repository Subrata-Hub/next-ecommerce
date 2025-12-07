import axios from "axios";
import React from "react";
import Card from "./shared/Card";

const FeaturesProduct = async () => {
  let getFeaturedProduct = null;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product`
    );
    getFeaturedProduct = response.data;
  } catch (error) {
    // If it's a 404 error, we just ignore it and let categoryData remain null
    // If it's another error (like 500), you might want to log it
    if (error.response && error.response.status === 404) {
      console.warn(`Feature product  not found.`);
    } else {
      console.error("Error fetching :Feature product", error.message);
    }
  }

  // mt-8  flex flex-wrap gap-4
  // grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2
  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-10 md:pt-28">
      <div className="flex flex-col gap-y-4 justify-center items-center text-center">
        <h2 className="text-3xl font-bold">
          Featured Products: Top Picks Inside
        </h2>
        <p className="text-gray-500">
          Discover our handpicked featured products - quality, style, and value!
        </p>
      </div>
      <div className="mt-8  grid  lg:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-3 md:gap-6">
        {(!getFeaturedProduct || !getFeaturedProduct.data) && (
          <div className="text-center py-5">Product not found</div>
        )}
        {getFeaturedProduct?.data?.map((prods) => (
          <Card key={prods._id} product={prods} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesProduct;
