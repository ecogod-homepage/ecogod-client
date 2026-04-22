import {
  getPublicCategoryBySlug,
  listPublicCategories,
  listPublicProductsByCategorySlug
} from "./adminStore";

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPublicCategories() {
  await delay();
  return listPublicCategories();
}

export async function fetchCategoryBySlug(categorySlug) {
  await delay(90);
  return getPublicCategoryBySlug(categorySlug);
}

export async function fetchProductsByCategory(categorySlug) {
  await delay();
  return listPublicProductsByCategorySlug(categorySlug);
}
