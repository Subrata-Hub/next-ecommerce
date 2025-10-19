export const ADMIN_DASBOARD = "/admin/dashboard";

// Media Route
export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit/${id}` : "");

// Category Route
export const ADMIN_CATEGORY_ADD = "/admin/category/add";
export const ADMIN_CATEGORY_SHOW = "/admin/category";
export const ADMIN_CATEGORY_EDIT = (id) =>
  id ? `/admin/category/edit/${id}` : "";

// Product Route
export const ADMIN_PRODUCT_ADD = "/admin/product/add";
export const ADMIN_PRODUCT_SHOW = "/admin/product";
export const ADMIN_PRODUCT_EDIT = (id) =>
  id ? `/admin/product/edit/${id}` : "";

// Product variant routes
export const ADMIN_PRODUCT_VARIANT_ADD = "/admin/product-variant/add";
export const ADMIN_PRODUCT_VARIANT_SHOW = "/admin/product-variant";
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) =>
  id ? `/admin/product-variant/edit/${id}` : "";

// Coupon routes
export const ADMIN_COUPON_ADD = "/admin/coupon/add";
export const ADMIN_COUPON_SHOW = "/admin/coupon";
export const ADMIN_COUPON_EDIT = (id) => (id ? `/admin/coupon/edit/${id}` : "");

// Customers routes
export const ADMIN_CUSTOMER_SHOW = "/admin/customers";
// Review routes
export const ADMIN_REVIEW_SHOW = "/admin/review";

// Trash routes
export const ADMIN_TRASH = "/admin/trash";
