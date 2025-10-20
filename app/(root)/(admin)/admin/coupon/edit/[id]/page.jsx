"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";

import ButtonLoading from "@/components/application/ButtonLoading";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { credentialsSchema } from "@/lib/zodSchema";
import { ADMIN_COUPON_SHOW, ADMIN_DASBOARD } from "@/routes/AddminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dayjs from "dayjs";

import { use, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

const breadCrumbData = [
  {
    href: ADMIN_DASBOARD,
    label: "Home",
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: "Coupons",
  },
  {
    href: "",
    label: "Edit Coupon",
  },
];

const Editcoupon = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  const { data: getCoupon } = useFetch(`/api/coupon/get/${id}`);

  const formSchema = credentialsSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "",
    },
  });

  useEffect(() => {
    if (getCoupon && getCoupon.success) {
      const coupon = getCoupon.data;
      form.reset({
        _id: coupon?._id,
        code: coupon.code,
        minShoppingAmount: coupon.minShoppingAmount,
        discountPercentage: coupon.discountPercentage,
        validity: dayjs(coupon.validity).format("YYYY-MM-DD"),
      });
    }
  }, [getCoupon]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data: response } = await axios.put("/api/coupon/update", values);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-4 px-3 border-b [.border-b:pb-2]">
          <h4 className="text-xl font-semibold">Edit coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="mb-1">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Code"
                            {...field}
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
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Min Shopping Amount
                          <span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Number"
                            placeholder="Enter Min Shopping Amount"
                            {...field}
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
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentage
                          <span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Number"
                            placeholder="Enter discount Percentage"
                            {...field}
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
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Validity<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input type="Date" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-5">
                <ButtonLoading
                  type="submit"
                  text="Save Changes"
                  className="cursor-pointer"
                  loading={loading}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editcoupon;
