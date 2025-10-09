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
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASBOARD,
} from "@/routes/AddminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { use, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import slugify from "slugify";

const breadCrumbData = [
  {
    href: ADMIN_DASBOARD,
    label: "Home",
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: "Category",
  },
  {
    href: "",
    label: "Add Category",
  },
];

const EditCategory = ({ params }) => {
  const { id } = use(params);
  const { data: categoryData } = useFetch(`/api/category/get/${id}`);
  const [loading, setLoading] = useState(false);
  const formSchema = credentialsSchema.pick({
    _id: true,
    name: true,
    slug: true,
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (categoryData && categoryData.success) {
      const data = categoryData.data;
      form.reset({
        _id: data?._id,
        name: data?.name,
        slug: data?.slug,
      });
    }
  }, [categoryData]);

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put(
        "/api/category/update",
        values
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      // form.reset()
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
          <h4 className="text-xl font-semibold">Edit Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
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

              <div>
                <ButtonLoading
                  type="submit"
                  text="Update Category"
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

export default EditCategory;
