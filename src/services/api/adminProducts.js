import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  listAdminProducts,
  updateAdminProduct
} from "./adminStore";

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAdminProducts() {
  await delay();
  return listAdminProducts();
}

export async function fetchAdminProductById(productId) {
  await delay();
  return getAdminProductById(productId);
}

export async function saveAdminProduct(payload, productId) {
  await delay();
  return productId ? updateAdminProduct(productId, payload) : createAdminProduct(payload);
}

export async function removeAdminProduct(productId) {
  await delay();
  return deleteAdminProduct(productId);
}
