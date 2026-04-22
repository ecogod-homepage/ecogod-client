import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoryById,
  listAdminCategories,
  listPublicCategories,
  updateAdminCategory
} from "./adminStore";

function delay(ms = 160) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAdminCategories() {
  await delay();
  return listAdminCategories();
}

export async function fetchAdminCategoryById(categoryId) {
  await delay();
  return getAdminCategoryById(categoryId);
}

export async function saveAdminCategory(payload, categoryId) {
  await delay();
  return categoryId ? updateAdminCategory(categoryId, payload) : createAdminCategory(payload);
}

export async function removeAdminCategory(categoryId) {
  await delay();
  return deleteAdminCategory(categoryId);
}

export async function fetchActiveCategoryOptions() {
  await delay(80);
  return listPublicCategories();
}
