import React from "react";
import Card from "../shared/Card";

const Wishlist = ({ favouriteProducts }) => {
  return (
    <>
      <div className="flex py-6 items-center">
        <h1 className="text-xl font-semibold">My Favourites</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {favouriteProducts?.[0]?.products?.map((product) => (
          <div key={product._id}>
            <Card product={product} isWishlist={true} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Wishlist;
