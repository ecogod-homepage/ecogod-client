import { adminCategorySeeds, adminProductSeeds } from "../../data/adminSeeds";

const CATEGORY_STORAGE_KEY = "ecogad.admin.categories.v1";
const PRODUCT_STORAGE_KEY = "ecogad.admin.products.v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

function generateId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function sortCategories(items) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name, "ko");
  });
}

function sortProducts(items) {
  return [...items].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

function readStorage(key, fallback) {
  if (!hasWindow()) {
    return clone(fallback);
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return clone(fallback);
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    window.localStorage.removeItem(key);
    return clone(fallback);
  }
}

function writeStorage(key, value) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureStore() {
  if (!hasWindow()) {
    return;
  }

  if (!window.localStorage.getItem(CATEGORY_STORAGE_KEY)) {
    writeStorage(CATEGORY_STORAGE_KEY, adminCategorySeeds);
  }

  if (!window.localStorage.getItem(PRODUCT_STORAGE_KEY)) {
    writeStorage(PRODUCT_STORAGE_KEY, adminProductSeeds);
  }
}

function getCategories() {
  ensureStore();
  return sortCategories(readStorage(CATEGORY_STORAGE_KEY, adminCategorySeeds));
}

function saveCategories(items) {
  writeStorage(CATEGORY_STORAGE_KEY, sortCategories(items));
}

function getProducts() {
  ensureStore();
  return sortProducts(readStorage(PRODUCT_STORAGE_KEY, adminProductSeeds));
}

function saveProducts(items) {
  writeStorage(PRODUCT_STORAGE_KEY, sortProducts(items));
}

function mapCategoryToOption(category) {
  return {
    id: category.id,
    code: category.code,
    slug: category.slug,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
}

function attachCategory(products, categories) {
  return products.map((product) => {
    const category = categories.find((item) => item.code === product.categoryCode);

    return {
      ...product,
      categoryName: category?.name ?? "미분류",
      categorySlug: category?.slug ?? ""
    };
  });
}

function assertCategoryUnique(categories, target, categoryId) {
  const duplicateCode = categories.find(
    (item) => item.code === target.code && item.id !== categoryId
  );

  if (duplicateCode) {
    throw new Error("같은 카테고리 코드가 이미 있습니다.");
  }

  const duplicateSlug = categories.find(
    (item) => item.slug === target.slug && item.id !== categoryId
  );

  if (duplicateSlug) {
    throw new Error("같은 주소(slug)가 이미 있습니다.");
  }
}

export function listAdminCategories() {
  return getCategories().map(mapCategoryToOption);
}

export function getAdminCategoryById(categoryId) {
  const category = getCategories().find((item) => item.id === categoryId);
  return category ? mapCategoryToOption(category) : null;
}

export function createAdminCategory(payload) {
  const categories = getCategories();
  const timestamp = nowIso();
  const category = {
    id: generateId("cat"),
    code: normalizeCode(payload.code),
    slug: normalizeSlug(payload.slug),
    name: String(payload.name ?? "").trim(),
    description: String(payload.description ?? "").trim(),
    sortOrder: Number(payload.sortOrder ?? 0),
    isActive: Boolean(payload.isActive),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  assertCategoryUnique(categories, category, null);
  categories.push(category);
  saveCategories(categories);
  return mapCategoryToOption(category);
}

export function updateAdminCategory(categoryId, payload) {
  const categories = getCategories();
  const index = categories.findIndex((item) => item.id === categoryId);

  if (index < 0) {
    throw new Error("수정할 카테고리를 찾을 수 없습니다.");
  }

  const current = categories[index];
  const nextCategory = {
    ...current,
    name: String(payload.name ?? current.name).trim(),
    description: String(payload.description ?? current.description).trim(),
    sortOrder: Number(payload.sortOrder ?? current.sortOrder),
    isActive: Boolean(payload.isActive),
    updatedAt: nowIso()
  };

  assertCategoryUnique(categories, nextCategory, categoryId);
  categories[index] = nextCategory;
  saveCategories(categories);
  return mapCategoryToOption(nextCategory);
}

export function deleteAdminCategory(categoryId) {
  const categories = getCategories();
  const target = categories.find((item) => item.id === categoryId);

  if (!target) {
    throw new Error("삭제할 카테고리를 찾을 수 없습니다.");
  }

  const products = getProducts();
  const linkedProducts = products.some((item) => item.categoryCode === target.code);

  if (linkedProducts) {
    throw new Error("이 카테고리를 사용하는 제품이 있어 삭제할 수 없습니다.");
  }

  saveCategories(categories.filter((item) => item.id !== categoryId));
}

export function listAdminProducts() {
  const categories = getCategories();
  return attachCategory(getProducts(), categories);
}

export function getAdminProductById(productId) {
  const categories = getCategories();
  const product = getProducts().find((item) => item.id === productId);
  return product ? attachCategory([product], categories)[0] : null;
}

export function createAdminProduct(payload) {
  const categories = getCategories();
  const products = getProducts();
  const category = categories.find((item) => item.code === payload.categoryCode);

  if (!category) {
    throw new Error("선택한 카테고리를 찾을 수 없습니다.");
  }

  const duplicate = products.find(
    (item) =>
      item.categoryCode === payload.categoryCode &&
      item.name.trim().toLowerCase() === String(payload.name ?? "").trim().toLowerCase()
  );

  if (duplicate) {
    throw new Error("같은 카테고리에 동일한 제품명이 이미 있습니다.");
  }

  const timestamp = nowIso();
  const product = {
    id: generateId("product"),
    categoryCode: category.code,
    name: String(payload.name ?? "").trim(),
    summary: String(payload.summary ?? "").trim(),
    description: String(payload.description ?? "").trim(),
    thumbnailUrl: String(payload.thumbnailUrl ?? "").trim(),
    published: Boolean(payload.published),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  products.push(product);
  saveProducts(products);
  return attachCategory([product], categories)[0];
}

export function updateAdminProduct(productId, payload) {
  const categories = getCategories();
  const products = getProducts();
  const index = products.findIndex((item) => item.id === productId);

  if (index < 0) {
    throw new Error("수정할 제품을 찾을 수 없습니다.");
  }

  const category = categories.find((item) => item.code === payload.categoryCode);
  if (!category) {
    throw new Error("선택한 카테고리를 찾을 수 없습니다.");
  }

  const duplicate = products.find(
    (item) =>
      item.id !== productId &&
      item.categoryCode === payload.categoryCode &&
      item.name.trim().toLowerCase() === String(payload.name ?? "").trim().toLowerCase()
  );

  if (duplicate) {
    throw new Error("같은 카테고리에 동일한 제품명이 이미 있습니다.");
  }

  const nextProduct = {
    ...products[index],
    categoryCode: category.code,
    name: String(payload.name ?? "").trim(),
    summary: String(payload.summary ?? "").trim(),
    description: String(payload.description ?? "").trim(),
    thumbnailUrl: String(payload.thumbnailUrl ?? "").trim(),
    published: Boolean(payload.published),
    updatedAt: nowIso()
  };

  products[index] = nextProduct;
  saveProducts(products);
  return attachCategory([nextProduct], categories)[0];
}

export function deleteAdminProduct(productId) {
  const products = getProducts();
  const nextProducts = products.filter((item) => item.id !== productId);

  if (nextProducts.length === products.length) {
    throw new Error("삭제할 제품을 찾을 수 없습니다.");
  }

  saveProducts(nextProducts);
}

export function listPublicCategories() {
  return getCategories()
    .filter((item) => item.isActive)
    .map(mapCategoryToOption);
}

export function getPublicCategoryBySlug(slug) {
  const category = listPublicCategories().find((item) => item.slug === slug);
  return category ?? null;
}

export function listPublicProductsByCategorySlug(slug) {
  const category = getPublicCategoryBySlug(slug);

  if (!category) {
    return [];
  }

  return listAdminProducts().filter(
    (item) => item.categoryCode === category.code && item.published
  );
}
