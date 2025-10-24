"use client";

import { categorieMenu } from "@/lib/categorieMenu";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import slugify from "slugify";

const Categories = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    // Only allow one dialog to be open at a time
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // 1. Add relative positioning to the nav for context if needed,
    //    though Dialog is usually viewport-based.
    <nav className="flex px-4 md:px-40 py-4 border-b-2 border-gray-100 z-1000000">
      <ul className="flex justify-between items-center gap-10 w-full">
        {categorieMenu?.map((categorie, index) => (
          <React.Fragment key={index}>
            <li className="relative">
              <div
                onClick={() => handleToggle(index)}
                className="flex cursor-pointer"
              >
                <p className="text-gray-800">{categorie.name}</p>
                {categorie?.subCategory && (
                  <MdOutlineKeyboardArrowDown className="text-gray-600 text-lg mt-[1px]" />
                )}
              </div>
            </li>
            {openIndex === index && (
              <div className="absolute top-[190px] z-2000000">
                {categorie?.subCategory && (
                  <div
                    className="flex flex-wrap bg-white border-2 border-gray-200  p-8 w-[1200px] h-auto gap-5"
                    onMouseLeave={() => setOpenIndex(null)}
                  >
                    {categorie.subCategory.map((item, subIndex) => (
                      <div
                        key={subIndex}
                        className={`p-2 ${
                          item?.color ? item?.color : ""
                        }   cursor-pointer w-[360px] h-40 rounded-xl`}
                      >
                        <Link
                          href={WEBSITE_CATEGORY(
                            slugify(item?.title).toLowerCase()
                          )}
                        >
                          <div className="flex justify-between">
                            <div
                              className={`flex flex-col gap-y-4 ${item?.text} pt-4 pl-4`}
                            >
                              <span className="text-xl font-semibold">
                                {item.title}
                              </span>
                              <div className="flex gap-2 items-center">
                                <span>Shop now</span>
                                <GoArrowRight />
                              </div>
                            </div>
                            <div className="mt-6 w-[110px] h-[110px]">
                              <Image
                                src={
                                  item?.Image ||
                                  "https://placehold.co/250x150/cccccc/ffffff?text=No+Image"
                                }
                                width={60}
                                height={60}
                                className="w-full h-full object-cover rounded-full"
                                alt="ing"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Categories;
