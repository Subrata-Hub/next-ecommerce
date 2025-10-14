export const ADMIN_DASBOARD = "/admin/dasboard";

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

// Trash routes
export const ADMIN_TRASH = "/admin/trash";
