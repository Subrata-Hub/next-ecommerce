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
import { ADMIN_DASBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AddminPanelRoutes";
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
    href: ADMIN_PRODUCT_SHOW,
    label: "Products",
  },
  {
    href: "",
    label: "Add Product",
  },
];

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const { data: getCategory } = useFetch(
    "/api/category?deleteType=SD&size=1000"
  );

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data;
      const option = data.map((cat) => ({ label: cat.name, value: cat._id }));
      setCategoryOption(option);
    }
  }, [getCategory]);
  const formSchema = credentialsSchema.pick({
    name: true,
    slug: true,
    category: true,

    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);

  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;
    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discountPercentage));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };
  const onSubmit = async (values) => {
    setLoading(true);

    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select media");
      }

      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      const { data: response } = await axios.post(
        "/api/product/create",
        values
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
      form.setValue("description", "");
      setSelectedMedia([]);
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
          <h4 className="text-xl font-semibold">Add Product</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="mb-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name<span className="text-yellow-300">*</span>{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Category Name"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug<span className="text-yellow-300">*</span>{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Slug"
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-yellow-300">*</span>{" "}
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
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
                          MRP <span className="text-yellow-300">*</span> (For
                          default Variant)
                          <span className="text-red-500"></span>
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
                          sellingPrice{" "}
                          <span className="text-yellow-300">*</span> (For
                          default Variant)
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
                          <span className="text-yellow-300">*</span>
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

                <div className="mb-5 md:col-span-2">
                  <FormLabel className="mb-2">
                    Description
                    <span className="text-yellow-500">*</span>{" "}
                  </FormLabel>
                  <Editor onChange={editor} />
                  <FormMessage></FormMessage>
                </div>
              </div>

              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
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
              </div>

              <div className="mt-5">
                <ButtonLoading
                  type="submit"
                  text="Add Product"
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

export default AddProduct;
