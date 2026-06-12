import { requestMultipart } from "./http";

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return requestMultipart("/api/v1/admin/uploads/products/images", {
    method: "POST",
    auth: true,
    formData
  });
}
