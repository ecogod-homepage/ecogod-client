import { request } from "./http";

export async function fetchPublicCategories() {
  return request("/api/v1/product-categories");
}

export async function fetchCategoryBySlug(categorySlug) {
  const categories = await fetchPublicCategories();
  return categories.find((item) => item.slug === categorySlug) ?? null;
}

export async function fetchProductsByCategory(categorySlug) {
  return request(`/api/v1/products?category=${encodeURIComponent(categorySlug)}`);
}

export function fetchProductById(productId) {
  return request(`/api/v1/products/${productId}`);
}
