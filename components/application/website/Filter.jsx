"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react"; // Removed unused imports

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { creams, dietarys, flavours, weightsData } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ButtonLoading from "../ButtonLoading";
// Removed useSearchParams, useRouter, and usePathname
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Helper function to get items from sessionStorage
// const getInitialState = (key, defaultValue) => {
//   if (typeof window === "undefined") {
//     return defaultValue; // Return default if on server
//   }
//   const saved = sessionStorage.getItem(key);
//   return saved ? JSON.parse(saved) : defaultValue;
// };

const Filter = ({
  priceFilter,
  setPriceFilter,
  selectedWeights,
  setSelectedWeights,
  selectedFlavours,
  setSelectedFlavours,
  selectedCreams,
  setSelectedCreams,
  selectedDietarys,
  setSelectedDietarys,
}) => {
  // const searchParams = useSearchParams();

  // const [priceFilter, setPriceFilter] = useState(() =>
  //   getInitialState("filterPrice", { minPrice: 0, maxPrice: 3000 })
  // );
  // const [selectedWeights, setSelectedWeights] = useState(() =>
  //   getInitialState("filterWeights", [])
  // );
  // const [selectedFlavours, setSelectedFlavours] = useState(() =>
  //   getInitialState("filterFlavours", [])
  // );
  // const [selectedCreams, setSelectedCreams] = useState(() =>
  //   getInitialState("filterCreams", [])
  // );
  // const [selectedDietarys, setSelectedDietarys] = useState(() =>
  //   getInitialState("filterDietarys", [])
  // );

  // const urlSearchParams = new URLSearchParams(searchParams.toString());

  // Price slider change handler (does not save, only updates local state)
  const handlePriceChanged = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  // ---
  // 2. Save state to sessionStorage in each handler
  // ---
  const handleWeightFilter = (weights) => {
    let newSelectedWeight = [...selectedWeights];
    if (newSelectedWeight.includes(weights)) {
      newSelectedWeight = newSelectedWeight.filter(
        (weight) => weight !== weights
      );
    } else {
      newSelectedWeight.push(weights);
    }

    setSelectedWeights(newSelectedWeight);
    // newSelectedWeight.length > 0
    //   ? urlSearchParams.set("weight", newSelectedWeight.join(","))
    //   : urlSearchParams.delete("weight");
    // Save to sessionStorage
    sessionStorage.setItem("filterWeights", JSON.stringify(newSelectedWeight));
  };

  const handleFlavoursFilter = (flavours) => {
    let newSelectedFlavours = [...selectedFlavours];
    if (newSelectedFlavours.includes(flavours)) {
      newSelectedFlavours = newSelectedFlavours.filter(
        (flavour) => flavour !== flavours
      );
    } else {
      newSelectedFlavours.push(flavours);
    }

    setSelectedFlavours(newSelectedFlavours);
    // newSelectedFlavours.length > 0
    //   ? urlSearchParams.set("flavour", newSelectedFlavours.join(","))
    //   : urlSearchParams.delete("flavour");
    // Save to sessionStorage
    sessionStorage.setItem(
      "filterFlavours",
      JSON.stringify(newSelectedFlavours)
    );
  };

  const handleCreamsFilter = (creams) => {
    let newSelectedCreams = [...selectedCreams];
    if (newSelectedCreams.includes(creams)) {
      newSelectedCreams = newSelectedCreams.filter((cream) => cream !== creams);
    } else {
      newSelectedCreams.push(creams);
    }

    setSelectedCreams(newSelectedCreams);
    // newSelectedCreams.length > 0
    //   ? urlSearchParams.set("cream", newSelectedCreams.join(","))
    //   : urlSearchParams.delete("cream");
    // Save to sessionStorage
    sessionStorage.setItem("filterCreams", JSON.stringify(newSelectedCreams));
  };

  const handleDietarysFilter = (dietarys) => {
    let newSelectedDietarys = [...selectedDietarys];
    if (newSelectedDietarys.includes(dietarys)) {
      newSelectedDietarys = newSelectedDietarys.filter(
        (dietary) => dietary !== dietarys
      );
    } else {
      newSelectedDietarys.push(dietarys);
    }

    setSelectedDietarys(newSelectedDietarys);
    // newSelectedDietarys.length > 0
    //   ? urlSearchParams.set("dietary", newSelectedDietarys.join(","))
    //   : urlSearchParams.delete("dietary");
    // Save to sessionStorage
    sessionStorage.setItem(
      "filterDietarys",
      JSON.stringify(newSelectedDietarys)
    );
  };

  // Price filter button handler (saves the staged price)
  const handlePriceFilter = () => {
    // urlSearchParams.set("minPrice", priceFilter.minPrice);
    // urlSearchParams.set("maxPrice", priceFilter.maxPrice);
    // Save to sessionStorage
    sessionStorage.setItem("filterPrice", JSON.stringify(priceFilter));
  };

  const handleClear = () => {
    setPriceFilter({ minPrice: 0, maxPrice: 3000 });
    setSelectedWeights([]);
    setSelectedFlavours([]);
    setSelectedCreams([]);
    setSelectedDietarys([]);
    sessionStorage.clear();
  };

  // The commented-out useEffect is no longer needed
  // as state is initialized directly in useState

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium">Filters</h1>
        <button className="text-blue-400" onClick={handleClear}>
          clear all
        </button>
      </div>
      <div className="sticky top-0 bg-gray-100 p-4  mt-6 rounded-2xl">
        <Accordion
          type="multiple"
          // Set default open values, can also be stored in session storage if needed
          // defaultValue={["1", "2", "3", "4", "5"]}
          // collapsible

          defaultValue="5"
          collapsible={["1", "2", "3", "4"]}
        >
          {/* Price Accordion */}
          <AccordionItem value="5">
            <AccordionTrigger className="uppercase font-semibold hover:no-underline">
              Price
            </AccordionTrigger>
            <AccordionContent>
              <Slider
                // Use `value` to make it a controlled component
                value={[priceFilter.minPrice, priceFilter.maxPrice]}
                className="mt-1"
                max={3000}
                step={1}
                onValueChange={handlePriceChanged}
              />
              <div className="flex justify-between items-center pt-2">
                <span>
                  {priceFilter.minPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
                <span>
                  {priceFilter.maxPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              {/* <div className="mt-4">
                <ButtonLoading
                  type="button"
                  onclick={handlePriceFilter}
                  text="Filter price"
                  className="rounded-full"
                />
              </div> */}
            </AccordionContent>
          </AccordionItem>
          {/* Weights Accordion */}
          <AccordionItem value="1" className="bg-slate-50 px-2">
            <AccordionTrigger className="uppercase font-semibold hover:no-underline">
              Weights
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-48 overflow-auto">
                <ul>
                  {weightsData.map((weight, index) => (
                    <li key={index} className="mb-3 text-gray-900">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleWeightFilter(weight.value)
                          }
                          checked={selectedWeights.includes(weight.value)}
                          className="bg-white"
                        />
                        <span>{weight.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Flavours Accordion */}
          <AccordionItem value="2" className="bg-slate-50 px-2">
            <AccordionTrigger className="uppercase font-semibold hover:no-underline ">
              Flavours
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-48 overflow-auto">
                <ul>
                  {flavours.map((flavour, index) => (
                    <li key={index} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFlavoursFilter(flavour.value)
                          }
                          checked={selectedFlavours.includes(flavour.value)}
                          className="bg-white"
                        />
                        <span>{flavour.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Creams Accordion */}
          <AccordionItem value="3" className="bg-slate-50 px-2">
            <AccordionTrigger className="uppercase font-semibold hover:no-underline">
              Creams
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-48 overflow-auto">
                <ul>
                  {creams.map((cream, index) => (
                    <li key={index} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCreamsFilter(cream.value)
                          }
                          checked={selectedCreams.includes(cream.value)}
                          className="bg-white"
                        />
                        <span>{cream.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dietarys Accordion */}
          <AccordionItem value="4" className="bg-slate-50 px-2">
            <AccordionTrigger className="uppercase font-semibold hover:no-underline">
              Dietarys
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-48 overflow-auto">
                <ul>
                  {dietarys.map((dietary, index) => (
                    <li key={index} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleDietarysFilter(dietary.value)
                          }
                          checked={selectedDietarys.includes(dietary.value)}
                          className="bg-white"
                        />
                        <span>{dietary.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Filter;
