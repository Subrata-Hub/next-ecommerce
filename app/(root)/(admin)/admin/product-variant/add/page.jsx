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
import { creams, dietarys, flavours, weightsData } from "@/lib/utils";
import { credentialsSchema } from "@/lib/zodSchema";
import {
  ADMIN_DASBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AddminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

const breadCrumbData = [
  {
    href: ADMIN_DASBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: "ProductVariant",
  },
  {
    href: "",
    label: "Add Variant",
  },
];

const AddProductVariant = () => {
  const [loading, setLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);

  const { data: getProduct } = useFetch(
    "/api/product?deleteType=SD&& size=10000"
  );

  // const [open, setOpen] = useState(false);
  // const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data;
      const option = data.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setProductOption(option);
    }
  }, [getProduct]);

  const formSchema = credentialsSchema.pick({
    product: true,
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
      product: "",
      weight: [],

      cream: "",
      flavour: "",
      dietary: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
    },
  });

  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;
    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discountPercentage));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      // if (selectedMedia.length <= 0) {
      //   return showToast("error", "Please select media");
      // }

      // const mediaIds = selectedMedia.map((media) => media._id);
      // values.media = mediaIds;
      const { data: response } = await axios.post(
        "/api/product-variant/create",
        values
      );

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
          <h4 className="text-xl font-semibold">Add Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid md:grid-cols-2 gap-5">
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
                            isMulti={true}
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
                            isMulti={true}
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
                            isMulti={true}
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
                            isMulti={true}
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

                {/* <div className="mb-5 md:col-span-2">
                  <FormLabel className="mb-2">
                    Description<span className="text-red-500">*</span>
                  </FormLabel>
                  <Editor onChange={editor} />
                  <FormMessage></FormMessage>
                </div> */}
              </div>

              {/* <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media?.url}
                          height={100}
                          width={100}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Select Media</span>
                </div>
              </div> */}

              <div className="mt-5">
                <ButtonLoading
                  type="submit"
                  text="Add Product Varient"
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

export default AddProductVariant;
