// "use client";
// import { PRODUCT_DETAILS } from "@/routes/WebsiteRoutes";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { MdFavoriteBorder } from "react-icons/md";
// import slugify from "slugify";
// import ProductDetailModal from "../ProductDetailModal";

// const Card = ({ name, slug, mrp, url, sellingPrice, discountPercentage }) => {
//   const [open, setOpen] = useState(false);

//   return (

//     <div className="w-full flex flex-col  h-auto rounded-2xl flex-0">
//       <div className="w-[285px] h-[400px] bg-white  border-2 border-gray-100 px-2 pt-2 relative">
//         <Link href={PRODUCT_DETAILS(slug)}>
//           <Image
//             src={url}
//             alt="pimg"
//             width={285}
//             height={210}
//             className="w-[285px] h-[210px] object-center object-cover rounded-2xl "
//           />

//           <div className="flex flex-col mt-2 px-2">
//             <h2 className="mt-3 text-[18px] font-semibold">{name}</h2>
//             <span className="mt-4 font-medium">₹ {sellingPrice}</span>
//           </div>
//         </Link>

//         <ProductDetailModal open={open} setOpen={setOpen} />

//         <div className="flex px-2 items-center " onClick={() => setOpen(true)}>
//           <button
//             type="button"
//             className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer mt-6 w-full"
//           >
//             Add to Card
//           </button>
//         </div>

//         <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white z-100 flex justify-center items-center">
//           <MdFavoriteBorder className="" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;

"use client";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoutes";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import slugify from "slugify";
import ProductDetailModal from "../ProductDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addVariant } from "@/store/slices/cartSlice";

const Card = ({ product }) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  console.log(product);

  const selectedProductAndVariant = {
    productId: product._id,
    variantId: product?.variants?.[0]?._id,
    mrp: product?.variants?.[0]?.mrp,
    sellingPrice: product?.variants?.[0]?.sellingPrice,
    weight: product?.variants?.[0]?.weight,
    cream: product?.variants?.[0]?.cream,
    dietary: product?.variants?.[0]?.dietary,
    flavour: product?.variants?.[0]?.flavour,
  };

  const handleClick = () => {
    navigate.push(PRODUCT_DETAILS(product?.slug));
    dispatch(addVariant(selectedProductAndVariant));
  };

  const handlePopup = () => {
    dispatch(addVariant(selectedProductAndVariant));

    setOpen(true);
  };

  return (
    // <div className="w-full flex flex-col  h-auto rounded-2xl flex-0">
    //   <div className="w-[285px] h-[400px] bg-white  border-2 border-gray-100 px-2 pt-2 relative">
    //     {/* <Link href={PRODUCT_DETAILS(product?.slug)}>
    //       <Image
    //         src={product?.media?.[0]?.secure_url}
    //         alt="pimg"
    //         width={285}
    //         height={210}
    //         className="w-[285px] h-[210px] object-center object-cover rounded-2xl "
    //       />

    //       <div className="flex flex-col mt-2 px-2">
    //         <h2 className="mt-3 text-[18px] font-semibold">{product?.name}</h2>
    //         <span className="mt-4 font-medium">
    //           ₹ {product?.variants?.[0]?.sellingPrice}
    //         </span>
    //       </div>
    //     </Link> */}

    //     <div onClick={handleClick} className="cursor-pointer w-full">
    //       <Image
    //         src={product?.media?.[0]?.secure_url}
    //         alt="pimg"
    //         width={285}
    //         height={210}
    //         className="w-full h-[210px] object-center object-cover rounded-2xl "
    //       />

    //       <div className="flex flex-col mt-2 px-2">
    //         <h2 className="mt-3 text-[18px] font-semibold">{product?.name}</h2>
    //         <span className="mt-4 font-medium">
    //           ₹ {product?.variants?.[0]?.sellingPrice}
    //         </span>
    //       </div>
    //     </div>

    //     <ProductDetailModal open={open} setOpen={setOpen} product={product} />

    //     <div className="flex px-2 items-center " onClick={handlePopup}>
    //       <button
    //         type="button"
    //         className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer mt-6 w-full"
    //       >
    //         Add to Card
    //       </button>
    //     </div>

    //     <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white z-40 flex justify-center items-center">
    //       <MdFavoriteBorder className="" />
    //     </div>
    //   </div>
    // </div>

    <div className="w-full h-full flex flex-col relative group">
      <div className="w-full h-full bg-white border border-gray-100 rounded-2xl p-2 md:p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
        <div onClick={handleClick} className="cursor-pointer w-full">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={
                product?.media?.[0]?.secure_url || "https://placehold.co/400"
              }
              alt={product?.name}
              width={285}
              height={210}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col mt-2 px-1">
            {/* 4. TYPOGRAPHY: Smaller text on mobile, larger on desktop */}
            <h2 className="mt-2 text-sm md:text-lg font-semibold line-clamp-2 leading-tight">
              {product?.name}
            </h2>
            <span className="mt-2 text-sm md:text-base font-medium text-gray-900">
              ₹ {product?.variants?.[0]?.sellingPrice}
            </span>
          </div>
        </div>

        <ProductDetailModal open={open} setOpen={setOpen} product={product} />

        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={handlePopup}
            className="w-full py-2 md:py-3 bg-amber-400 hover:bg-amber-500 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold transition-colors"
          >
            Add to Card
          </button>
        </div>

        {/* Favorite Icon */}
        <div className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 rounded-full bg-white/90 shadow-sm z-10 flex justify-center items-center cursor-pointer hover:text-red-500">
          <MdFavoriteBorder />
        </div>
      </div>
    </div>
  );
};

export default Card;
