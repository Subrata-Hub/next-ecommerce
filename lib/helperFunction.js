import { NextResponse } from "next/server";
import { success } from "zod";

export const response = (success, statuscode, message, data = {}) => {
  return NextResponse.json({
    success,
    statuscode,
    message,
    data,
  });
};

export const catchError = (error, customMessage) => {
  // handeling duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPatten).join(",");
    error.message = `Duplicate fields: ${keys}. These field must be unique`;
  }

  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error",
    };
  }

  return NextResponse.json({
    success: false,
    statuscode: error.code,
    ...errorObj,
  });
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};
