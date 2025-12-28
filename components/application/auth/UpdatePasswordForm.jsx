"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { credentialsSchema } from "@/lib/zodSchema";

import { Form } from "@/components/ui/form";

import ButtonLoading from "@/components/application/ButtonLoading";
import z from "zod";

import axios from "axios";
import { showToast } from "@/lib/showToast";

import { PasswordField } from "./PasswordField";

const UpdatePasswordForm = ({
  email,
  onPasswordUpdateSuccess,
  onUpdatePasswordFail,
}) => {
  const [loading, setLoading] = useState(false);

  const formSchema = credentialsSchema
    .pick({
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "password and confirm password must be same",
      path: ["confirmPassword"],
    });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true);
      const { data: passwordUpdateResponse } = await axios.put(
        "/api/auth/reset-password/update-password",
        values
      );
      if (!passwordUpdateResponse.success) {
        throw new Error(passwordUpdateResponse.message);
      }

      form.reset();
      showToast("success", passwordUpdateResponse.message);

      onPasswordUpdateSuccess();
    } catch (error) {
      // showToast("error", error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      onUpdatePasswordFail(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="************"
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="************"
          />
          <div className="mt-4">
            <ButtonLoading
              type="submit"
              text="Update Password"
              className="w-full cursor-pointer"
              loading={loading}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePasswordForm;
