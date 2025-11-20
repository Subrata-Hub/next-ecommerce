"use client";

import useFetch from "@/hooks/useFetch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WEBSITE_CART, WEBSITE_CATEGORY } from "@/routes/WebsiteRoutes";
import imgPlaceHolder from "@/public/assets/images/img-placeholder.webp";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";

import axios from "axios";

import AddToCard from "./shared/AddToCard";

import { Loader2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "@/store/slices/cartSlice";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";

import DOMPurify from "dompurify";
import Loadings from "../Loadings";

// Helper to get/set Cart ID from LocalStorage
const getLocalCartId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("cartId");
  }
  return null;
};

const setLocalCartId = (id) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartId", id);
  }
};

const ProductDetails = ({ product, isQuickView = false }) => {
  const variant = useSelector((store) => store.cartStore.selectedVariant);

  const dispatch = useDispatch();
  const router = useRouter();
  const [activeThumb, setActiveThumb] = useState();
  const [loading, setLoading] = useState(false);
  const [isAddedIntoCard, setIsAddedIntoCard] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [mrp, setMrp] = useState(variant.mrp);
  const [sellingPrice, setSellingPrice] = useState(variant.sellingPrice);
  const [discountPercentage, setDiscountPercentage] = useState(
    variant.discountPercentage
  );
  const [selectedWeights, setSelectedWeights] = useState(variant?.weight);
  const [selectedFlavours, setSelectedFlavours] = useState(variant?.flavour);
  const [selectedCreams, setSelectedCreams] = useState(variant?.cream);
  const [selectedDietarys, setSelectedDietarys] = useState(variant.dietary);
  const [updateLoading, setUpdateLoading] = useState(false);

  let currentCartId = getLocalCartId();

  const searchParams = new URLSearchParams({
    weight: selectedWeights,
    flavour: selectedFlavours,
    cream: selectedCreams,
    dietary: selectedDietarys,
  }).toString();

  const { data: getProductVariant, loading: prodactVariantLoading } = useFetch(
    `/api/product-variant/get-product-variant/${product?._id}/?${searchParams}`
  );
  // console.log(ProductVariant);
  const productVariant = getProductVariant?.data;
  const cartStore = useSelector((state) => state.cartStore);
  const existingProduct = cartStore.products.find(
    (p) => p.productId === product._id && p.variantId === productVariant?._id
  );

  // const fetchProductVariant = async () => {
  //   const searchParams = new URLSearchParams({
  //     weight: selectedWeights,
  //     flavour: selectedFlavours,
  //     cream: selectedCreams,
  //     dietary: selectedDietarys,
  //   }).toString();
  //   const { data: getProductVariant } = await axios.get(
  //     `/api/product-variant/get-product-variant/${product?._id}/?${searchParams}`
  //   );

  //   if (!getProductVariant.success) throw new Error(getProducts.message);

  //   return getProductVariant?.data

  //   console.log(getProductVariant);
  // };

  // useEffect(() => {
  //   fetchProductVariant();
  // }, [selectedWeights, selectedFlavours, selectedCreams, selectedDietarys]);

  // useEffect(() => {
  //   if (productVariant) {
  //     setSellingPrice(productVariant?.sellingPrice);
  //   }
  // }, [productVariant]);

  useEffect(() => {
    setActiveThumb(product.media[0].secure_url);
  }, []);

  useEffect(() => {
    if (productVariant) {
      // 2. The existingProduct variable is defined outside the useEffect
      //    and will update when the store changes.

      if (existingProduct) {
        // ⬅️ Correct check: `existingProduct` is the object, which is truthy
        setIsAddedIntoCard(true);

        // 3. Set the local quantity state to the persisted quantity
        setQuantity(existingProduct.quantity);
      } else {
        setIsAddedIntoCard(false);
        setQuantity(1); // Reset quantity if not in cart
      }
    }
  }, [productVariant, existingProduct]);

  useEffect(() => {
    if (productVariant) {
      setMrp(productVariant?.mrp);
      setSellingPrice(productVariant.sellingPrice);
      setDiscountPercentage(productVariant.discountPercentage);
    }
  }, [productVariant]);

  const handleThumb = (thumbUrl) => {
    setActiveThumb(thumbUrl);
  };

  const formatWeight = (w) => {
    const weight = Number(w);
    if (isNaN(weight)) return w; // fallback if invalid
    return weight >= 1000 ? `${(weight / 1000).toFixed(2)} kg` : `${weight} gm`;
  };

  const handleCreameChange = (value) => {
    setSelectedCreams(value);
  };

  const handleDietaryChange = (value) => {
    setSelectedDietarys(value);
  };

  const handleAddToCard = async () => {
    if (!productVariant || !productVariant._id) {
      showToast(
        "error",
        "Please select a valid option (Weight/Flavour) first."
      );
      return;
    }

    const weight = productVariant?.weight;
    const flavour = productVariant?.flavour;
    const cream = productVariant?.cream;
    const dietary = productVariant?.dietary;

    console.log(weight);
    const cardProduct = {
      productId: product._id,
      variantId: productVariant?._id,
      name: product.name,
      url: product.slug,
      weight: weight,
      flavour: flavour,
      cream: cream,
      dietary: dietary,
      mrp: productVariant?.mrp,
      sellingPrice: productVariant?.sellingPrice,
      media: product?.media[0]?.secure_url,
      quantity: 1,
    };

    const productData = {
      productId: product?._id,
      variantId: productVariant?._id,
      quantity: 1,
      cartId: currentCartId ? currentCartId : null,
    };
    dispatch(addProductToCart(cardProduct));

    // setUpdateLoading(true);
    setLoading(true);
    setIsAddedIntoCard(true);
    const { data: response } = await axios.post(
      "/api/cart/addToCart",
      productData
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    if (response.data && response.data.cartId) {
      setLocalCartId(response.data.cartId);
    }

    // setUpdateLoading(false);
    setLoading(false);
    setIsAddedIntoCard(true);

    showToast("success", "product added into card");
    router.push(WEBSITE_CART);
  };

  const safeDescription = DOMPurify.sanitize(product?.description || "");

  if (prodactVariantLoading)
    return (
      <div className="flex justify-center items-center">
        <Loadings />
      </div>
    );
  return (
    <div className={`${!isQuickView ? "lg:px-0" : "lg:px-4"} px-4`}>
      {!isQuickView && (
        <div className="my-6 px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`${WEBSITE_CATEGORY(product?.category?.[0]?.slug)}`}
                >
                  {product?.category?.[0]?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        <div className="md:w-1/2 xl:flex xl:justify-center  md:sticky md:top-0">
          <div className="xl:order-last xl:mb-0 mb-5 xl:w-calc(100%-144px}">
            <div className="w-[470px] h-[420px]">
              <Image
                src={activeThumb || imgPlaceHolder.src}
                alt="pro-img"
                width={450}
                height={420}
                className="border rounded w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="flex xl:flex-col items-center xl-gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
            {product.media?.map((thumb) => (
              <Image
                key={thumb?._id}
                src={thumb.secure_url || imgPlaceHolder.src}
                alt="pro-img"
                width={120}
                height={80}
                onClick={() => handleThumb(thumb.secure_url)}
                className={`md:w-[120px] h-[80px] max-w-16 rounded cursor-pointer ${
                  thumb.secure_url === activeThumb
                    ? "border-2 border-primary"
                    : "border"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:mt-0 mt-5 ">
          <div className="md:flex gap-4 items-center">
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <span>
              <MdFavoriteBorder className="text-2xl" />
            </span>
          </div>

          {!prodactVariantLoading ? (
            <div className="flex items-center gap-2 mb-3">
              {sellingPrice > 0 && (
                <span className="text-xl font-semibold">
                  {sellingPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              )}
              {discountPercentage > 0 ? (
                <span className="text-sm line-through text-gray-500">
                  {mrp.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              ) : (
                ""
              )}
              {discountPercentage > 0 ? (
                <span className="bg-red-500 rounded-2xl px-3 py-1 text-xs ms-5 font-semibold">
                  {discountPercentage}%
                </span>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3 w-48 h-10 rounded-2xl bg-gray-100 animate-pulse"></div>
          )}

          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{
              // __html: decode(product?.description || ""),
              __html: safeDescription,
            }}
          ></div>
          <div className="mt-6">
            <h1 className="text-2xl font-semibold">Select Weight</h1>
            <div className="md:w-[300px] bg-white mt-2">
              <Select
                value={selectedWeights}
                onValueChange={(value) => setSelectedWeights(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent>
                  {product?.weights?.map((sort) => (
                    <SelectItem key={sort} value={sort} className="text-md">
                      {formatWeight(sort)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold">Cream</h2>
            <div className="flex gap-4 mt-2">
              {product?.creams?.map((cream, index) => (
                <button
                  key={index}
                  // className="px-5 py-2 bg-gray-200 rounded-xl"
                  // onClick={(e) => handleCreameChange(e.target.value)}
                  className={`px-5 py-2 rounded-xl ${
                    selectedCreams === cream
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleCreameChange(cream)}
                >
                  {cream}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-semibold">Select Flavour</h1>
            <div className="md:w-[200px] bg-white mt-2">
              <Select
                value={selectedFlavours}
                onValueChange={(value) => setSelectedFlavours(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>

                <SelectContent position="popper">
                  {product?.flavours?.map((sort) => (
                    <SelectItem key={sort} value={sort}>
                      {sort}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold">Dietary Preference</h2>
            <div className="flex gap-4 mt-2">
              {product?.dietarys?.map((dietary, index) => (
                <button
                  key={index}
                  className={`px-5 py-2 rounded-xl ${
                    selectedDietarys === dietary
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleDietaryChange(dietary)}
                >
                  {dietary}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="font-bold mb-2">Quantity</p>
            <div className="mt-5 w-full rounded-full py-4 text-md bg-blue-500 flex justify-center items-center ">
              <div
                className="flex justify-between gap-4"
                onClick={handleAddToCard}
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {(loading || !isAddedIntoCard) && "Add to Card"}
              </div>
              {isAddedIntoCard && !loading && (
                <AddToCard
                  quantity={quantity || existingProduct?.quantity}
                  setQuantity={setQuantity}
                  productId={product?._id}
                  productVariantId={productVariant?._id}
                  setUpdateLoading={setUpdateLoading}
                  updateLoading={updateLoading}
                  isDiffLoading={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
