export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

// User routes
export const USER_DASBOARD = "/my-account";

// export const USER_DASBOARD_MANAGE_ADDRESS = "/my-account/addresses";
// export const USER_DASBOARD_WISHLIST = "/my-account/wishlist";
// export const USER_DASBOARD_ORDERS = "/my-account/orders";

// Category routes
export const WEBSITE_CATEGORY = (slug) => (slug ? `/category/${slug}` : "");
export const WEBSITE_MOBILE_CATEGORIES = "/categories";

// Product routes
export const PRODUCT_DETAILS = (slug) =>
  slug ? `/product/${slug}` : "/product";

// Cart route
export const WEBSITE_CART = "/cart";

export const WEBSITE_CHECKOUT = "/checkout";
