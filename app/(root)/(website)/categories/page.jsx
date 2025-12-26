import { categorieMenu } from "@/lib/categorieMenu";

import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoriesPage = () => {
  return (
    <div className="md:hidden">
      <div className="w-full px-4 ">
        <ul className="">
          {categorieMenu?.map((categorie, index) => (
            <div key={index} className="py-6 border-b border-b-gray-200">
              <li className="text-lg font-bold"> {categorie.name}</li>

              {categorie?.subCategory ? (
                <div className="grid grid-cols-2">
                  {categorie.subCategory.map((item, subIndex) => (
                    <div key={subIndex} className="py-4">
                      <Link href={WEBSITE_CATEGORY(item.slug)}>
                        <div className="flex gap-4 items-center">
                          <div className="w-15 h-15 bg-gray-200 rounded-2xl flex items-center justify-center">
                            <Image
                              src={
                                item?.Image ||
                                "https://placehold.co/250x150/cccccc/ffffff?text=No+Image"
                              }
                              width={40}
                              height={40}
                              alt="categori-img"
                              className="w-10 h-10 object-none rounded-full"
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
