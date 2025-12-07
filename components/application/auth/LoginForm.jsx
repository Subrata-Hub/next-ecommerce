// components/auth/LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import Link from "next/link";
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
import { WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoutes";
import { credentialsSchema } from "@/lib/zodSchema";
import { PasswordField } from "./PasswordField"; // Import the helper above
import { useDispatch } from "react-redux";
import { setLoginPopup } from "@/store/slices/authSlice";

const loginSchema = credentialsSchema.pick({ email: true }).extend({
  password: z.string().min(3, "Password is required"),
});

export const LoginForm = ({
  onSwitchToRegister,
  onLoginSuccess,
  onLoginFail,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", values);
      if (!data.success) throw new Error(data.message);

      form.reset();
      showToast("success", data.message);
      onLoginSuccess(values.email); // Trigger OTP view in parent
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      onLoginFail(errorMessage);
      // showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
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

            <PasswordField
              control={form.control}
              name="password"
              label="Password"
              placeholder="************"
            />

            <ButtonLoading
              type="submit"
              text="Login"
              className="w-full"
              loading={loading}
            />
          </div>

          <div className="text-center mt-5">
            <div className="flex justify-center items-center gap-2">
              <p>Don't have an account?</p>
              <span
                onClick={onSwitchToRegister}
                className="text-primary underline cursor-pointer"
              >
                Create account
              </span>
            </div>
            <div className="mt-3">
              <Link
                href={WEBSITE_RESETPASSWORD}
                className="text-primary underline"
                onClick={() => dispatch(setLoginPopup(false))}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
