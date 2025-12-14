"use client";
import CartBanner from "@/components/application/website/CartBanner";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_DETAILS,
  WEBSITE_CHECKOUT,
  WEBSITE_HOME,
} from "@/routes/WebsiteRoutes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import Image from "next/image";
import AddToCard from "@/components/application/website/shared/AddToCard";
import { RiDeleteBinLine } from "react-icons/ri";
import { addVariant, removeProductToCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { RiCoupon2Line } from "react-icons/ri";
import { credentialsSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { showToast } from "@/lib/showToast";
import { getLocalCartId, setLocalCartId } from "@/lib/helperFunction";
import Loadings from "@/components/application/Loadings";
import UpdateLoading from "@/components/application/website/UpdateLoading";
import { setLoginPopup, setPostLoginRedirect } from "@/store/slices/authSlice";
import AddressModal from "@/components/application/website/shared/AddressModal";
import { setShowAddressForm } from "@/store/slices/settingSlice";
import useFetch from "@/hooks/useFetch";

const cartPage = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutBtnLoading, setCheckoutBtnLoading] = useState(false);
  const [itemTotal, setItemTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const cartStore = useSelector((state) => state.cartStore);
  const count = cartStore.count;
  const products = cartStore.products;
  const loginPopup = useSelector((state) => state.authStore.loginPopup);
  const auth = useSelector((state) => state.authStore.auth);
  const showAddressForm = useSelector(
    (state) => state.settingStore.showAddressForm
  );

  // const { data: getAddress } = useFetch(`/api/address/getAddress`);

  const { data: address, loading: addressLoading } = useFetch(
    "/api/address/getAddress",
    "GET",
    {},
    !!auth // ⭐ only run when auth exists
  );

  const currentCartId = getLocalCartId();

  const formSchema = credentialsSchema.pick({
    code: true,
    cartId: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      cartId: currentCartId,
    },
  });

  const formatWeight = (w) => {
    const weight = Number(w);
    if (isNaN(weight)) return w; // fallback if invalid
    return weight >= 1000 ? `${(weight / 1000).toFixed(2)} kg` : `${weight} gm`;
  };

  useEffect(() => {
    const totalPrice = cartStore.products.reduce(
      (acc, prod) => acc + prod.sellingPrice * prod.quantity,
      0
    );

    setTotalPrice(totalPrice);

    const itemTotal = cartStore.products.reduce(
      (acc, prod) => acc + prod.mrp * prod.quantity,
      0
    );

    setItemTotal(itemTotal);

    const totalDiscount = itemTotal - totalPrice;

    setTotalDiscount(totalDiscount);
  }, [cartStore]);

  // const discount = itemTotal - totalPrice;

  const removeItem = async (productId, productVariantId, quantity) => {
    let currentCartId = getLocalCartId();
    const userId = auth !== null ? auth._id : auth;
    const existingProduct = products.find(
      (product) =>
        product.productId === productId &&
        product.variantId === productVariantId
    );
    const negativeQuantity = -existingProduct.quantity;
    const productData = {
      productId: productId,
      variantId: productVariantId, // We always dispatch a quantity of 1 for the click action
      quantity: negativeQuantity,
      cartId: currentCartId ? currentCartId : null,
      userId: userId,
    };

    setQuantity(1); // Dispatch productData instead of existingProduct
    dispatch(removeProductToCart({ ...productData, quantity: quantity }));
    try {
      // 2. API Call (Consolidated)
      setUpdateLoading(true);
      const { data: response } = await axios.post(
        "/api/cart/addToCart",
        productData
      );

      if (!response.success) {
        // If API fails, throw error for catch block
        throw new Error(response.message);
      }

      // 3. SAVE CART ID (Crucial for new guest carts)
      if (response.data && response.data.cartId) {
        setLocalCartId(response.data.cartId);
      }

      showToast("success", response.message || "Cart updated successfully");
    } catch (error) {
      console.error(error);
      showToast("error", error.message || "Failed to update cart");
    } finally {
      setUpdateLoading(false); // ADDED: Guaranteed loading cleanup
    }
  };

  const handleClick = (product) => {
    const selectedProductAndVariant = {
      productId: product._id,
      variantId: product?.variantId,
      mrp: product?.mrp,
      sellingPrice: product?.sellingPrice,
      weight: product?.weight,
      cream: product?.cream,
      dietary: product?.dietary,
      flavour: product?.flavour,
    };
    navigate.push(PRODUCT_DETAILS(product?.productUrl));
    dispatch(addVariant(selectedProductAndVariant));
  };

  const handleApplayCoupon = async (values) => {
    setLoading(true);
    try {
      // const { data: getCoupon } = await axios.post(
      //   `/api/coupon/get-coupon/${coupon?.code}`
      // );

      const { data: getCoupon } = await axios.post(
        `/api/cart/update-total-price`,
        values
      );

      if (!getCoupon.success) {
        throw new Error(getCoupon.message);
      }

      if (getCoupon.data.validity < Date.now()) {
        showToast(
          "error",
          `Coupon Expired on ${getCoupon.validity.toDateString()}`
        );
      }

      if (totalPrice >= getCoupon.data.minShoppingAmount) {
        const updatedDiscount =
          (totalPrice * getCoupon.data.discountPercentage) / 100;

        setTotalPrice(totalPrice - updatedDiscount);
        setTotalDiscount(totalDiscount + updatedDiscount);
        form.reset();
        showToast("success", "Coupon Applyed Successfully");
        setLoading(false);
      }
      if (totalPrice > getCoupon.data.minShoppingAmount) {
        showToast(
          "warning",
          `Minimum Shopping Amount ${getCoupon.data.minShoppingAmount}`
        );
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (addressLoading) {
  //     // showToast("error", "Please wait, loading your details...");
  //     return;
  //   }
  //   const updateCart = async () => {
  //     if (address?.data?.length > 0) {
  //       const addressId = address?.data?.[0]?._id;
  //       setCheckoutBtnLoading(true);
  //       try {
  //         const { data: getCart } = await axios.post(`/api/cart/update`, {
  //           cartId: currentCartId,
  //           addressId: addressId,
  //         });

  //         if (!getCart.success) {
  //           throw new Error(getCart.message);
  //         }

  //         setCheckoutBtnLoading(false);

  //         // navigate.push(WEBSITE_CHECKOUT);
  //         dispatch(setPostLoginRedirect(WEBSITE_CHECKOUT));
  //       } catch (error) {
  //         showToast("error", error.message);
  //       } finally {
  //         setCheckoutBtnLoading(false);
  //       }
  //     } else {
  //       return;
  //     }
  //   };

  //   updateCart();
  // }, [currentCartId, address?.data?.[0], auth]);

  const goToCheckout = async () => {
    if (addressLoading) {
      // showToast("error", "Please wait, loading your details...");
      return;
    }
    if (!auth) {
      dispatch(setLoginPopup(true));
      dispatch(setPostLoginRedirect(WEBSITE_CHECKOUT));
    } else if (!address || address.data.length === 0) {
      dispatch(setPostLoginRedirect(WEBSITE_CHECKOUT));
      dispatch(setShowAddressForm(true));
    } else {
      navigate.push(WEBSITE_CHECKOUT);
    }
  };

  return (
    <div className="">
      <CartBanner />
      {/* <div className="w-full flex flex-col md:hidden mt-10 px-4">
        <h1 className="text-2xl font-bold">Cart</h1>
        <p>There are 1 product in your cart</p>
      </div> */}
      {count === 0 ? (
        <div className="md:flex px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40 pt-20 justify-center items-center">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">Your Cart is Empty</h4>
            <Button type="button" asChild>
              <Link href={WEBSITE_HOME}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div>
            {updateLoading && (
              <div className="absolute top-[5%] right-[0%] w-screen z-[25400000]">
                <UpdateLoading />
              </div>
            )}
          </div>

          <div className="flex lg:flex-nowrap flex-wrap gap-10 mt-10 md:mt-0 my-0 md:my-10 px-4 md:px-4 lg:px-6 xl:px-15 2xl:px-40">
            <div className="lg:w-[70%] w-full">
              <table className="w-full border">
                <thead className="border-b bg-gray-50 md:table-header-group hidden">
                  <tr>
                    <th className="text-start p-3">Product</th>
                    <th className="text-start p-3">Price</th>
                    <th className="text-start p-3">Quanttity</th>
                    <th className="text-start p-3">Total</th>
                    {/* <th className="text-start p-3">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {products?.map((prod) => (
                    <tr
                      key={prod.variantId}
                      className="md:table-row block border-b"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-5">
                          <div className="w-[60px] h-[60px]">
                            <Image
                              src={prod.media || imagePlaceholder.src}
                              width={60}
                              height={60}
                              alt={prod.productName}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>

                          <div className="">
                            <h4
                              className="text-lg line-clamp-1 font-semibold"
                              onClick={() => handleClick(prod)}
                            >
                              {prod.productName}
                              {/* <Link href={PRODUCT_DETAILS(prod.url)}>
                              {prod.name}
                            </Link> */}
                            </h4>
                            <p className="text-sm text-gray-600 font-medium">
                              {formatWeight(prod?.weight)}/{prod?.cream}/
                              {prod?.flavour}/{prod.dietary}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-0 px-4 pb-2 text-center">
                        <span className="md:hidden font-medium">Price</span>
                        <span>
                          {(prod.sellingPrice * prod.quantity).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: "INR",
                            }
                          )}
                        </span>
                        <span className="text-sm line-through text-gray-500 ml-1">
                          {(prod.mrp * prod.quantity).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-4 pb-2  text-center">
                        <span className="md:hidden font-medium">Quantity</span>
                        <div className="flex relative justify-between items-center w-24 h-7 border-1">
                          <AddToCard
                            quantity={prod?.quantity}
                            setQuantity={setQuantity}
                            productId={prod?.productId}
                            productVariantId={prod.variantId}
                            setUpdateLoading={setUpdateLoading}
                            updateLoading={updateLoading}
                          />
                        </div>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-4 pb-2 text-center">
                        <span className="md:hidden font-medium">Total</span>
                        <div className="flex gap-6 items-center">
                          <span>
                            {(prod.sellingPrice * prod.quantity).toLocaleString(
                              "en-IN",
                              {
                                style: "currency",
                                currency: "INR",
                              }
                            )}
                          </span>

                          <span
                            className="flex line-through"
                            onClick={() =>
                              removeItem(
                                prod.productId,
                                prod.variantId,
                                prod.quantity
                              )
                            }
                          >
                            <RiDeleteBinLine className="" />
                          </span>
                        </div>
                      </td>
                      {/* <td className="md:table-cell flex justify-between md:p-3 px-4 pb-2 text-center">
                      <span className="md:hidden font-medium">Remove</span>
                      <div
                        className="flex"
                        onClick={() =>
                          removeItem(
                            prod.productId,
                            prod.variantId,
                            prod.quantity
                          )
                        }
                      >
                        <RiDeleteBinLine />
                      </div>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="w-full lg:w-[70%] h-auto border rounded-2xl mt-6 p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleApplayCoupon)}
                    className=""
                  >
                    <div className="flex gap-2">
                      <div className="mb-1 flex-1">
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="py-2">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                  <RiCoupon2Line />
                                  <h2>Apply Coupon</h2>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter Coupon Code"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-13">
                        <ButtonLoading
                          type="submit"
                          text="Apply"
                          className="cursor-pointer w-24 h-10"
                          loading={loading}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            <div className="lg:w-[30%] w-full">
              <div className="rounded bg-gray-50 p-5 sticky top-5">
                <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                <div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-medium py-2 ">Subtotal</td>
                        <td className="text-end py-2">
                          {itemTotal.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium py-2 ">Discount</td>
                        <td className="text-end py-2">
                          {totalDiscount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium py-2 ">Total</td>
                        <td className="text-end py-2">
                          {totalPrice.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex flex-col gap-y-4 mt-4">
                    {/* <Button type="button" asChild >
                      <Link href={WEBSITE_CHECKOUT} className="" >
                        Checkout
                      </Link>
                     
                    </Button> */}

                    <ButtonLoading
                      type="text"
                      text="Checkout"
                      onClick={goToCheckout}
                      className="w-full border py-2"
                      loading={addressLoading || checkoutBtnLoading}
                    />

                    <Button type="button" asChild>
                      <Link href={WEBSITE_HOME} className="">
                        Continue to Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div>
        <AddressModal showAddressForm={showAddressForm} />
      </div>
    </div>
  );
};

export default cartPage;
