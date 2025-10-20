"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import Editor from "@/components/application/admin/Editor";
import MediaModal from "@/components/application/admin/MediaModal";
import ButtonLoading from "@/components/application/ButtonLoading";
import Select from "@/components/application/Select";
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
import Image from "next/image";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import slugify from "slugify";

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
    label: "Add Coupon",
  },
];

const AddCoupon = () => {
  const [loading, setLoading] = useState(false);

  const formSchema = credentialsSchema.pick({
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data: response } = await axios.post("/api/coupon/create", values);

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
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
          <h4 className="text-xl font-semibold">Add Coupon</h4>
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
                  text="Add Coupon"
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

export default AddCoupon;
