import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import slugify from "slugify";

const CuratedCollections = () => {
  // lg:w-[390px] h-[230px]
  // w-[200px] h-[130px]
  return (
    <div className="px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-10 md:pt-28">
      <div className="flex flex-col justify-between items-center text-center">
        <h2 className="text-3xl font-bold">
          Shop Our Curated Collections Today!
        </h2>
        <p className="mt-4">
          Explore timeless favorites crafted with traditional recipes and
          flavors, perfect for any occasion
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Link href={WEBSITE_CATEGORY(slugify("birthday").toLowerCase())}>
          <div className=" flex justify-between  bg-blue-400 gap-4 p-6  rounded-2xl">
            <div className="flex flex-col gap-y-3 mt-4">
              <h2 className="text-[22px] font-black text-blue-900">
                Celebration Cakes
              </h2>
              <span className="text-sm">
                Custom birthday cakes for your Celebration
              </span>
              <div className="flex gap-2 items-center text-blue-900 font-semibold">
                <span className="">Explore Now</span>
                <span>
                  <GoArrowRight />
                </span>
              </div>
            </div>
            <div className=" w-[200px] h-[130px] mt-12">
              <Image
                src="https://res.cloudinary.com/duvvksw0w/image/upload/v1760971065/ecommerce/WhatsApp_Image_2025-10-08_at_12.06.46_AM_xh0eai.webp"
                alt="small-bn-img"
                width={200}
                height={130}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </Link>

        <Link href={WEBSITE_CATEGORY(slugify("wedding").toLowerCase())}>
          <div className="flex  bg-pink-300 w-full  p-6 justify-between  rounded-2xl">
            <div className="flex flex-col gap-y-3 mt-4">
              <h2 className="text-2xl font-black text-pink-800">
                Wedding Cakes
              </h2>
              <span className="text-sm">
                Exquisite Wedding Cake Creations Await You.
              </span>
              <div className="flex gap-2 items-center text-pink-800 font-semibold">
                <span className="">Explore Now</span>
                <span>
                  <GoArrowRight />
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[130px] mt-12">
              <Image
                src="https://res.cloudinary.com/duvvksw0w/image/upload/v1760970882/ecommerce/WhatsApp_Image_2025-10-08_at_12.06.59_AM_2_wsitwm.webp"
                alt="small-bn-img"
                width={200}
                height={130}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </Link>

        <Link href={WEBSITE_CATEGORY(slugify("anniversary").toLowerCase())}>
          <div className="w-full  flex  bg-cyan-400  p-6 justify-between  rounded-2xl">
            <div className="flex flex-col gap-y-3 mt-4">
              <h2 className="text-[22px] font-black text-cyan-900">
                Anniversary Cakes
              </h2>
              <span className="text-sm">
                Cherish Memories with Anniversary Cake Delights
              </span>
              <div className="flex gap-2 items-center text-blue-900 font-semibold">
                <span className="">Explore Now</span>
                <span>
                  <GoArrowRight />
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[130px] mt-12">
              <Image
                src="https://res.cloudinary.com/duvvksw0w/image/upload/v1760971065/ecommerce/WhatsApp_Image_2025-10-08_at_12.06.46_AM_xh0eai.webp"
                alt="small-bn-img"
                width={200}
                height={130}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CuratedCollections;
