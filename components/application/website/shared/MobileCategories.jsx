"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categorieMenu } from "@/lib/categorieMenu";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import Link from "next/link";
import React from "react"; // Removed useState
import { GiHamburgerMenu } from "react-icons/gi";

const MobileCategories = () => {
  // REMOVED: useState, handleToggle (Shadcn handles this automatically)

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <GiHamburgerMenu className="text-2xl cursor-pointer" />
        </SheetTrigger>

        <SheetContent className="w-full px-6">
          <SheetHeader className="flex flex-row justify-between items-center">
            {/* Added text for Accessibility, hidden with sr-only if you don't want to see it */}
            <SheetTitle className="sr-only">Categories</SheetTitle>
            <SheetDescription className="sr-only">
              Browse our product categories
            </SheetDescription>
          </SheetHeader>

          <div className="w-full h-[1px] bg-gray-100 px-2"></div>

          <h2 className="text-2xl font-semibold"> Categories</h2>

          <div className="pr-4">
            <Accordion type="single" collapsible className="w-full">
              {categorieMenu?.map((categorie, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="uppercase font-semibold hover:no-underline">
                    {categorie.name}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="flex flex-col pl-4 gap-2">
                      {categorie?.subCategory?.map((item, subIndex) => (
                        <SheetClose asChild key={subIndex}>
                          <Link
                            href={WEBSITE_CATEGORY(item.slug)}
                            className="py-2 "
                          >
                            <span className="text-lg text-gray-600 hover:text-black">
                              {item.title}
                            </span>
                          </Link>
                        </SheetClose>
                      ))}

                      {/* Safety check if empty */}
                      {/* {(!categorie?.subCategory ||
                        categorie.subCategory.length === 0) && (
                        <span className="text-sm text-gray-400">
                          No subcategories
                        </span>
                      )} */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileCategories;
