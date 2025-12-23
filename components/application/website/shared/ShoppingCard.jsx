"use client";

import { RiShoppingBag4Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import AddToCard from "./AddToCard";
import { useEffect, useState } from "react";
import {
  removeProductToCart,
  updateInitialState,
} from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_CART } from "@/routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { getLocalCartId, setLocalCartId } from "@/lib/helperFunction";
import UpdateLoading from "../UpdateLoading";

const ShoppingCard = ({ cart }) => {
  const dispatch = useDispatch();
  const authFromStore = useSelector((store) => store.authStore.auth);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const cartStore = useSelector((state) => state.cartStore);
  const auth = useSelector((state) => state.authStore.auth);
  const count = cartStore.count;
  const products = cartStore.products;

  console.log(cart);

  const subTotal = cartStore.products.reduce(
    (acc, prod) => acc + prod.sellingPrice * prod.quantity,
    0
  );

  const itemTotal = cartStore.products.reduce(
    (acc, prod) => acc + prod.mrp * prod.quantity,
    0
  );

  const formatWeight = (w) => {
    const weight = Number(w);
    if (isNaN(weight)) return w; // fallback if invalid
    return weight >= 1000 ? `${(weight / 1000).toFixed(2)} kg` : `${weight} gm`;
  };

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
      userId: userId,
      productId: productId,
      variantId: productVariantId, // We always dispatch a quantity of 1 for the click action
      quantity: negativeQuantity,
      cartId: currentCartId ? currentCartId : null,
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

      setUpdateLoading(false);

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
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (cart) {
      dispatch(
        updateInitialState({
          products: cart?.cartItems,
          count: cart?.totalItem,
        })
      );
      localStorage.setItem("cartId", cart?._id);
    }
  }, [cart]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="flex relative">
          <RiShoppingBag4Line className="text-2xl" />
          <div className="w-5 h-5 flex justify-center items-center rounded-full bg-red-300 absolute -top-2 left-4 text-[12px] font-bold ">
            <span>{count}</span>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">Cart</SheetTitle>
        </SheetHeader>
        <div className="w-full h-[1px] bg-gray-100 px-2"></div>
        {/* <SheetDescription></SheetDescription> */}
        <div className="h-[calc(100vh-150px)] lg:h-[calc(100vh-40px)]">
          <div className="px-2 h-[calc(100%-160px)] overflow-auto pe-2 flex flex-col">
            {count === 0 && (
              <div className="h-full flex justify-center items-center text-xl font-semibold">
                Your Cart is Empty
              </div>
            )}
            {/* {updateLoading && (
              <div className="">
                <UpdateLoading />
              </div>
            )} */}
            <div>
              {products.map((prod) => (
                <div
                  className="flex gap-4 py-2 items-center border-b-2 border-gray-100"
                  key={prod.variantId}
                >
                  <div className="w-[60px] h-[60px]">
                    <Image
                      src={prod.media}
                      width={60}
                      height={60}
                      alt="prod"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">
                        <h2>{prod.productName}</h2>
                      </div>

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
                    </div>
                    <div>
                      <p>
                        {formatWeight(prod?.weight)}/{prod?.cream}/
                        {prod?.flavour}/{prod.dietary}
                      </p>
                    </div>
                    <div className="flex w-full  justify-between items-center ">
                      <div className="flex gap-2 items-center">
                        <span className="font-medium">
                          ₹{prod?.sellingPrice * prod.quantity}
                        </span>
                        {prod?.mrp !== prod?.sellingPrice ? (
                          <span className="font-medium text-sm line-through text-gray-500">
                            ₹{prod?.mrp * prod.quantity}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="flex justify-between items-center w-24 h-7 border-1">
                        <AddToCard
                          quantity={prod?.quantity}
                          setQuantity={setQuantity}
                          productId={prod?.productId}
                          productVariantId={prod.variantId}
                          setUpdateLoading={setUpdateLoading}
                          updateLoading={updateLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="mt-4">
              <h2 className="font-semibold">Bill Details</h2>
              <div className="flex justify-between">
                <h2>Item Total</h2>
                <div className="flex gap-2 items-center">
                  {itemTotal !== subTotal && (
                    <span className="text-sm line-through text-gray-500">
                      {itemTotal}
                    </span>
                  )}
                  <span>{subTotal}</span>
                </div>
              </div>
              <div className="w-full h-[1px] mt-4 bg-gray-200"></div>
            </div> */}
          </div>
          <div className="h-20 border-t pt-5 px-5 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 ">
              <span className="text-lg font-semibold">SubTotal</span>
              <span className="font-semibold">₹ {subTotal}</span>
            </div>
            {/* <div className="w-full h-[1px] bg-gray-400"></div> */}
            <div className="flex justify-between items-center gap-4 mt-4 border-t pt-4">
              <Button
                type="button"
                asChild
                variant="secondary"
                className="w-1/2"
                onClick={() => setOpen(false)}
              >
                <Link href={WEBSITE_CART}>View Card</Link>
              </Button>
              <Button type="button" asChild className="w-1/2">
                <Link href={WEBSITE_CART}>Continue Shopping </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCard;
