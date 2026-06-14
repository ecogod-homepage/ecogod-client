import { request } from "./http";

export async function fetchAdminProducts() {
  return request("/api/v1/admin/products", { auth: true });
}

export async function fetchAdminProductById(productId) {
  return request(`/api/v1/admin/products/${productId}`, { auth: true });
}

export async function saveAdminProduct(payload, productId) {
  return request(productId ? `/api/v1/admin/products/${productId}` : "/api/v1/admin/products", {
    method: productId ? "PATCH" : "POST", auth: true, body: payload
  });
}

export async function removeAdminProduct(productId) {
  return request(`/api/v1/admin/products/${productId}`, { method: "DELETE", auth: true });
}
