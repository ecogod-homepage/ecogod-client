import { request, requestMultipart } from "./http";

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return requestMultipart("/api/v1/admin/uploads/products/images", {
    method: "POST",
    auth: true,
    formData
  });
}

export function deleteProductImage(key) {
  return request("/api/v1/admin/uploads/products/images", {
    method: "DELETE", auth: true, body: { key }
  });
}
