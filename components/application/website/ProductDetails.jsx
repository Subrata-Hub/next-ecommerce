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

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const ProductDetails = ({ product, isQuickView = false }) => {
  const variant = useSelector((store) => store.cartStore.selectedVariant);
  const auth = useSelector((state) => state.authStore.auth);
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

    const userId = auth !== null ? auth._id : auth;

    console.log(weight);
    const cardProduct = {
      // userId: userId,
      productId: product._id,
      variantId: productVariant?._id,
      // name: product.name,
      productName: product.name,
      // url: product.slug,
      productUrl: product.slug,
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
      userId: userId,
      productId: product?._id,
      variantId: productVariant?._id,
      quantity: 1,
      cartId: currentCartId ? currentCartId : null,
      // distance: 0,
      // delivery_fee: 0,
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
    <>
      <div className={`${!isQuickView ? "lg:px-0" : "lg:px-4"} px-4 `}>
        {!isQuickView && (
          <div className="my-6 xl:px-8 2xl:px-8">
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

        <div className="lg:flex justify-between items-start lg:gap-10 xl:gap-15 gap-5 mb-20">
          <div className="lg:w-1/2  xl:flex justify-center  lg:sticky lg:top-0">
            <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-60px)]">
              <div className="w-full lg:w-[470px] lg:h-[420px] aspect-[4/3] overflow-hidden">
                <Image
                  src={activeThumb || imgPlaceHolder.src}
                  alt="pro-img"
                  width={450}
                  height={420}
                  loading="lazy"
                  className="border rounded w-full h-full object-cover object-center"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(450, 420)
                  )}`}
                />
              </div>
            </div>

            <div className="flex xl:flex-col items-center xl-gap-5 gap-6 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
              {product.media?.map((thumb) => (
                <Image
                  key={thumb?._id}
                  src={thumb.secure_url || imgPlaceHolder.src}
                  alt="pro-img"
                  width={120}
                  height={80}
                  onClick={() => handleThumb(thumb.secure_url)}
                  className={` lg:w-[120px] lg:h-[80px] w-8 h-8 md:w-12 md:h-12 max-w-12 max-h-12 rounded cursor-pointer ${
                    thumb.secure_url === activeThumb
                      ? "border-2 border-primary"
                      : "border"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 md:mt-0 mt-5 ">
            <div className="flex  justify-between  items-center lg:justify-normal gap-4">
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div>
                <MdFavoriteBorder className="text-3xl" />
              </div>
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
            <div
              className={`w-full md:flex mt-5 ${
                isQuickView ? "flex" : "hidden"
              } `}
            >
              {/* <p className="font-bold mb-2">Quantity</p> */}
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

      {!isQuickView && (
        <div className="flex w-full items-center px-4 pb-2 md:hidden fixed  bottom-[70px] border-t border-gray-200 bg-white left-0 z-50">
          <div className="w-[120px]">
            {sellingPrice > 0 && (
              <span className="text-xl font-semibold">
                {sellingPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            )}
          </div>

          <div className="mt-5 w-[calc(100%-120px)] rounded-full py-3 text-md bg-blue-500 flex justify-center items-center">
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
      )}
    </>
  );
};

export default ProductDetails;
