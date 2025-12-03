"use client";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { getLocalCartId } from "@/lib/helperFunction";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UpdateLoading from "./UpdateLoading";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "./shared/AddressCard";
import { setShowAddressForm } from "@/store/slices/settingSlice";
import AddressModal from "./shared/AddressModal";
import SelectedAddressCard from "./shared/SelectedAddressCard";
import { orderSchema } from "@/zodSchema/orderSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Daypicker from "./shared/Daypicker";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const showAddressForm = useSelector(
    (state) => state.settingStore.showAddressForm
  );

  const count = cartStore.count;
  const cartId = typeof window !== "undefined" ? getLocalCartId() : null;

  const {
    data: address,
    loading: addressLoading,
    refetch: refetchAddress,
  } = useFetch("/api/address/getAddress");

  const {
    data: getCart,
    loading,
    refetch,
  } = useFetch(`/api/cart/getCart/${cartId}`);

  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [refetchAddres, setRefetchAddres] = useState(false);
  const [showSelectedAddress, setShowSelectedAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});

  const formSchema = orderSchema.pick({
    addressId: true,
    cartId: true,
    delivery_date: true,
    time_slot: true,
    order_note: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressId: "",
      cartId: cartId || "", // Initialize cartId here
      delivery_date: undefined, // undefined works better for Dates with Zod than ""
      time_slot: "10AM - 7PM", // Typo fixed from "7AM" to "7PM" probably?
      order_note: "",
    },
  });

  // --- FIX: Sync selectedAddress with Form ---
  useEffect(() => {
    if (showSelectedAddress && selectedAddress?._id) {
      form.setValue("addressId", selectedAddress._id, { shouldValidate: true });
    }
  }, [showSelectedAddress, selectedAddress, form]);
  // -------------------------------------------

  useEffect(() => {
    refetch();
  }, [count]);

  useEffect(() => {
    refetchAddress();
  }, [refetchAddres]);

  useEffect(() => {
    if (getCart && getCart.success) {
      const cart = getCart?.data;
      setSubTotal(cart.subTotal);
      setTotal(cart.total);
      setTotalDiscount(cart.totalDiscount);
    }
  }, [getCart]);

  const onSubmit = async (values) => {
    console.log("SUCCESS:", values);
    // Proceed to API call here
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  if (loading || addressLoading)
    return (
      <div className="flex justify-center items-center">
        <UpdateLoading />
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-bold">Checkout</h2>
      <div className="flex gap-10 mt-4">
        <div className="lg:w-[70%] w-full">
          <div className="flex justify-between">
            {!showSelectedAddress ? (
              <div>
                <h2 className="text-lg font-semibold">
                  Choose a delivery address
                </h2>
                <p className="text-sm">Multiple addresses in this location</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <p>🚀</p>
              </div>
            )}

            <div>
              {!showSelectedAddress ? (
                <button
                  className="px-4 py-2 bg-primary text-white"
                  onClick={() => dispatch(setShowAddressForm(true))}
                >
                  Add Address
                </button>
              ) : (
                <div
                  className="text-orange-500 cursor-pointer"
                  onClick={() => setShowSelectedAddress(false)}
                >
                  CHANGE
                </div>
              )}
            </div>
          </div>

          {!showSelectedAddress && (
            <div className="flex flex-wrap gap-2 mt-4 w-full">
              {address?.data.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  setSelectedAddress={setSelectedAddress}
                  setShowSelectedAddress={setShowSelectedAddress}
                  showSelectedAddress={showSelectedAddress}
                  refetch={refetch}
                />
              ))}
            </div>
          )}

          {!showSelectedAddress && (
            <div className="flex flex-col gap-y-2 mt-6">
              <div className="w-full h-20 border flex p-4 items-center text-gray-400">
                Date of delivery
              </div>
              <div className="w-full h-20 border p-6 text-gray-400">
                Add message on your cake
              </div>
            </div>
          )}

          {showSelectedAddress && (
            <Form {...form}>
              <form
                id="checkout-form"
                onSubmit={form.handleSubmit(onSubmit, onError)}
              >
                <div className="grid grid-cols-1 mt-5">
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="addressId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selected Address</FormLabel>
                          <FormControl>
                            <Input
                              type="hidden"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          {/* Visual only, logic handled in useEffect */}
                          <SelectedAddressCard address={selectedAddress} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                  <div className="mb-1">
                    <FormField
                      control={form.control}
                      name="delivery_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Of Delivery</FormLabel>
                          <FormControl>
                            <Daypicker
                              onSelectDate={(date) => {
                                const valueToSet =
                                  date instanceof Date ? date : undefined;

                                form.setValue("delivery_date", valueToSet, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-1">
                    <FormField
                      control={form.control}
                      name="time_slot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred delivery timeslot</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 mt-5">
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="order_note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message on your cake</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          )}
        </div>

        {/* Sidebar Summary */}
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
                      {`Delivery Fee | ${getCart?.data.distance || 0}km`}
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
                <button
                  type="button"
                  className="w-full bg-black text-white py-2 rounded"
                  onClick={form.handleSubmit(onSubmit, onError)}
                  disabled={form.formState.isSubmitting}
                >
                  Proceed to Payment
                </button>
                <Button type="button" asChild variant="outline">
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        showAddressForm={showAddressForm}
        setRefetchAddres={setRefetchAddres}
        setSelectedAddress={setSelectedAddress}
        setShowSelectedAddress={setShowSelectedAddress}
        refetch={refetch}
      />
    </div>
  );
};

export default Checkout;
