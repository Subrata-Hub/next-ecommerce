"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { credentialsSchema } from "@/lib/zodSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/application/ButtonLoading";

import { showToast } from "@/lib/showToast";
import axios from "axios";

const ResetPasswordForm = ({
  onSwitchToLogin,
  handleEmailVerificationSuccess,
  setOtpEmail,
  onResetPasswordFail,
}) => {
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);

  const fromSchema = credentialsSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values
      );
      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }

      setOtpEmail(values.email);
      handleEmailVerificationSuccess();

      showToast("success", sendOtpResponse.message);
    } catch (error) {
      // showToast("error", error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      onResetPasswordFail(errorMessage);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEmailVerification)}>
          <div className="mb-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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

          <div>
            <ButtonLoading
              type="submit"
              text="Send OTP"
              className="w-full cursor-pointer"
              loading={emailVerificationLoading}
            />
          </div>
          <div className="text-center">
            <div className="flex justify-center items-center gap-1">
              <span
                onClick={onSwitchToLogin}
                className="text-primary underline cursor-pointer"
              >
                Back to Login
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
