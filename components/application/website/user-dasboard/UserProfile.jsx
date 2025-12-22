"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Daypicker from "../shared/Daypicker";
import ButtonLoading from "../../ButtonLoading";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);

  console.log(user);
  const formSchema = authSchema.pick({
    name: true,
    email: true,
    phoneNumber: true,
    date_of_brith: true,
    date_of_anniversary: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      // date_of_brith: formatPlainDate(user?.date_of_brith),
      // date_of_anniversary: formatPlainDate(user?.date_of_anniversary),
      date_of_brith: user?.date_of_brith
        ? new Date(user.date_of_brith)
        : undefined,
      date_of_anniversary: user?.date_of_anniversary
        ? new Date(user.date_of_anniversary)
        : undefined,
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/users/update-profile",
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
    <div className="">
      <div className="px-4 py-2 border-b border-b-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Personal Information</h1>
        <Avatar className="w-20 h-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-5">
              <div className="mb-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          type="email"
                          placeholder="example@gmail.com"
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PhoneNumber</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-1">
                <FormField
                  control={form.control}
                  name="date_of_brith"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Of Brith</FormLabel>
                      <FormControl>
                        <Daypicker
                          disableFuture
                          // onSelectDate={(date) => {
                          //   const valueToSet =
                          //     date instanceof Date ? date : undefined;

                          //   form.setValue("date_of_brith", valueToSet, {
                          //     shouldValidate: true,
                          //     shouldDirty: true,
                          //   });
                          // }}
                          value={field.value}
                          onSelectDate={(date) => {
                            field.onChange(date ?? undefined);
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
                  name="date_of_anniversary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Of Anniversary</FormLabel>
                      <FormControl>
                        <Daypicker
                          disableFuture
                          // onSelectDate={(date) => {
                          //   const valueToSet =
                          //     date instanceof Date ? date : undefined;

                          //   form.setValue("date_of_anniversary", valueToSet, {
                          //     shouldValidate: true,
                          //     shouldDirty: true,
                          //   });
                          // }}
                          value={field.value}
                          onSelectDate={(date) => {
                            field.onChange(date ?? undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <ButtonLoading
                type="submit"
                text="Update Profile"
                className="cursor-pointer"
                loading={loading}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;
