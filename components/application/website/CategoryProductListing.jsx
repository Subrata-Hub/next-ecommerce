"use client";
import useFetch from "@/hooks/useFetch";
import React, { useMemo, useState } from "react";
import Filter from "./Filter";
import Link from "next/link";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import { usePathname } from "next/navigation";
import Sorting from "./Sorting";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSize";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Card from "./shared/Card";
import ButtonLoading from "../ButtonLoading";
import Loadings from "../Loadings";

// Helper function to get items from sessionStorage
const getInitialState = (key, defaultValue) => {
  if (typeof window === "undefined") {
    return defaultValue; // Return default if on server
  }
  const saved = sessionStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

const CategoryProductListing = ({ categoryData }) => {
  const windowSize = useWindowSize();

  const [sorting, setSorting] = useState("default_sorting");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [priceFilter, setPriceFilter] = useState(() =>
    getInitialState("filterPrice", { minPrice: 0, maxPrice: 3000 })
  );
  const [selectedWeights, setSelectedWeights] = useState(() =>
    getInitialState("filterWeights", [])
  );
  const [selectedFlavours, setSelectedFlavours] = useState(() =>
    getInitialState("filterFlavours", [])
  );
  const [selectedCreams, setSelectedCreams] = useState(() =>
    getInitialState("filterCreams", [])
  );
  const [selectedDietarys, setSelectedDietarys] = useState(() =>
    getInitialState("filterDietarys", [])
  );

  const searchParams = {
    weight: selectedWeights,
    flavour: selectedFlavours,
    cream: selectedCreams,
    dietary: selectedDietarys,
    minPrice: priceFilter.minPrice,
    maxPrice: priceFilter.maxPrice,
  };

  const fetchProduct = async (pageParam) => {
    if (!categoryData?._id) return { products: [], nextPage: null };
    const searchParams = new URLSearchParams({
      // page: pageParam,
      // limit: 10,
      weight: selectedWeights.join(","),
      flavour: selectedFlavours.join(","),
      cream: selectedCreams.join(","),
      dietary: selectedDietarys.join(","),
      minPrice: priceFilter.minPrice,
      maxPrice: priceFilter.maxPrice,
      // sort: sorting,
    }).toString();
    const { data: getProducts } = await axios.get(
      `/api/category/products/${categoryData._id}?page=${pageParam}&limit=10&${searchParams}&sort=${sorting}`
    );
    if (!getProducts.success) throw new Error(getProducts.message);

    return getProducts.data;
  };

  const { error, data, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["products", sorting, searchParams],
      queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextPage;
      },
    });

  console.log(data);

  const productLength = data?.pages?.[0]?.totalProducts;

  return (
    <div className="md:flex px-4 md:px-40 pt-10 md:pt-15">
      {windowSize.width > 1024 ? (
        <div className="w-72 me-4">
          <div className="">
            <Filter
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              selectedWeights={selectedWeights}
              setSelectedWeights={setSelectedWeights}
              selectedFlavours={selectedFlavours}
              setSelectedFlavours={setSelectedFlavours}
              selectedCreams={selectedCreams}
              setSelectedCreams={setSelectedCreams}
              selectedDietarys={selectedDietarys}
              setSelectedDietarys={setSelectedDietarys}
            />
          </div>
        </div>
      ) : (
        <Sheet open={isMobileOpen} onOpenChange={() => setIsMobileOpen(false)}>
          <SheetContent side="left" className="block">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="p-4 overflow-auto h-[calc(100vh-80px)]">
              <Filter
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                selectedWeights={selectedWeights}
                setSelectedWeights={setSelectedWeights}
                selectedFlavours={selectedFlavours}
                setSelectedFlavours={setSelectedFlavours}
                selectedCreams={selectedCreams}
                setSelectedCreams={setSelectedCreams}
                selectedDietarys={selectedDietarys}
                setSelectedDietarys={setSelectedDietarys}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="lg:w-[calc(100%-18rem)] lg:pl-4">
        <Sorting
          sorting={sorting}
          setSorting={setSorting}
          categoryData={categoryData}
          mobileFilterOpen={isMobileOpen}
          setMobileFilterOpen={setIsMobileOpen}
          productLength={productLength}
        />

        {isFetching && (
          <div className="p-3 font-semibold text-center">
            <Loadings className="flex justify-center items-center" />
          </div>
        )}
        {error && (
          <div className="p-3 font-semibold text-center">{error.message}.</div>
        )}
        <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-5 mt-6">
          {data &&
            data?.pages?.map((page) =>
              page?.products?.map((prods) => (
                <Card key={prods._id} product={prods} />
              ))
            )}
        </div>
        <div className="flex justify-center mt-10">
          {hasNextPage ? (
            <ButtonLoading
              type="button"
              loading={isFetching}
              text="load more"
              onclick={fetchNextPage}
            />
          ) : (
            <>{!isFetching && <span>No more data to load</span>}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductListing;
