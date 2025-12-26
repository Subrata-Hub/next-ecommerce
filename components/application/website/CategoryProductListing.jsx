"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";

import { RxCross2 } from "react-icons/rx";

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

  const cartProduct = useSelector((state) => state.cartStore.products);

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

  console.log(cartProduct);

  const productLength = data?.pages?.[0]?.totalProducts;

  // const cartVariantIds = cartProduct?.map((item) => item.variantId) || [];

  // // Flatten all pages and remove only the variants that are in the cart
  // const newProducts = data?.pages?.flatMap((page) =>
  //   page?.products?.map((product) => ({
  //     ...product,
  //     variants: product?.variants?.filter(
  //       (variant) => !cartVariantIds.includes(variant?._id)
  //     ),
  //   }))
  // );

  // const cartVariantIds = cartProduct?.map((item) => item.variantId) || [];

  // const newProducts = data?.pages?.flatMap((page) =>
  //   page?.products
  //     ?.map((product) => {
  //       const filteredVariants = product?.variants?.filter(
  //         (variant) => !cartVariantIds.includes(String(variant?._id))
  //       );

  //       return {
  //         ...product,
  //         variants: filteredVariants || [],
  //       };
  //     })
  //     // Optional: remove products that end up with zero variants
  //     ?.filter((product) => product?.variants?.length > 0)
  // );

  const cartItems = cartProduct || [];

  // const newProducts = data?.pages?.flatMap((page) =>
  //   page?.products?.map((product) => {
  //     // Find all variants in cart that belong to this product
  //     const productCartVariants = cartItems
  //       .filter((item) => item.productId === product._id)
  //       .map((item) => item.variantId);

  //     // Filter out only the variants that match those IDs
  //     let filteredVariants = [];
  //     if (product?.variants.length > 1) {
  //       // filteredVariants = product?.variants.isDefaultVariant;
  //       filteredVariants = product?.variants?.filter(
  //         (variant) => !productCartVariants.includes(variant?._id)
  //       );
  //     } else {
  //       filteredVariants = product?.variants?.filter((variant) =>
  //         productCartVariants.includes(variant?._id)
  //       );
  //     }

  //     return {
  //       ...product,
  //       variants: filteredVariants,
  //     };
  //   })
  // );

  const newProducts = data?.pages?.flatMap(
    (page) =>
      page?.products?.map((product) => {
        const originalVariants = product?.variants || [];

        // Get all variant IDs for this product that are in the cart
        const productCartVariantIds = cartItems
          .filter((item) => item.productId === product._id)
          .map((item) => item.variantId);

        // Get all variants that are NOT in the cart
        const variantsNotInCart = originalVariants.filter(
          (variant) => !productCartVariantIds.includes(variant?._id)
        );

        let finalVariants = [];

        if (variantsNotInCart.length > 0) {
          // Case 1: We have variants not in the cart. Use them.
          finalVariants = variantsNotInCart;
        } else if (originalVariants.length > 0) {
          // Case 2: All variants are in the cart (or the list was empty).
          // As you requested, keep the last variant as a fallback.
          finalVariants = [originalVariants[originalVariants.length - 1]];
        }
        // Case 3: originalVariants was empty, so finalVariants remains [].

        return {
          ...product,
          variants: finalVariants,
        };
      })
    // Optional: You might want to filter out products that end up
    // with no variants, though my logic ensures at least one.
    // .filter((product) => product.variants.length > 0)
  );

  const activeFilters = [
    {
      items: selectedWeights,
      type: "selectedWeights",
      style: "text-violet-600 border-2 border-violet-300",
    },
    {
      items: selectedFlavours,
      type: "selectedFlavours",
      style: "text-violet-600 border-2 border-violet-300",
    },
    {
      items: selectedCreams,
      type: "selectedCreams",
      style: "text-violet-600 border-2 border-violet-300",
    },
    {
      items: selectedDietarys,
      type: "selectedDietarys",
      style: "text-violet-600 border-2 border-violet-300",
    },
  ];

  const removeFilter = (filterType, value) => {
    // Map the string keys to their specific state setter functions
    const filterSetters = {
      selectedWeights: setSelectedWeights,
      selectedFlavours: setSelectedFlavours,
      selectedCreams: setSelectedCreams,
      selectedDietarys: setSelectedDietarys,
    };

    const setFilterState = filterSetters[filterType];

    // If a matching setter is found, filter the previous state
    if (setFilterState) {
      setFilterState((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleClear = () => {
    setPriceFilter({ minPrice: 0, maxPrice: 3000 });
    setSelectedWeights([]);
    setSelectedFlavours([]);
    setSelectedCreams([]);
    setSelectedDietarys([]);
    setSorting("default_sorting");
    sessionStorage.clear();
  };
  return (
    <div className="md:flex px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-10 md:pt-15">
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
              handleClear={handleClear}
            />
          </div>
        </div>
      ) : (
        <Sheet open={isMobileOpen} onOpenChange={() => setIsMobileOpen(false)}>
          <SheetContent side="left" className="z-[5000000000000]">
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
                handleClear={handleClear}
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

        <div className="flex gap-4 pt-4 flex-wrap">
          {activeFilters.map((group) =>
            group.items.map((item) => (
              <div
                key={`${group.type}-${item}`}
                className={`w-28 h-8 flex justify-between items-center px-2 rounded-xl ${group.style}`}
              >
                <p className="truncate text-sm">{item}</p>
                <span
                  className="cursor-pointer"
                  onClick={() => removeFilter(group.type, item)}
                >
                  <RxCross2 />
                </span>
              </div>
            ))
          )}
        </div>

        {isFetching && (
          <div className="p-3 font-semibold text-center">
            <Loadings className="flex justify-center items-center" />
          </div>
        )}
        {error && (
          <div className="p-3 font-semibold text-center">{error.message}.</div>
        )}

        <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-5 mt-6">
          {/* {data &&
            data?.pages?.map((page) =>
              page?.products?.map((prods) => (
                <Card key={prods._id} product={prods} />
              ))
            )} */}
          {newProducts?.map((prods) => (
            <Card key={prods._id} product={prods} />
          ))}
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
