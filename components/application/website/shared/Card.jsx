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

const Card = ({ product }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col  h-auto rounded-2xl flex-0">
      <div className="w-[285px] h-[400px] bg-white  border-2 border-gray-100 px-2 pt-2 relative">
        <Link href={PRODUCT_DETAILS(product?.slug)}>
          <Image
            src={product?.media?.[0]?.secure_url}
            alt="pimg"
            width={285}
            height={210}
            className="w-[285px] h-[210px] object-center object-cover rounded-2xl "
          />

          <div className="flex flex-col mt-2 px-2">
            <h2 className="mt-3 text-[18px] font-semibold">{product?.name}</h2>
            <span className="mt-4 font-medium">
              ₹ {product?.variants?.[0]?.sellingPrice}
            </span>
          </div>
        </Link>

        <ProductDetailModal open={open} setOpen={setOpen} product={product} />

        <div className="flex px-2 items-center " onClick={() => setOpen(true)}>
          <button
            type="button"
            className=" px-8 py-3 bg-amber-400 rounded-2xl cursor-pointer mt-6 w-full"
          >
            Add to Card
          </button>
        </div>

        <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white z-40 flex justify-center items-center">
          <MdFavoriteBorder className="" />
        </div>
      </div>
    </div>
  );
};

export default Card;
