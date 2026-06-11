const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const ACCESS_TOKEN_KEY = "ecogod.admin.access-token";

export { ACCESS_TOKEN_KEY };

class AdminAuthError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = "AdminAuthError";
    this.code = code;
    this.status = status;
  }
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new AdminAuthError(
      payload?.error?.message ?? "요청 처리 중 오류가 발생했습니다.",
      payload?.error?.code ?? `HTTP_${response.status}`,
      response.status
    );
  }

  return payload?.data ?? null;
}

function buildHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(credentials)
  });

  return parseResponse(response);
}

export async function fetchCurrentAdmin(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: buildHeaders(token)
  });

  return parseResponse(response);
}

export function getStoredAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
}

export function storeAdminToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isUnauthorizedError(error) {
  return error instanceof AdminAuthError && error.status === 401;
}

export { AdminAuthError };
