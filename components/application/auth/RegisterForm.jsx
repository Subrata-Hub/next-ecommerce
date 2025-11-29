// components/auth/RegisterForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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
import { credentialsSchema } from "@/lib/zodSchema";
import { PasswordField } from "./PasswordField";

const registerSchema = credentialsSchema
  .pick({ name: true, email: true, password: true })
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const RegisterForm = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", values);
      if (!data.success) throw new Error(data.message);

      form.reset();
      showToast("success", data.message);
      // Optional: Auto switch to login after register
      // onSwitchToLogin();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="************"
          />

          <ButtonLoading
            type="submit"
            text="Create Account"
            className="w-full"
            loading={loading}
          />

          <div className="text-center mt-5">
            <div className="flex justify-center items-center gap-2">
              <p>Already have an account?</p>
              <span
                onClick={onSwitchToLogin}
                className="text-primary underline cursor-pointer"
              >
                Login
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
