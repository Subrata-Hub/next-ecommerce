"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";

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
import {
  creams,
  defaultVariant,
  dietarys,
  flavours,
  weightsData,
} from "@/lib/utils";
import { credentialsSchema } from "@/lib/zodSchema";
import {
  ADMIN_DASBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AddminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { use, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

const breadCrumbData = [
  {
    href: ADMIN_DASBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: "Product Variants",
  },
  {
    href: "",
    label: "Edit Variant",
  },
];

const EditProduct = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);

  const { data: getProduct } = useFetch("/api/product?deleteType=SD&size=1000");

  console.log(getProduct);

  const { data: getProductVariant } = useFetch(
    `/api/product-variant/get/${id}`
  );

  const formSchema = credentialsSchema.pick({
    _id: true,
    product: true,
    isDefaultVariant: true,
    weight: true,
    cream: true,
    flavour: true,
    dietary: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      product: "",
      isDefaultVariant: false,
      weight: "",
      cream: "",
      flavour: "",
      dietary: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
    },
  });

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data;
      const option = data.map((cat) => ({ label: cat.name, value: cat._id }));
      setProductOption(option);
    }
  }, [getProduct]);

  useEffect(() => {
    if (getProductVariant && getProductVariant.success) {
      const productVariant = getProductVariant.data;
      form.reset({
        _id: productVariant?._id,

        product: productVariant.product,
        isDefaultVariant: productVariant.isDefaultVariant,
        weight: productVariant.weight,

        cream: productVariant.cream,
        flavour: productVariant.flavour,
        dietary: productVariant.dietary,
        mrp: productVariant.mrp,
        sellingPrice: productVariant.sellingPrice,
        discountPercentage: productVariant.discountPercentage,
      });
    }
  }, [getProductVariant]);

  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;
    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discountPercentage));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  useEffect(() => {
    const isDefaultVariant = form.getValues("isDefaultVariant");
    const selectedProductId = form.getValues("product");
    const productVariant = getProductVariant?.data;
    const mrp = productVariant?.mrp || 0;
    const sellingPrice = productVariant?.sellingPrice || 0;
    const discountPercentage = productVariant?.discountPercentage || 0;

    if (isDefaultVariant && selectedProductId) {
      const fetchProduct = async () => {
        try {
          const { data: res } = await axios.get(
            `/api/product/get-product/${selectedProductId}`
          );
          if (res.success && res.data) {
            const product = res.data;
            form.setValue("mrp", product.mrp);
            form.setValue("sellingPrice", product.sellingPrice);
            form.setValue("discountPercentage", product.discountPercentage);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchProduct();
    } else {
      form.setValue("mrp", mrp);
      form.setValue("sellingPrice", sellingPrice);
      form.setValue("discountPercentage", discountPercentage);
    }
  }, [form.watch("isDefaultVariant")]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data: response } = await axios.put(
        "/api/product-variant/update",
        values
      );

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
          <h4 className="text-xl font-semibold">Edit Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="mb-1">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={productOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Weight<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={weightsData}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="cream"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cream<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={creams}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="flavour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          flavour<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={flavours}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="dietary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          dietary<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={dietarys}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Number"
                            placeholder="Enter MRP"
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
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          sellingPrice<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Number"
                            placeholder="Enter sellingPrice"
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
                          discountPercentage
                          <span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Number"
                            readOnly
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
                    name="isDefaultVariant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          IsDefaultVariant<span className="text-red-500"></span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={defaultVariant}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
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

export default EditProduct;
