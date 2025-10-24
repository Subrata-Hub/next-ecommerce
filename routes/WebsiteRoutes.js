export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

// User routes
export const USER_DASBOARD = "/my-account";

// Category routes
export const WEBSITE_CATEGORY = (name) => (name ? `/category/${name}` : "");

// Product routes
export const WEBSITE_PRODUCT = (name) => (name ? `/products/${name}` : "");
