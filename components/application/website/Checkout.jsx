"use client";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { getLocalCartId } from "@/lib/helperFunction";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UpdateLoading from "./UpdateLoading";
import { useSelector } from "react-redux";

const Checkout = () => {
  const cartStore = useSelector((state) => state.cartStore);
  const count = cartStore.count;
  const cartId = typeof window !== "undefined" ? getLocalCartId() : null;

  const {
    data: getCart,
    loading,
    refetch,
  } = useFetch(`/api/cart/getCart/${cartId}`);
  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // 2. Add this useEffect to trigger a re-fetch whenever 'count' changes
  useEffect(() => {
    refetch();
  }, [count]); // <--- Dependency on count

  useEffect(() => {
    if (getCart && getCart.success) {
      const cart = getCart?.data;
      setSubTotal(cart.subTotal);
      setTotal(cart.total);
      setTotalDiscount(cart.totalDiscount);
    }
  }, [getCart]);

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <UpdateLoading />
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-bold">Checkout</h2>
      <div className="flex gap-10">
        <div className="lg:w-[70%] w-full"></div>
        <div className="lg:w-[30%] w-full">
          <div className="rounded bg-gray-50 p-5 sticky top-5">
            <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-medium py-2 ">Subtotal</td>
                    <td className="text-end py-2">
                      {subTotal?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2 ">Discount</td>
                    <td className="text-end py-2">
                      {totalDiscount?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2 ">
                      {`Delivery Fee | ${getCart?.data.distance}km`}{" "}
                    </td>
                    <td className="text-end py-2">
                      {getCart?.data?.delivery_fee?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2 ">Total</td>
                    <td className="text-end py-2">
                      {total.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col gap-y-4 mt-4">
                <Button type="button" asChild>
                  <Link href="" className="">
                    Proceed to Payment
                  </Link>
                </Button>
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
    </div>
  );
};

export default Checkout;
