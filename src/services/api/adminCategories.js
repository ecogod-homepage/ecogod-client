import { request } from "./http";

export async function fetchAdminCategories() {
  return request("/api/v1/admin/categories", { auth: true });
}

export async function fetchAdminCategoryById(categoryId) {
  const items = await fetchAdminCategories();
  return items.find((item) => String(item.id) === String(categoryId)) ?? null;
}

export async function saveAdminCategory(payload, categoryId) {
  return request(categoryId ? `/api/v1/admin/categories/${categoryId}` : "/api/v1/admin/categories", {
    method: categoryId ? "PATCH" : "POST", auth: true, body: payload
  });
}

export async function removeAdminCategory(categoryId) {
  return request(`/api/v1/admin/categories/${categoryId}`, { method: "DELETE", auth: true });
}

export async function fetchActiveCategoryOptions() {
  return request("/api/v1/product-categories");
}
