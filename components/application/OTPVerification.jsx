import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import ButtonLoading from "./ButtonLoading";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { credentialsSchema } from "@/lib/zodSchema";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const OTPVerification = ({ email, onSubmit, loading }) => {
  const [resendingOtp, setResendingOtp] = useState(false);
  const fromSchema = credentialsSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpSubmit = async (values) => {
    onSubmit(values);
  };

  const resendOtp = async () => {
    try {
      setResendingOtp(true);
      const { data: loginResponse } = await axios.post("/api/auth/resend-otp", {
        email,
      });
      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }

      showToast("success", loginResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpSubmit)}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mt-2">
              Please complete verification
            </h1>
            <p className="text-md">
              we have sent one time password (otp) to your register email
              address.The otp is valid only for 10 minites
            </p>
          </div>
          <div className="mb-5 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    One-Time-Password (OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot className="text-xl size-10" index={1} />
                        <InputOTPSlot className="text-xl size-10" index={2} />
                        <InputOTPSlot className="text-xl size-10" index={3} />
                        <InputOTPSlot className="text-xl size-10" index={4} />
                        <InputOTPSlot className="text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <ButtonLoading
              type="submit"
              text="verify"
              className="w-full cursor-pointer"
              loading={loading}
            />
            <div className="mt-5 text-center">
              {!resendingOtp ? (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Resent OTP
                </button>
              ) : (
                <span>Resending otp.....</span>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
