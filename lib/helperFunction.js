import { NextResponse } from "next/server";

export const response = (success, status, message, data = null) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
};

// export const catchError = (error, customMessage) => {
//   // handeling duplicate key error
//   if (error.code === 11000) {
//     const keys = Object.keys(error.keyPatten).join(",");
//     error.message = `Duplicate fields: ${keys}. These field must be unique`;
//   }

//   let errorObj = {};

//   if (process.env.NODE_ENV === "development") {
//     errorObj = {
//       message: error.message,
//       error,
//     };
//   } else {
//     errorObj = {
//       message: customMessage || "Internal server error",
//     };
//   }

//   return NextResponse.json({
//     success: false,
//     statuscode: error.code,
//     ...errorObj,
//   });
// };

export const catchError = (error, customMessage) => {
  // handling duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern || {}).join(",");
    error.message = `Duplicate fields: ${keys}. These fields must be unique`;
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

  // FIX -> RETURN THE CORRECT HTTP STATUS
  return NextResponse.json(
    {
      success: false,
      ...errorObj,
    },
    { status: error.statusCode || 500 }
  );
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const columnConfig = (
  column,
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumn = [...column];

  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt",
      header: "Category At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toISOString(),
    });
  }
  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toISOString(),
    });
  }

  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toISOString(),
    });
  }

  return newColumn;
};

export const getLocalCartId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("cartId");
  }
  return null;
};

// Helper to SET Cart ID (Crucial for guest checkout)
export const setLocalCartId = (id) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartId", id);
  }
};
