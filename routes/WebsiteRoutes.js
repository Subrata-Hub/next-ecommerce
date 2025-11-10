export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

// User routes
export const USER_DASBOARD = "/my-account";

// Category routes
export const WEBSITE_CATEGORY = (slug) => (slug ? `/category/${slug}` : "");

// Product routes
export const PRODUCT_DETAILS = (slug) =>
  slug ? `/product/${slug}` : "/product";

// Cart route
export const WEBSITE_CART = "/cart";
