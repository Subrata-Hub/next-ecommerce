// "use client";

// import { categorieMenu } from "@/lib/categorieMenu";
// import Image from "next/image";
// import React, { useState } from "react";
// import { MdOutlineKeyboardArrowDown } from "react-icons/md";
// import { GoArrowRight } from "react-icons/go";
// import Link from "next/link";
// import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
// import slugify from "slugify";
// import useWindowSize from "@/hooks/useWindowSize";

// const Categories = () => {
//   const [openIndex, setOpenIndex] = useState(null);
//   const windowSize = useWindowSize();

//   const handleToggle = (index) => {
//     // Only allow one dialog to be open at a time
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <>
//       {windowSize.width >= 768 && (
//         <nav className="hidden  md:flex px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40  py-4  z-1000">
//           <ul className="flex justify-between items-center gap-1 lg:gap-6 w-full ml-7 relative">
//             {categorieMenu?.map((categorie, index) => (
//               <React.Fragment key={index}>
//                 <li className="relative">
//                   <div
//                     onClick={() => handleToggle(index)}
//                     className="flex cursor-pointer"
//                   >
//                     <p className="text-[12px] lg:text-[14px] text-nowrap text-gray-800">
//                       {categorie.name}
//                     </p>
//                     {categorie?.subCategory && (
//                       <MdOutlineKeyboardArrowDown className="text-gray-600 text-sm lg:text-lg mt-[1px]" />
//                     )}
//                   </div>
//                 </li>
//                 {openIndex === index && (
//                   <div className="absolute top-[40px] z-2000">
//                     {categorie?.subCategory && (
//                       <div
//                         className="w-full grid grid-cols-3 bg-white border-2 border-gray-200 p-6  h-auto gap-4"
//                         onMouseLeave={() => setOpenIndex(null)}
//                       >
//                         {categorie.subCategory.map((item, subIndex) => (
//                           <div
//                             key={subIndex}
//                             className={`p-2 ${
//                               item?.color ? item?.color : ""
//                             }   cursor-pointer w-full h-40 rounded-xl`}
//                           >
//                             <Link href={WEBSITE_CATEGORY(item.slug)}>
//                               <div className="w-full flex justify-between xl:gap-13 2xl:gap-20">
//                                 <div
//                                   className={`flex flex-col gap-y-4 ${item?.text} pt-4 pl-4`}
//                                 >
//                                   <span className="text-xl font-semibold">
//                                     {item.title}
//                                   </span>
//                                   <div className="flex gap-2 items-center">
//                                     <span>Shop now</span>
//                                     <GoArrowRight />
//                                   </div>
//                                 </div>
//                                 <div className="mt-6 w-[110px] h-[110px]">
//                                   <Image
//                                     src={
//                                       item?.Image ||
//                                       "https://placehold.co/250x150/cccccc/ffffff?text=No+Image"
//                                     }
//                                     width={60}
//                                     height={60}
//                                     className="w-full h-full object-cover rounded-full"
//                                     alt="ing"
//                                   />
//                                 </div>
//                               </div>
//                             </Link>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </React.Fragment>
//             ))}
//           </ul>
//         </nav>
//       )}
//     </>
//   );
// };

// export default Categories;

"use client";

import { categorieMenu } from "@/lib/categorieMenu";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import useWindowSize from "@/hooks/useWindowSize";

const Categories = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const windowSize = useWindowSize();

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {windowSize.width > 768 && (
        <nav className="hidden md:flex px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 py-4 ml-8  relative ">
          {/* 2. Added 'relative' here so the dropdown positions against the full width of the UL, not the individual LI */}
          <ul className="flex justify-between items-center gap-4 lg:gap-6 w-full relative">
            {categorieMenu?.map((categorie, index) => (
              <React.Fragment key={index}>
                {/* 3. 'static' allows the dropdown (absolute) to align with the parent UL */}
                <li className="static">
                  <div
                    onClick={() => handleToggle(index)}
                    className={`flex cursor-pointer items-center gap-1 hover:text-blue-600 transition-colors ${
                      openIndex === index ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    <p className="text-[12px] lg:text-[14px] xl:text-[15px] whitespace-nowrap font-medium">
                      {categorie.name}
                    </p>
                    {categorie?.subCategory && (
                      <MdOutlineKeyboardArrowDown
                        className={`text-sm lg:text-lg transition-transform duration-200 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </li>

                {/* Dropdown Menu */}
                {openIndex === index && categorie?.subCategory && (
                  // 4. Positioned absolute left-0 w-full relative to the UL container
                  <div
                    className="absolute top-full left-0 w-full z-50 mt-4 shadow-xl rounded-b-xl overflow-hidden"
                    onMouseLeave={() => setOpenIndex(null)}
                  >
                    <div className="w-full bg-white border border-gray-100 p-6">
                      {/* 5. Responsive Grid: 2 cols on tablet, 3 cols on desktop */}
                      <div className="grid grid-cols-3  gap-4">
                        {categorie.subCategory.map((item, subIndex) => (
                          <div
                            key={subIndex}
                            className={`group p-4 ${
                              item?.color ? item?.color : "bg-gray-50"
                            } cursor-pointer w-full rounded-xl transition-transform hover:shadow-md border border-transparent hover:border-gray-200`}
                          >
                            <Link
                              href={WEBSITE_CATEGORY(item.slug)}
                              className="block h-full"
                            >
                              <div className="w-full flex justify-between h-full">
                                <div className="flex flex-col justify-between pt-2 pl-2">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                      {item.title}
                                    </span>
                                    <div className="flex gap-2 items-center text-sm text-gray-600 group-hover:text-blue-600">
                                      <span>Shop now</span>
                                      <GoArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>

                                <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] flex-shrink-0">
                                  <Image
                                    src={
                                      item?.Image ||
                                      "https://placehold.co/250x150/cccccc/ffffff?text=No+Image"
                                    }
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                                    alt={item.title || "Category Image"}
                                  />
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>

          {/* Optional: Click overlay to close menu if clicking outside (simple version) */}
          {openIndex !== null && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setOpenIndex(null)}
            />
          )}
        </nav>
      )}
    </>
  );
};

export default Categories;
