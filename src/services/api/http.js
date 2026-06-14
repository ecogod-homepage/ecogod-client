import { clearAdminToken, getStoredAdminToken } from "./adminAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new ApiError(
      payload?.error?.message ?? "요청 처리 중 오류가 발생했습니다.",
      payload?.error?.code ?? `HTTP_${response.status}`,
      response.status
    );
  }
  return payload?.data ?? null;
}

function headers(auth, json = true) {
  const result = json ? { "Content-Type": "application/json" } : {};
  if (auth) {
    const token = getStoredAdminToken();
    if (token) result.Authorization = `Bearer ${token}`;
  }
  return result;
}

export async function request(path, { method = "GET", auth = false, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: headers(auth),
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return parseResponse(response);
}

export async function requestMultipart(path, { method = "POST", auth = false, formData }) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: headers(auth, false),
    body: formData
  });
  return parseResponse(response);
}
