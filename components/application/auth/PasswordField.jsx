// components/auth/PasswordField.jsx
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export const PasswordField = ({ control, name, label, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <button
            type="button"
            className="absolute top-8 right-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
