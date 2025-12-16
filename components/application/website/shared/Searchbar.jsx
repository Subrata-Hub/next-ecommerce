"use client";
import useFetch from "@/hooks/useFetch";
import { categorieMenu } from "@/lib/categorieMenu";
import { PRODUCT_DETAILS } from "@/routes/WebsiteRoutes";
import { appStore } from "@/store/appStore";
import { addVariant } from "@/store/slices/cartSlice";
import { cacheResults, clearStore } from "@/store/slices/searchSlice";
import axios from "axios";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const Searchbar = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();

  const categories = categorieMenu
    .flatMap((category) => category.subCategory && category.subCategory)
    .filter((subcatory) => subcatory !== undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [productSuggestion, setProductSuggestion] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const searchCache = useSelector((store) => store.searchStore);

  // const { data: productSuggestion } = useFetch(`/api/search?${searchParams}`);

  // console.log(productSuggestion);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (query === "") {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === categories.length - 1 ? 0 : prevIndex + 1
        );
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [categories, query]);

  const getSearchSuggestion = async (query) => {
    const searchParams = new URLSearchParams({
      q: query,
    }).toString();
    if (query && query !== "") {
      const { data: products } = await axios.get(`/api/search?${searchParams}`);
      if (!products.success) {
        return;
      }

      setProductSuggestion(products.data);

      setShowSuggestion(true);

      dispatch(cacheResults({ [query]: products.data }));
    }

    // return productSuggestion.data;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === "") {
        // If query is empty, hide everything immediately
        setProductSuggestion([]);
        setShowSuggestion(false);
        return;
      }
      if (searchCache[query]) {
        setProductSuggestion(searchCache[query]);
      } else {
        getSearchSuggestion(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setProductSuggestion([]);
    dispatch(clearStore());
    setQuery("");
  }, []);

  const handleClick = (product) => {
    setShowSuggestion(false);
    setQuery("");
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
    navigate.push(PRODUCT_DETAILS(product?.slug));
    dispatch(addVariant(selectedProductAndVariant));
  };

  return (
    <div className="relative w-full xl:w-[440px] 2xl:w-[400px]">
      <div className="relative w-full rounded-xl bg-gray-200">
        <input
          type="search"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          // SHOW when user clicks inside
          onFocus={() => {
            if (productSuggestion.length > 0) setShowSuggestion(true);
          }}
          // HIDE when user clicks outside (with delay to allow clicking items)
          onBlur={() => {
            setTimeout(() => setShowSuggestion(false), 200);
          }}
          placeholder={
            categories.length > 0
              ? `Search for ${categories[currentIndex]?.title}...`
              : "Search..."
          }
          className="w-full h-[55px] px-4 relative bg-transparent outline-none text-gray-700 placeholder-gray-500 rounded-xl"
        />
        <IoIosSearch className="absolute top-[40%] right-2" />
      </div>
      {showSuggestion && (
        <div
          className="w-full max-h-[250px] absolute overflow-y-scroll top-13 z-[100] bg-white shadow-2xl"
          // onFocus={() => setShowSuggestion(false)}
        >
          {productSuggestion.map((prod) => (
            <div
              key={prod._id}
              className="mx-1 mt-1 bg-white hover:bg-gray-200"
            >
              <div
                className="flex gap-4 items-center px-2 py-1 cursor-pointer"
                // onClick={() => handleClick(prod)}
                // onMouseDown fires BEFORE the input's onBlur, ensuring the click always registers.
                onMouseDown={(e) => {
                  e.preventDefault(); // Optional: prevents focus loss flickering
                  handleClick(prod);
                }}
              >
                <div className="w-10 h-10 bg-gray-200  flex items-center justify-center">
                  <Image
                    src={
                      prod?.media?.[0]?.secure_url ||
                      "https://placehold.co/250x150/cccccc/ffffff?text=No+Image"
                    }
                    width={40}
                    height={40}
                    alt="categori-img"
                    className="w-8 h-8 object-none rounded-md"
                  />
                </div>

                <h1>{prod.name}</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
